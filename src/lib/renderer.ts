import { GAME_PARAMETERS } from "../config/parameters";

// バー描画用のインターフェース (初期UI)
interface BarCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  id: string;
  type: "plant" | "herbivore" | "carnivore";
}

// ピラミッドセグメント描画用のインターフェース (最終UI)
interface SegmentCoordinates {
  points: string;
  fillColor: string;
  id: string;
  type: "plant" | "herbivore" | "carnivore";
}

/**
 * SVG要素を初期化し、生態系バーを描画します。（初期UI）
 * @param svgElement SVG要素
 * @param plantAmount 植物の量
 * @param herbivoreAmount 草食動物の量
 * @param carnivoreAmount 肉食動物の量
 */
export function initializeBars(
  svgElement: SVGSVGElement,
  plantAmount: number,
  herbivoreAmount: number,
  carnivoreAmount: number,
): void {
  svgElement.innerHTML = ""; // 既存の描画をクリア

  const { svgWidth, svgHeight, barWidth, maxBarHeight } = GAME_PARAMETERS;
  const centerX = svgWidth / 2;
  const startX = centerX - barWidth / 2; // バーの中心をSVGの中心に合わせる

  // 各生物の量に応じたバーの高さを計算
  const totalInitialAmount =
    GAME_PARAMETERS.initialPlantAmount +
    GAME_PARAMETERS.initialHerbivoreAmount +
    GAME_PARAMETERS.initialCarnivoreAmount;
  const plantBarHeight = (plantAmount / totalInitialAmount) * maxBarHeight;
  const herbivoreBarHeight =
    (herbivoreAmount / totalInitialAmount) * maxBarHeight;
  const carnivoreBarHeight =
    (carnivoreAmount / totalInitialAmount) * maxBarHeight;

  let currentY = svgHeight; // SVGの最下部から描画を開始

  // 植物バー (最下層)
  currentY -= plantBarHeight;
  const plantBar: BarCoordinates = {
    x: startX,
    y: currentY,
    width: barWidth,
    height: plantBarHeight,
    fillColor: "#4CAF50", // 緑
    id: "bar-plant",
    type: "plant",
  };
  drawRect(svgElement, plantBar);

  // 草食動物バー (中間層)
  currentY -= herbivoreBarHeight;
  const herbivoreBar: BarCoordinates = {
    x: startX,
    y: currentY,
    width: barWidth,
    height: herbivoreBarHeight,
    fillColor: "#FFC107", // 黄色
    id: "bar-herbivore",
    type: "herbivore",
  };
  drawRect(svgElement, herbivoreBar);

  // 肉食動物バー (最上層)
  currentY -= carnivoreBarHeight;
  const carnivoreBar: BarCoordinates = {
    x: startX,
    y: currentY,
    width: barWidth,
    height: carnivoreBarHeight,
    fillColor: GAME_PARAMETERS.pyramidSegmentColors.carnivore,
    id: "bar-carnivore",
    type: "carnivore",
  };
  drawRect(svgElement, carnivoreBar);
}

/**
 * 長方形を描画します。（初期UIヘルパー）
 * @param svgElement SVG要素
 * @param bar バーの座標と情報
 */
function drawRect(svgElement: SVGSVGElement, bar: BarCoordinates): void {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", bar.x.toString());
  rect.setAttribute("y", bar.y.toString());
  rect.setAttribute("width", bar.width.toString());
  rect.setAttribute("height", bar.height.toString());
  rect.setAttribute("fill", bar.fillColor);
  rect.setAttribute("id", bar.id);
  rect.classList.add("creature-bar");
  rect.dataset.type = bar.type;
  svgElement.appendChild(rect);
}

/**
 * 生物量の変化に応じてバーの描画を更新します。（初期UI）
 * @param svgElement SVG要素
 * @param plantAmount 植物の量
 * @param herbivoreAmount 草食動物の量
 * @param carnivoreAmount 肉食動物の量
 */
export function updateBars(
  svgElement: SVGSVGElement,
  plantAmount: number,
  herbivoreAmount: number,
  carnivoreAmount: number,
): void {
  const { svgHeight, maxBarHeight } = GAME_PARAMETERS;

  // 各生物の量に応じたバーの高さを計算
  const totalInitialAmount =
    GAME_PARAMETERS.initialPlantAmount +
    GAME_PARAMETERS.initialHerbivoreAmount +
    GAME_PARAMETERS.initialCarnivoreAmount; // 初期総量基準

  // totalInitialAmountが0の場合のゼロ除算対策
  const plantBarHeight =
    totalInitialAmount > 0
      ? Math.max(0, (plantAmount / totalInitialAmount) * maxBarHeight)
      : 0;
  const herbivoreBarHeight =
    totalInitialAmount > 0
      ? Math.max(0, (herbivoreAmount / totalInitialAmount) * maxBarHeight)
      : 0;
  const carnivoreBarHeight =
    totalInitialAmount > 0
      ? Math.max(0, (carnivoreAmount / totalInitialAmount) * maxBarHeight)
      : 0;

  let currentY = svgHeight;

  // 植物バーの更新
  const plantRect = svgElement.querySelector("#bar-plant") as SVGRectElement;
  if (plantRect) {
    plantRect.setAttribute("height", plantBarHeight.toString());
    currentY -= plantBarHeight;
    plantRect.setAttribute("y", currentY.toString());
    plantRect.setAttribute("fill", GAME_PARAMETERS.pyramidSegmentColors.plant);
  }

  // 草食動物バーの更新
  const herbivoreRect = svgElement.querySelector(
    "#bar-herbivore",
  ) as SVGRectElement;
  if (herbivoreRect) {
    herbivoreRect.setAttribute("height", herbivoreBarHeight.toString());
    currentY -= herbivoreBarHeight;
    herbivoreRect.setAttribute("y", currentY.toString());
    herbivoreRect.setAttribute(
      "fill",
      GAME_PARAMETERS.pyramidSegmentColors.herbivore,
    );
  }

  // 肉食動物バーの更新
  const carnivoreRect = svgElement.querySelector(
    "#bar-carnivore",
  ) as SVGRectElement;
  if (carnivoreRect) {
    carnivoreRect.setAttribute("height", carnivoreBarHeight.toString());
    currentY -= carnivoreBarHeight;
    carnivoreRect.setAttribute("y", currentY.toString());
    carnivoreRect.setAttribute(
      "fill",
      GAME_PARAMETERS.pyramidSegmentColors.carnivore,
    );
  }
}

/**
 * SVG要素を初期化し、生態系ピラミッドのセグメントを描画します。（最終UI）
 * @param svgElement SVG要素
 * @param plantAmount 植物の量
 * @param herbivoreAmount 草食動物の量
 * @param carnivoreAmount 肉食動物の量
 */
export function initializePyramid(
  svgElement: SVGSVGElement,
  plantAmount: number,
  herbivoreAmount: number,
  carnivoreAmount: number,
): void {
  svgElement.innerHTML = ""; // 既存の描画をクリア

  const segments = calculatePyramidSegments(
    plantAmount,
    herbivoreAmount,
    carnivoreAmount,
  );

  // SVG要素にセグメントを追加
  segments.forEach((segment) => {
    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon",
    );
    polygon.setAttribute("points", segment.points);
    polygon.setAttribute("fill", segment.fillColor);
    polygon.setAttribute("id", segment.id);
    polygon.classList.add("pyramid-segment");
    polygon.dataset.type = segment.type; // 生物タイプをデータ属性として保持
    svgElement.appendChild(polygon);
  });
}

/**
 * 生物量に基づいてピラミッドのセグメント座標を計算します。（最終UIヘルパー）
 * 各層の高さは生物量に比例し、全体としてピラミッドの形状（側面の直線性）を維持します。
 * @param plantAmount 植物の量
 * @param herbivoreAmount 草食動物の量
 * @param carnivoreAmount 肉食動物の量
 * @returns 各セグメントの座標と情報
 */
export function calculatePyramidSegments(
  plantAmount: number,
  herbivoreAmount: number,
  carnivoreAmount: number,
): SegmentCoordinates[] {
  const segments: SegmentCoordinates[] = [];
  const {
    svgWidth,
    svgHeight,
    pyramidPaddingBottom,
    pyramidSegmentColors,
  } = GAME_PARAMETERS;
  const centerX = svgWidth / 2;

  // Ensure amounts are positive to avoid Math.sqrt(negative) or division by zero
  plantAmount = Math.max(1e-6, plantAmount);
  herbivoreAmount = Math.max(1e-6, herbivoreAmount);
  carnivoreAmount = Math.max(1e-6, carnivoreAmount);

  // 新しい計算式に基づいて高さを計算
  const h_c = Math.sqrt(Math.sqrt(3) * carnivoreAmount);
  const h_h = Math.sqrt(herbivoreAmount / Math.sqrt(3));
  const h_p = Math.sqrt(Math.sqrt(3) * plantAmount / 5);

  // スケーリングファクターを計算
  const totalCalculatedHeight = h_c + h_h + h_p;
  const scaleFactor = GAME_PARAMETERS.pyramidTotalHeight / totalCalculatedHeight;

  // スケーリングを適用した高さ
  const scaled_h_c = h_c * scaleFactor;
  const scaled_h_h = h_h * scaleFactor;
  const scaled_h_p = h_p * scaleFactor;

  // 新しい計算式に基づいて幅を計算
  const sqrt3 = Math.sqrt(3);
  const base_c = (2 * scaled_h_c) / sqrt3; // 肉食動物の底辺

  const top_base_h = (2 * scaled_h_h) / sqrt3; // 草食動物の上辺
  const bottom_base_h = (4 * scaled_h_h) / sqrt3; // 草食動物の底辺

  const top_base_p = (4 * scaled_h_p) / sqrt3; // 植物の上辺
  const bottom_base_p = (6 * scaled_h_p) / sqrt3; // 植物の底辺

  let currentY = svgHeight - pyramidPaddingBottom; // Start from the bottom of the SVG

  // Plant layer (bottom trapezoid)
  const plant_y_bottom = currentY;
  const plant_y_top = currentY - scaled_h_p;
  segments.push({
    points:
      `${centerX - bottom_base_p / 2},${plant_y_bottom} ` +
      `${centerX + bottom_base_p / 2},${plant_y_bottom} ` +
      `${centerX + top_base_p / 2},${plant_y_top} ` +
      `${centerX - top_base_p / 2},${plant_y_top}`,
    fillColor: pyramidSegmentColors.plant,
    id: 'segment-plant',
    type: 'plant',
  });
  currentY = plant_y_top;

  // Herbivore layer (middle trapezoid)
  const herbivore_y_bottom = currentY;
  const herbivore_y_top = currentY - scaled_h_h;
  segments.push({
    points:
      `${centerX - bottom_base_h / 2},${herbivore_y_bottom} ` +
      `${centerX + bottom_base_h / 2},${herbivore_y_bottom} ` +
      `${centerX + top_base_h / 2},${herbivore_y_top} ` +
      `${centerX - top_base_h / 2},${herbivore_y_top}`,
    fillColor: pyramidSegmentColors.herbivore,
    id: 'segment-herbivore',
    type: 'herbivore',
  });
  currentY = herbivore_y_top;

  // Carnivore layer (top triangle)
  const carnivore_y_bottom = currentY;
  const carnivore_y_top = currentY - scaled_h_c;
  segments.push({
    points:
      `${centerX - base_c / 2},${carnivore_y_bottom} ` +
      `${centerX + base_c / 2},${carnivore_y_bottom} ` +
      `${centerX},${carnivore_y_top}`, // Top point of triangle
    fillColor: pyramidSegmentColors.carnivore,
    id: 'segment-carnivore',
    type: 'carnivore',
  });

  return segments;
}

/**
 * 生物量の変化に応じてピラミッドの描画を更新します。（最終UI）
 * @param svgElement SVG要素
 * @param plantAmount 植物の量
 * @param herbivoreAmount 草食動物の量
 * @param carnivoreAmount 肉食動物の量
 */
export function updatePyramid(
  svgElement: SVGSVGElement,
  plantAmount: number,
  herbivoreAmount: number,
  carnivoreAmount: number,
): void {
  const segments = calculatePyramidSegments(
    plantAmount,
    herbivoreAmount,
    carnivoreAmount,
  );

  segments.forEach((newSegment) => {
    const polygon = svgElement.querySelector(
      `#${newSegment.id}`,
    ) as SVGPolygonElement;
    if (polygon) {
      polygon.setAttribute("points", newSegment.points);
    }
  });
}

/**
 * 指定されたセグメントにホバー効果を適用または解除します。（最終UI）
 * @param segmentType 操作対象の生物タイプ
 * @param isHovered ホバー状態か否か
 */
export function setHoverEffect(
  segmentType: "plant" | "herbivore" | "carnivore" | null,
  isHovered: boolean,
): void {
  const svgElement = document.getElementById(
    "ecosystem-svg",
  ) as unknown as SVGSVGElement;
  if (!svgElement) return;

  // 全てのセグメントからホバークラスを削除
  svgElement.querySelectorAll(".pyramid-segment").forEach((el) => {
    el.classList.remove("hovered");
  });

  // 指定されたセグメントにホバークラスを追加
  if (segmentType && isHovered) {
    const targetSegment = svgElement.querySelector(
      `#segment-${segmentType}`,
    ) as SVGPolygonElement;
    if (targetSegment) {
      targetSegment.classList.add("hovered");
    }
  }
}

/**
 * 指定されたセグメントにドラッグ効果を適用または解除します。（最終UI）
 * @param segmentType 操作対象の生物タイプ
 * @param isDragging ドラッグ状態か否か
 */
export function setDraggingEffect(
  segmentType: "plant" | "herbivore" | "carnivore" | null,
  isDragging: boolean,
): void {
  const svgElement = document.getElementById(
    "ecosystem-svg",
  ) as unknown as SVGSVGElement;
  if (!svgElement) return;

  // 全てのセグメントからドラッグクラスを削除
  svgElement.querySelectorAll(".pyramid-segment").forEach((el) => {
    el.classList.remove("dragging");
  });

  // 指定されたセグメントにドラッグクラスを追加
  if (segmentType && isDragging) {
    const targetSegment = svgElement.querySelector(
      `#segment-${segmentType}`,
    ) as SVGPolygonElement;
    if (targetSegment) {
      targetSegment.classList.add("dragging");
    }
  }
}
