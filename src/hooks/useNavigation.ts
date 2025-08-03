import { useState, useCallback } from 'react'
import type { Post } from '../types'

interface NavigationState {
  currentView: 'list' | 'detail'
  selectedPost: Post | null
}

export const useNavigation = () => {
  const [state, setState] = useState<NavigationState>({
    currentView: 'list',
    selectedPost: null
  })

  const showPostDetail = useCallback((post: Post) => {
    setState({
      currentView: 'detail',
      selectedPost: post
    })
  }, [])

  const showPostList = useCallback(() => {
    setState({
      currentView: 'list',
      selectedPost: null
    })
  }, [])

  return {
    currentView: state.currentView,
    selectedPost: state.selectedPost,
    showPostDetail,
    showPostList
  }
}
