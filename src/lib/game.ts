import { GAME_PARAMETERS } from "../config/parameters";

export interface EcosystemState {
  plant: number;
  herbivore: number;
  carnivore: number;
  time: number; // 生存時間 (ミリ秒)
  isGameOver: boolean;
}

let state: EcosystemState;
let lastUpdateTime: DOMHighResTimeStamp;
let animationFrameId: number | null = null;
let onUpdateCallback: ((state: EcosystemState) => void) | null = null;
let onGameOverCallback: ((score: number) => void) | null = null;

const PARAMETER_UPDATE_INTERVAL = 10000; // 10秒 (ミリ秒)
let currentActiveParameters: {
  rA: number;
  KA: number;
  a1: number;
  a2: number;
  rB: number;
  b1: number;
  b2: number;
  rC: number;
  hA: number;
  hB: number;
  hC: number;
};
let lastParameterUpdateTime: DOMHighResTimeStamp;

/**
 * ゲームの状態を初期化します。
 */
export function initializeGame(): void {
  state = {
    plant: GAME_PARAMETERS.initialPlantAmount,
    herbivore: GAME_PARAMETERS.initialHerbivoreAmount,
    carnivore: GAME_PARAMETERS.initialCarnivoreAmount,
    time: 0,
    isGameOver: false,
  };
  lastUpdateTime = performance.now();
  lastParameterUpdateTime = lastUpdateTime; // パラメータ更新タイマーをリセット
  currentActiveParameters = getCurrentRandomizedParameters(); // 初期パラメータを設定

  console.log("ゲーム開始！生態系バランスを維持しよう！");
  console.log(
    `初期個体数: 植物=${state.plant}, 草食動物=${state.herbivore}, 肉食動物=${state.carnivore}`,
  );
  if (onUpdateCallback) {
    onUpdateCallback(state);
    console.log(
      `現在の個体数: 植物=${state.plant.toFixed(2)}, 草食動物=${state.herbivore.toFixed(2)}, 肉食動物=${state.carnivore.toFixed(2)}`,
    );
    console.log(
      `現在のパラメータ: rA=${currentActiveParameters.rA.toFixed(5)}, KA=${currentActiveParameters.KA.toFixed(2)}, a1=${currentActiveParameters.a1.toFixed(5)}, a2=${currentActiveParameters.a2.toFixed(5)}, rB=${currentActiveParameters.rB.toFixed(5)}, b1=${currentActiveParameters.b1.toFixed(5)}, b2=${currentActiveParameters.b2.toFixed(5)}, rC=${currentActiveParameters.rC.toFixed(5)}, hA=${currentActiveParameters.hA.toFixed(5)}, hB=${currentActiveParameters.hB.toFixed(5)}, hC=${currentActiveParameters.hC.toFixed(5)}`,
    );
  }
}

/**
 * メインゲームループを開始します。
 * @param updateCallback 状態更新時に呼ばれるコールバック
 * @param gameOverCallback ゲームオーバー時に呼ばれるコールバック
 */
export function startGameLoop(
  updateCallback: (state: EcosystemState) => void,
  gameOverCallback: (score: number) => void,
): void {
  onUpdateCallback = updateCallback;
  onGameOverCallback = gameOverCallback;
  initializeGame(); // ゲームを初期化
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId); // 既存のループがあれば停止
  }
  animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * メインゲームループを停止します。
 */
export function stopGameLoop(): void {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/**
 * ゲームのメインループ関数です。
 * @param currentTime 現在のタイムスタンプ
 */
function gameLoop(currentTime: DOMHighResTimeStamp): void {
  if (state.isGameOver) {
    stopGameLoop();
    return;
  }

  const deltaTime = currentTime - lastUpdateTime;
  lastUpdateTime = currentTime;

  // 時間の経過を更新 (ミリ秒)
  state.time += deltaTime;

  // パラメータを定期的に更新
  if (currentTime - lastParameterUpdateTime >= PARAMETER_UPDATE_INTERVAL) {
    currentActiveParameters = getCurrentRandomizedParameters();
    lastParameterUpdateTime = currentTime;
  }

  updateEcosystem(deltaTime / 1000, currentActiveParameters); // 秒単位で計算するために変換

  // ゲームオーバー判定
  checkGameOver();

  // 状態が更新されたことを通知
  if (onUpdateCallback) {
    onUpdateCallback(state);
    console.log(
      `現在の個体数: 植物=${state.plant.toFixed(2)}, 草食動物=${state.herbivore.toFixed(2)}, 肉食動物=${state.carnivore.toFixed(2)}`,
    );
    console.log(
      `現在のパラメータ: rA=${currentActiveParameters.rA.toFixed(5)}, KA=${currentActiveParameters.KA.toFixed(2)}, a1=${currentActiveParameters.a1.toFixed(5)}, a2=${currentActiveParameters.a2.toFixed(5)}, rB=${currentActiveParameters.rB.toFixed(5)}, b1=${currentActiveParameters.b1.toFixed(5)}, b2=${currentActiveParameters.b2.toFixed(5)}, rC=${currentActiveParameters.rC.toFixed(5)}, hA=${currentActiveParameters.hA.toFixed(5)}, hB=${currentActiveParameters.hB.toFixed(5)}, hC=${currentActiveParameters.hC.toFixed(5)}`,
    );
  }

  // 次のフレームを要求
  animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * 生態系の量を更新します。
 * @param dt 時間差 (秒)
 */
function updateEcosystem(
  dt: number,
  currentParams: {
    rA: number;
    KA: number;
    a1: number;
    a2: number;
    rB: number;
    b1: number;
    b2: number;
    rC: number;
    hA: number;
    hB: number;
    hC: number;
  },
): void {
  const { rA, KA, a1, a2, rB, b1, b2, rC, hA, hB, hC } = currentParams;

  // 植物 (A) の変化
  const plantGrowthTerm =
    KA === 0 ? 0 : rA * state.plant * (1 - state.plant / KA);
  const dAdt =
    plantGrowthTerm - a1 * state.plant * state.herbivore - hA * state.plant;

  // 草食動物 (B) の変化
  const dBdt =
    a2 * state.plant * state.herbivore -
    rB * state.herbivore -
    b1 * state.herbivore * state.carnivore -
    hB * state.herbivore;

  // 肉食動物 (C) の変化
  const dCdt =
    b2 * state.herbivore * state.carnivore -
    rC * state.carnivore -
    hC * state.carnivore;

  state.plant += dAdt * dt;
  state.herbivore += dBdt * dt;
  state.carnivore += dCdt * dt;

  // 量が0を下回らないようにする
  state.plant = Math.max(0, state.plant);
  state.herbivore = Math.max(0, state.herbivore);
  state.carnivore = Math.max(0, state.carnivore);
}

/**
 * 基本値と変動幅に基づいてランダムなパラメータ値を生成します。
 * @param base 基本値
 * @param variance 変動幅 (0-1の割合)
 * @returns ランダム化されたパラメータ値
 */
function getRandomizedParameter(base: number, variance: number): number {
  const min = base * (1 - variance);
  const max = base * (1 + variance);
  const rawResult = min + (max - min) * Math.random();
  return Math.max(1e-6, rawResult);
}

/**
 * 現在のランダム化されたパラメータ値を生成して返します。
 */
function getCurrentRandomizedParameters() {
  const rA = getRandomizedParameter(
    GAME_PARAMETERS.rA_base,
    GAME_PARAMETERS.rA_variance,
  );
  const KA = getRandomizedParameter(
    GAME_PARAMETERS.KA_base,
    GAME_PARAMETERS.KA_variance,
  );
  const a1 = getRandomizedParameter(
    GAME_PARAMETERS.a1_base,
    GAME_PARAMETERS.a1_variance,
  );
  const a2 = getRandomizedParameter(
    GAME_PARAMETERS.a2_base,
    GAME_PARAMETERS.a2_variance,
  );
  const rB = getRandomizedParameter(
    GAME_PARAMETERS.rB_base,
    GAME_PARAMETERS.rB_variance,
  );
  const b1 = getRandomizedParameter(
    GAME_PARAMETERS.b1_base,
    GAME_PARAMETERS.b1_variance,
  );
  const b2 = getRandomizedParameter(
    GAME_PARAMETERS.b2_base,
    GAME_PARAMETERS.b2_variance,
  );
  const rC = getRandomizedParameter(
    GAME_PARAMETERS.rC_base,
    GAME_PARAMETERS.rC_variance,
  );
  const hA = getRandomizedParameter(
    GAME_PARAMETERS.hA_base,
    GAME_PARAMETERS.hA_variance,
  );
  const hB = getRandomizedParameter(
    GAME_PARAMETERS.hB_base,
    GAME_PARAMETERS.hB_variance,
  );
  const hC = getRandomizedParameter(
    GAME_PARAMETERS.hC_base,
    GAME_PARAMETERS.hC_variance,
  );
  return { rA, KA, a1, a2, rB, b1, b2, rC, hA, hB, hC };
}

/**
 * プレイヤーの操作に応じて生物量を調整します。
 * @param type 調整対象の生物タイプ
 * @param direction 調整方向 (1: 増加, -1: 減少)
 * @param amount 調整量 (オプション, ドラッグ用)
 */
export function adjustCreatureAmount(
  type: "plant" | "herbivore" | "carnivore",
  direction: 1 | -1,
  amount?: number,
): void {
  if (state.isGameOver) return;

  const adjustment =
    amount !== undefined ? amount : GAME_PARAMETERS.playerInterventionAmount;
  const finalAmount = adjustment * direction;

  switch (type) {
    case "plant":
      state.plant += finalAmount;
      break;
    case "herbivore":
      state.herbivore += finalAmount;
      break;
    case "carnivore":
      state.carnivore += finalAmount;
      break;
  }
  // 量が0を下回らないようにする
  state.plant = Math.max(0, state.plant);
  state.herbivore = Math.max(0, state.herbivore);
  state.carnivore = Math.max(0, state.carnivore);

  // UIを即座に更新するためにコールバックを呼び出す
  if (onUpdateCallback) {
    onUpdateCallback(state);
  }
}

/**
 * ゲームオーバー条件をチェックします。
 */
function checkGameOver(): void {
  if (state.plant < 1 || state.herbivore < 1 || state.carnivore < 1) {
    state.isGameOver = true;
    let cause = "";
    if (state.plant < 1) cause += "植物 ";
    if (state.herbivore < 1) cause += "草食動物 ";
    if (state.carnivore < 1) cause += "肉食動物 ";
    console.log(`ゲームオーバー！絶滅した生物: ${cause.trim()}`);
    if (onGameOverCallback) {
      onGameOverCallback(state.time); // 生存時間をスコアとして渡す
    }
  }
}

/**
 * 現在のゲーム状態を取得します。
 * @returns 現在のゲーム状態
 */
export function getCurrentState(): EcosystemState {
  return { ...state };
}
