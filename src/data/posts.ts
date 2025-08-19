import type {Post} from '../types'

export const posts: Post[] = [
  {
    id: 1,
    title: "React 19からの新機能を紹介します",
    excerpt: "React 19からの新機能を紹介します",
    content: `
## はじめに

React 19（2024年4月25日リリース）は、React開発に劇的な進化をもたらす新機能や安定化、最適化が多数導入されました。React 19の機能を紹介します。

## インストール方法

\`\`\`bash
npm install --save-exact react@^19.0.0 react-dom@^19.0.0

# TypeScriptを使用している場合
npm install --save-exact @types/react@^19.0.0 @types/react-dom@^19.0.0
\`\`\`

## 破壊的変更

### 1. レンダー中のエラーハンドリングの変更
React 19 では、重複を減らすためにエラーの扱いを改善し、再スローは行わないようになりました。

- **キャッチされないエラー**: \`window.reportError\`に報告
- **キャッチされたエラー**: \`console.error\`に報告
- エラーバウンダリの新しいオプション追加

\`\`\`javascript
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... エラーレポートをログ出力
  },
  onCaughtError: (error, errorInfo) => {
    // ... エラーレポートをログ出力
  }
});
\`\`\`

### 2. 非推奨化されたReact APIの削除

#### 関数コンポーネントの\`propTypes\`と\`defaultProps\`
PropTypes は 2017 年 4 月 (v15.5.0) に非推奨化されました。

\`\`\`javascript
// Before（削除前）
import PropTypes from 'prop-types';
function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Hello, world!',
};

// After（React 19対応）
interface Props {
  text?: string;
}
function Heading({text = 'Hello, world!'}: Props) {
  return <h1>{text}</h1>;
}
\`\`\`

#### レガシーコンテクストの削除
レガシーコンテクストは 2018 年 10 月 (v16.6.0) に非推奨化されました。

\`\`\`javascript
// Before（削除前）
import PropTypes from 'prop-types';
class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };
  getChildContext() {
    return { foo: 'bar' };
  }
  render() {
    return <Child />;
  }
}

// After（React 19対応）
const FooContext = React.createContext();
class Parent extends React.Component {
  render() {
    return (
      <FooContext.Provider value='bar'>
        <Child />
      </FooContext.Provider>
    );
  }
}
\`\`\`

#### 文字列形式のrefの削除
文字列形式の ref は 2018 年 3 月 (v16.3.0) に非推奨化されました。

\`\`\`javascript
// Before（削除前）
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }
  render() {
    return <input ref='input' />;
  }
}

// After（React 19対応）
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input ref={input => this.input = input} />;
  }
}
\`\`\`

#### その他の削除された機能
- **モジュールパターンファクトリ**: 通常の関数に移行
- **React.createFactory**: JSXに移行
- **react-test-renderer/shallow**: \`react-shallow-renderer\`パッケージを直接使用

### 3. 非推奨化されたReact DOM APIの削除

#### ReactDOM.renderの削除
\`\`\`javascript
// Before（削除前）
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// After（React 19対応）
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
\`\`\`

#### ReactDOM.hydrateの削除
\`\`\`javascript
// Before（削除前）
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// After（React 19対応）
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
\`\`\`

#### その他の削除
- **ReactDOM.findDOMNode**: DOM用のrefで置き換え
- **unmountComponentAtNode**: \`root.unmount()\`を使用
- **react-dom/test-utils**: \`act\`は\`react\`パッケージからインポート

## 新たな非推奨化

### 1. element.refの非推奨化
React 19 では props としての ref がサポートされるため、element.ref を非推奨化します。代わりに element.props.ref を使用します。

### 2. react-test-rendererの非推奨化
react-test-renderer を非推奨化します。これはユーザが使用する環境とは異なる独自のレンダラ環境を実装しており、内部実装の詳細に対するテストを助長し、React 内部の構造に依存するものだからです。

推奨される代替案：
- \`@testing-library/react\`
- \`@testing-library/react-native\`

## 注目すべき変更点

### 1. StrictModeの変更
開発中に Strict Mode で二重レンダーが発生した際、useMemo と useCallback は 1 回目のレンダー時にメモ化された結果を 2 回目のレンダーで再利用します。

### 2. Suspenseの改善
React 19 では、コンポーネントがサスペンドした際には兄弟ツリー全体のレンダーを待たずに、直近のサスペンスバウンダリのフォールバックを即座にコミットするようになります。

この変更により：
- サスペンスのフォールバックがより早く表示
- サスペンドされたツリー内の遅延リクエストも事前に準備

### 3. UMDビルドの削除
テストとリリースプロセスの複雑性を軽減するため、React 19 からは UMD ビルドを生成しなくなります。

script タグでReact 19を使用する場合：
\`\`\`html
<script type="module">
import React from "https://esm.sh/react@19/?dev"
import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
...
</script>
\`\`\`

## TypeScript関連の変更

### 1. refクリーンアップの必須化
\`\`\`javascript
// Before（修正前）
<div ref={current => (instance = current)} />

// After（修正後）
<div ref={current => {instance = current}} />
\`\`\`

### 2. useRefの引数の必須化
TypeScript と React の動作に関する長年の不満のひとつが useRef でした。今後 useRef には引数が必須になるよう型を変更することにしました。

\`\`\`javascript
// エラーになる
useRef(); // @ts-expect-error: Expected 1 argument but saw none

// 正しい使用法
useRef(undefined);
useRef(null);
\`\`\`

### 3. ReactElementの型変更
React 要素が ReactElement として型付けされている場合、その props のデフォルトの型は any ではなく unknown になります。

### 4. useReducerの型改善
新しいベストプラクティスは、useReducer に型引数を渡さないことです。

\`\`\`javascript
// Before（修正前）
useReducer<React.Reducer<State, Action>>(reducer)

// After（修正後）
useReducer(reducer)
\`\`\`

## Codemod（自動変換ツール）

アップグレードを支援するため、codemod.com のチームと協力し、React 19 の新しい API やパターンにコードを自動的に更新するための codemod を公開しました。

利用可能なcodemod：
- \`react-codemod\`コマンドを使用
- TypeScriptサポート
- 複雑なコード移行の自動処理

## 全変更点

### その他の破壊的変更
- **react-dom**: \`src\`と\`href\`でのJavaScript URLに対するエラー
- **react-dom**: \`onRecoverableError\`から\`errorInfo.digest\`を削除
- **react-dom**: 複数のunstable APIの削除
- **react-is**: 非推奨メソッドの削除

### その他の注目すべき変更
- 同期・デフォルト・連続レーンのバッチ処理
- レンダーフェーズでの無限更新ループの検出
- SSR中のレイアウトエフェクト警告の削除

## まとめ

React 19は多くの破壊的変更を含みますが、これらの変更は：
1. **パフォーマンスの向上**
2. **コードの簡素化**
3. **開発体験の改善**
4. **React の内部構造の整理**

を目的としています。ほとんどのアプリには影響が出ないことを予想していますが、段階的なアップグレードと十分なテストが推奨されます。

## 参考

- **React 19 アップグレードガイド**: [https://ja.react.dev/blog/2024/04/25/react-19-upgrade-guide](https://ja.react.dev/blog/2024/04/25/react-19-upgrade-guide)
- **Changelog**: [https://github.com/facebook/react/blob/main/CHANGELOG.md#1900-december-5-2024](https://github.com/facebook/react/blob/main/CHANGELOG.md#1900-december-5-2024)
`,
    date: "2025-08-01",
    category: "React",
    readTime: "0分",
    tags: ["React", "React19", "フロントエンド"],
    author: "Tech Writer",
    slug: "react-19-complete-guide",
    publishedAt: "2025-08-01T12:00:00Z",
    updatedAt: "2025-08-01T12:00:00Z",
    views: 0,
    likes: 0
  },
  {
    id: 2,
    title: "TypeScript 5.9の機能の紹介",
    excerpt: "TypeScript 5.9の機能の紹介",
    content: `
## はじめに

TypeScript 5.9の新機能を記載順に具体例を挙げて解説します。(TypeScript 5.9の新機能詳細解説)

## 1. 最小限で更新された \`tsc --init\`

### 変更点
従来の \`tsc --init\` は大量のコメントアウトされた設定で冗長でしたが、5.9では実用的で最小限の設定に変更されました。

### 生成される設定例
\`\`\`json
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",

    // Environment Settings
    "module": "nodenext",
    "target": "esnext",
    "types": [],

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
\`\`\`

### 実用的な改善点
- **モジュール検出**: \`moduleDetection: "force"\` で全ファイルをモジュールとして扱う
- **最新ES機能**: \`target: "esnext"\` で最新のECMAScript機能を使用可能
- **JSX対応**: \`jsx: "react-jsx"\` でJSXユーザーの設定摩擦を軽減
- **型制限**: \`types: []\` で不要な型定義ファイルの読み込みを制限

## 2. \`import defer\` のサポート

### 概要
ECMAScriptの遅延モジュール評価提案をサポート。モジュールを読み込むが、実際のアクセスまで実行を遅延できます。

### 基本的な使用例
\`\`\`typescript
// ./some-feature.ts
initializationWithSideEffects();

function initializationWithSideEffects() {
  specialConstant = 42;
  console.log("Side effects have occurred!");
}

export let specialConstant: number;
\`\`\`

\`\`\`typescript
// メインファイル
import defer * as feature from "./some-feature.js";

// この時点では副作用は発生していない
console.log("Module loaded but not executed");

// specialConstantにアクセスした時点で初めて実行される
console.log(feature.specialConstant); // 42
// "Side effects have occurred!" がここで出力される
\`\`\`

### 構文の制限
\`\`\`typescript
// ❌ 許可されない構文
import defer { doSomething } from "some-module";
import defer defaultExport from "some-module";

// ✅ サポートされる構文（名前空間インポートのみ）
import defer * as feature from "some-module";
\`\`\`

### 実用例
\`\`\`typescript
// 条件付きで重い処理を行うモジュール
import defer * as heavyComputation from "./heavy-computation.js";

function processData(useAdvanced: boolean) {
  if (useAdvanced) {
    // 必要な時だけ重い処理モジュールが実行される
    return heavyComputation.advancedProcess();
  }
  return simpleProcess();
}
\`\`\`

### 制約事項
- \`--module preserve\` または \`esnext\` でのみ動作
- TypeScriptによる変換は行われない（ランタイムサポートが必要）

## 3. \`--module node20\` のサポート

### 新しいオプション
Node.js v20の動作をモデル化した安定したモジュール設定オプションです。

### 設定例
\`\`\`json
{
  "compilerOptions": {
    "module": "node20",
    "moduleResolution": "node20"
    // --target es2023 が暗黙的に設定される
  }
}
\`\`\`

### \`nodenext\` との違い
\`\`\`typescript
// node20: 安定した設定（将来変更されにくい）
// target: es2023 を暗黙設定

// nodenext: 常に最新（floating target: esnext）
// 将来的な変更の可能性あり
\`\`\`

## 4. DOM APIのサマリー記述

### 改善点
DOM APIにMDNドキュメントベースの簡潔な説明が追加されました。

### 例（ホバー時の表示）
\`\`\`typescript
// 従来: 単なるリンクのみ
document.querySelector // MDNリンクのみ

// 5.9以降: 説明付き
document.querySelector // 指定されたセレクターにマッチする最初の要素を返します
\`\`\`

## 5. 展開可能なホバー（プレビュー）

### 機能概要
ホバーツールチップに \`+/-\` ボタンが追加され、型情報をより詳細に表示できます。

### 使用例
\`\`\`typescript
interface Options {
  color: string;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
  };
}

export function drawButton(options: Options): void {
  // optionsにホバーすると:
  // 初期状態: (parameter) options: Options
  // +ボタンクリック後: 詳細な型情報が展開表示
}
\`\`\`

### ビフォー・アフター
\`\`\`typescript
// 従来のホバー表示
(parameter) options: Options

// 展開後の表示（+ボタンクリック）
(parameter) options: {
  color: string;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
  };
}
\`\`\`

## 6. 設定可能なホバー最大長

### 設定方法
VS Codeの設定で調整可能：

\`\`\`json
{
  "js/ts.hover.maximumLength": 2000
}
\`\`\`

### 改善点
- デフォルトのホバー長が大幅に増加
- より多くの情報がホバーで表示される
- 重要な情報が切り取られることが減少

## 7. パフォーマンス最適化

### マッパーでのインスタンス化キャッシュ
\`\`\`typescript
// Zod、tRPCなどの複雑なライブラリでの改善例
type ComplexType<T> = {
  [K in keyof T]: T[K] extends string ? \`processed_\${T[K]}\` : T[K]
}

// 5.9以前: 同じ中間型を何度も再インスタンス化
// 5.9以降: 中間インスタンス化をキャッシュして効率化
\`\`\`

### ファイル存在チェックの最適化
\`\`\`typescript
// 最適化前のコード例（概念的）
files.forEach(file => {
  if (fileExists(file)) { // 毎回新しい関数オブジェクトを作成
    processFile(file);
  }
});

// 最適化後: 約11%の速度向上
\`\`\`

## 8. 重要な動作変更

### lib.d.ts の変更
\`\`\`typescript
// ArrayBufferの型階層変更により新しいエラー
let buffer: Buffer;
let arrayBuffer: ArrayBuffer;

// エラー例
// error TS2322: Type 'Buffer' is not assignable to type 'ArrayBuffer'.

// 解決策1: より具体的な型指定
let data: Uint8Array<ArrayBuffer> = new Uint8Array([0, 1, 2, 3, 4]);

// 解決策2: .bufferプロパティの使用
let data = new Uint8Array([0, 1, 2, 3, 4]);
someFunc(data.buffer); // data.bufferを使用
\`\`\`

### 型引数推論の変更
\`\`\`typescript
// 型変数のリーク修正により新しいエラーが発生する可能性
function genericFunction<T>(value: T): T {
  return value;
}

// 5.9では明示的な型引数が必要になる場合
genericFunction<string>("hello"); // 明示的に型を指定
\`\`\`

### 移行対応
\`\`\`bash
# @types/nodeの更新
npm update @types/node --save-dev

# 型エラーの修正
# 1. より具体的な型指定
# 2. .bufferプロパティの使用
# 3. 明示的な型引数の追加
\`\`\`

## まとめ

TypeScript 5.9は開発者体験の向上に重点を置いた改善が多く含まれています：

- **開発効率**: 展開可能なホバー、改良されたtsconfig.json
- **パフォーマンス**: キャッシュ最適化、ファイル操作の高速化
- **新機能**: import defer、node20モジュール
- **開発者体験**: DOM API説明、設定可能なホバー長

これらの機能により、より快適で効率的なTypeScript開発が可能になります。

## 参考

- **TypeScript 5.9**: [https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html#expandable-hovers-preview](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html#expandable-hovers-preview)
`,
    date: "2025-08-10",
    category: "TypeScript",
    readTime: "0分",
    tags: ["TypeScript", "型安全性", "JavaScript"],
    author: "Tech Writer",
    slug: "typescript-5-9-type-system",
    publishedAt: "2025-08-10T12:00:00Z",
    views: 0,
    likes: 0
  },
  {
    id: 3,
    title: "Viteの仕組みと利用方法について説明します",
    excerpt: "Viteの仕組みと利用方法について説明します",
    content: `
## はじめに

**Vite**は、フロントエンド開発向けの超高速ビルドツール兼開発サーバーです。Vue.js開発者のEvan You氏によって開発され、2020年4月に初リリースされました。

- Node.js上で動作します。Node.js 18+または20+が推奨されています。
- Vite自体はNode.js上で動作するビルドツール（Node.jsはランタイム環境で、Viteはその上で動作するアプリケーション）

## Viteの特徴

### 1. 開発時の革新的なアプローチ

Viteの最大の特徴は、**「開発時はバンドルしない」** ことです。従来のWebpackやRollupなどのツールは開発時にも全ファイルをバンドルしますが、Viteは**ES Modules**（ESM）を活用し、必要なファイルのみを都度変換・配信します。

具体的には：
- ブラウザがモジュールを要求した時点で、そのモジュールのみをトランスパイル
- 依存関係も必要に応じて動的に解決
- これにより初回起動が劇的に高速化
- 大規模プロジェクトでも高速な起動と更新が可能

### 2. Hot Module Replacement (HMR)

開発サーバーでは、ブラウザがアクセスする度に対象モジュールのみコンパイルして返すため、ビルドの待ち時間が大幅に減少します。また、**HMR（Hot Module Replacement）**に対応しており：

- ファイル変更時に変更部分だけを即座に差し替え、ブラウザ表示に反映
- Vue SFCの場合、テンプレート・スクリプト・スタイルを個別に更新可能
- React Fast Refreshにも対応
- 状態を保持したまま更新されるため、開発効率が大幅向上

### 3. プロダクションビルド

プロダクションビルド時は、Rollupを利用し全体を最適化・バンドルします。以下の最適化も自動で行われます：

- コード分割（Code Splitting）
- Tree Shaking（不要コードの除去）
- アセット最適化

## 対応フレームワーク

現在のViteは以下をサポート：
- Vanilla JavaScript/TypeScript
- Vue 3
- React
- Svelte
- Lit
- Preact
など、幅広いフレームワークに対応

## Viteの利用方法

### 1. Node.jsをインストール

公式推奨はNode.jsの18以上。バージョン確認は以下のコマンドで可能：

\`\`\`bash
node -v
\`\`\`

### 2. 新規プロジェクト作成

ターミナルで以下を実行します（好きなディレクトリでOK）：

\`\`\`bash
npm create vite@latest
\`\`\`

指示に従ってプロジェクト名や使いたいフレームワーク（例: Vanilla, Vue, React, Svelteなど）、TypeScript/JavaScriptの選択を行います。

### 3. 依存パッケージのインストール

\`\`\`bash
cd 作成したプロジェクト名
npm install
\`\`\`

で必要なモジュールがインストールされます。

### 4. 開発サーバー起動

\`\`\`bash
npm run dev
\`\`\`

ローカル開発サーバーが立ち上がるので、案内されたURLをブラウザで開けば成果物が表示されます。

### 5. 本番用ビルド

\`\`\`bash
npm run build
\`\`\`

でプロダクション向けに最適化された静的ファイルを\`dist\`フォルダなどに出力します。

## 生成される主なディレクトリ構成例

\`\`\`
├── node_modules
├── public
│   └── vite.svg
├── .gitignore
├── counter.js
├── index.html
├── javascript.svg
├── main.js
├── package-lock.json
├── package.json
├── style.css
└── vite.config.js  # 設定ファイル（詳細設定が可能）
\`\`\`

## まとめ

### 特徴
- 超高速な開発体験
- Hot Module Replacement
- 必要最小限のバンドル
- 効率的な本番ビルド

### 利用手順
1. Node.jsインストール
2. プロジェクト作成
3. パッケージインストール
4. 開発/ビルドコマンド実行

### 仕組み
- ESMを活用し、開発時は都度コンパイル
- ビルド時にはRollupで最適化

Viteは、現代のフロントエンド開発において必須クラスのツールとなっています。Vue/React/Svelte/Vanillaなど幅広く対応しており、爆速開発を実現したい方には特におすすめです。

`,
    date: "2025-08-15",
    category: "Build Tools",
    readTime: "0分",
    tags: ["Vite", "ビルドツール", "パフォーマンス"],
    author: "Tech Writer",
    slug: "frontend-development",
    publishedAt: "2025-08-15T12:00:00Z",
    views: 0,
    likes: 0
  },
  {
    id: 4,
    title: "react-markdownでMarkdownブログをリッチにカスタマイズする方法",
    excerpt: "react-markdownでMarkdownブログをリッチにカスタマイズする方法",
    content: `
## はじめに

Markdownはドキュメントやブログ記事を手軽に記述できる便利な形式ですが、そのまま表示するとデザインが質素になりがちです。React環境でMarkdownを扱うなら、react-markdown ライブラリが非常に強力です。

このライブラリを使えば、Markdownの各要素（見出し、リンク、コードブロックなど）を自由なデザインのReactコンポーネントに置き換え、リッチで統一感のあるブログを作成できます。

- **react-markdownのGitHubリポジトリ**: [https://github.com/remarkjs/react-markdown](https://github.com/remarkjs/react-markdown)

本記事では、**react-markdown** のコンポーネントカスタマイズ機能の仕組みと、その裏側にある重要なWeb技術について解説します。
---------

## react-markdownを利用したカスタムコンポーネントの仕組み

**react-markdown** の最も強力な機能の一つが、**components** プロパティを使ってMarkdownタグを任意のReactコンポーネントにマッピングできる点です。

以下は、ブログ記事でよく使う要素をカスタマイズする設定例です。

\`\`\`TypeScript
import type { Components } from 'react-markdown';
import type { ClassAttributes, HTMLAttributes } from 'react';
import type { ExtraProps } from 'react-markdown';

// カスタムコンポーネントの設定オブジェクト
const mdComponents: Partial<Components> = {
  // リンク(a)は新しいタブで開き、セキュリティ対策を施す
  a: (props) => <a {...props} target="_blank" rel="noopener noreferrer"/>,

  // コード(code)はインラインとブロックでスタイルを分ける
  code: ({inline, className, children, ...props}: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps & { inline?: boolean }) =>
    inline ? (
      <code className="px-1 py-0.5 rounded bg-gray-100" {...props}>
        {children}
      </code>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    ),

  // 見出し(h2, h3)にマージンとフォントスタイルを適用
  h2: (props) => <h2 className="mt-10 mb-4 text-2xl font-bold" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-xl font-semibold" {...props} />,

  // 画像(img)に角丸と影を付け、アクセシビリティを考慮
  img: (props) => <img className="rounded-lg shadow" alt={props.alt ?? ''} {...props} />,
};
\`\`\`

この **mdComponents** オブジェクトを **ReactMarkdown** コンポーネントに渡すことで、Markdownのレンダリング結果をカスタマイズします。

\`\`\`TypeScript
import ReactMarkdown from 'react-markdown';

// ... mdComponentsの定義

function MyBlogComponent({ markdownContent }) {
  return (
    <ReactMarkdown components={mdComponents}>
      {markdownContent}
    </ReactMarkdown>
  );
}
\`\`\`

### 各コンポーネントの解説

* **a (リンク)**:
すべてのリンクが新しいタブで開くように **target="_blank"** を設定。同時に、後述するセキュリティリスク対策として **rel="noopener noreferrer"** を付与しています。
- **code (コードブロック)**:
**inline** プロパティの有無で、バッククォート1つで囲む「インラインコード」と、3つで囲む「コードブロック」を判別しています。インラインコードには背景色などのスタイルを適用し、コードブロックはシンタックスハイライト用の **className** をそのまま保持するようにしています。
- **h2, h3 (見出し)**:
Tailwind CSSのクラスを使い、見出し階層に応じた余白（マージン）や文字の太さ・大きさを設定し、デザインに一貫性を持たせています。
- **img (画像)**:
画像に **rounded-lg（角丸）** や **shadow（影）** といった装飾を加えています。また、alt属性が未定義の場合でもエラーにならないよう、**?? ''** で空文字列をフォールバックとして設定し、アクセシビリティに配慮しています。

このように、**components** プロパティを使いこなすことで、Markdownの記述しやすさを維持しつつ、デザイン、セキュリティ、アクセシビリティを高度に制御したWebページを構築できます。
---------

### 【補足】知っておきたい関連技術

上記のコードで使われている重要な概念をいくつか深掘りします。

### 外部リンクのセキュリティ：「noopener」と「noreferrer」

**rel="noopener noreferrer"** は、外部リンクのセキュリティとプライバシーを強化するための重要な属性です。

- **noopenerの役割**
**target="_blank"** でリンクを開くと、新しく開かれたページは **window.opener** というプロパティを通じて、リンク元のページを操作できてしまいます。これは **「Reverse Tabnabbing」** と呼ばれるフィッシング攻撃に悪用される可能性があります。 **noopener** を指定すると、この **window.opener** が **null** になり、新しいタブから元のページへのアクセスを完全に遮断します。
- **noreferrerの役割**
通常のリンク遷移では、遷移先のサイトに「どのページから来たか」という情報（リファラー）がHTTPヘッダーで送信されます。 **noreferrer** は、このリファラー情報を送信しないようにする設定です。これにより、ユーザーの閲覧履歴に関するプライバシーを保護し、内部のURL構造が外部に漏れるのを防ぎます。

最新ブラウザの多くは **target="_blank"** に対して自動的に **noopener** の挙動を適用しますが、互換性や明示的なセキュリティ担保のため、外部リンクには常に **rel="noopener noreferrer"** をセットすることがベストプラクティスです。

### 【深掘り】window.openerとは何か？

**window.opener** は、 **window.open()** や **target="_blank"** によって開かれた子ウィンドウから、 **親ウィンドウのWindowオブジェクト** を参照するためのプロパティです。

これが有効な場合、悪意のある子ページは以下のような操作ができてしまいます。

\`\`\`TypeScript
// 悪意のあるサイト側で実行されるコード
if (window.opener) {
  // 親タブを偽のログインページに書き換える
  window.opener.location = 'https://fake-login-page.com';
}
\`\`\`
ユーザーが元のタブに戻ったとき、信頼していたはずのサイトが偽サイトにすり替わっている、という攻撃が成立してしまいます。 **rel="noopener"** はこの参照を断ち切ることで、こうしたリスクを根本から防ぎます。

### 【深掘り】コンポーネントの柔軟性を支える{...props}

**{...props}** は、JavaScriptのスプレッド構文を使い、**propsオブジェクト** の全プロパティをコンポーネントに展開する記述です。

これを使う主な理由は **柔軟性** です。 **react-markdown** は、標準のHTML属性以外にも、シンタックスハイライト用の **data-lang属性** など、様々なプロパティを内部的に渡してきます。 **{...props}** を使うことで、これらのプロパティを失うことなく、最終的なHTML要素にすべて引き継ぐことができます。

また、以下の分割代入と組み合わせることで、特定のプロパティだけを個別に取り出し、残りをまとめて渡すという洗練された記述が可能になります。

\`\`\`TypeScript
// inline, className, childrenは個別に取り出し、残りの全てはpropsオブジェクトに格納
({inline, className, children, ...props}) => { /* ... */ }
\`\`\`

### 【深掘り】複雑なTypeScriptの型定義を分解する

**codeコンポーネント** の引数に付けられた以下の型定義は、一見複雑に見えます。

\`\`\`TypeScript
ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps & { inline?: boolean }
\`\`\`

- **ClassAttributes<HTMLElement>**: Reactの **key** や **ref** といった特殊なプロパティを定義します。
- **HTMLAttributes<HTMLElement>**: **id**, **style**, **onClick** など、標準的なHTML要素が持つ属性をすべて定義します。
- **ExtraProps**: **react-markdown** が独自に追加する **node（構文木の要素）** などのプロパティを定義します。
- **{ inline?: boolean }**: このコンポーネントで独自に利用する **inline** プロパティを定義します。

これらを **&** で結合することで、Reactコンポーネントとして必要な機能、HTMLの標準機能、ライブラリ固有の機能、そして独自の機能を、すべて型安全な状態で扱えるようになっているのです。
                     `,
    date: "2025-08-18",
    category: "React",
    readTime: "0分",
    tags: ["React", "Tailwind CSS"],
    author: "Tech Writer",
    slug: "frontend-development",
    publishedAt: "2025-08-18T12:00:00Z",
    views: 0,
    likes: 0
  },
]

export const categories = ['All', 'React', 'TypeScript', 'Build Tools', 'JavaScript']
