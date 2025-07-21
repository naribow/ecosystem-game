export const GAME_PARAMETERS = {
  initialPlantAmount: 50,
  initialHerbivoreAmount: 30,
  initialCarnivoreAmount: 10,

  // 新しい数式用の定数
  rA_base: 0.005, // 植物の自然増加率の基本値 (増加)
  rA_variance: 2.5,
  KA_base: 1200, // 植物の環境収容力の基本値 (増加)
  KA_variance: 2.5,
  a1_base: 0.0008, // 草食動物による植物の捕食効率の基本値 (減少)
  a1_variance: 2.2,
  a2_base: 0.0025, // 草食動物が植物を食べて増加する効率の基本値 (減少)
  a2_variance: 0.2,
  rB_base: 0.2, // 草食動物の自然減少率の基本値 (増加)
  rB_variance: 2.7,
  b1_base: 0.0012, // 肉食動物による草食動物の捕食効率の基本値 (わずかに増加)
  b1_variance: 2.5,
  b2_base: 0.00016, // 肉食動物が草食動物を食べて増加する効率の基本値 (さらに大幅に減少)
  b2_variance: 2.5,
  rC_base: 0.05, // 肉食動物の自然減少率の基本値 (大幅に増加)
  rC_variance: 2.5,

  // 乱獲する人間による介入定数
  hA_base: 0.01, // 植物の乱獲効率の基本値
  hA_variance: 10.1, // 植物の乱獲効率の変動幅
  hB_base: 0.02, // 草食動物の乱獲効率の基本値
  hB_variance: 10.1, // 草食動物の乱獲効率の変動幅
  hC_base: 0.01, // 肉食動物の乱獲効率の基本値
  hC_variance: 10.1, // 肉食動物の乱獲効率の変動幅

  // 既存の定数（一部は新しい数式で不要になるが、互換性のため残す）
  plantGrowthRate: 0.01, // 植物の自然増殖率
  herbivoreConsumptionRate: 0.005, // 草食動物の植物消費率
  carnivoreConsumptionRate: 0.003, // 肉食動物の草食動物消費率
  naturalDeathRate: 0.0001, // 全生物共通の自然死率

  playerInterventionAmount: 100, // プレイヤーの介入による増減量

  // UI関連のパラメータ (初期バー表示用)
  svgWidth: 800, // SVGキャンバスの幅
  svgHeight: 500, // SVGキャンバスの高さ
  barWidth: 100, // 各生物バーの幅
  maxBarHeight: 400, // バーの最大高さ（SVG高さからマージンを引いた値など）

  // UI関連のパラメータ (最終ピラミッド表示用)
  pyramidTotalHeight: 400, // ピラミッド全体の最大高さ
  pyramidBaseWidth: 461.88, // ピラミッドの底辺の最大幅 (正三角形の比率に合わせる)
  pyramidTopWidth: 0, // ピラミッドの最上部（肉食動物の頂点）の幅 (正三角形のため0)
  pyramidPaddingBottom: 50, // SVG下部からのピラミッドのパディング
  pyramidSegmentColors: {
    plant: "#4CAF50", // 緑
    herbivore: "#FFC107", // 黄色
    carnivore: "#F44336", // 赤
  },
  dragSensitivity: 1, // ドラッグ操作の感度 (ピクセルあたりの量変化)
};
