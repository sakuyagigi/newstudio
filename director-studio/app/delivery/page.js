'use client'

export default function DeliveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">成片交付</h1>
        <p className="text-gray-500 mt-1">项目导出与交付管理</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">成片交付中心</h3>
          <p className="text-gray-400 mb-6">导出多种格式，生成交付报告</p>
          <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-md transition-shadow">
            查看交付项
          </button>
        </div>
      </div>
    </div>
  )
}
