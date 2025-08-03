import { type FC, memo, useOptimistic, useTransition } from 'react';
import { Calendar, Tag, ArrowRight, Heart } from 'lucide-react';
import type { PostCardProps } from '../types';

const PostCard: FC<PostCardProps> = memo(({ post, darkMode, onPostClick }) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(false);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = () => {
    startTransition(() => {
      setOptimisticLiked(true);
    });
  };

  const handlePostClick = () => {
    if (onPostClick) {
      startTransition(() => {
        onPostClick(post);
      });
    }
  };

  return (
    <article className={`group rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    } ${isPending ? 'opacity-75' : ''}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              darkMode ? 'bg-blue-900 text-blue-200 group-hover:bg-blue-800' : 'bg-blue-100 text-blue-800 group-hover:bg-blue-200'
            }`}>
              {post.category}
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {post.readTime}
            </span>
          </div>
          <button
            onClick={handleLike}
            className={`p-1 rounded-full transition-all duration-200 ${
              optimisticLiked
                ? 'text-red-500 scale-110'
                : darkMode
                  ? 'text-gray-400 hover:text-red-400'
                  : 'text-gray-500 hover:text-red-500'
            }`}
            aria-label="いいね"
          >
            <Heart size={16} fill={optimisticLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <h3
          className="text-xl font-bold mb-3 hover:text-blue-500 transition-colors cursor-pointer line-clamp-2"
          onClick={handlePostClick}
        >
          {post.title}
        </h3>

        <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatDate(post.date)}
            </span>
          </div>
          <button
            onClick={handlePostClick}
            className="text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center space-x-1 transition-all duration-200 hover:translate-x-1"
            disabled={isPending}
          >
            <span>続きを読む</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs transition-colors ${
              darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
              <Tag size={10} />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
