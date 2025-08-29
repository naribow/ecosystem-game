# ecosystem-game

以下のリンクから遊べます
https://naribow.github.io/ecosystem-game/

# 使用したドキュメント

生態系ゲームにおける定数のランダムな変動
このドキュメントでは、植物（A）、草食動物（B）、肉食動物（C）の生態系シミュレーションゲームにおいて、個体数の増減を司る定数を定期的にランダムに変更する方法について説明します。これにより、ゲームに予測不可能な要素と高いリプレイ性を加えることができます。
1. ランダム変動の基本概念
ゲームの進行中、一定の期間（例えば、毎ターン、数ターンごと、またはゲーム内の特定の「月」や「年」の変わり目など）で、生態系の数式で使用される定数（増加率、捕食効率、環境収容力など）をランダムに調整します。
この調整は、以下のような要因をシミュレートするのに役立ちます。
* 環境の変化: 天候の変動、季節の移り変わり、自然災害など。
* 種の適応/進化: 特定の種が一時的に繁殖力を高めたり、捕食効率を上げたりする。
* 病気や資源の変動: 病気の流行で死亡率が上がったり、新たな資源の発見で環境収容力が変化したりする。
2. 個体数と定数の関係を示す数式
各個体群の数の変化率を dA/dt、dB/dt、dC/dt とします。これらの数式は、各定数と個体数（A, B, C）がどのように互いに影響し合うかを直接的に示しています。
a. 植物 (A) の変化
植物の数は、自然に増加する傾向がありますが、草食動物に食べられることで減少します。また、環境が支えられる植物の最大数（環境収容力 KA​）によって、その増加は制限されます。
dtdA​=rA​A(1−KA​A​)−a1​AB
ここで:
* rA​: 植物の自然増加率（定数）
* KA​: 植物の環境収容力（定数）
* a1​: 草食動物による植物の捕食効率（定数）
b. 草食動物 (B) の変化
草食動物の数は、植物を食べることで増加しますが、自然な死亡や肉食動物に食べられることで減少します。
dtdB​=a2​AB−rB​B−b1​BC
ここで:
* a2​: 草食動物が植物を食べて増加する効率（定数）
* rB​: 草食動物の自然減少率（定数）
* b1​: 肉食動物による草食動物の捕食効率（定数）
c. 肉食動物 (C) の変化
肉食動物の数は、草食動物を食べることで増加しますが、自然な死亡により減少します。
dtdC​=b2​BC−rC​C
ここで:
* b2​: 肉食動物が草食動物を食べて増加する効率（定数）
* rC​: 肉食動物の自然減少率（定数）
これらの数式は、ゲームの各ターンで個体数を計算する際の基盤となります。例えば、次のターンの個体数 At+1​ は、現在の個体数 At​ に変化率 dA/dt と時間ステップ Δt を乗じたものを加えることで計算されます。
At+1​=At​+Δt⋅dtdA​Bt+1​=Bt​+Δt⋅dtdB​Ct+1​=Ct​+Δt⋅dtdC​
3. 数式におけるランダム変動の表現
各定数をランダムに変動させるには、まず「基本となる定数」を定義し、それに「ランダムな変動係数」を乗じる方法が一般的です。
ある定数 X （例: 植物の自然増加率 rA​）について、その変動は以下のように表現されます。
X現在​=X基本​×Fランダム​
ここで:
* X現在​: ゲームの現在のターンで使用される定数の値。
* X基本​: その定数の基準となる値。ゲーム開始時に設定する平均的な値です。
* Fランダム​: 1.0を中心に変動するランダムな係数。この係数によって、定数が基本値からどれだけ上下するかを制御します。
Fランダム​ は、例えば 0.7 から 1.3 の範囲（つまり、基本値の −30% から +30% の範囲で変動）など、指定した範囲内で一様乱数として生成されます。
4. 各定数の推奨レンジと変動幅
定数の値は、ゲームの挙動に大きく影響します。まずは安定した生態系が維持できる基本値を見つけ、その上でランダムな変動幅を設定することをお勧めします。
a. 自然増加率 (rA​,rB​,rC​)
* 影響: 各種の繁殖力や自己増殖能力。値が高いほど、その種は増えやすくなります。
* 基本値の目安: 0.05∼0.3
* ランダム変動幅: 基本値の ±10% から ±50% 程度。
   * 例: rA​ の基本値が 0.1 の場合、Fランダム​ を 0.7∼1.3 の範囲で生成し、rA​ を 0.07∼0.13 の間で変動させる。
b. 捕食効率 (a1​,a2​,b1​,b2​)
* 影響: 捕食者と被捕食者の相互作用の強さ。値が高いほど、捕食者は効率的に被捕食者を減らし、自身を増やします。
* 基本値の目安: 0.001∼0.01 （個体数が多いと積が大きくなるため、小さい値から始めるのが良いでしょう。）
* ランダム変動幅: 基本値の ±10% から ±30% 程度。
   * 例: a1​ の基本値が 0.005 の場合、Fランダム​ を 0.8∼1.2 の範囲で生成し、a1​ を 0.004∼0.006 の間で変動させる。
c. 環境収容力 (KA​)
* 影響: 特定の環境で支えられる種の最大個体数。
* 基本値の目安: ゲームの規模に合わせて 1000∼10000 など。
* ランダム変動幅: 基本値の ±10% から ±50% 程度。
   * 例: KA​ の基本値が 5000 の場合、Fランダム​ を 0.5∼1.5 の範囲で生成し、KA​ を 2500∼7500 の間で変動させる。
d. 自然減少率（死亡率）(rB​,rC​)
* 影響: 食料に関係なく自然に死ぬ割合。
* 基本値の目安: 0.01∼0.1
* ランダム変動幅: 基本値の ±10% から ±50% 程度。
   * 例: rB​ の基本値が 0.05 の場合、Fランダム​ を 0.5∼1.5 の範囲で生成し、rB​ を 0.025∼0.075 の間で変動させる。
5. 実装上の考慮事項
* 更新頻度: 定数をランダムに更新する頻度を決定します。
   * 毎ターン: 非常に動的で予測不能なゲームになります。
   * 数ターンごと: ある程度の安定性を保ちつつ、変化を導入できます。
   * ゲーム内イベントと連動: 特定のイベント（例: 季節の変わり目、災害発生）時にのみ変動させることで、ドラマチックな展開を作れます。
* 値の制約:
   * 非負の保証: 定数が負の値にならないように、生成された値が常に 0 より大きいことを確認してください（特に捕食効率や増加率）。
   * 現実的な範囲: あまりにも極端な値にならないように、上限と下限を設定することを検討してください。
* ゲームイベントとの連携: ランダムな変動を、ゲーム内の視覚的なイベントやメッセージと結びつけると、プレイヤーは変化の理由を理解しやすくなります。例えば、「大雨が降り、植物の成長率が一時的に上昇しました！」といったメッセージを表示するなどです。
* プレイヤーへのフィードバック: 定数の変動が個体数にどのような影響を与えているかを、グラフ表示やテキストメッセージでプレイヤーに伝えることで、ゲームの戦略性を高めることができます。
6. まとめ
定数を定期的にランダムに変動させることで、生態系シミュレーションゲームはよりダイナミックで予測不可能なものになります。上記の数式と推奨されるレンジを参考に、まずはシンプルな実装から始め、ゲームの面白さを最大限に引き出すために、様々な値や変動パターンを試行錯誤してみてください。

---

生態系バランスゲーム 開発ドキュメント v2.3 詳細版
1. はじめに
このドキュメントは、生態系の食物連鎖をテーマにしたブラウザ向けシミュレーションゲームの開発計画をまとめたものです。プレイヤーは「植物」「草食動物」「肉食動物」のバランスを調整し、生態系ができるだけ長く存続することを目指します。
本プロジェクトでは、TypeScriptを採用し、最新の開発ツールとCI/CDパイプラインを導入することで、品質と開発効率の高い開発を目指します。完成したゲームは静的サイトとしてビルドされ、GitHub Pagesなどで簡単に公開できます。
2. ゲームコンセプト
* テーマ: 生態系のバランスと食物連鎖
* 目的: すべての生物が絶滅するまでの時間を可能な限り引き延ばす。
* UI: 各生物の量を可視化する。
   * 初期UI: 各生物の量は、高さがその量に比例するシンプルな**垂直な直線（バー）**で表現します。これらのバーは下から順に「植物」「草食動物」「肉食動物」として積み重ねて表示され、常に下の層に隙間なく配置されます。
   * 最終UI: 生態系ピラミッドを模した図形（三角形と台形）で各生物の量を可視化します。
* 操作: プレイヤーは、各生物の量を調整するためのボタンを操作することで、各生物の量を調整する。
   * 最終UI: プレイヤーは図形の左右の辺をドラッグ操作することで、各生物の量を直感的に調整する。
* 機能: 生存時間をスコアとして記録し、ブラウザ内にランキングを保存する。
3. 技術スタックと開発環境
* 言語: TypeScript
* 開発・ビルドツール: Vite
* 描画: SVG (Scalable Vector Graphics)
* データ永続化: Web Storage (localStorage)
4. プロジェクト構成
Viteの標準的なTypeScriptプロジェクト構成に、設定ファイル用のディレクトリを追加します。
ecosystem-game/
│
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actionsのワークフローファイル
│
├── src/
│   ├── lib/
│   │   ├── game.ts         # ゲームロジック（生態系シミュレーション、ゲームオーバー判定など）
│   │   ├── renderer.ts     # SVG描画処理
│   │   ├── interaction.ts  # プレイヤーのインタラクション（マウスイベントなど）
│   │   └── storage.ts      # localStorageへのアクセス処理
│   │
│   ├── styles/
│   │   └── style.css       # 全体的なスタイリング
│   │
│   ├── config/
│   │   └── parameters.ts   # ゲームバランス調整用のパラメータ定義
│   │
│   └── main.ts             # アプリケーションのエントリーポイント、メインループ管理
│
├── index.html              # HTMLのメインファイル
├── package.json            # プロジェクトの依存関係とスクリプト
├── tsconfig.json           # TypeScriptの設定ファイル
└── vite.config.ts          # Viteの設定ファイル


5. ゲームデザイン詳細
5.1. 生態系シミュレーション
ゲームループ
ゲームの進行は requestAnimationFrame を利用したメインループによって管理されます。ループ内では、以下の処理が順次実行されます。
1. 時間経過の計算: 前回のフレームからの時間差を計算し、シミュレーションのステップに使用します。
2. 生態系の変動: src/lib/game.ts に実装されたロジックに基づき、各生物の量が時間経過、捕食、自然死などによって変動します。
3. プレイヤー操作の反映: プレイヤーの操作（ボタンによる生物量の増減）を反映します。
4. 状態判定: ゲームオーバー条件（いずれかの生物が絶滅）を満たしているか判定します。
5. 描画更新: src/lib/renderer.ts を呼び出し、現在の生物量に基づいてSVG要素を更新し、画面に描画します。
パラメータ管理
ゲームの面白さの核となる生態系の変動ロジックは、後から簡単に調整できるように設計します。
* 設定の分離: 生物の自然増減率、捕食による増減係数、自然死の確率、プレイヤーの介入による変化量などの数値は、src/config/parameters.ts のような独立したファイルに定数としてまとめて定義します。
   * 例:
// src/config/parameters.ts
export const GAME_PARAMETERS = {
   plantGrowthRate: 0.01,
   herbivoreConsumptionRate: 0.005,
   carnivoreConsumptionRate: 0.003,
   naturalDeathRate: 0.0001,
   playerInterventionAmount: 10,
   // ...その他のパラメータ
};



   * 柔軟な調整: ゲームロジック（game.ts）はこの設定ファイルをインポートして使用します。これにより、ゲームバランスを調整する際に、ロジックのコードを直接書き換える必要がなく、parameters.ts の数値を変更するだけで済みます。
5.2. プレイヤーの操作とUIフィードバック
生態系バーの描画と変化のロジック
ゲームのUIは、各生物の量を垂直な直線（バー）の高さで表現します。
   * 初期構造:
   * SVG領域内に、下から順に「植物」「草食動物」「肉食動物」に対応する長方形（バー）を描画します。
   * 各バーの高さは、対応する生物の量に比例します。
   * これらのバーは、常に下の層に隙間なく積み重なるように配置され、全体としてピラミッドのような階層構造を形成します。
   * 生物量の変化と図形の変化:
   * 各生物の量が変化すると、その生物に対応するバーの高さが比例して変化します。
   * バーの幅は一定に保たれ、高さのみが動的に変化することで、生物量の増減を直感的に表現します。
直感的な操作
プレイヤーは、各生物の量を調整するためのボタンを操作します。
   * 各生物（植物、草食動物、肉食動物）に対して、「増加」ボタンと「減少」ボタンを配置します。
   * ボタンをクリックすることで、対応する生物の量が一定量増減します。
UIフィードバック
プレイヤーがどの生物を操作しようとしているかを視覚的に分かりやすくするため、インタラクションに応じたフィードバックを実装します。
   * ボタンの視覚的フィードバック: ボタンがクリックされた際に、色が変わる、わずかに縮むなどの視覚的なフィードバックを提供します。
   * 実装例: CSSの :active 擬似クラスやJavaScriptでのクラス追加/削除によりスタイルを変更します。
5.3. ゲームオーバーとランキング
   * ゲームオーバー条件: 「植物」「草食動物」「肉食動物」のいずれか1種類でも、その量が0になった（絶滅した）時点で即座にゲームオーバーとなります。
   * スコアリング: ゲーム開始からの総生存時間をスコアとします。時間はミリ秒単位で計測し、最終的に秒単位で表示します。
   * ランキング: ゲームオーバー時にスコアを localStorage に保存し、ランキングを更新・表示します。
   * localStorage には、例えば ecosystemGameRanking のようなキーでJSON形式の配列を保存します。
   * 新しいスコアが既存のランキングに入り込む場合、適切な位置に挿入し、上位N件（例: 10件）のみを保持します。
6. コード品質と自動化 (CI/CD)
GitHub Actions を利用して、main ブランチにコードがプッシュされるたびに、テスト、ビルド、そしてGitHub Pagesへのデプロイを自動的に実行します。これにより、コードの品質を常に高く保ち、最新版をいつでも公開できる状態にします。
ワークフロー詳細
以下の内容で .github/workflows/deploy.yml ファイルを作成します。
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
 push:
   branches:
     - main # mainブランチにプッシュされたときに実行

jobs:
 deploy: # ジョブ名をdeployに変更
   runs-on: ubuntu-latest
   permissions:
     contents: write
     pages: write
     id-token: write

   steps:
     - name: Checkout repository
       uses: actions/checkout@v4 # リポジトリをチェックアウト

     - name: Setup Node.js
       uses: actions/setup-node@v4 # Node.js環境をセットアップ
       with:
         node-version: '20' # 使用するNode.jsのバージョン

     - name: Install dependencies
       run: npm install # プロジェクトの依存関係をインストール

     - name: Run ESLint
       run: npm run lint # ESLintを実行してコードの品質をチェック

     - name: Run Prettier
       run: npm run format # Prettierを実行してコードのフォーマットを修正 (必要であれば)
       continue-on-error: true # フォーマットエラーがあってもビルドを続行する場合

     - name: Build project
       run: npm run build # Viteでプロジェクトをビルド

     - name: Setup Pages
       uses: actions/configure-pages@v3 # GitHub Pagesの環境設定

     - name: Upload artifact
       uses: actions/upload-pages-artifact@v3 # ビルド成果物をアップロード
       with:
         path: './dist' # Viteのビルド出力ディレクトリ

     - name: Deploy to GitHub Pages
       id: deployment
       uses: actions/deploy-pages@v4 # GitHub Pagesにデプロイ




GitHub Pagesの設定:
GitHubリポジトリにアクセスし、「Settings」タブ -> 左側のメニューから「Pages」を選択します。
「Source」で「Deploy from a branch」ではなく「GitHub Actions」を選択し、「Save」をクリックします。これにより、上記のワークフローが自動的にデプロイを管理するようになります。
7. 実装計画（ステップ・バイ・ステップ）
ステップ 1: 環境構築
   1. Vite + TypeScriptのプロジェクトを作成:
   * ターミナルを開き、以下のコマンドを実行します。
npm create vite@latest ecosystem-game -- --template vanilla-ts



   * プロジェクトディレクトリに移動します。
cd ecosystem-game



   * 必要な依存関係をインストールします。
npm install



      2. Prettier, ESLintを導入:
      * 開発依存関係としてインストールします。
npm install -D prettier eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier



      * .eslintrc.cjs ファイルを作成し、ESLintの設定を記述します。
// .eslintrc.cjs
module.exports = {
 root: true,
 env: {
   browser: true,
   es2020: true,
 },
 extends: [
   'eslint:recommended',
   'plugin:@typescript-eslint/recommended',
   'prettier', // Prettierとの競合を避ける設定
 ],
 parser: '@typescript-eslint/parser',
 parserOptions: {
   ecmaVersion: 'latest',
   sourceType: 'module',
 },
 plugins: ['@typescript-eslint'],
 rules: {
   // 必要に応じてルールを追加・変更
 },
};



      * .prettierrc.cjs ファイルを作成し、Prettierの設定を記述します。
// .prettierrc.cjs
module.exports = {
 semi: true,
 trailingComma: 'all',
 singleQuote: true,
 printWidth: 80,
 tabWidth: 2,
};



      * package.json にスクリプトを追加します。
// package.json (一部抜粋)
"scripts": {
 "dev": "vite",
 "build": "tsc && vite build",
 "preview": "vite preview",
 "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
 "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,scss,md}\""
},



      * VS Codeを使用している場合、PrettierとESLintの拡張機能をインストールし、保存時に自動フォーマットされるように設定します。
         3. src/config/parameters.ts を作成し、仮のパラメータを定義:
         * src ディレクトリ内に config ディレクトリを作成します。
mkdir -p src/config



         * src/config/parameters.ts ファイルを作成し、以下の内容を記述します。
// src/config/parameters.ts
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



ステップ 2: CI/CDパイプラインの構築
            1. vite.config.ts の base オプションを設定:
            * GitHub Pagesにデプロイする場合、リポジトリ名がURLのパスになるため、base オプションを設定する必要があります。
            * vite.config.ts を開き、以下のように修正します。
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
 base: '/ecosystem-game/', // GitHub Pagesのリポジトリ名に合わせる
 // ...その他の設定
});



               2. GitHub Actionsのワークフロー（deploy.yml）を作成し、リポジトリにプッシュ:
               * .github/workflows ディレクトリを作成します。
mkdir -p .github/workflows



               * .github/workflows/deploy.yml ファイルを作成し、以下の内容を記述します。
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
 push:
   branches:
     - main # mainブランチにプッシュされたときに実行

jobs:
 deploy: # ジョブ名をdeployに変更
   runs-on: ubuntu-latest
   permissions:
     contents: write
     pages: write
     id-token: write

   steps:
     - name: Checkout repository
       uses: actions/checkout@v4 # リポジトリをチェックアウト

     - name: Setup Node.js
       uses: actions/setup-node@v4 # Node.js環境をセットアップ
       with:
         node-version: '20' # 使用するNode.jsのバージョン

     - name: Install dependencies
       run: npm install # プロジェクトの依存関係をインストール

     - name: Run ESLint
       run: npm run lint # ESLintを実行してコードの品質をチェック

     - name: Run Prettier
       run: npm run format # Prettierを実行してコードのフォーマットを修正 (必要であれば)
       continue-on-error: true # フォーマットエラーがあってもビルドを続行する場合

     - name: Build project
       run: npm run build # Viteでプロジェクトをビルド

     - name: Setup Pages
       uses: actions/configure-pages@v3 # GitHub Pagesの環境設定

     - name: Upload artifact
       uses: actions/upload-pages-artifact@v3 # ビルド成果物をアップロード
       with:
         path: './dist' # Viteのビルド出力ディレクトリ

     - name: Deploy to GitHub Pages
       id: deployment
       uses: actions/deploy-pages@v4 # GitHub Pagesにデプロイ



               * このファイルをリポジトリにプッシュします。
                  3. GitHub Pagesの設定を行い、初期ページが自動でデプロイされることを確認:
                  * GitHubリポジトリにアクセスします。
                  * 「Settings」タブをクリックします。
                  * 左側のメニューから「Pages」を選択します。
                  * 「Source」で「Deploy from a branch」ではなく「GitHub Actions」を選択し、「Save」をクリックします。これにより、上記のワークフローが自動的にデプロイを管理するようになります。
ステップ 3: 静的な画面の構築（初期UI: バーとボタン）
                  1. index.html にSVG要素とUI要素を配置し、src/styles/style.css でスタイリング:
                  * index.html を開き、ゲームのコンテナとなるHTML構造とSVG要素、そして各生物を操作するためのボタンを追加します。
<!DOCTYPE html>
<html lang="ja">
 <head>
   <meta charset="UTF-8" />
   <link rel="icon" type="image/svg+xml" href="/vite.svg" />
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <title>生態系バランスゲーム</title>
   <link rel="stylesheet" href="/src/styles/style.css" />
 </head>
 <body>
   <div id="app">
     <h1>生態系バランスゲーム</h1>
     <div class="game-container">
       <svg id="ecosystem-svg" width="800" height="500" viewBox="0 0 800 500"></svg>
       <div class="ui-panel">
         <div id="time-display" class="info-box">生存時間: 0秒</div>

         <div class="creature-controls">
           <div class="control-group">
             <h3>植物</h3>
             <button id="plant-increase" class="action-button">+</button>
             <button id="plant-decrease" class="action-button">-</button>
           </div>
           <div class="control-group">
             <h3>草食動物</h3>
             <button id="herbivore-increase" class="action-button">+</button>
             <button id="herbivore-decrease" class="action-button">-</button>
           </div>
           <div class="control-group">
             <h3>肉食動物</h3>
             <button id="carnivore-increase" class="action-button">+</button>
             <button id="carnivore-decrease" class="action-button">-</button>
           </div>
         </div>

         <button id="restart-button" class="action-button">リスタート</button>
         <div id="ranking-display" class="info-box">
           <h2>ランキング</h2>
           <ul id="ranking-list">
             <!-- ランキングがここに表示されます -->
           </ul>
         </div>
       </div>
     </div>
     <div id="game-over-modal" class="modal">
       <div class="modal-content">
         <h2>ゲームオーバー！</h2>
         <p id="final-score"></p>
         <button id="modal-restart-button" class="action-button">もう一度プレイ</button>
       </div>
     </div>
   </div>
   <script type="module" src="/src/main.ts"></script>
 </body>
</html>

                  * src ディレクトリ内に styles ディレクトリを作成します。
mkdir -p src/styles

                  * src/styles/style.css ファイルを作成し、基本的なスタイリングを記述します。バーのスタイルも追加します。
/* src/styles/style.css */
body {
   font-family: 'Inter', sans-serif;
   display: flex;
   justify-content: center;
   align-items: center;
   min-height: 100vh;
   margin: 0;
   background-color: #f0f8ff; /* 淡い青 */
   color: #333;
}

#app {
   text-align: center;
   background-color: #ffffff;
   padding: 20px;
   border-radius: 15px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   width: 90%;
   max-width: 1000px;
   box-sizing: border-box;
}

h1 {
   color: #2c3e50;
   margin-bottom: 20px;
}

.game-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 20px;
}

#ecosystem-svg {
   border: 1px solid #ccc;
   background-color: #e0ffe0; /* 淡い緑 */
   border-radius: 10px;
   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
   width: 100%; /* レスポンシブ対応 */
   height: auto; /* 高さを自動調整 */
   max-height: 500px; /* 最大高さを設定 */
}

/* SVG内のバーに対する基本スタイル */
.creature-bar {
   fill: #4CAF50; /* 植物のデフォルト色 */
   transition: height 0.3s ease, y 0.3s ease; /* 高さの変化を滑らかに */
}

/* SVG内のピラミッドセグメントに対する基本スタイル */
.pyramid-segment {
   stroke: #333;
   stroke-width: 1;
   transition: fill 0.3s ease, stroke 0.3s ease, stroke-width 0.1s ease;
   cursor: default; /* デフォルトカーソル */
}

.pyramid-segment.hovered {
   stroke-width: 3; /* ホバー時の辺の太さ */
   stroke: #1976D2; /* ホバー時の辺の色 */
}

.pyramid-segment.dragging {
   fill: #FFEB3B; /* ドラッグ中の強調色 */
   opacity: 0.9;
   animation: pulse 0.8s infinite alternate; /* ドラッグ中のアニメーション */
}

@keyframes pulse {
   from { transform: scale(1); }
   to { transform: scale(1.005); }
}


.ui-panel {
   display: flex;
   flex-direction: column;
   gap: 15px;
   width: 100%;
   max-width: 300px;
   background-color: #f9f9f9;
   padding: 15px;
   border-radius: 10px;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-box {
   background-color: #e3f2fd; /* 淡い青 */
   padding: 10px;
   border-radius: 8px;
   font-size: 1.1em;
   color: #1a237e;
   font-weight: bold;
}

.creature-controls {
   display: flex;
   flex-direction: column;
   gap: 10px;
   width: 100%;
}

.control-group {
   display: flex;
   justify-content: space-between;
   align-items: center;
   background-color: #f0f0f0;
   padding: 8px 15px;
   border-radius: 8px;
}

.control-group h3 {
   margin: 0;
   font-size: 1em;
   color: #555;
}

.action-button {
   background-color: #4CAF50; /* 緑 */
   color: white;
   padding: 8px 15px; /* ボタンのパディングを調整 */
   border: none;
   border-radius: 8px;
   cursor: pointer;
   font-size: 1em;
   transition: background-color 0.3s ease, transform 0.1s ease;
   box-shadow: 0 4px #388E3C;
   min-width: 40px; /* ボタンの最小幅 */
}

.action-button:hover {
   background-color: #66BB6A;
   transform: translateY(-2px);
   box-shadow: 0 6px #388E3C;
}

.action-button:active {
   background-color: #388E3C;
   transform: translateY(2px);
   box-shadow: 0 2px #388E3C;
}

#ranking-list {
   list-style: none;
   padding: 0;
   margin-top: 10px;
   text-align: left;
}

#ranking-list li {
   background-color: #ffffff;
   margin-bottom: 5px;
   padding: 8px 10px;
   border-radius: 5px;
   border: 1px solid #eee;
   display: flex;
   justify-content: space-between;
   align-items: center;
}

#ranking-list li:nth-child(1) { font-weight: bold; color: #d4af37; } /* Gold */
#ranking-list li:nth-child(2) { font-weight: bold; color: #a8a8a8; } /* Silver */
#ranking-list li:nth-child(3) { font-weight: bold; color: #cd7f32; } /* Bronze */

/* モーダル */
.modal {
   display: none; /* 初期状態では非表示 */
   position: fixed;
   z-index: 1;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   overflow: auto;
   background-color: rgba(0,0,0,0.4); /* 半透明の背景 */
   justify-content: center;
   align-items: center;
}

.modal-content {
   background-color: #fefefe;
   margin: auto;
   padding: 30px;
   border: 1px solid #888;
   width: 80%;
   max-width: 500px;
   border-radius: 15px;
   text-align: center;
   box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-content h2 {
   color: #D32F2F; /* 赤 */
   margin-bottom: 20px;
}

.modal-content p {
   font-size: 1.2em;
   margin-bottom: 20px;
}

/* レスポンシブデザイン */
@media (min-width: 768px) {
   .game-container {
       flex-direction: row;
       justify-content: center;
       align-items: flex-start;
   }
   #ecosystem-svg {
       width: 60%;
       max-width: 800px;
   }
   .ui-panel {
       width: 35%;
       max-width: 350px;
   }
}

                     2. src/lib/renderer.ts で、初期状態の生態系バーを描画:
                     * src/lib ディレクトリを作成します。
mkdir -p src/lib

                     * src/lib/renderer.ts ファイルを作成し、SVG描画ロジックを記述します。
// src/lib/renderer.ts
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

ステップ 4: ゲームロジックとメインループの実装
                        1. src/lib/game.ts で、parameters.ts を読み込んで生態系のシミュレーションロジックを実装:
                        * src/lib/game.ts ファイルを作成し、ゲームロジックを記述します。
// src/lib/game.ts
import { GAME_PARAMETERS } from '../config/parameters';

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
   gameOverCallback: (score: number) => void
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
   const { plantGrowthRate, herbivoreConsumptionRate, carnivoreConsumptionRate, naturalDeathRate } = GAME_PARAMETERS;

   // 植物の変動
   const plantGrowth = state.plant * plantGrowthRate * dt;
   const plantConsumedByHerbivores = state.herbivore * herbivoreConsumptionRate * dt;
   state.plant += plantGrowth - plantConsumedByHerbivores;

   // 草食動物の変動
   const herbivoreGrowth = plantConsumedByHerbivores * 0.5; // 消費した植物の一部が草食動物の成長になる
   const herbivoreConsumedByCarnivores = state.carnivore * carnivoreConsumptionRate * dt;
   const herbivoreNaturalDeath = state.herbivore * naturalDeathRate * dt;
   state.herbivore += herbivoreGrowth - herbivoreConsumedByCarnivores - herbivoreNaturalDeath;

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
export function adjustCreatureAmount(type: 'plant' | 'herbivore' | 'carnivore', direction: 1 | -1, amount?: number): void {
   if (state.isGameOver) return;

   const adjustment = amount !== undefined ? amount : GAME_PARAMETERS.playerInterventionAmount;
   const finalAmount = adjustment * direction;

   switch (type) {
       case 'plant':
           state.plant += finalAmount;
           break;
       case 'herbivore':
           state.herbivore += finalAmount;
           break;
       case 'carnivore':
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

                           2. src/main.ts でメインループを開始し、シミュレーションと描画を連携:
                           * src/main.ts ファイルを編集し、アプリケーションのエントリーポイントとして機能させます。ボタンイベントリスナーを追加します。
// src/main.ts
import { initializeBars, updateBars, initializePyramid, updatePyramid, setHoverEffect, setDraggingEffect } from './lib/renderer'; // バー描画とピラミッド描画の両方をインポート
import { startGameLoop, stopGameLoop, adjustCreatureAmount, getCurrentState, initializeGame } from './lib/game';
import { saveScore, getRanking } from './lib/storage';
import { GAME_PARAMETERS } from './config/parameters';

const svgElement = document.getElementById('ecosystem-svg') as SVGSVGElement;
const timeDisplay = document.getElementById('time-display') as HTMLDivElement;
const restartButton = document.getElementById('restart-button') as HTMLButtonElement;
const rankingList = document.getElementById('ranking-list') as HTMLUListElement;
const gameOverModal = document.getElementById('game-over-modal') as HTMLDivElement;
const finalScoreDisplay = document.getElementById('final-score') as HTMLParagraphElement;
const modalRestartButton = document.getElementById('modal-restart-button') as HTMLButtonElement;

// 生物量調整ボタンの取得
const plantIncreaseButton = document.getElementById('plant-increase') as HTMLButtonElement;
const plantDecreaseButton = document.getElementById('plant-decrease') as HTMLButtonElement;
const herbivoreIncreaseButton = document.getElementById('herbivore-increase') as HTMLButtonElement;
const herbivoreDecreaseButton = document.getElementById('herbivore-decrease') as HTMLButtonElement;
const carnivoreIncreaseButton = document.getElementById('carnivore-increase') as HTMLButtonElement;
const carnivoreDecreaseButton = document.getElementById('carnivore-decrease') as HTMLButtonElement;

let isDragging = false;
let activeSegment: 'plant' | 'herbivore' | 'carnivore' | null = null;
let dragStartX = 0;

// UIモードを切り替えるフラグ (開発中はtrue/falseを切り替えてテスト)
// 最終的には、このフラグは不要になり、直接 initializePyramid を呼び出す
const USE_PYRAMID_UI = false; // 初期はバーUI、最終的にtrueにする

document.addEventListener('DOMContentLoaded', () => {
   if (svgElement) {
       const initialState = getCurrentState(); // game.tsで初期化された状態を取得

       if (USE_PYRAMID_UI) {
           initializePyramid(svgElement, initialState.plant, initialState.herbivore, initialState.carnivore);
           setupPyramidEventListeners(); // ピラミッドUI用のイベントリスナー
       } else {
           initializeBars(svgElement, initialState.plant, initialState.herbivore, initialState.carnivore);
           setupBarEventListeners(); // バーUI用のイベントリスナー
       }

       updateTimeDisplay(initialState.time);
       updateRankingDisplay(); // 初期ランキング表示

       // ゲームループ開始
       startGameLoop(onGameUpdate, onGameOver);
   } else {
       console.error('SVG要素が見つかりません。');
   }
});

/**
* ゲームの状態が更新されたときに呼び出されるコールバック。
* @param state 現在の生態系状態
*/
function onGameUpdate(state: { plant: number; herbivore: number; carnivore: number; time: number; isGameOver: boolean; }): void {
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
       rankingList.innerHTML = ranking.map((s, index) => `<li>${index + 1}. ${s}秒</li>`).join('');
   }
}

/**
* ゲームオーバーモーダルを表示します。
* @param score 最終スコア (秒)
*/
function showGameOverModal(score: number): void {
   if (gameOverModal && finalScoreDisplay) {
       finalScoreDisplay.textContent = `あなたの生存時間: ${score}秒`;
       gameOverModal.style.display = 'flex'; // flexで中央寄せ
   }
}

/**
* ゲームオーバーモーダルを非表示にします。
*/
function hideGameOverModal(): void {
   if (gameOverModal) {
       gameOverModal.style.display = 'none';
   }
}

/**
* ゲームをリスタートします。
*/
function restartGame(): void {
   initializeGame(); // ゲームの状態を初期化
   if (USE_PYRAMID_UI) {
       const initialState = getCurrentState();
       initializePyramid(svgElement, initialState.plant, initialState.herbivore, initialState.carnivore);
   } else {
       const initialState = getCurrentState();
       initializeBars(svgElement, initialState.plant, initialState.herbivore, initialState.carnivore);
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
       restartButton.addEventListener('click', () => {
           restartGame();
       });
   }
   if (modalRestartButton) {
       modalRestartButton.addEventListener('click', () => {
           hideGameOverModal();
           restartGame();
       });
   }

   // 各生物の増減ボタンにイベントリスナーを追加
   plantIncreaseButton.addEventListener('click', () => adjustCreatureAmount('plant', 1));
   plantDecreaseButton.addEventListener('click', () => adjustCreatureAmount('plant', -1));
   herbivoreIncreaseButton.addEventListener('click', () => adjustCreatureAmount('herbivore', 1));
   herbivoreDecreaseButton.addEventListener('click', () => adjustCreatureAmount('herbivore', -1));
   carnivoreIncreaseButton.addEventListener('click', () => adjustCreatureAmount('carnivore', 1));
   carnivoreDecreaseButton.addEventListener('click', () => adjustCreatureAmount('carnivore', -1));
}

/**
* ピラミッドUI用のイベントリスナーを設定します。
*/
function setupPyramidEventListeners(): void {
   // バーUI用のボタンイベントリスナーを削除 (もしあれば)
   plantIncreaseButton.removeEventListener('click', () => adjustCreatureAmount('plant', 1));
   plantDecreaseButton.removeEventListener('click', () => adjustCreatureAmount('plant', -1));
   herbivoreIncreaseButton.removeEventListener('click', () => adjustCreatureAmount('herbivore', 1));
   herbivoreDecreaseButton.removeEventListener('click', () => adjustCreatureAmount('herbivore', -1));
   carnivoreIncreaseButton.removeEventListener('click', () => adjustCreatureAmount('carnivore', 1));
   carnivoreDecreaseButton.removeEventListener('click', () => adjustCreatureAmount('carnivore', -1));

   if (restartButton) {
       restartButton.addEventListener('click', () => {
           restartGame();
       });
   }
   if (modalRestartButton) {
       modalRestartButton.addEventListener('click', () => {
           hideGameOverModal();
           restartGame();
       });
   }

   if (svgElement) {
       svgElement.addEventListener('mousemove', handlePyramidMouseMove);
       svgElement.addEventListener('mousedown', handlePyramidMouseDown);
       svgElement.addEventListener('mouseup', handlePyramidMouseUp);
       svgElement.addEventListener('mouseleave', handlePyramidMouseLeave);
   }
}

/**
* ピラミッドUIでのマウス移動時の処理（ホバー効果）
* @param event マウスイベント
*/
function handlePyramidMouseMove(event: MouseEvent): void {
   if (isDragging) return; // ドラッグ中はホバー効果を無効にする

   const target = event.target as SVGPolygonElement;
   const segmentType = target?.dataset.type as 'plant' | 'herbivore' | 'carnivore' | undefined;

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
   const segmentType = target?.dataset.type as 'plant' | 'herbivore' | 'carnivore' | undefined;

   if (segmentType) {
       isDragging = true;
       activeSegment = segmentType;
       dragStartX = event.clientX;
       setDraggingEffect(activeSegment, true); // ドラッグ効果を適用
       svgElement.addEventListener('mousemove', handlePyramidDrag); // ドラッグ中のmousemoveイベントを追加
   }
}

/**
* ピラミッドUIでのマウスが離されたときの処理（ドラッグ終了）
*/
function handlePyramidMouseUp(): void {
   if (isDragging) {
       isDragging = false;
       setDraggingEffect(null, false); // ドラッグ効果を解除
       svgElement.removeEventListener('mousemove', handlePyramidDrag); // ドラッグ中のmousemoveイベントを削除
       activeSegment = null;
   }
}

/**
* ピラミッドUIでのマウスがSVG要素から離れたときの処理
*/
function handlePyramidMouseLeave(): void {
   if (!isDragging) { // ドラッグ中でない場合のみホバー効果を解除
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

ステップ 5: プレイヤーのインタラクションとフィードバックの実装（初期UI: ボタン操作）
                              1. src/main.ts で、ボタンクリックイベントを処理し、game.ts の adjustCreatureAmount を呼び出す:
                              * src/main.ts にて、各生物の増減ボタンに対応するイベントリスナーを追加し、adjustCreatureAmount 関数を呼び出すように実装済みです。
                              2. src/styles/style.css で、ボタンのクリック時の視覚的フィードバックを実装:
                              * src/styles/style.css にて、.action-button:active や :hover などの擬似クラスを用いて、ボタンがクリックされたりホバーされたりした際のスタイル変化を実装済みです。
ステップ 6: ゲームオーバーとランキング機能の実装
                              1. src/lib/game.ts にゲームオーバー判定を実装:
                              * src/lib/game.ts 内の checkGameOver 関数で実装済みです。
                              2. src/lib/storage.ts にlocalStorageへのアクセス処理を実装し、ランキング機能を完成:
                              * src/lib/storage.ts ファイルを作成し、localStorage を利用したスコアの保存と取得ロジックを記述します。
// src/lib/storage.ts

const RANKING_KEY = 'ecosystemGameRanking';
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
           if (Array.isArray(ranking) && ranking.every(item => typeof item === 'number')) {
               return ranking;
           }
       } catch (e) {
           console.error('Failed to parse ranking from localStorage:', e);
       }
   }
   return []; // データがない、またはパースエラーの場合は空の配列を返す
}



ステップ 7: 仕上げとバランス調整
                                 1. 実際にプレイしながら、src/config/parameters.ts の値を調整し、ゲームバランスを最適化:
                                 * ゲームをローカルで実行 (npm run dev) し、実際にプレイしながら、src/config/parameters.ts の数値を変更して、ゲームの難易度や挙動を調整します。
                                 * 例:
                                 * 植物の成長率を上げるとゲームが簡単になります。
                                 * 捕食率を上げると、各生物の量が減少しやすくなります。
                                 * プレイヤーの介入量を調整して、操作の効き具合を調整します。
                                 2. 操作説明の追加など、プレイヤー体験を向上させます:
                                 * index.html にゲームの遊び方や操作方法を説明するテキストを追加します。
                                 * ゲーム開始前やゲームオーバー時に表示されるメッセージを改善します。
                                 * 効果音やBGMの追加も検討できます（このドキュメントでは範囲外ですが、将来的な拡張として）。
                                 3. UIのアップデート（正三角形と台形の図形を導入）とドラッグ操作の実装:
                                 * ゲームバランスが調整できたら、SVG描画を長方形（バー）から、正三角形と台形を組み合わせたピラミッド型UIに切り替えます。
                                 * src/config/parameters.ts の更新:
                                 * pyramidTotalHeight, pyramidBaseWidth, pyramidTopWidth, pyramidPaddingBottom, pyramidSegmentColors, dragSensitivity などのピラミッド描画とドラッグ操作に必要なパラメータを定義・調整します。
                                 * src/lib/renderer.ts の更新:
                                 * initializeBars と updateBars 関数は残しつつ、新たに initializePyramid と updatePyramid 関数を実装します。
                                 * calculatePyramidSegments 関数を実装し、各生物の量に基づいて polygon 要素の points 属性を計算します。
                                 * 描画ロジック詳細:
                                 1. GAME_PARAMETERS から svgWidth, svgHeight, pyramidTotalHeight, pyramidBaseWidth, pyramidTopWidth, pyramidPaddingBottom を取得します。
                                 2. SVGの中心X座標 centerX = svgWidth / 2 を計算します。
                                 3. ピラミッドが最大高さになる基準となる総量 maxTotalAmount (例: initialPlantAmount + initialHerbivoreAmount + initialCarnivoreAmount) を定義します。
                                 4. 現在の各生物の量 (plantAmount, herbivoreAmount, carnivoreAmount) に基づいて、各層の高さを計算します。各層の高さは、その生物の量と maxTotalAmount の比率を pyramidTotalHeight に乗じることで求めます。
                                 5. ピラミッドの底辺からの特定の高さ h_from_base におけるピラミッドの幅を計算するヘルパー関数 getWidthAtHeight(h_from_base) を定義します。この関数は、pyramidBaseWidth、pyramidTopWidth、pyramidTotalHeight を使って線形補間を行い、ピラミッドの側面の直線性を維持します。
                                 6. currentPyramidHeightFromBase = 0 から開始し、各層の高さ分だけ上に移動しながら、その層の下辺と上辺の幅を getWidthAtHeight 関数を使って計算します。
                                 7. 各層の polygon の points 属性を、計算した座標 (centerX と各辺の幅) で設定します。
                                 * 植物層と草食動物層は台形として4つの座標を、肉食動物層は三角形として3つの座標（頂点を含む）を設定します。
                                 * これにより、各層は下の層に隙間なく積み重なり、全体としてピラミッドの形状を維持し、各層の高さが生物量に比例して変化するようになります。
                                 8. setHoverEffect と setDraggingEffect 関数を、polygon 要素に適用できるように調整します。
                                 * src/main.ts の更新:
                                 * USE_PYRAMID_UI フラグを true に設定し、initializePyramid と updatePyramid 関数が呼び出されるようにします。
                                 * バーUI用のボタンイベントリスナー（plantIncreaseButton.addEventListener など）を削除またはコメントアウトします。
                                 * SVG要素に対して、以下のマウスイベントリスナーを再導入し、ドラッグ操作を実装します。
                                 * handlePyramidMouseMove: マウスカーソルが pyramid-segment の左右の辺に近づいたかを判定し、setHoverEffect を呼び出してホバー効果を提供します。
                                 * handlePyramidMouseDown: クリックされたSVG要素が pyramid-segment であれば、ドラッグ開始フラグ (isDragging) を true に設定し、activeSegment（操作対象の生物タイプ）と dragStartX（ドラッグ開始時のX座標）を記録します。setDraggingEffect を呼び出してドラッグ中の強調表示を行います。
                                 * handlePyramidMouseUp: ドラッグ終了時に isDragging を false にリセットし、setDraggingEffect を解除します。
                                 * handlePyramidMouseLeave: マウスがSVG領域外に出た際に、ドラッグ中でなければホバー効果を解除します。
                                 * handlePyramidDrag: ドラッグ中（isDragging が true の間）に発生する mousemove イベントで、deltaX = event.clientX - dragStartX を計算します。この deltaX と GAME_PARAMETERS.dragSensitivity を使って調整量を算出し、adjustCreatureAmount 関数を呼び出して activeSegment の生物量を増減させます。dragStartX を現在の event.clientX に更新することで、連続的なドラッグ操作を可能にします。
                                 * src/styles/style.css の更新:
                                 * .creature-bar 関連のスタイルを削除またはコメントアウトします。
                                 * .pyramid-segment クラスに、多角形要素に対する基本的なスタイル（fill、stroke、stroke-width、transition）を定義します。
                                 * .pyramid-segment.hovered と .pyramid-segment.dragging クラスに、ホバー時とドラッグ時の視覚的フィードバック（辺の太さ、色、アニメーションなど）を定義します。
