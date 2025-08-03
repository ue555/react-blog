export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  author: string;
  slug: string;
}

export const categories = ['all', 'React', 'TypeScript', 'Vite', 'JavaScript'] as const;
export type Category = typeof categories[number];

export interface CategoryFilterProps {
  categories: readonly string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  darkMode: boolean;
}

export interface PostCardProps {
  post: Post;
  darkMode: boolean;
  onPostClick?: (post: Post) => void;
}

export interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onSearch?: (query: string) => void;
}

export interface FooterProps {
  darkMode: boolean;
}

export interface SearchBoxProps {
  onSearch: (query: string) => void,
  darkMode: boolean,
  placeholder?: string,
  isSearching?: any
}

export interface Post {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  readTime: string
  tags: string[]
  author: string
  slug: string
  // 詳細画面用の追加フィールド
  publishedAt?: string
  updatedAt?: string
  views?: number
  likes?: number
}

export interface ArticleDetailProps {
  post: Post
  darkMode: boolean
  onBack: () => void
  onLike: (postId: number) => void
  onShare: (post: Post) => void
}

export interface NavigationState {
  currentView: 'list' | 'detail'
  selectedPost: Post | null
}
