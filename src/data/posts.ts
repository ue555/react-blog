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
  }
]

export const categories = ['All', 'React', 'TypeScript', 'Build Tools', 'JavaScript']
