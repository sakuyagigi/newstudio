'use client'

export default function ConflictsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">冲突看板</h1>
        <p className="text-gray-500 mt-1">AI导演间分析冲突与一致性检查</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">冲突检测中心</h3>
          <p className="text-gray-400 mb-6">自动检测角色、场景、风格的一致性问题</p>
          <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-md transition-shadow">
            运行冲突检测
          </button>
        </div>
      </div>
    </div>
  )
}
