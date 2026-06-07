'use client'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">系统设置</h1>
        <p className="text-gray-500 mt-1">全局配置与个性化设置</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">API 配置</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">API Key 安全存储在服务端，前端无法访问</p>
              <p className="text-xs text-gray-400 mt-2">所有外部 API 调用均通过服务端路由转发</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">风格配置</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">全局风格字典：真人胶片风格</p>
              <p className="text-xs text-gray-400 mt-2">禁用：CG、UE5、卡通风格</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">安全设置</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">服务端API转发</span>
                <span className="text-green-500 text-sm font-medium">✓ 已启用</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Key 前端隐藏</span>
                <span className="text-green-500 text-sm font-medium">✓ 已启用</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">用户数据隔离</span>
                <span className="text-green-500 text-sm font-medium">✓ 已启用</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
