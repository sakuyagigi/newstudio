'use client'

export default function RenderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">视频渲染</h1>
        <p className="text-gray-500 mt-1">分镜转视频，支持多模型切换</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">视频渲染中心</h3>
          <p className="text-gray-400 mb-6">选择分镜，一键生成视频成片</p>
          <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-md transition-shadow">
            开始渲染
          </button>
        </div>
      </div>
    </div>
  )
}
