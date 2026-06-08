'use client'

import { useState } from 'react'
import { useStudio } from '../../context/StudioContext'

const timeOptions = ['全部', '白天', '夜晚', '黄昏', '黎明', '室内', '室外']
const styleTags = ['现代', '科幻', '古风', '奇幻', '都市', '自然', '工业', '复古']

export default function ScenePage() {
  const { scenes, storyboards, characters, setSelectedShot } = useStudio()
  const [selectedTime, setSelectedTime] = useState('全部')
  const [selectedStyle, setSelectedStyle] = useState([])
  const [selectedScene, setSelectedScene] = useState(null)

  // 每个场景的镜头数量
  const sceneShotCounts = storyboards.reduce((acc, shot) => {
    acc[shot.scene] = (acc[shot.scene] || 0) + 1
    return acc
  }, {})

  // 每个场景的角色
  const sceneCharacters = storyboards.reduce((acc, shot) => {
    if (!acc[shot.scene]) {
      acc[shot.scene] = []
    }
    shot.characters?.forEach((charId) => {
      if (!acc[shot.scene].includes(charId)) {
        acc[shot.scene].push(charId)
      }
    })
    return acc
  }, {})

  const filteredScenes = scenes.filter((scene) => {
    if (selectedTime !== '全部' && scene.time !== selectedTime) return false
    return true
  })

  const currentScene = scenes.find(s => s.id === selectedScene)
  const sceneShots = storyboards.filter(s => s.scene === currentScene?.name)

  return (
    <div className="h-full flex flex-col">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">场景库</h1>
          <p className="text-neutral-500 mt-1 text-sm">BETA · 视觉导演工作台</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50">
            上传场景
          </button>
          <button className="px-5 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium shadow-card hover:shadow-card-hover transition-all">
            + 新建场景
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">时间：</span>
            <div className="flex items-center gap-1">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-brand-500 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <span>共 {scenes.length} 个场景</span>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* 左侧：场景网格 */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            {filteredScenes.map((scene) => {
              const shotCount = sceneShotCounts[scene.name] || 0
              const charIds = sceneCharacters[scene.name] || []
              const sceneChars = charIds.map(id => characters.find(c => c.id === id)).filter(Boolean)

              return (
                <div
                  key={scene.id}
                  onClick={() => setSelectedScene(scene.id)}
                  className={`bg-white rounded-xl shadow-card overflow-hidden cursor-pointer transition-all border-2 ${
                    selectedScene === scene.id
                      ? 'border-brand-400 shadow-lg'
                      : 'border-transparent hover:border-neutral-200 hover:shadow-md'
                  }`}
                >
                  {/* 场景图 */}
                  <div className="aspect-video relative">
                    <img
                      src={scene.image}
                      alt={scene.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-sm">{scene.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white/80 text-xs">📍 {scene.location}</span>
                        <span className="text-white/80 text-xs">🕐 {scene.time}</span>
                      </div>
                    </div>
                    {shotCount > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-neutral-800 text-xs font-medium rounded-full">
                          {shotCount} 镜
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 场景信息 */}
                  <div className="p-3">
                    <p className="text-xs text-neutral-500 line-clamp-2">{scene.desc}</p>
                    
                    {sceneChars.length > 0 && (
                      <div className="flex items-center gap-1 mt-3">
                        <span className="text-xs text-neutral-400 mr-1">角色：</span>
                        {sceneChars.slice(0, 3).map((char) => (
                          <div
                            key={char.id}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-200 to-brand-300 flex items-center justify-center text-xs"
                            title={char.name}
                          >
                            {char.name.charAt(0)}
                          </div>
                        ))}
                        {sceneChars.length > 3 && (
                          <span className="text-xs text-neutral-400">+{sceneChars.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 右侧：场景详情 */}
        <div className="w-80 flex-shrink-0 overflow-y-auto">
          {currentScene ? (
            <div className="bg-white rounded-xl shadow-card p-5 space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">{currentScene.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">{currentScene.desc}</p>
              </div>

              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="text-xs text-neutral-400">时间</div>
                  <div className="text-sm font-medium text-neutral-700 mt-0.5">{currentScene.time}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="text-xs text-neutral-400">地点</div>
                  <div className="text-sm font-medium text-neutral-700 mt-0.5">{currentScene.location}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="text-xs text-neutral-400">镜头数</div>
                  <div className="text-sm font-medium text-neutral-700 mt-0.5">{sceneShots.length} 镜</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="text-xs text-neutral-400">出场角色</div>
                  <div className="text-sm font-medium text-neutral-700 mt-0.5">
                    {(sceneCharacters[currentScene.name] || []).length} 个
                  </div>
                </div>
              </div>

              {/* 场景内镜头列表 */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">包含镜头</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sceneShots.map((shot) => (
                    <div
                      key={shot.id}
                      onClick={() => setSelectedShot(shot.id)}
                      className="p-2.5 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-neutral-700">{shot.shotNo}</span>
                        {shot.isSLevel && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">S</span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-1">{shot.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-neutral-400">{shot.duration}</span>
                        <span className="text-xs text-neutral-400">{shot.shotSize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 风格标签 */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-2">风格标签</h4>
                <div className="flex flex-wrap gap-2">
                  {['现代都市', '写实风格', '冷色调'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-brand-50 text-brand-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-2 pt-2">
                <button className="w-full py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
                  编辑场景
                </button>
                <button className="w-full py-2 bg-white border border-neutral-200 text-neutral-600 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                  生成变体
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-card p-10 text-center">
              <div className="text-4xl mb-3">🏔️</div>
              <p className="text-neutral-500 text-sm">选择一个场景查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
