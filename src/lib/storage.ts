const RANKING_KEY = "ecosystemGameRanking";
const MAX_RANKING_ENTRIES = 10; // ランキングに保存する最大件数

/**
 * スコアをlocalStorageに保存し、ランキングを更新します。
 * @param newScore 新しいスコア (秒)
 */
export function saveScore(newScore: number): void {
  const ranking = getRanking();
  ranking.push(newScore);
  ranking.sort((a, b) => b - a); // 降順にソート（高スコアが上位）

  // 最大件数を超えた場合は古いスコアを削除
  if (ranking.length > MAX_RANKING_ENTRIES) {
    ranking.splice(MAX_RANKING_ENTRIES);
  }

  localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
}

/**
 * localStorageからランキングを取得します。
 * @returns スコアの配列
 */
export function getRanking(): number[] {
  const rankingString = localStorage.getItem(RANKING_KEY);
  if (rankingString) {
    try {
      const ranking = JSON.parse(rankingString);
      // 配列であり、数値のみを含むことを確認
      if (
        Array.isArray(ranking) &&
        ranking.every((item) => typeof item === "number")
      ) {
        return ranking;
      }
    } catch (e) {
      console.error("Failed to parse ranking from localStorage:", e);
    }
  }
  return []; // データがない、またはパースエラーの場合は空の配列を返す
}
