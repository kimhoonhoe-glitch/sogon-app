'use client'

export default function CrisisAlert() {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-2xl p-6 mb-4">
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3">
        혹시 힘든 생각이 드시나요?
      </h3>
      <p className="text-red-700 dark:text-red-400 mb-4 leading-relaxed">
        당신의 삶은 소중합니다. 전문 상담사와 대화해보시는 건 어떨까요?
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2">
        <div>
          <div className="text-sm text-text/60 dark:text-white/60">자살예방 상담전화</div>
          <a href="tel:1393" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            ☎️ 1393
          </a>
        </div>
        <div>
          <div className="text-sm text-text/60 dark:text-white/60">정신건강 위기상담</div>
          <a href="tel:1577-0199" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            ☎️ 1577-0199
          </a>
        </div>
      </div>
    </div>
  )
}
