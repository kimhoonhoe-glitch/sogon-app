'use client'

export default function LoadingMessage() {
  return (
    <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-text/70 dark:text-white/70 text-sm">
        잠시만요, 듣고 있어요...
      </span>
    </div>
  )
}
