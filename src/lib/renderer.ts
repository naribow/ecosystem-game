import { GAME_PARAMETERS } from '../config/parameters';

// バー描画用のインターフェース (初期UI)
interface BarCoordinates {
   x: number;
   y: number;
   width: number;
   height: number;
   fillColor: string;
   id: string;
   type: 'plant' | 'herbivore' | 'carnivore';
}

// ピラミッドセグメント描画用のインターフェース (最終UI)
interface SegmentCoordinates {
   points: string;
   fillColor: string;
   id: string;
   type: 'plant' | 'herbivore' | 'carnivore';
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
   carnivoreAmount: number
): void {
   svgElement.innerHTML = ''; // 既存の描画をクリア

   const { svgWidth, svgHeight, barWidth, maxBarHeight } = GAME_PARAMETERS;
   const centerX = svgWidth / 2;
   const startX = centerX - barWidth / 2; // バーの中心をSVGの中心に合わせる

   // 各生物の量に応じたバーの高さを計算
   const totalInitialAmount = GAME_PARAMETERS.initialPlantAmount + GAME_PARAMETERS.initialHerbivoreAmount + GAME_PARAMETERS.initialCarnivoreAmount;
   const plantBarHeight = (plantAmount / totalInitialAmount) * maxBarHeight;
   const herbivoreBarHeight = (herbivoreAmount / totalInitialAmount) * maxBarHeight;
   const carnivoreBarHeight = (carnivoreAmount / totalInitialAmount) * maxBarHeight;

   let currentY = svgHeight; // SVGの最下部から描画を開始

   // 植物バー (最下層)
   currentY -= plantBarHeight;
   const plantBar: BarCoordinates = {
       x: startX,
       y: currentY,
       width: barWidth,
       height: plantBarHeight,
       fillColor: '#4CAF50', // 緑
       id: 'bar-plant',
       type: 'plant',
   };
   drawRect(svgElement, plantBar);

   // 草食動物バー (中間層)
   currentY -= herbivoreBarHeight;
   const herbivoreBar: BarCoordinates = {
       x: startX,
       y: currentY,
       width: barWidth,
       height: herbivoreBarHeight,
       fillColor: '#FFC107', // 黄色
       id: 'bar-herbivore',
       type: 'herbivore',
   };
   drawRect(svgElement, herbivoreBar);

   // 肉食動物バー (最上層)
   currentY -= carnivoreBarHeight;
   const carnivoreBar: BarCoordinates = {
       x: startX,
       y: currentY,
       width: barWidth,
       height: carnivoreBarHeight,
       fillColor: '#F44336', // 赤
       id: 'bar-carnivore',
       type: 'carnivore',
   };
   drawRect(svgElement, carnivoreBar);
}

/**
* 長方形を描画します。（初期UIヘルパー）
* @param svgElement SVG要素
* @param bar バーの座標と情報
*/
function drawRect(svgElement: SVGSVGElement, bar: BarCoordinates): void {
   const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
   rect.setAttribute('x', bar.x.toString());
   rect.setAttribute('y', bar.y.toString());
   rect.setAttribute('width', bar.width.toString());
   rect.setAttribute('height', bar.height.toString());
   rect.setAttribute('fill', bar.fillColor);
   rect.setAttribute('id', bar.id);
   rect.classList.add('creature-bar');
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
   carnivoreAmount: number
): void {
   const { svgHeight, maxBarHeight } = GAME_PARAMETERS;

   // 各生物の量に応じたバーの高さを計算
   const totalInitialAmount = GAME_PARAMETERS.initialPlantAmount + GAME_PARAMETERS.initialHerbivoreAmount + GAME_PARAMETERS.initialCarnivoreAmount; // 初期総量基準
   const plantBarHeight = (plantAmount / totalInitialAmount) * maxBarHeight;
   const herbivoreBarHeight = (herbivoreAmount / totalInitialAmount) * maxBarHeight;
   const carnivoreBarHeight = (carnivoreAmount / totalInitialAmount) * maxBarHeight;

   let currentY = svgHeight;

   // 植物バーの更新
   const plantRect = svgElement.querySelector('#bar-plant') as SVGRectElement;
   if (plantRect) {
       plantRect.setAttribute('height', plantBarHeight.toString());
       currentY -= plantBarHeight;
       plantRect.setAttribute('y', currentY.toString());
   }

   // 草食動物バーの更新
   const herbivoreRect = svgElement.querySelector('#bar-herbivore') as SVGRectElement;
   if (herbivoreRect) {
       herbivoreRect.setAttribute('height', herbivoreBarHeight.toString());
       currentY -= herbivoreBarHeight;
       herbivoreRect.setAttribute('y', currentY.toString());
   }

   // 肉食動物バーの更新
   const carnivoreRect = svgElement.querySelector('#bar-carnivore') as SVGRectElement;
   if (carnivoreRect) {
       carnivoreRect.setAttribute('height', carnivoreBarHeight.toString());
       currentY -= carnivoreBarHeight;
       carnivoreRect.setAttribute('y', currentY.toString());
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
   carnivoreAmount: number
): void {
   svgElement.innerHTML = ''; // 既存の描画をクリア

   const segments = calculatePyramidSegments(
       plantAmount,
       herbivoreAmount,
       carnivoreAmount
   );

   // SVG要素にセグメントを追加
   segments.forEach(segment => {
       const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
       polygon.setAttribute('points', segment.points);
       polygon.setAttribute('fill', segment.fillColor);
       polygon.setAttribute('id', segment.id);
       polygon.classList.add('pyramid-segment');
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
function calculatePyramidSegments(
   plantAmount: number,
   herbivoreAmount: number,
   carnivoreAmount: number
): SegmentCoordinates[] {
   const segments: SegmentCoordinates[] = [];
   const { svgWidth, svgHeight, pyramidTotalHeight, pyramidBaseWidth, pyramidTopWidth, pyramidPaddingBottom, pyramidSegmentColors } = GAME_PARAMETERS;
   const centerX = svgWidth / 2;

   // 最大総量（ピラミッドが最大高さになる基準）
   const maxTotalAmount = GAME_PARAMETERS.initialPlantAmount + GAME_PARAMETERS.initialHerbivoreAmount + GAME_PARAMETERS.initialCarnivoreAmount;

   // 現在の各層の絶対高さを計算
   const plantAbsHeight = (plantAmount / maxTotalAmount) * pyramidTotalHeight;
   const herbivoreAbsHeight = (herbivoreAmount / maxTotalAmount) * pyramidTotalHeight;
   const carnivoreAbsHeight = (carnivoreAmount / maxTotalAmount) * pyramidTotalHeight;

   // ピラミッドの底辺のY座標
   const pyramidBottomY = svgHeight - pyramidPaddingBottom;

   /**
    * ピラミッドの特定の高さにおける幅を計算するヘルパー関数
    * @param h_from_base ピラミッドの底辺からの高さ
    * @returns その高さにおけるピラミッドの幅
    */
   const getWidthAtHeight = (h_from_base: number): number => {
       if (pyramidTotalHeight === 0) return pyramidBaseWidth; // 0除算対策
       const ratio = h_from_base / pyramidTotalHeight;
       return pyramidBaseWidth - (pyramidBaseWidth - pyramidTopWidth) * ratio;
   };

   let currentPyramidHeightFromBase = 0; // ピラミッドの底辺からの現在の高さ

   // 植物層 (最下層、台形)
   const plantBottomWidth = getWidthAtHeight(currentPyramidHeightFromBase);
   currentPyramidHeightFromBase += plantAbsHeight;
   const plantTopWidth = getWidthAtHeight(currentPyramidHeightFromBase);
   segments.push({
       points: `${centerX - plantBottomWidth / 2},${pyramidBottomY} ` +
               `${centerX + plantBottomWidth / 2},${pyramidBottomY} ` +
               `${centerX + plantTopWidth / 2},${pyramidBottomY - plantAbsHeight} ` +
               `${centerX - plantTopWidth / 2},${pyramidBottomY - plantAbsHeight}`,
       fillColor: pyramidSegmentColors.plant,
       id: 'segment-plant',
       type: 'plant',
   });

   // 草食動物層 (中間層、台形)
   const herbivoreBottomWidth = plantTopWidth; // 草食動物の下辺は植物の上辺に合わせる
   currentPyramidHeightFromBase += herbivoreAbsHeight;
   const herbivoreTopWidth = getWidthAtHeight(currentPyramidHeightFromBase);
   segments.push({
       points: `${centerX - herbivoreBottomWidth / 2},${pyramidBottomY - plantAbsHeight} ` +
               `${centerX + herbivoreBottomWidth / 2},${pyramidBottomY - plantAbsHeight} ` +
               `${centerX + herbivoreTopWidth / 2},${pyramidBottomY - plantAbsHeight - herbivoreAbsHeight} ` +
               `${centerX - herbivoreTopWidth / 2},${pyramidBottomY - plantAbsHeight - herbivoreAbsHeight}`,
       fillColor: pyramidSegmentColors.herbivore,
       id: 'segment-herbivore',
       type: 'herbivore',
   });

   // 肉食動物層 (最上層、三角形)
   const carnivoreBottomWidth = herbivoreTopWidth; // 肉食動物の下辺は草食動物の上辺に合わせる
   currentPyramidHeightFromBase += carnivoreAbsHeight;
   const carnivoreTopY = pyramidBottomY - plantAbsHeight - herbivoreAbsHeight - carnivoreAbsHeight; // 肉食動物の頂点のY座標
   segments.push({
       points: `${centerX - carnivoreBottomWidth / 2},${pyramidBottomY - plantAbsHeight - herbivoreAbsHeight} ` +
               `${centerX + carnivoreBottomWidth / 2},${pyramidBottomY - plantAbsHeight - herbivoreAbsHeight} ` +
               `${centerX},${carnivoreTopY}`, // 三角形の頂点
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
   carnivoreAmount: number
): void {
   const segments = calculatePyramidSegments(
       plantAmount,
       herbivoreAmount,
       carnivoreAmount
   );

   segments.forEach(newSegment => {
       const polygon = svgElement.querySelector(`#${newSegment.id}`) as SVGPolygonElement;
       if (polygon) {
           polygon.setAttribute('points', newSegment.points);
       }
   });
}

/**
* 指定されたセグメントにホバー効果を適用または解除します。（最終UI）
* @param segmentType 操作対象の生物タイプ
* @param isHovered ホバー状態か否か
*/
export function setHoverEffect(segmentType: 'plant' | 'herbivore' | 'carnivore' | null, isHovered: boolean): void {
   const svgElement = document.getElementById('ecosystem-svg') as SVGSVGElement;
   if (!svgElement) return;

   // 全てのセグメントからホバークラスを削除
   svgElement.querySelectorAll('.pyramid-segment').forEach(el => {
       el.classList.remove('hovered');
   });

   // 指定されたセグメントにホバークラスを追加
   if (segmentType && isHovered) {
       const targetSegment = svgElement.querySelector(`#segment-${segmentType}`) as SVGPolygonElement;
       if (targetSegment) {
           targetSegment.classList.add('hovered');
       }
   }
}

/**
* 指定されたセグメントにドラッグ効果を適用または解除します。（最終UI）
* @param segmentType 操作対象の生物タイプ
* @param isDragging ドラッグ状態か否か
*/
export function setDraggingEffect(segmentType: 'plant' | 'herbivore' | 'carnivore' | null, isDragging: boolean): void {
   const svgElement = document.getElementById('ecosystem-svg') as SVGSVGElement;
   if (!svgElement) return;

   // 全てのセグメントからドラッグクラスを削除
   svgElement.querySelectorAll('.pyramid-segment').forEach(el => {
       el.classList.remove('dragging');
   });

   // 指定されたセグメントにドラッグクラスを追加
   if (segmentType && isDragging) {
       const targetSegment = svgElement.querySelector(`#segment-${segmentType}`) as SVGPolygonElement;
       if (targetSegment) {
           targetSegment.classList.add('dragging');
       }
   }
}
