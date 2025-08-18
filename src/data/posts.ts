import type { Post } from '../types'

export const posts: Post[] = [
  {
    id: 1,
    title: "React 19からの新機能を紹介します",
    excerpt: "React 19からの新機能を紹介します",
    content: `# React 19の新機能を紹介します

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
    title: "TypeScript 5.5の型システム進化",
    excerpt: "TypeScript 5.5で追加された新しい型機能と、実践的な活用例を紹介します。",
    content: `# TypeScript 5.5の型システム進化

TypeScript 5.5では、型システムがさらに強力になり、開発者の生産性向上に大きく貢献する新機能が追加されました。

## 新しい型機能

### Const Type Parameters
\`\`\`typescript
function createArray<const T>(items: readonly T[]): T[] {
  return [...items]
}

const numbers = createArray([1, 2, 3] as const) // type: readonly [1, 2, 3]
\`\`\`

### Improved Template Literal Types
より柔軟なテンプレートリテラル型が利用可能になりました。

## 実践的な活用例

実際のプロジェクトでこれらの新機能をどのように活用するか、具体例とともに解説します...`,
    date: "2025-01-18",
    category: "TypeScript",
    readTime: "8分",
    tags: ["TypeScript", "型安全性", "JavaScript"],
    author: "Tech Writer",
    slug: "typescript-5-5-type-system",
    publishedAt: "2025-01-18T10:00:00Z",
    views: 892,
    likes: 67
  },
  {
    id: 3,
    title: "Vite 6.0で変わるフロントエンド開発",
    excerpt: "Vite 6.0の新機能とパフォーマンス改善について、実際のプロジェクトでの活用例とともに解説。",
    content: `# Vite 6.0で変わるフロントエンド開発

Vite 6.0では、開発体験とビルドパフォーマンスが大幅に向上しました。

## 主な新機能

### 改善されたHMR
ホットモジュールリプレースメントがさらに高速化され、大規模プロジェクトでも瞬時に反映されます。

### 新しいプラグインAPI
より柔軟で強力なプラグインシステムが導入されました。

## パフォーマンス改善

実際のベンチマーク結果とともに、Vite 6.0のパフォーマンス向上について詳しく解説します...`,
    date: "2025-01-15",
    category: "Build Tools",
    readTime: "12分",
    tags: ["Vite", "ビルドツール", "パフォーマンス"],
    author: "Tech Writer",
    slug: "vite-6-frontend-development",
    publishedAt: "2025-01-15T14:00:00Z",
    views: 734,
    likes: 45
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
