import {type FC, useOptimistic, useTransition, useState, type JSX} from 'react'
import React from 'react'
import {
  ArrowLeft,
  Calendar,
  Tag,
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
    let listItems: string[] = []
    let isInOrderedList = false
    let orderedListItems: string[] = []
    let tableLines: string[] = []
    let isInTable = false

    const processTable = (tableLines: string[]) => {
      if (tableLines.length < 2) return null

      const headerLine = tableLines[0]
      const separatorLine = tableLines[1]
      const bodyLines = tableLines.slice(2)

      // ヘッダーの解析
      const headers = headerLine.split('|').map(cell => cell.trim()).filter(cell => cell !== '')

      // セパレーターの解析（テキスト配置の判定）
      const alignments = separatorLine.split('|').map(cell => {
        const trimmed = cell.trim()
        if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center'
        if (trimmed.endsWith(':')) return 'right'
        return 'left'
      }).filter((_, index) => index < headers.length)

      // ボディの解析
      const rows = bodyLines.map(line =>
        line.split('|').map(cell => cell.trim()).filter(cell => cell !== '').slice(0, headers.length)
      ).filter(row => row.length > 0)

      return (
        <div className="overflow-x-auto mb-6">
          <table className={`min-w-full border-collapse border ${
            darkMode ? 'border-gray-600' : 'border-gray-300'
          }`}>
            <thead>
            <tr className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 border font-semibold text-sm ${
                    darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'
                  } ${
                    alignments[index] === 'center' ? 'text-center' :
                      alignments[index] === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {processInlineMarkdown(header)}
                </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0
                    ? (darkMode ? 'bg-gray-900' : 'bg-white')
                    : (darkMode ? 'bg-gray-850' : 'bg-gray-50')
                } hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-2 border text-sm ${
                      darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
                    } ${
                      alignments[cellIndex] === 'center' ? 'text-center' :
                        alignments[cellIndex] === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {processInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )
    }

    const flushTable = () => {
      if (tableLines.length > 0) {
        const tableElement = processTable(tableLines)
        if (tableElement) {
          elements.push(React.cloneElement(tableElement, { key: `table-${elements.length}` }))
        }
        tableLines = []
        isInTable = false
      }
    }

    const processInlineMarkdown = (text: string) => {

      // インラインコードの処理（最初に処理して他の記法と干渉しないようにする）
      const codeRegex = /`([^`]+)`/g
      const codeMatches: { match: string; replacement: JSX.Element; index: number }[] = []
      let match
      while ((match = codeRegex.exec(text)) !== null) {
        const codeElement = (
          <code
            key={`code-${match.index}`}
            className={`px-2 py-1 rounded text-sm font-mono ${
              darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {match[1]}
          </code>
        )
        codeMatches.push({
          match: match[0],
          replacement: codeElement,
          index: match.index
        })
      }

      // コード以外の部分を処理
      const parts = text.split(/`[^`]+`/)
      const processedParts = parts.map((part) => {
        let processedPart = part

        // 太字の処理 **text** と __text__
        processedPart = processedPart.replace(/\*\*(.*?)\*\*/g, (_, content) => `<strong>${content}</strong>`)
        processedPart = processedPart.replace(/__(.*?)__/g, (_, content) => `<strong>${content}</strong>`)

        // 斜体の処理 *text* と _text_
        processedPart = processedPart.replace(/\*(.*?)\*/g, (_, content) => `<em>${content}</em>`)
        processedPart = processedPart.replace(/_(.*?)_/g, (_, content) => `<em>${content}</em>`)

        // 取り消し線の処理 ~~text~~
        processedPart = processedPart.replace(/~~(.*?)~~/g, (_, content) => `<del>${content}</del>`)

        // リンクの処理 [text](url)
        processedPart = processedPart.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 underline">${text}</a>`
        )

        return processedPart
      })

      // HTMLを含む文字列とインラインコードを組み合わせて最終的なJSX要素を作成
      const finalElements: (string | JSX.Element)[] = []
      let codeIndex = 0

      processedParts.forEach((part, index) => {
        if (part.includes('<')) {
          // HTMLタグが含まれている場合はdangerouslySetInnerHTMLを使用
          finalElements.push(
            <span
              key={`html-${index}`}
              dangerouslySetInnerHTML={{ __html: part }}
            />
          )
        } else {
          finalElements.push(part)
        }

        // インラインコードを挿入
        if (codeIndex < codeMatches.length) {
          finalElements.push(codeMatches[codeIndex].replacement)
          codeIndex++
        }
      })

      return finalElements
    }

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside mb-4 space-y-1">
            {listItems.map((item, index) => (
              <li key={index} className="mb-1">
                {processInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        )
        listItems = []
      }
    }

    const flushOrderedList = () => {
      if (orderedListItems.length > 0) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-inside mb-4 space-y-1">
            {orderedListItems.map((item, index) => (
              <li key={index} className="mb-1">
                {processInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        )
        orderedListItems = []
        isInOrderedList = false
      }
    }

    lines.forEach((line, index) => {
      // コードブロックの開始
      if (line.startsWith('```')) {
        flushList()
        flushOrderedList()
        flushTable()

        if (!isInCodeBlock) {
          isInCodeBlock = true
          codeBlockLanguage = line.replace('```', '').trim()
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

      // 水平線の処理
      const trimmedLine = line.trim()
      if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___' ||
        /^-{3,}$/.test(trimmedLine) || /^\*{3,}$/.test(trimmedLine) || /^_{3,}$/.test(trimmedLine)) {
        flushList()
        flushOrderedList()
        flushTable()
        elements.push(
          <hr key={index} className={`my-8 border-t ${
            darkMode ? 'border-gray-600' : 'border-gray-300'
          }`} />
        )
        return
      }

      // テーブルの処理
      if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
        flushList()
        flushOrderedList()

        if (!isInTable) {
          isInTable = true
          tableLines = []
        }
        tableLines.push(line)
        return
      } else if (isInTable && line.trim() === '') {
        // 空行でテーブル終了
        flushTable()
        return
      } else if (isInTable) {
        // テーブル以外の行が来たらフラッシュ
        flushTable()
      }

      // 見出しの処理
      if (line.startsWith('# ')) {
        flushList()
        flushOrderedList()
        flushTable()
        elements.push(
          <h1 key={index} id={`heading-${index}`} className="text-3xl font-bold mb-6 mt-8 first:mt-0 scroll-mt-24">
            {processInlineMarkdown(line.replace('# ', ''))}
          </h1>
        )
        return
      }

      if (line.startsWith('## ')) {
        flushList()
        flushOrderedList()
        flushTable()
        elements.push(
          <h2 key={index} id={`heading-${index}`} className="text-2xl font-semibold mb-4 mt-8 scroll-mt-24">
            {processInlineMarkdown(line.replace('## ', ''))}
          </h2>
        )
        return
      }

      if (line.startsWith('### ')) {
        flushList()
        flushOrderedList()
        flushTable()
        elements.push(
          <h3 key={index} id={`heading-${index}`} className="text-xl font-semibold mb-3 mt-6 scroll-mt-24">
            {processInlineMarkdown(line.replace('### ', ''))}
          </h3>
        )
        return
      }

      if (line.startsWith('#### ')) {
        flushList()
        flushOrderedList()
        flushTable()
        elements.push(
          <h4 key={index} id={`heading-${index}`} className="text-lg font-semibold mb-2 mt-5 scroll-mt-24">
            {processInlineMarkdown(line.replace('#### ', ''))}
          </h4>
        )
        return
      }

      if (line.startsWith('##### ')) {
        flushList()
        flushOrderedList()
        flushTable()
        elements.push(
          <h5 key={index} id={`heading-${index}`} className="text-base font-semibold mb-2 mt-4 scroll-mt-24">
            {processInlineMarkdown(line.replace('##### ', ''))}
          </h5>
        )
        return
      }

      // 番号付きリストの処理
      const orderedListMatch = line.match(/^(\d+)\.\s+(.+)/)
      if (orderedListMatch) {
        flushList() // 通常のリストを先にフラッシュ
        flushTable()
        isInOrderedList = true
        orderedListItems.push(orderedListMatch[2])
        return
      } else if (isInOrderedList && !line.trim()) {
        // 空行で番号付きリストを終了
        flushOrderedList()
        return
      } else if (isInOrderedList) {
        // 番号付きリスト以外の行が来たらフラッシュ
        flushOrderedList()
      }

      // 通常のリストの処理
      if (line.startsWith('- ') || line.startsWith('* ')) {
        flushOrderedList() // 番号付きリストを先にフラッシュ
        flushTable()
        listItems.push(line.replace(/^[-*]\s+/, ''))
        return
      } else if (listItems.length > 0 && !line.trim()) {
        // 空行でリストを終了
        flushList()
        return
      } else if (listItems.length > 0) {
        // リスト以外の行が来たらフラッシュ
        flushList()
      }

      // 引用の処理
      if (line.startsWith('> ')) {
        flushList()
        flushOrderedList()
        flushTable()
        elements.push(
          <blockquote key={index} className={`border-l-4 border-blue-500 pl-4 italic my-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {processInlineMarkdown(line.replace('> ', ''))}
          </blockquote>
        )
        return
      }

      // 通常の段落
      if (line.trim()) {
        flushList()
        flushOrderedList()
        flushTable()
        elements.push(
          <p key={index} className="mb-4 leading-relaxed">
            {processInlineMarkdown(line)}
          </p>
        )
      } else {
        elements.push(<div key={index} className="mb-2" />)
      }
    })

    // 最後にリストとテーブルをフラッシュ
    flushList()
    flushOrderedList()
    flushTable()

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
                  {/*<div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{post.views?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={14} />
                    <span>{likes}</span>
                  </div>*/}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>

              <div className={`flex flex-wrap items-center gap-4 text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {/*<div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{post.author}</span>
                </div>*/}
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(post.date)}</span>
                </div>
                {/*<div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{post.readTime}</span>
                </div>*/}
              </div>
            </div>

            {/* Action Buttons */}
            {/*<div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">*/}
            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
              {/*<button
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
              </div>*/}
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
