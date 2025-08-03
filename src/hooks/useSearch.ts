import { useState, useMemo, useDeferredValue } from 'react'
import type { Post } from '../types'

interface UseSearchReturn {
  query: string
  setQuery: (query: string) => void
  results: Post[]
  isSearching: boolean
}

export const useSearch = (posts: Post[]): UseSearchReturn => {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(() => {
    if (!deferredQuery.trim()) return posts

    const searchTerm = deferredQuery.toLowerCase()
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      post.category.toLowerCase().includes(searchTerm)
    )
  }, [posts, deferredQuery])

  return {
    query,
    setQuery,
    results,
    isSearching: query !== deferredQuery
  }
}
