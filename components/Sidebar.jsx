'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: '项目总览', icon: '🎬', path: '/' },
  { name: '剧本分析', icon: '📝', path: '/script' },
  { name: '角色定妆', icon: '👤', path: '/character' },
  { name: '分镜生成', icon: '🎨', path: '/storyboard' },
  { name: '视频渲染', icon: '🎞️', path: '/render' },
  { name: '成片交付', icon: '✨', path: '/delivery' },
  { name: '冲突看板', icon: '⚠️', path: '/conflicts' },
  { name: '系统设置', icon: '⚙️', path: '/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-sm border-r border-orange-100 shadow-lg z-40">
      {/* Logo区域 */}
      <div className="p-6 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">墨</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800">墨枢光影</h1>
            <p className="text-xs text-gray-400">AI导演台 v1.0</p>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* AI导演组状态 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-orange-100 bg-white/50">
        <div className="text-xs text-gray-400 mb-3">AI导演组</div>
        <div className="flex items-center gap-2 flex-wrap">
          {['ALPHA', 'BETA', 'GAMMA', 'KAPPA', 'EPSILON', 'SIGMA'].map((name, i) => (
            <div
              key={name}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-sm"
              title={name}
            >
              {name.charAt(0)}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">6位导演 · 全部在线</p>
      </div>
    </aside>
  )
}
