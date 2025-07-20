import { GAME_PARAMETERS } from "../config/parameters";

interface EcosystemState {
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
  if (onUpdateCallback) {
    onUpdateCallback(state);
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

  // 生態系の変動を計算
  updateEcosystem(deltaTime / 1000); // 秒単位で計算するために変換

  // ゲームオーバー判定
  checkGameOver();

  // 状態が更新されたことを通知
  if (onUpdateCallback) {
    onUpdateCallback(state);
  }

  // 次のフレームを要求
  animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * 生態系の量を更新します。
 * @param dt 時間差 (秒)
 */
function updateEcosystem(dt: number): void {
  const {
    plantGrowthRate,
    herbivoreConsumptionRate,
    carnivoreConsumptionRate,
    naturalDeathRate,
  } = GAME_PARAMETERS;

  // 植物の変動
  const plantGrowth = state.plant * plantGrowthRate * dt;
  const plantConsumedByHerbivores =
    state.herbivore * herbivoreConsumptionRate * dt;
  state.plant += plantGrowth - plantConsumedByHerbivores;

  // 草食動物の変動
  const herbivoreGrowth = plantConsumedByHerbivores * 0.5; // 消費した植物の一部が草食動物の成長になる
  const herbivoreConsumedByCarnivores =
    state.carnivore * carnivoreConsumptionRate * dt;
  const herbivoreNaturalDeath = state.herbivore * naturalDeathRate * dt;
  state.herbivore +=
    herbivoreGrowth - herbivoreConsumedByCarnivores - herbivoreNaturalDeath;

  // 肉食動物の変動
  const carnivoreGrowth = herbivoreConsumedByCarnivores * 0.5; // 消費した草食動物の一部が肉食動物の成長になる
  const carnivoreNaturalDeath = state.carnivore * naturalDeathRate * dt;
  state.carnivore += carnivoreGrowth - carnivoreNaturalDeath;

  // 量が0を下回らないようにする
  state.plant = Math.max(0, state.plant);
  state.herbivore = Math.max(0, state.herbivore);
  state.carnivore = Math.max(0, state.carnivore);
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
  if (state.plant <= 0 || state.herbivore <= 0 || state.carnivore <= 0) {
    state.isGameOver = true;
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
