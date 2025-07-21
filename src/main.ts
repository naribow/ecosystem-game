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

let isDragging = false;
let activeSegment: "plant" | "herbivore" | "carnivore" | null = null;
let activeEdge: "left" | "right" | null = null;
let dragStartX = 0;

// UIモードを切り替えるフラグ (開発中はtrue/falseを切り替えてテスト)
// 最終的には、このフラグは不要になり、直接 initializePyramid を呼び出す
const USE_PYRAMID_UI = true; // 初期はバーUI、最終的にtrueにする

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
function onGameUpdate(state: EcosystemState): void {
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

  // ゲームオーバー時に選択状態をすべて解除
  setHoverEffect(null, false);
  setDraggingEffect(null, false);
  svgElement.style.cursor = "default";
  isDragging = false;
  activeSegment = null;
  activeEdge = null;
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

  // リスタート時に選択状態をすべて解除
  setHoverEffect(null, false);
  setDraggingEffect(null, false);
  svgElement.style.cursor = "default";
  isDragging = false;
  activeSegment = null;
  activeEdge = null;
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
}

/**
 * ピラミッドUI用のイベントリスナーを設定します。
 */
function setupPyramidEventListeners(): void {
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

  const { segment, edge } = getDraggableEdge(event.clientX, event.clientY);

  if (segment && edge) {
    svgElement.style.cursor = "ew-resize";
    setHoverEffect(segment, true);
  } else {
    svgElement.style.cursor = "default";
    setHoverEffect(null, false);
  }
}

/**
 * ピラミッドUIでのマウスが押されたときの処理（ドラッグ開始）
 * @param event マウスイベント
 */
function handlePyramidMouseDown(event: MouseEvent): void {
  const { segment, edge } = getDraggableEdge(event.clientX, event.clientY);

  if (segment && edge) {
    isDragging = true;
    activeSegment = segment;
    activeEdge = edge;
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
    activeEdge = null;
    svgElement.style.cursor = "default";
  }
}

/**
 * ピラミッドUIでのマウスがSVG要素から離れたときの処理
 */
function handlePyramidMouseLeave(): void {
  if (!isDragging) {
    // ドラッグ中でない場合のみホバー効果を解除
    setHoverEffect(null, false);
    svgElement.style.cursor = "default";
  }
  // ドラッグ中にSVG外に出た場合でも、mouseupで解除されるようにする
}

/**
 * ピラミッドUIでのドラッグ中の処理
 * @param event マウスイベント
 */
function handlePyramidDrag(event: MouseEvent): void {
  if (!isDragging || !activeSegment || !activeEdge) return;

  let adjustment = event.clientX - dragStartX;
  // 左辺をドラッグしている場合は、移動方向を反転させて「外側＝増、内側＝減」に揃える
  if (activeEdge === "left") {
    adjustment = -adjustment;
  }

  const adjustmentAmount = adjustment * GAME_PARAMETERS.dragSensitivity; // 感度を適用

  // ドラッグ方向に応じて増減
  const direction = adjustmentAmount > 0 ? 1 : -1;
  adjustCreatureAmount(activeSegment, direction, Math.abs(adjustmentAmount));

  dragStartX = event.clientX; // ドラッグ開始位置を更新して連続的な調整を可能にする
}

/**
 * 指定された座標が、いずれかのセグメントのドラッグ可能な辺の上にあるかを判定します。
 * @param clientX マウスのクライアントX座標
 * @param clientY マウスのクライアントY座標
 * @returns ドラッグ可能なセグメントと辺の種類（左 or 右）、またはnull
 */
function getDraggableEdge(
  clientX: number,
  clientY: number,
): {
  segment: "plant" | "herbivore" | "carnivore" | null;
  edge: "left" | "right" | null;
} {
  const tolerance = 20; // 辺からの距離の許容範囲（ピクセル）を拡大

  // マウス座標をSVG座標に変換
  const pt = svgElement.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const svgP = pt.matrixTransform(svgElement.getScreenCTM()?.inverse());
  const x = svgP.x;
  const y = svgP.y;

  const segments = Array.from(
    svgElement.querySelectorAll(".pyramid-segment"),
  ) as SVGPolygonElement[];

  for (const segment of segments) {
    const points = Array.from(segment.points).map((p) => ({ x: p.x, y: p.y }));
    const type = segment.dataset.type as "plant" | "herbivore" | "carnivore";

    // 4つの頂点を取得（三角形の場合は頂点が3つ）
    const [p1, p2, p3, p4] =
      points.length === 3
        ? [points[0], points[1], points[2], points[0]] // 三角形: p1(左下), p2(右下), p3(上)
        : [points[0], points[1], points[2], points[3]]; // 台形: p1(左下), p2(右下), p3(右上), p4(左上)

    if (points.length === 3) {
      // 三角形の場合
      if (isNearLine(x, y, p1, p3, tolerance))
        return { segment: type, edge: "left" };
      if (isNearLine(x, y, p2, p3, tolerance))
        return { segment: type, edge: "right" };
    } else {
      // 台形の場合
      if (isNearLine(x, y, p1, p4, tolerance))
        return { segment: type, edge: "left" };
      if (isNearLine(x, y, p2, p3, tolerance))
        return { segment: type, edge: "right" };
    }
  }

  return { segment: null, edge: null };
}

/**
 * 点が線分に近いかどうかを判定します。
 * @param px 点のX座標
 * @param py 点のY座標
 * @param p1 線分の始点
 * @param p2 線分の終点
 * @param tolerance 許容距離
 * @returns 近い場合はtrue
 */
function isNearLine(
  px: number,
  py: number,
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  tolerance: number,
): boolean {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    // 始点と終点が同じ場合
    const d = Math.sqrt(Math.pow(px - p1.x, 2) + Math.pow(py - p1.y, 2));
    return d <= tolerance;
  }

  let t = ((px - p1.x) * dx + (py - p1.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t)); // 線分上に射影を制限

  const closestX = p1.x + t * dx;
  const closestY = p1.y + t * dy;

  const distance = Math.sqrt(
    Math.pow(px - closestX, 2) + Math.pow(py - closestY, 2),
  );

  return distance <= tolerance;
}
