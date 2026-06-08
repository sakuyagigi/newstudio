'use client'

import { useState } from 'react'

const styleCategories = [
  { id: 'cinematic', name: '电影感', count: 12 },
  { id: 'anime', name: '动漫风', count: 18 },
  { id: 'realistic', name: '写实风', count: 15 },
  { id: 'artistic', name: '艺术化', count: 9 },
  { id: 'retro', name: '复古风', count: 7 },
  { id: 'scifi', name: '科幻风', count: 11 },
]

const stylePresets = [
  {
    id: 'warm-cinema',
    name: '暖调电影感',
    category: 'cinematic',
    author: 'BETA导演',
    likes: 256,
    preview: 'https://picsum.photos/400/600?random=201',
    tags: ['暖调', '胶片', '浅景深'],
    description: '温暖的金色调，适合情感戏、回忆场景',
    colorTemp: '暖',
    contrast: '中高',
    saturation: '低',
  },
  {
    id: 'cool-scifi',
    name: '冷调科幻',
    category: 'scifi',
    author: 'BETA导演',
    likes: 189,
    preview: 'https://picsum.photos/400/600?random=202',
    tags: ['冷调', '科技感', '霓虹'],
    description: '青蓝色调为主，赛博朋克未来感',
    colorTemp: '冷',
    contrast: '高',
    saturation: '中',
  },
  {
    id: 'ghibli',
    name: '吉卜力风',
    category: 'anime',
    author: '社区',
    likes: 432,
    preview: 'https://picsum.photos/400/600?random=203',
    tags: ['手绘', '治愈', '明亮'],
    description: '宫崎骏风格，柔和的色彩和充满细节的背景',
    colorTemp: '中',
    contrast: '中',
    saturation: '高',
  },
  {
    id: 'noir',
    name: '黑色电影',
    category: 'cinematic',
    author: 'BETA导演',
    likes: 178,
    preview: 'https://picsum.photos/400/600?random=204',
    tags: ['高对比', '黑白', '悬疑'],
    description: '经典黑色电影风格，强烈的明暗对比',
    colorTemp: '冷',
    contrast: '极高',
    saturation: '低',
  },
  {
    id: 'watercolor',
    name: '水彩艺术',
    category: 'artistic',
    author: '社区',
    likes: 156,
    preview: 'https://picsum.photos/400/600?random=205',
    tags: ['水彩', '柔和', '艺术感'],
    description: '手绘水彩质感，适合文艺片、纪录片',
    colorTemp: '暖',
    contrast: '低',
    saturation: '中',
  },
  {
    id: 'retro-80s',
    name: '80年代复古',
    category: 'retro',
    author: '社区',
    likes: 203,
    preview: 'https://picsum.photos/400/600?random=206',
    tags: ['复古', '颗粒感', '暖橙'],
    description: '80年代复古胶片质感，充满怀旧感',
    colorTemp: '暖',
    contrast: '中',
    saturation: '中高',
  },
  {
    id: 'documentary',
    name: '纪实风格',
    category: 'realistic',
    author: 'BETA导演',
    likes: 145,
    preview: 'https://picsum.photos/400/600?random=207',
    tags: ['真实', '自然', '手持感'],
    description: '自然真实的纪录片风格，不刻意美化',
    colorTemp: '自然',
    contrast: '中',
    saturation: '自然',
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    category: 'scifi',
    author: '社区',
    likes: 367,
    preview: 'https://picsum.photos/400/600?random=208',
    tags: ['霓虹', '雨夜', '高楼'],
    description: '霓虹闪烁的未来都市，雨夜和高科技感',
    colorTemp: '冷',
    contrast: '高',
    saturation: '高',
  },
]

const colorPalettes = [
  { name: '暖阳金', colors: ['#D4A574', '#F5E6D3', '#C49A6C', '#E8D5B7', '#B8860B'] },
  { name: '深海蓝', colors: ['#1E3A5F', '#3A7CA5', '#81C3D7', '#D9DCD6', '#16425B'] },
  { name: '森林绿', colors: ['#2D5A27', '#5C8D56', '#8FBC8F', '#C8E6C9', '#1B3D16'] },
  { name: '日落橙', colors: ['#FF6B35', '#F7931E', '#FFD166', '#FFF3B0', '#E85D04'] },
  { name: '梦幻紫', colors: ['#7B2CBF', '#9D4EDD', '#C77DFF', '#E0AAFF', '#5A189A'] },
  { name: '莫兰迪', colors: ['#9C89B8', '#F0A6CA', '#EFC3E6', '#B8BEDD', '#F0E6EF'] },
]

export default function StylePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const filteredStyles = activeCategory === 'all'
    ? stylePresets
    : stylePresets.filter(s => s.category === activeCategory)

  const currentStyle = stylePresets.find(s => s.id === selectedStyle)

  return (
    <div className="h-full flex flex-col">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">风格中心</h1>
          <p className="text-neutral-500 mt-1 text-sm">BETA · 视觉导演工作台</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-neutral-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm ${viewMode === 'grid' ? 'bg-brand-50 text-brand-600' : 'text-neutral-500'}`}
            >
              网格
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm ${viewMode === 'list' ? 'bg-brand-50 text-brand-600' : 'text-neutral-500'}`}
            >
              列表
            </button>
          </div>
          <button className="px-5 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium shadow-card hover:shadow-card-hover transition-all">
            + 创建风格
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* 左侧：分类导航 */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-card p-4">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">风格分类</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full px-3 py-2.5 rounded-lg text-left text-sm transition-all flex items-center justify-between ${
                  activeCategory === 'all'
                    ? 'bg-brand-50 text-brand-600 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <span>全部风格</span>
                <span className="text-xs text-neutral-400">{stylePresets.length}</span>
              </button>
              {styleCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full px-3 py-2.5 rounded-lg text-left text-sm transition-all flex items-center justify-between ${
                    activeCategory === cat.id
                      ? 'bg-brand-50 text-brand-600 font-medium'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-neutral-400">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 当前项目风格 */}
          <div className="bg-white rounded-xl shadow-card p-4 mt-4">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">当前项目风格</h3>
            <div className="p-3 bg-brand-50 rounded-lg border border-brand-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                  <span className="text-white text-lg">🎨</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-brand-700">暖调电影感</div>
                  <div className="text-xs text-brand-500">已应用到全项目</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 中间：风格列表 */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredStyles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`bg-white rounded-xl shadow-card overflow-hidden cursor-pointer transition-all border-2 ${
                    selectedStyle === style.id
                      ? 'border-brand-400 shadow-lg'
                      : 'border-transparent hover:border-neutral-200 hover:shadow-md'
                  }`}
                >
                  <div className="aspect-[3/4] relative">
                    <img src={style.preview} alt={style.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-white font-semibold text-sm">{style.name}</h4>
                      <p className="text-white/70 text-xs mt-1">{style.author}</p>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs rounded-full flex items-center gap-1">
                        <span>❤️</span>
                        {style.likes}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {style.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStyles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`bg-white rounded-xl shadow-card p-4 cursor-pointer transition-all border-2 flex items-center gap-4 ${
                    selectedStyle === style.id
                      ? 'border-brand-400 shadow-lg'
                      : 'border-transparent hover:border-neutral-200'
                  }`}
                >
                  <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={style.preview} alt={style.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-neutral-800">{style.name}</h4>
                    <p className="text-sm text-neutral-500 truncate">{style.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {style.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm text-neutral-400">{style.author}</div>
                    <div className="text-xs text-brand-500 mt-1">❤️ {style.likes}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 右侧：风格详情 */}
        <div className="w-72 flex-shrink-0 overflow-y-auto">
          {currentStyle ? (
            <div className="bg-white rounded-xl shadow-card p-5 space-y-5">
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <img src={currentStyle.preview} alt={currentStyle.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-800">{currentStyle.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">{currentStyle.description}</p>
              </div>

              {/* 参数 */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-neutral-50 rounded-lg text-center">
                  <div className="text-xs text-neutral-400">色温</div>
                  <div className="text-sm font-medium text-neutral-700 mt-0.5">{currentStyle.colorTemp}</div>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-lg text-center">
                  <div className="text-xs text-neutral-400">对比度</div>
                  <div className="text-sm font-medium text-neutral-700 mt-0.5">{currentStyle.contrast}</div>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-lg text-center">
                  <div className="text-xs text-neutral-400">饱和度</div>
                  <div className="text-sm font-medium text-neutral-700 mt-0.5">{currentStyle.saturation}</div>
                </div>
              </div>

              {/* 标签 */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">风格标签</h4>
                <div className="flex flex-wrap gap-2">
                  {currentStyle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-brand-50 text-brand-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 调色盘 */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">推荐配色</h4>
                <div className="flex gap-1">
                  {colorPalettes[0].colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 h-8 rounded-md first:rounded-l-lg last:rounded-r-lg"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-2 pt-2">
                <button className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
                  应用到项目
                </button>
                <button className="w-full py-2 bg-white border border-neutral-200 text-neutral-600 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                  预览效果
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-card p-10 text-center">
              <div className="text-4xl mb-3">🎨</div>
              <p className="text-neutral-500 text-sm">选择一个风格查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
