import { type FC } from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 size={32} className="animate-spin text-blue-600" />
    <span className="ml-3 text-lg">読み込み中...</span>
  </div>
)

export default LoadingSpinner
