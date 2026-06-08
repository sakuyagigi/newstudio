'use client'

import { useState } from 'react'

// 灵感分类
const categories = [
  { id: 'all', name: '全部', count: 128 },
  { id: 'style', name: '风格参考', count: 45 },
  { id: 'composition', name: '构图参考', count: 32 },
  { id: 'character', name: '角色设计', count: 28 },
  { id: 'scene', name: '场景设定', count: 23 },
]

// 灵感卡片
const inspirations = [
  {
    id: 1,
    title: '赛博朋克雨夜街景',
    category: 'style',
    source: 'Pinterest',
    author: 'Cyberpunk Artist',
    likes: 2341,
    thumbnail: '🌃',
    color: '#1a1a3e',
  },
  {
    id: 2,
    title: '黄金分割构图法',
    category: 'composition',
    source: '摄影笔记',
    author: '构图研究',
    likes: 1856,
    thumbnail: '📐',
    color: '#2d5a27',
  },
  {
    id: 3,
    title: '东方古装角色设计',
    category: 'character',
    source: 'ArtStation',
    author: '国风画师',
    likes: 3421,
    thumbnail: '👘',
    color: '#8b0000',
  },
  {
    id: 4,
    title: '蒸汽朋克机械城',
    category: 'scene',
    source: 'Behance',
    author: 'Concept Art',
    likes: 1523,
    thumbnail: '⚙️',
    color: '#8b6914',
  },
  {
    id: 5,
    title: '日系治愈光影',
    category: 'style',
    source: 'Instagram',
    author: '日系摄影师',
    likes: 4521,
    thumbnail: '🌸',
    color: '#ffb6c1',
  },
  {
    id: 6,
    title: '低角度仰拍构图',
    category: 'composition',
    source: '电影截图',
    author: '诺兰电影',
    likes: 2134,
    thumbnail: '📽️',
    color: '#1a365d',
  },
  {
    id: 7,
    title: '科幻角色铠甲设计',
    category: 'character',
    source: 'ArtStation',
    author: 'Sci-Fi Artist',
    likes: 3245,
    thumbnail: '🦾',
    color: '#4a5568',
  },
  {
    id: 8,
    title: '奇幻森林场景',
    category: 'scene',
    source: 'DeviantArt',
    author: 'Fantasy Art',
    likes: 1876,
    thumbnail: '🌲',
    color: '#22543d',
  },
  {
    id: 9,
    title: '黑色电影光影美学',
    category: 'style',
    source: '电影史',
    author: 'Film Noir',
    likes: 2789,
    thumbnail: '🎬',
    color: '#1a1a1a',
  },
  {
    id: 10,
    title: '对称构图之美',
    category: 'composition',
    source: '摄影精选',
    author: '对称美学',
    likes: 1654,
    thumbnail: '🪞',
    color: '#5a67d8',
  },
  {
    id: 11,
    title: '赛博朋克角色设计',
    category: 'character',
    source: 'Pinterest',
    author: 'Cyber Character',
    likes: 2987,
    thumbnail: '🤖',
    color: '#6b46c1',
  },
  {
    id: 12,
    title: '末日废土场景',
    category: 'scene',
    source: 'ArtStation',
    author: 'Wasteland Art',
    likes: 1432,
    thumbnail: '🏚️',
    color: '#744210',
  },
]

// 热搜标签
const hotTags = ['赛博朋克', '日系治愈', '水墨国风', '电影感', '蒸汽朋克', '暗黑哥特', '极简主义', '超现实', '复古怀旧', '未来科技']

export default function Inspiration() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredInspirations = activeCategory === 'all'
    ? inspirations
    : inspirations.filter(i => i.category === activeCategory)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">灵感库</h1>
          <p className="text-neutral-500 mt-1 text-sm">情报官每日更新 · 全球影视/艺术精选参考</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="搜索灵感..."
            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 w-64"
          />
          <button className="px-4 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium shadow-card hover:shadow-card-hover transition-all">
            + 上传灵感
          </button>
        </div>
      </div>

      {/* 热搜标签 */}
      <div className="bg-white rounded-xl shadow-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔥</span>
          <span className="text-sm font-medium text-neutral-700">热门搜索</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {hotTags.map((tag) => (
            <button
              key={tag}
              className="px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-sm hover:bg-brand-50 hover:text-brand-600 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 左侧分类 */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-card p-4 sticky top-6">
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
                    <span>{cat.name}</span>
                    <span className={`text-xs ${isActive ? 'text-brand-500' : 'text-neutral-400'}`}>{cat.count}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <h4 className="text-xs font-medium text-neutral-500 mb-3">我的收藏夹</h4>
              <div className="space-y-2">
                {['科幻项目参考', '古风角色设计', '电影分镜灵感'].map((folder, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <span className="text-brand-400">📁</span>
                    <span className="text-sm text-neutral-600 truncate">{folder}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧瀑布流 */}
        <div className="col-span-10">
          <div className="grid grid-cols-4 gap-4">
            {filteredInspirations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-card overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
              >
                <div
                  className="aspect-[4/5] flex items-center justify-center relative"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <span className="text-5xl opacity-60">{item.thumbnail}</span>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sm shadow-sm hover:bg-white">
                      ❤️
                    </button>
                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sm shadow-sm hover:bg-white">
                      ⭐
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-neutral-800 mb-2">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>{item.author}</span>
                    <div className="flex items-center gap-1">
                      <span>❤️</span>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-neutral-50 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">{item.source}</span>
                    <button className="text-xs text-brand-600 font-medium hover:text-brand-700">
                      应用到项目 →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 加载更多 */}
          <div className="text-center mt-8">
            <button className="px-6 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
              加载更多灵感
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
