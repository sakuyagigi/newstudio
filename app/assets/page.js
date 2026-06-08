'use client'

import { useState } from 'react'

// 素材分类
const categories = [
  { id: 'all', name: '全部素材', count: 156, icon: '📁' },
  { id: 'characters', name: '角色图', count: 48, icon: '👤' },
  { id: 'scenes', name: '场景图', count: 62, icon: '🏔️' },
  { id: 'storyboards', name: '分镜图', count: 32, icon: '🎨' },
  { id: 'props', name: '道具图', count: 14, icon: '⚔️' },
]

// 素材列表
const assets = [
  { id: 1, name: '林远·常服正面', category: 'characters', project: '星河旅人', style: '赛博朋克', model: 'GPT-Image-2', time: '2025-06-05', thumbnail: '👨', tags: ['主角', '常服', '正面'] },
  { id: 2, name: '林远·夜行衣', category: 'characters', project: '星河旅人', style: '赛博朋克', model: 'GPT-Image-2', time: '2025-06-06', thumbnail: '🥷', tags: ['主角', '夜行衣', '全身'] },
  { id: 3, name: '星河港口全景', category: 'scenes', project: '星河旅人', style: '赛博朋克', model: 'DALL-E 3', time: '2025-06-04', thumbnail: '🌃', tags: ['外景', '全景', '科幻'] },
  { id: 4, name: '飞船控制室', category: 'scenes', project: '星河旅人', style: '科幻', model: 'Midjourney', time: '2025-06-03', thumbnail: '🚀', tags: ['内景', '科技', '主场景'] },
  { id: 5, name: '苏晴·礼服', category: 'characters', project: '星河旅人', style: '赛博朋克', model: 'GPT-Image-2', time: '2025-06-06', thumbnail: '👩', tags: ['女主角', '礼服', '宴会'] },
  { id: 6, name: '分镜第3镜·近景', category: 'storyboards', project: '星河旅人', style: '电影感', model: 'GPT-Image-2', time: '2025-06-07', thumbnail: '🖼️', tags: ['分镜', '近景', '第3镜'] },
  { id: 7, name: '太空酒吧', category: 'scenes', project: '星河旅人', style: '赛博朋克', model: 'DALL-E 3', time: '2025-06-05', thumbnail: '🍸', tags: ['内景', '酒吧', '霓虹'] },
  { id: 8, name: '异星荒原', category: 'scenes', project: '星河旅人', style: '科幻', model: 'Midjourney', time: '2025-06-04', thumbnail: '🏜️', tags: ['外景', '荒原', '外星'] },
  { id: 9, name: '能量剑', category: 'props', project: '星河旅人', style: '科幻', model: 'GPT-Image-2', time: '2025-06-03', thumbnail: '⚔️', tags: ['武器', '道具', '发光'] },
  { id: 10, name: '时光杂货店·外景', category: 'scenes', project: '时光杂货店', style: '日系治愈', model: 'DALL-E 3', time: '2025-06-02', thumbnail: '🏪', tags: ['外景', '店铺', '治愈'] },
  { id: 11, name: '森林秘境·入口', category: 'scenes', project: '森林秘境', style: '奇幻', model: 'Midjourney', time: '2025-06-01', thumbnail: '🌲', tags: ['外景', '森林', '奇幻'] },
  { id: 12, name: '城市记忆·天台', category: 'scenes', project: '城市记忆', style: '写实', model: 'GPT-Image-2', time: '2025-05-30', thumbnail: '🏙️', tags: ['外景', '天台', '都市'] },
]

const viewModes = [
  { id: 'grid', icon: '⊞' },
  { id: 'list', icon: '≡' },
]

export default function AssetLibrary() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAssets = assets.filter((asset) => {
    if (activeCategory !== 'all' && asset.category !== activeCategory) return false
    if (searchQuery && !asset.name.includes(searchQuery) && !asset.tags.some(t => t.includes(searchQuery))) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">素材库</h1>
          <p className="text-neutral-500 mt-1 text-sm">统一管理所有生成素材 · 共 {assets.length} 个文件</p>
        </div>
        <button className="px-4 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium shadow-card hover:shadow-card-hover transition-all">
          + 上传素材
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 左侧分类 */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-card p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="搜索素材..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive ? 'bg-brand-50 text-brand-600 font-medium' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className={`text-xs ${isActive ? 'text-brand-500' : 'text-neutral-400'}`}>{cat.count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 存储空间 */}
          <div className="bg-white rounded-xl shadow-card p-5 mt-4">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">存储空间</h3>
            <div className="text-2xl font-bold text-neutral-800 mb-1">2.4 GB</div>
            <div className="text-xs text-neutral-500 mb-3">已使用 / 10 GB</div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-gradient rounded-full" style={{ width: '24%' }}></div>
            </div>
            <button className="w-full mt-4 py-2 border border-brand-200 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors">
              升级存储空间
            </button>
          </div>
        </div>

        {/* 右侧素材列表 */}
        <div className="col-span-9">
          <div className="bg-white rounded-xl shadow-card p-5">
            {/* 工具栏 */}
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-neutral-500">
                共 <span className="font-medium text-neutral-700">{filteredAssets.length}</span> 个素材
              </div>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-200">
                  <option>按时间排序</option>
                  <option>按名称排序</option>
                  <option>按项目分组</option>
                </select>
                <div className="flex items-center gap-1 bg-neutral-100 rounded-md p-0.5">
                  {viewModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`w-7 h-7 rounded text-sm ${
                        viewMode === mode.id ? 'bg-white text-brand-600 shadow-sm' : 'text-neutral-400'
                      }`}
                    >
                      {mode.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 网格视图 */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-4 gap-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="border border-neutral-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center relative">
                      <span className="text-4xl opacity-50">{asset.thumbnail}</span>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs flex items-center justify-center">
                          ⤓
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-neutral-700 truncate">{asset.name}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-neutral-400">{asset.project}</span>
                        <span className="text-xs text-neutral-300">·</span>
                        <span className="text-xs text-neutral-400">{asset.model}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 列表视图 */}
            {viewMode === 'list' && (
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center gap-4 p-3 border border-neutral-100 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl opacity-50">{asset.thumbnail}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-neutral-700 truncate">{asset.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-neutral-400">{asset.project}</span>
                        <span className="text-xs text-neutral-300">·</span>
                        <span className="text-xs text-neutral-400">{asset.model}</span>
                        <span className="text-xs text-neutral-300">·</span>
                        <span className="text-xs text-neutral-400">{asset.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {asset.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="text-neutral-400 hover:text-brand-600 text-sm flex-shrink-0">
                      ⤓ 下载
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
