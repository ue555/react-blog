import { type FC, useMemo } from 'react'
import { Clock, ArrowRight } from 'lucide-react'
import type { Post } from '../types'

interface RelatedPostsProps {
  currentPost: Post
  allPosts: Post[]
  darkMode: boolean
  onPostClick: (post: Post) => void
}

const RelatedPosts: FC<RelatedPostsProps> = ({
                                               currentPost,
                                               allPosts,
                                               darkMode,
                                               onPostClick
                                             }) => {
  const relatedPosts = useMemo(() => {
    return allPosts
      .filter(post =>
          post.id !== currentPost.id && (
            post.category === currentPost.category ||
            post.tags.some(tag => currentPost.tags.includes(tag))
          )
      )
      .slice(0, 3)
  }, [currentPost, allPosts])

  if (relatedPosts.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-6">関連記事</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <article
            key={post.id}
            className={`group cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
            }`}
            onClick={() => onPostClick(post)}
          >
            <div className="p-4">
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
              }`}>
                {post.category}
              </span>

              <h4 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h4>

              <p className={`text-sm mb-3 line-clamp-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {post.excerpt}
              </p>

              <div className={`flex items-center justify-between text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{post.readTime}</span>
                </div>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
