'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

// 导航数据结构：按模块分组
const navGroups = [
  {
    name: '创作中心',
    items: [
      { name: '项目总览', icon: '🎬', path: '/', director: null },
      { name: '剧本库', icon: '📝', path: '/script', director: 'ALPHA' },
      { name: '角色库', icon: '👤', path: '/character', director: 'KAPPA' },
      { name: '场景库', icon: '🏔️', path: '/scene', director: 'BETA' },
      { name: '分镜台', icon: '🎨', path: '/storyboard', director: 'GAMMA' },
      { name: '后期特效', icon: '✨', path: '/post-production', director: 'SIGMA' },
      { name: '素材库', icon: '📁', path: '/assets', director: null },
    ]
  },
  {
    name: 'AI导演组',
    items: [
      { name: 'ALPHA · 叙事导演', icon: '🎭', path: '/director/alpha', director: 'ALPHA' },
      { name: 'BETA · 视觉导演', icon: '🎨', path: '/director/beta', director: 'BETA' },
      { name: 'GAMMA · 节奏导演', icon: '⏱️', path: '/director/gamma', director: 'GAMMA' },
      { name: 'KAPPA · 角色导演', icon: '👤', path: '/director/kappa', director: 'KAPPA' },
      { name: 'EPSILON · AI制片', icon: '📊', path: '/director/epsilon', director: 'EPSILON' },
      { name: 'SIGMA · 财务导演', icon: '💰', path: '/director/sigma', director: 'SIGMA' },
    ]
  },
  {
    name: '中心',
    items: [
      { name: '风格中心', icon: '✨', path: '/style', director: 'BETA' },
      { name: '成本中心', icon: '💴', path: '/cost', director: 'SIGMA' },
      { name: '灵感库', icon: '💡', path: '/inspiration', director: '情报官' },
    ]
  },
  {
    name: '系统',
    items: [
      { name: '项目设置', icon: '⚙️', path: '/settings', director: null },
    ]
  }
]

// 导演状态
const directorStatus = {
  'ALPHA': { status: 'working', text: '分析中', color: 'bg-amber-500' },
  'BETA': { status: 'working', text: '创作中', color: 'bg-purple-500' },
  'GAMMA': { status: 'idle', text: '待命', color: 'bg-gray-400' },
  'KAPPA': { status: 'idle', text: '待命', color: 'bg-gray-400' },
  'EPSILON': { status: 'working', text: '调度中', color: 'bg-blue-500' },
  'SIGMA': { status: 'idle', text: '待命', color: 'bg-gray-400' },
}

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white border-r border-neutral-200 shadow-card z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo区域 */}
      <div className="p-5 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-300 to-brand-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white text-lg font-semibold">墨</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-neutral-800">墨枢光影</h1>
              <p className="text-xs text-neutral-400">AI导演台 v2.0</p>
            </div>
          )}
        </div>
      </div>

      {/* 当前项目 */}
      {!collapsed && (
        <div className="mx-4 my-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100">
          <div className="text-xs text-neutral-400 mb-1">当前项目</div>
          <div className="font-medium text-neutral-700 text-sm truncate">星河旅人 · 第3集</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-xs text-neutral-500">进行中 · 65%</span>
          </div>
        </div>
      )}

      {/* 导航菜单 */}
      <nav className="p-3 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {navGroups.map((group) => (
          <div key={group.name}>
            {!collapsed && (
              <div className="text-xs text-neutral-400 font-medium px-3 mb-2">{group.name}</div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.path
                const status = item.director ? directorStatus[item.director] : null

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                      isActive
                        ? 'bg-brand-50 text-brand-600 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                    }`}
                    title={collapsed ? item.name : ''}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="text-sm flex-1 truncate">{item.name}</span>
                        {status && (
                          <div className={`w-2 h-2 rounded-full ${status.color} flex-shrink-0 ${status.status === 'working' ? 'animate-pulse' : ''}`} title={status.text}></div>
                        )}
                      </>
                    )}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                        {status && <span className="ml-1 text-neutral-300">· {status.text}</span>}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 底部导演组状态 */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-neutral-400">导演组</span>
            <span className="text-xs text-neutral-400">6 / 12 在线</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['A', 'B', 'G', 'K', 'E', 'S'].map((letter, i) => {
              const directorKey = ['ALPHA', 'BETA', 'GAMMA', 'KAPPA', 'EPSILON', 'SIGMA'][i]
              const status = directorStatus[directorKey]
              const isWorking = status?.status === 'working'

              return (
                <div
                  key={letter}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isWorking
                      ? 'bg-gradient-to-br from-brand-300 to-brand-500 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                  title={`${directorKey} · ${status?.text || '待命'}`}
                >
                  {letter}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 折叠按钮 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-6 -right-3 w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-600 shadow-sm z-50"
      >
        <span className="text-xs">{collapsed ? '›' : '‹'}</span>
      </button>
    </aside>
  )
}
