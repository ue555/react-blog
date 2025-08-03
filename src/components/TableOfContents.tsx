import { type FC, useEffect, useState } from 'react'
import { List } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
  darkMode: boolean
}

const TableOfContents: FC<TableOfContentsProps> = ({ content, darkMode }) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeId] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // コンテンツから見出しを抽出
    const headings = content.match(/^#{1,3}\s+.+$/gm) || []
    const items = headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 1
      const text = heading.replace(/^#+\s+/, '')
      const id = `heading-${index}`
      return { id, text, level }
    })
    setTocItems(items)
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (tocItems.length === 0) return null

  return (
    <div className="lg:sticky lg:top-24">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`lg:hidden flex items-center gap-2 mb-4 px-3 py-2 rounded-lg ${
          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}
      >
        <List size={16} />
        <span>目次</span>
      </button>

      <nav className={`${isVisible ? 'block' : 'hidden'} lg:block ${
        darkMode ? 'bg-gray-800' : 'bg-gray-50'
      } rounded-lg p-4`}>
        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
          目次
        </h4>
        <ul className="space-y-2">
          {tocItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToHeading(item.id)}
                className={`block w-full text-left text-sm transition-colors hover:text-blue-600 ${
                  item.level === 1 ? 'font-medium' : item.level === 2 ? 'ml-3' : 'ml-6'
                } ${activeId === item.id ? 'text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default TableOfContents
