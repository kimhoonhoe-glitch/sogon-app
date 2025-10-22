export default function ChatLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/20 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-soft mb-6 animate-pulse">
          <span className="text-6xl">💙</span>
        </div>
        <h2 className="text-2xl font-bold text-text dark:text-white mb-2">
          소곤
        </h2>
        <p className="text-text/60 dark:text-white/60">
          대화 준비 중...
        </p>
      </div>
    </div>
  )
}
