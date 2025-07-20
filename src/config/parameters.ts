export const GAME_PARAMETERS = {
   initialPlantAmount: 1000,
   initialHerbivoreAmount: 500,
   initialCarnivoreAmount: 200,

   plantGrowthRate: 0.01, // 植物の自然増殖率
   herbivoreConsumptionRate: 0.005, // 草食動物の植物消費率
   carnivoreConsumptionRate: 0.003, // 肉食動物の草食動物消費率

   naturalDeathRate: 0.0001, // 全生物共通の自然死率

   playerInterventionAmount: 50, // プレイヤーの介入による増減量

   // UI関連のパラメータ (初期バー表示用)
   svgWidth: 800, // SVGキャンバスの幅
   svgHeight: 500, // SVGキャンバスの高さ
   barWidth: 100, // 各生物バーの幅
   maxBarHeight: 400, // バーの最大高さ（SVG高さからマージンを引いた値など）

   // UI関連のパラメータ (最終ピラミッド表示用)
   pyramidTotalHeight: 400, // ピラミッド全体の最大高さ
   pyramidBaseWidth: 600, // ピラミッドの底辺の最大幅
   pyramidTopWidth: 50, // ピラミッドの最上部（肉食動物の頂点）の幅 (0に近い値)
   pyramidPaddingBottom: 50, // SVG下部からのピラミッドのパディング
   pyramidSegmentColors: {
       plant: '#4CAF50',    // 緑
       herbivore: '#FFC107', // 黄色
       carnivore: '#F44336', // 赤
   },
   dragSensitivity: 1, // ドラッグ操作の感度 (ピクセルあたりの量変化)
};
