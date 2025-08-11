import {type FC, useState, useMemo, Suspense, useTransition, useEffect} from 'react'
import {ArrowRight} from 'lucide-react'
import Header from './components/Header'
import SearchBox from './components/SearchBox'
import CategoryFilter from './components/CategoryFilter'
import PostCard from './components/PostCard'
import ArticleDetail from './components/ArticleDetail'
import LoadingSpinner from './components/LoadingSpinner'
import {useDarkMode} from './hooks/useDarkMode'
import {useSearch} from './hooks/useSearch'
import {useNavigation} from './hooks/useNavigation'
import {posts, categories} from './data/posts'
import type {Post} from './types'

const App: FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isPending, startTransition] = useTransition()

  const {query, setQuery, results, isSearching} = useSearch(posts)
  const {currentView, selectedPost, showPostDetail, showPostList} = useNavigation()

  const filteredPosts = useMemo(() => {
    const postsToFilter = query ? results : posts
    return selectedCategory === 'All'
      ? postsToFilter
      : postsToFilter.filter(post => post.category === selectedCategory)
  }, [selectedCategory, query, results])

  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      setSelectedCategory(category)
    })
  }

  useEffect(() => {
    const loadFromHash = () => {
      const hash = window.location.hash;

      if (hash.startsWith('#/post/')) {
        const postId = hash.replace('#/post/', '');
        const post = posts.find(p => p.id === Number(postId));
        if (post) {
          showPostDetail(post);
        }
      } else {
        showPostList();
      }
    };

    loadFromHash();

    window.addEventListener('hashchange', loadFromHash);
    return () => window.removeEventListener('hashchange', loadFromHash);
  }, []);

  const handlePostClick = (post: Post) => {
    startTransition(() => {
      showPostDetail(post)
      window.location.hash = `/post/${post.id}`;
    })
  }

  const handleBackToList = () => {
    startTransition(() => {
      showPostList()
      window.location.hash = '';
    })
  }

  if (currentView === 'detail' && selectedPost) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <ArticleDetail
          post={selectedPost}
          darkMode={darkMode}
          onBack={handleBackToList}
        />
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            技術を深く、シンプルに
          </h1>
          <p className={`text-xl mb-8 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            React 19とTypeScriptで構築された<br/>
            最新の技術情報をお届けするブログ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105">
              <span>最新記事を読む</span>
              <ArrowRight size={20}/>
            </button>
          </div>
        </div>
      </section>

      {/* Search */}
      <SearchBox
        onSearch={setQuery}
        darkMode={darkMode}
        isSearching={isSearching}
      />

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        darkMode={darkMode}
      />

      {/* Search Results Info */}
      {query && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            「{query}」の検索結果: {filteredPosts.length}件
          </p>
        </div>
      )}

      {/* Posts Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Suspense fallback={<LoadingSpinner/>}>
          {isPending ? (
            <LoadingSpinner/>
          ) : filteredPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <PostCard
                    post={post}
                    darkMode={darkMode}
                    onPostClick={handlePostClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {query ? '検索条件に一致する記事が見つかりませんでした。' : '記事がありません。'}
              </p>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  )
}

export default App
