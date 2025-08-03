import {type FC, useOptimistic, useTransition, useState, type JSX} from 'react'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  User,
  Eye,
  Heart,
  Share2,
  Twitter,
  Facebook,
  Link as LinkIcon,
  Bookmark
} from 'lucide-react'
import RelatedPosts from './RelatedPosts'
import TableOfContents from './TableOfContents'
import { posts } from '../data/posts'
import type { Post } from '../types'

interface ArticleDetailProps {
  post: Post
  darkMode: boolean
  onBack: () => void
  onPostClick?: (post: Post) => void
}

const ArticleDetail: FC<ArticleDetailProps> = ({
                                                 post,
                                                 darkMode,
                                                 onBack,
                                                 onPostClick
                                               }) => {
  const [likes, setOptimisticLikes] = useOptimistic(post.likes || 0)
  const [isLiked, setOptimisticLiked] = useOptimistic(false)
  const [isBookmarked, setOptimisticBookmarked] = useOptimistic(false)
  const [isPending, startTransition] = useTransition()
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleLike = () => {
    startTransition(() => {
      setOptimisticLikes(prev => isLiked ? prev - 1 : prev + 1)
      setOptimisticLiked(!isLiked)
    })
  }

  const handleBookmark = () => {
    startTransition(() => {
      setOptimisticBookmarked(!isBookmarked)
    })
  }

  const handleShare = (platform: 'twitter' | 'facebook' | 'copy') => {
    const url = `${window.location.origin}/posts/${post.slug}`
    const text = `${post.title} - Tech Blog`

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank'
        )
        break

      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        )
        break

      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('リンクをコピーしました！')
        }).catch(() => {
          // フォールバック: 古いブラウザ対応
          const textArea = document.createElement('textarea')
          textArea.value = url
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          alert('リンクをコピーしました！')
        })
        break
    }

    setShowShareMenu(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: JSX.Element[] = []
    let codeBlockContent = ''
    let isInCodeBlock = false
    let codeBlockLanguage = ''

    lines.forEach((line, index) => {
      // コードブロックの開始
      if (line.startsWith('```')) {
        if (!isInCodeBlock) {
          isInCodeBlock = true
          codeBlockLanguage = line.replace('```', '')
          codeBlockContent = ''
        } else {
          // コードブロックの終了
          isInCodeBlock = false
          elements.push(
            <div key={`code-${index}`} className={`mb-6 rounded-lg overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              {codeBlockLanguage && (
                <div className={`px-4 py-2 text-xs font-medium border-b ${
                  darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-200 text-gray-600 border-gray-300'
                }`}>
                  {codeBlockLanguage}
                </div>
              )}
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-mono whitespace-pre">
                  {codeBlockContent}
                </code>
              </pre>
            </div>
          )
          codeBlockContent = ''
          codeBlockLanguage = ''
        }
        return
      }

      // コードブロック内の場合
      if (isInCodeBlock) {
        codeBlockContent += line + '\n'
        return
      }

      // 見出しの処理
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} id={`heading-${index}`} className="text-3xl font-bold mb-6 mt-8 first:mt-0 scroll-mt-24">
            {line.replace('# ', '')}
          </h1>
        )
        return
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} id={`heading-${index}`} className="text-2xl font-semibold mb-4 mt-8 scroll-mt-24">
            {line.replace('## ', '')}
          </h2>
        )
        return
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} id={`heading-${index}`} className="text-xl font-semibold mb-3 mt-6 scroll-mt-24">
            {line.replace('### ', '')}
          </h3>
        )
        return
      }

      // リストの処理
      if (line.startsWith('- ')) {
        elements.push(
          <ul key={index} className="list-disc list-inside mb-4">
            <li className="mb-1">{line.replace('- ', '')}</li>
          </ul>
        )
        return
      }

      // 引用の処理
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className={`border-l-4 border-blue-500 pl-4 italic my-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {line.replace('> ', '')}
          </blockquote>
        )
        return
      }

      // インラインコードの処理
      const processInlineCode = (text: string) => {
        const parts = text.split(/(`[^`]+`)/)
        return parts.map((part, i) => {
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={i} className={`px-2 py-1 rounded text-sm font-mono ${
                darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
              }`}>
                {part.slice(1, -1)}
              </code>
            )
          }
          return part
        })
      }

      // 通常の段落
      if (line.trim()) {
        elements.push(
          <p key={index} className="mb-4 leading-relaxed">
            {processInlineCode(line)}
          </p>
        )
      } else {
        elements.push(<div key={index} className="mb-2" />)
      }
    })

    return elements
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 backdrop-blur-md border-b transition-colors ${
        darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft size={16} />
            記事一覧に戻る
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                }`}>
                  {post.category}
                </span>
                <div className={`flex items-center gap-4 text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{post.views?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={14} />
                    <span>{likes}</span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>

              <div className={`flex flex-wrap items-center gap-4 text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(post.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLike}
                disabled={isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isLiked
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                } ${isPending ? 'opacity-50' : 'hover:scale-105'}`}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{likes}</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isBookmarked
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                } hover:scale-105`}
              >
                <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  } hover:scale-105`}
                >
                  <Share2 size={16} />
                </button>

                {showShareMenu && (
                  <div className={`absolute top-full left-0 mt-2 p-2 rounded-lg shadow-lg border z-20 ${
                    darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Twitter size={16} />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Facebook size={16} />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LinkIcon size={16} />
                      リンクをコピー
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Article Content */}
            <article className={`prose prose-lg max-w-none ${darkMode ? 'prose-invert' : ''}`}>
              <div className="article-content">
                {renderContent(post.content)}
              </div>
            </article>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">タグ</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    } hover:scale-105 transition-transform cursor-pointer`}
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            {onPostClick && (
              <RelatedPosts
                currentPost={post}
                allPosts={posts}
                darkMode={darkMode}
                onPostClick={onPostClick}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <TableOfContents content={post.content} darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleDetail
