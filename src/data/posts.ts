import type { Post } from '../types'

export const posts: Post[] = [
  {
    id: 1,
    title: "React 19の新機能と実践的な使い方",
    excerpt: "React 19で導入されたuseTransition、useDeferredValue、Suspenseの新機能について詳しく解説します。",
    content: `# React 19の新機能と実践的な使い方

React 19では、パフォーマンスとユーザーエクスペリエンスを大幅に向上させる新機能が導入されました。この記事では、特に重要な3つの機能について詳しく解説します。

## useTransition - 非同期UIの革命

\`useTransition\`は、重い処理を実行しながらもUIの応答性を保つための革新的なHookです。

\`\`\`typescript
import { useTransition, useState } from 'react'

function SearchComponent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    startTransition(() => {
      // 重い検索処理
      const searchResults = performHeavySearch(newQuery)
      setResults(searchResults)
    })
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        disabled={isPending}
      />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </div>
  )
}
\`\`\`

### 主なメリット
- **ユーザー入力の優先**: ユーザーのインタラクションを最優先
- **スムーズなUI**: 重い処理中でもUIが固まらない
- **適応的スケジューリング**: ブラウザのリソースを効率的に活用

## useDeferredValue - スマートな遅延処理

\`useDeferredValue\`は、値の更新を遅延させることで、パフォーマンスを最適化します。

\`\`\`typescript
import { useState, useDeferredValue, useMemo } from 'react'

function FilteredList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('')
  const deferredFilter = useDeferredValue(filter)

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(deferredFilter.toLowerCase())
    )
  }, [items, deferredFilter])

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="フィルター..."
      />
      <List items={filteredItems} />
      {filter !== deferredFilter && <LoadingIndicator />}
    </div>
  )
}
\`\`\`

### 使用場面
- **リアルタイム検索**: 入力中の快適性を保持
- **大量データの処理**: メモリ効率の改善
- **UI応答性**: スムーズなユーザー体験

## Suspense - 宣言的ローディング

React 19のSuspenseは、さらに柔軟で強力になりました。

\`\`\`typescript
import { Suspense, lazy } from 'react'

const LazyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <div>
      <Suspense fallback={<SkeletonLoader />}>
        <LazyComponent />
      </Suspense>
    </div>
  )
}

// エラーバウンダリとの組み合わせ
function RobustApp() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<LoadingSpinner />}>
        <AsyncDataComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
\`\`\`

## 実践的な組み合わせ

これらの機能を組み合わせることで、より洗練されたアプリケーションを構築できます：

\`\`\`typescript
function ModernBlogApp() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const deferredQuery = useDeferredValue(searchQuery)

  const searchResults = useMemo(() => {
    return performSearch(deferredQuery)
  }, [deferredQuery])

  return (
    <div>
      <SearchInput
        value={searchQuery}
        onChange={(query) => {
          setSearchQuery(query)
          startTransition(() => {
            // 重い処理をトランジションで包む
          })
        }}
      />

      <Suspense fallback={<ArticleSkeletons />}>
        <ArticleList
          articles={searchResults}
          isPending={isPending}
        />
      </Suspense>
    </div>
  )
}
\`\`\`

## まとめ

React 19の新機能により、これまで以上にパフォーマンスの高いWebアプリケーションを構築できるようになりました。これらの機能を適切に組み合わせることで、ユーザーにとって快適で応答性の高いインターフェースを提供できます。

次回は、これらの機能を活用した実際のプロジェクト例について詳しく解説します。`,
    date: "2025-01-15",
    category: "React",
    readTime: "10分",
    tags: ["React", "React19", "フロントエンド", "パフォーマンス"],
    author: "Tech Writer",
    slug: "react-19-complete-guide",
    publishedAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    views: 1250,
    likes: 89
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

- react-markdownのGitHubリポジトリ: [https://github.com/remarkjs/react-markdown](https://github.com/remarkjs/react-markdown)

本記事では、react-markdown のコンポーネントカスタマイズ機能の仕組みと、その裏側にある重要なWeb技術について解説します。

## react-markdownを利用したカスタムコンポーネントの仕組み

react-markdownの最も強力な機能の一つが、componentsプロパティを使ってMarkdownタグを任意のReactコンポーネントにマッピングできる点です。

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

このmdComponentsオブジェクトをReactMarkdownコンポーネントに渡すことで、Markdownのレンダリング結果をカスタマイズします。

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

* a (リンク):
すべてのリンクが新しいタブで開くようにtarget="_blank"を設定。同時に、後述するセキュリティリスク対策としてrel="noopener noreferrer"を付与しています。
* code (コードブロック):
inlineプロパティの有無で、バッククォート1つで囲む「インラインコード」と、3つで囲む「コードブロック」を判別しています。インラインコードには背景色などのスタイルを適用し、コードブロックはシンタックスハイライト用のclassNameをそのまま保持するようにしています。
* h2, h3 (見出し):
Tailwind CSSのクラスを使い、見出し階層に応じた余白（マージン）や文字の太さ・大きさを設定し、デザインに一貫性を持たせています。
* img (画像):
画像にrounded-lg（角丸）やshadow（影）といった装飾を加えています。また、alt属性が未定義の場合でもエラーにならないよう、?? ''で空文字列をフォールバックとして設定し、アクセシビリティに配慮しています。

このように、componentsプロパティを使いこなすことで、Markdownの記述しやすさを維持しつつ、デザイン、セキュリティ、アクセシビリティを高度に制御したWebページを構築できます。

### 【補足】知っておきたい関連技術

上記のコードで使われている重要な概念をいくつか深掘りします。

### 外部リンクのセキュリティ：「noopener」と「noreferrer」

rel="noopener noreferrer"は、外部リンクのセキュリティとプライバシーを強化するための重要な属性です。

* noopenerの役割
target="_blank"でリンクを開くと、新しく開かれたページはwindow.openerというプロパティを通じて、リンク元のページを操作できてしまいます。これは 「Reverse Tabnabbing」 と呼ばれるフィッシング攻撃に悪用される可能性があります。noopenerを指定すると、このwindow.openerがnullになり、新しいタブから元のページへのアクセスを完全に遮断します。
* noreferrerの役割
通常のリンク遷移では、遷移先のサイトに「どのページから来たか」という情報（リファラー）がHTTPヘッダーで送信されます。noreferrerは、このリファラー情報を送信しないようにする設定です。これにより、ユーザーの閲覧履歴に関するプライバシーを保護し、内部のURL構造が外部に漏れるのを防ぎます。

最新ブラウザの多くはtarget="_blank"に対して自動的にnoopenerの挙動を適用しますが、互換性や明示的なセキュリティ担保のため、外部リンクには常にrel="noopener noreferrer"をセットすることがベストプラクティスです。

### 【深掘り】window.openerとは何か？

window.openerは、window.open()やtarget="_blank"によって開かれた子ウィンドウから、親ウィンドウのWindowオブジェクトを参照するためのプロパティです。

これが有効な場合、悪意のある子ページは以下のような操作ができてしまいます。

\`\`\`TypeScript
// 悪意のあるサイト側で実行されるコード
if (window.opener) {
  // 親タブを偽のログインページに書き換える
  window.opener.location = 'https://fake-login-page.com';
}
\`\`\`
ユーザーが元のタブに戻ったとき、信頼していたはずのサイトが偽サイトにすり替わっている、という攻撃が成立してしまいます。rel="noopener"はこの参照を断ち切ることで、こうしたリスクを根本から防ぎます。

### 【深掘り】コンポーネントの柔軟性を支える{...props}

{...props}は、JavaScriptのスプレッド構文を使い、propsオブジェクトの全プロパティをコンポーネントに展開する記述です。

これを使う主な理由は柔軟性です。react-markdownは、標準のHTML属性以外にも、シンタックスハイライト用のdata-lang属性など、様々なプロパティを内部的に渡してきます。{...props}を使うことで、これらのプロパティを失うことなく、最終的なHTML要素にすべて引き継ぐことができます。

また、以下の分割代入と組み合わせることで、特定のプロパティだけを個別に取り出し、残りをまとめて渡すという洗練された記述が可能になります。

\`\`\`TypeScript
// inline, className, childrenは個別に取り出し、残りの全てはpropsオブジェクトに格納
({inline, className, children, ...props}) => { /* ... */ }
\`\`\`

### 【深掘り】複雑なTypeScriptの型定義を分解する

codeコンポーネントの引数に付けられた以下の型定義は、一見複雑に見えます。

\`\`\`TypeScript
ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps & { inline?: boolean }
\`\`\`

- ClassAttributes<HTMLElement>: Reactのkeyやrefといった特殊なプロパティを定義します。
- HTMLAttributes<HTMLElement>: id, style, onClickなど、標準的なHTML要素が持つ属性をすべて定義します。
- ExtraProps: react-markdownが独自に追加するnode（構文木の要素）などのプロパティを定義します。
- { inline?: boolean }: このコンポーネントで独自に利用するinlineプロパティを定義します。

これらを&で結合することで、Reactコンポーネントとして必要な機能、HTMLの標準機能、ライブラリ固有の機能、そして独自の機能を、すべて型安全な状態で扱えるようになっているのです。
                     `,
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
]

export const categories = ['All', 'React', 'TypeScript', 'Build Tools', 'JavaScript']
