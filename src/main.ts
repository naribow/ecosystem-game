import {
  initializeBars,
  updateBars,
  initializePyramid,
  updatePyramid,
  setHoverEffect,
  setDraggingEffect,
} from "./lib/renderer"; // バー描画とピラミッド描画の両方をインポート
import {
  startGameLoop,
  adjustCreatureAmount,
  getCurrentState,
  initializeGame,
  EcosystemState,
} from "./lib/game";
import { saveScore, getRanking } from "./lib/storage";
import { GAME_PARAMETERS } from "./config/parameters";

const svgElement = document.getElementById(
  "ecosystem-svg",
) as unknown as SVGSVGElement;
const timeDisplay = document.getElementById("time-display") as HTMLDivElement;
const restartButton = document.getElementById(
  "restart-button",
) as HTMLButtonElement;
const rankingList = document.getElementById("ranking-list") as HTMLUListElement;
const gameOverModal = document.getElementById(
  "game-over-modal",
) as HTMLDivElement;
const finalScoreDisplay = document.getElementById(
  "final-score",
) as HTMLParagraphElement;
const modalRestartButton = document.getElementById(
  "modal-restart-button",
) as HTMLButtonElement;

// 生物量調整ボタンの取得
const plantIncreaseButton = document.getElementById(
  "plant-increase",
) as HTMLButtonElement;
const plantDecreaseButton = document.getElementById(
  "plant-decrease",
) as HTMLButtonElement;
const herbivoreIncreaseButton = document.getElementById(
  "herbivore-increase",
) as HTMLButtonElement;
const herbivoreDecreaseButton = document.getElementById(
  "herbivore-decrease",
) as HTMLButtonElement;
const carnivoreIncreaseButton = document.getElementById(
  "carnivore-increase",
) as HTMLButtonElement;
const carnivoreDecreaseButton = document.getElementById(
  "carnivore-decrease",
) as HTMLButtonElement;

let isDragging = false;
let activeSegment: "plant" | "herbivore" | "carnivore" | null = null;
let dragStartX = 0;

// UIモードを切り替えるフラグ (開発中はtrue/falseを切り替えてテスト)
// 最終的には、このフラグは不要になり、直接 initializePyramid を呼び出す
const USE_PYRAMID_UI = false; // 初期はバーUI、最終的にtrueにする

document.addEventListener("DOMContentLoaded", () => {
  initializeGame(); // ゲームを初期化
  if (svgElement) {
    const initialState = getCurrentState(); // game.tsで初期化された状態を取得

    if (USE_PYRAMID_UI) {
      initializePyramid(
        svgElement,
        initialState.plant,
        initialState.herbivore,
        initialState.carnivore,
      );
      setupPyramidEventListeners(); // ピラミッドUI用のイベントリスナー
    } else {
      initializeBars(
        svgElement,
        initialState.plant,
        initialState.herbivore,
        initialState.carnivore,
      );
      setupBarEventListeners(); // バーUI用のイベントリスナー
    }

    updateTimeDisplay(initialState.time);
    updateRankingDisplay(); // 初期ランキング表示

    // ゲームループ開始
    startGameLoop(onGameUpdate, onGameOver);
  } else {
    console.error("SVG要素が見つかりません。");
  }
});

/**
 * ゲームの状態が更新されたときに呼び出されるコールバック。
 * @param state 現在の生態系状態
 * @param params 現在のパラメータ値
 */
function onGameUpdate(
  state: EcosystemState,
  params: {
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
  if (svgElement) {
    if (USE_PYRAMID_UI) {
      updatePyramid(svgElement, state.plant, state.herbivore, state.carnivore);
    } else {
      updateBars(svgElement, state.plant, state.herbivore, state.carnivore);
    }
  }
  updateTimeDisplay(state.time);
}

/**
 * ゲームオーバー時に呼び出されるコールバック。
 * @param score 最終スコア (ミリ秒)
 */
function onGameOver(score: number): void {
  const scoreInSeconds = Math.floor(score / 1000);
  saveScore(scoreInSeconds); // スコアを保存
  updateRankingDisplay(); // ランキングを更新して表示
  showGameOverModal(scoreInSeconds); // ゲームオーバーモーダルを表示
}

/**
 * 生存時間を表示を更新します。
 * @param time 生存時間 (ミリ秒)
 */
function updateTimeDisplay(time: number): void {
  const seconds = Math.floor(time / 1000);
  if (timeDisplay) {
    timeDisplay.textContent = `生存時間: ${seconds}秒`;
  }
}

/**
 * ランキング表示を更新します。
 */
function updateRankingDisplay(): void {
  if (rankingList) {
    const ranking = getRanking();
    rankingList.innerHTML = ranking
      .map((s, index) => `<li>${index + 1}. ${s}秒</li>`)
      .join("");
  }
}

/**
 * ゲームオーバーモーダルを表示します。
 * @param score 最終スコア (秒)
 */
function showGameOverModal(score: number): void {
  if (gameOverModal && finalScoreDisplay) {
    finalScoreDisplay.textContent = `あなたの生存時間: ${score}秒`;
    gameOverModal.style.display = "flex"; // flexで中央寄せ
  }
}

/**
 * ゲームオーバーモーダルを非表示にします。
 */
function hideGameOverModal(): void {
  if (gameOverModal) {
    gameOverModal.style.display = "none";
  }
}

/**
 * ゲームをリスタートします。
 */
function restartGame(): void {
  initializeGame(); // ゲームの状態を初期化
  if (USE_PYRAMID_UI) {
    const initialState = getCurrentState();
    initializePyramid(
      svgElement,
      initialState.plant,
      initialState.herbivore,
      initialState.carnivore,
    );
  } else {
    const initialState = getCurrentState();
    initializeBars(
      svgElement,
      initialState.plant,
      initialState.herbivore,
      initialState.carnivore,
    );
  }
  startGameLoop(onGameUpdate, onGameOver); // 新しいゲームループを開始
  hideGameOverModal(); // モーダルを非表示にする
  updateRankingDisplay(); // ランキングを再表示
}

/**
 * バーUI用のイベントリスナーを設定します。
 */
function setupBarEventListeners(): void {
  if (restartButton) {
    restartButton.addEventListener("click", () => {
      restartGame();
    });
  }
  if (modalRestartButton) {
    modalRestartButton.addEventListener("click", () => {
      hideGameOverModal();
      restartGame();
    });
  }

  // 各生物の増減ボタンにイベントリスナーを追加
  plantIncreaseButton.addEventListener("click", () =>
    adjustCreatureAmount("plant", 1),
  );
  plantDecreaseButton.addEventListener("click", () =>
    adjustCreatureAmount("plant", -1),
  );
  herbivoreIncreaseButton.addEventListener("click", () =>
    adjustCreatureAmount("herbivore", 1),
  );
  herbivoreDecreaseButton.addEventListener("click", () =>
    adjustCreatureAmount("herbivore", -1),
  );
  carnivoreIncreaseButton.addEventListener("click", () =>
    adjustCreatureAmount("carnivore", 1),
  );
  carnivoreDecreaseButton.addEventListener("click", () =>
    adjustCreatureAmount("carnivore", -1),
  );
}

/**
 * ピラミッドUI用のイベントリスナーを設定します。
 */
function setupPyramidEventListeners(): void {
  // バーUI用のボタンイベントリスナーを削除 (もしあれば)
  plantIncreaseButton.removeEventListener("click", () =>
    adjustCreatureAmount("plant", 1),
  );
  plantDecreaseButton.removeEventListener("click", () =>
    adjustCreatureAmount("plant", -1),
  );
  herbivoreIncreaseButton.removeEventListener("click", () =>
    adjustCreatureAmount("herbivore", 1),
  );
  herbivoreDecreaseButton.removeEventListener("click", () =>
    adjustCreatureAmount("herbivore", -1),
  );
  carnivoreIncreaseButton.removeEventListener("click", () =>
    adjustCreatureAmount("carnivore", 1),
  );
  carnivoreDecreaseButton.removeEventListener("click", () =>
    adjustCreatureAmount("carnivore", -1),
  );

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      restartGame();
    });
  }
  if (modalRestartButton) {
    modalRestartButton.addEventListener("click", () => {
      hideGameOverModal();
      restartGame();
    });
  }

  if (svgElement) {
    svgElement.addEventListener("mousemove", handlePyramidMouseMove);
    svgElement.addEventListener("mousedown", handlePyramidMouseDown);
    svgElement.addEventListener("mouseup", handlePyramidMouseUp);
    svgElement.addEventListener("mouseleave", handlePyramidMouseLeave);
  }
}

/**
 * ピラミッドUIでのマウス移動時の処理（ホバー効果）
 * @param event マウスイベント
 */
function handlePyramidMouseMove(event: MouseEvent): void {
  if (isDragging) return; // ドラッグ中はホバー効果を無効にする

  const target = event.target as SVGPolygonElement;
  const segmentType = target?.dataset.type as
    | "plant"
    | "herbivore"
    | "carnivore"
    | undefined;

  if (segmentType) {
    setHoverEffect(segmentType, true);
  } else {
    setHoverEffect(null, false); // SVG要素外または非セグメント要素にホバーした場合
  }
}

/**
 * ピラミッドUIでのマウスが押されたときの処理（ドラッグ開始）
 * @param event マウスイベント
 */
function handlePyramidMouseDown(event: MouseEvent): void {
  const target = event.target as SVGPolygonElement;
  const segmentType = target?.dataset.type as
    | "plant"
    | "herbivore"
    | "carnivore"
    | undefined;

  if (segmentType) {
    isDragging = true;
    activeSegment = segmentType;
    dragStartX = event.clientX;
    setDraggingEffect(activeSegment, true); // ドラッグ効果を適用
    svgElement.addEventListener("mousemove", handlePyramidDrag); // ドラッグ中のmousemoveイベントを追加
  }
}

/**
 * ピラミッドUIでのマウスが離されたときの処理（ドラッグ終了）
 */
function handlePyramidMouseUp(): void {
  if (isDragging) {
    isDragging = false;
    setDraggingEffect(null, false); // ドラッグ効果を解除
    svgElement.removeEventListener("mousemove", handlePyramidDrag); // ドラッグ中のmousemoveイベントを削除
    activeSegment = null;
  }
}

/**
 * ピラミッドUIでのマウスがSVG要素から離れたときの処理
 */
function handlePyramidMouseLeave(): void {
  if (!isDragging) {
    // ドラッグ中でない場合のみホバー効果を解除
    setHoverEffect(null, false);
  }
  // ドラッグ中にSVG外に出た場合でも、mouseupで解除されるようにする
}

/**
 * ピラミッドUIでのドラッグ中の処理
 * @param event マウスイベント
 */
function handlePyramidDrag(event: MouseEvent): void {
  if (!isDragging || !activeSegment) return;

  const deltaX = event.clientX - dragStartX;
  const adjustmentAmount = deltaX * GAME_PARAMETERS.dragSensitivity; // 感度を適用

  // ドラッグ方向に応じて増減
  const direction = adjustmentAmount > 0 ? 1 : -1;
  // 絶対値で調整量を渡し、game.tsでplayerInterventionAmountを乗算しないようにする
  adjustCreatureAmount(activeSegment, direction, Math.abs(adjustmentAmount));

  dragStartX = event.clientX; // ドラッグ開始位置を更新して連続的な調整を可能にする
}
