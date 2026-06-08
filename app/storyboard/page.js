'use client'

import { useState } from 'react'
import { useStudio } from '../../context/StudioContext'

export default function StoryboardPage() {
  const {
    storyboards,
    selectedShot,
    setSelectedShot,
    updateShot,
    setShotPerfLevel,
    setShotDubStatus,
    toggleSLevel,
    setShotModel,
    scenesWithShots,
    scenes,
    characters,
    stats,
    PERF_LEVELS,
    DUB_STATUS,
    MODEL_RECOMMEND,
    currentProject,
  } = useStudio()

  const [viewMode, setViewMode] = useState('list') // list / grid
  const [showSLevelOnly, setShowSLevelOnly] = useState(false)

  const currentShot = storyboards.find(s => s.id === selectedShot)
  const shotCharacters = currentShot?.characters?.map(id => characters.find(c => c.id === id)).filter(Boolean) || []

  const getLevelBadge = (level) => {
    switch (level) {
      case 'S': return 'bg-red-100 text-red-600 border-red-200'
      case 'A': return 'bg-brand-50 text-brand-600 border-brand-200'
      case 'B': return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'C': return 'bg-neutral-100 text-neutral-600 border-neutral-200'
      default: return 'bg-neutral-100 text-neutral-600 border-neutral-200'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">分镜台</h1>
          <p className="text-neutral-500 mt-1 text-sm">GAMMA · 节奏导演工作台</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-neutral-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm ${viewMode === 'list' ? 'bg-brand-50 text-brand-600' : 'text-neutral-500'}`}
            >
              列表
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm ${viewMode === 'grid' ? 'bg-brand-50 text-brand-600' : 'text-neutral-500'}`}
            >
              带图
            </button>
          </div>
          <button
            onClick={() => setShowSLevelOnly(!showSLevelOnly)}
            className={`px-3 py-2 rounded-lg text-sm border ${
              showSLevelOnly ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-neutral-600 border-neutral-200'
            }`}
          >
            S级镜头: {stats.sLevelShots}
          </button>
          <button className="px-4 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium shadow-card hover:shadow-card-hover transition-all">
            + 新增镜头
          </button>
        </div>
      </div>

      {/* 统计栏 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="text-2xl font-bold text-neutral-800">{stats.totalShots}</div>
          <div className="text-sm text-neutral-500">总镜头数</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="text-2xl font-bold text-red-500">{stats.sLevelShots}</div>
          <div className="text-sm text-neutral-500">S级镜头</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="text-2xl font-bold text-brand-600">{stats.totalDuration}</div>
          <div className="text-sm text-neutral-500">总时长</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="text-2xl font-bold text-emerald-500">
            {stats.dubProgress.done}/{storyboards.length}
          </div>
          <div className="text-sm text-neutral-500">配音完成</div>
        </div>
      </div>

      {/* 主内容区 - 三栏布局 */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* 左栏：场景段落导航 */}
        <div className="w-56 flex-shrink-0 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-card p-3">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3 px-2">场景段落</h3>
            <div className="space-y-1">
              {Object.entries(scenesWithShots).map(([scene, shots]) => {
                const sLevelCount = shots.filter(s => s.isSLevel).length
                return (
                  <div key={scene} className="p-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">{scene}</span>
                      <span className="text-xs text-neutral-400">{shots.length}镜</span>
                    </div>
                    {sLevelCount > 0 && (
                      <div className="text-xs text-red-500 mt-1">
                        {sLevelCount}个S级
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 中栏：镜头列表 */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {Object.entries(scenesWithShots).map(([scene, shots]) => (
              <div key={scene}>
                <div className="text-sm font-medium text-neutral-500 mb-2 px-1">{scene}</div>
                <div className="space-y-2">
                  {shots
                  .filter(shot => !showSLevelOnly || shot.isSLevel)
                  .map((shot) => (
                    <div
                      key={shot.id}
                      onClick={() => setSelectedShot(shot.id)}
                      className={`bg-white rounded-xl p-4 shadow-card cursor-pointer transition-all border-2 ${
                        selectedShot === shot.id
                          ? 'border-brand-400 shadow-lg'
                          : 'border-transparent hover:border-neutral-200'
                      } ${shot.isSLevel ? 'ring-2 ring-red-200' : ''}`}
                    >
                      {viewMode === 'grid' && shot.image && (
                        <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-neutral-100">
                          <img src={shot.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-neutral-400">{shot.shotNo}</span>
                          {shot.isSLevel && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full font-medium">
                            S级
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getLevelBadge(shot.level)}`}>
                            {shot.level}级
                          </span>
                        </div>
                        <span className="text-xs text-neutral-400">{shot.duration}</span>
                      </div>

                      <h4 className="font-medium text-neutral-800 text-sm mb-2">{shot.title}</h4>
                      <p className="text-xs text-neutral-500 line-clamp-2">{shot.description}</p>

                      {/* 底部标签栏 */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-50">
                        {shot.perfLevel && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PERF_LEVELS[shot.perfLevel]?.color}`}>
                            {PERF_LEVELS[shot.perfLevel]?.label}
                          </span>
                        )}
                        {shot.dubStatus && DUB_STATUS[shot.dubStatus] && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DUB_STATUS[shot.dubStatus]?.color}`}>
                            {DUB_STATUS[shot.dubStatus]?.label}
                          </span>
                        )}
                        {shot.modelRec && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs">
                            {MODEL_RECOMMEND.video.find(m => m.id === shot.modelRec)?.name || shot.modelRec}
                          </span>
                        )}
                        <div className="flex-1"></div>
                        <span className="text-xs text-neutral-400">{shot.shotSize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右栏：镜头详情面板 */}
        <div className="w-80 flex-shrink-0 overflow-y-auto">
          {currentShot ? (
            <div className="bg-white rounded-xl shadow-card p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-800">{currentShot.title}</h3>
                <button
                  onClick={() => toggleSLevel(currentShot.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                    currentShot.isSLevel
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-white text-neutral-500 border-neutral-200'
                  }`}
                >
                  {currentShot.isSLevel ? '✓ S级' : '设为S级'}
                </button>
              </div>

              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="text-xs text-neutral-400">景别</div>
                  <div className="text-sm text-neutral-700 font-medium mt-1">{currentShot.shotSize}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="text-xs text-neutral-400">运镜</div>
                  <div className="text-sm text-neutral-700 font-medium mt-1">{currentShot.cameraMove}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="text-xs text-neutral-400">时长</div>
                  <div className="text-sm text-neutral-700 font-medium mt-1">{currentShot.duration}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <div className="text-xs text-neutral-400">等级</div>
                  <div className="text-sm text-neutral-700 font-medium mt-1">{currentShot.level}级</div>
                </div>
              </div>

              {/* 表演等级 */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">表演等级</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PERF_LEVELS).map(([key, level]) => (
                    <button
                      key={key}
                      onClick={() => setShotPerfLevel(currentShot.id, key)}
                      className={`p-2.5 rounded-lg text-left border-2 transition-all ${
                        currentShot.perfLevel === key
                          ? 'border-brand-400 bg-brand-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="text-sm font-medium text-neutral-700">{level.label}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">×{level.costMult}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 配音状态 */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">配音状态</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(DUB_STATUS).map(([key, status]) => (
                    <button
                      key={key}
                      onClick={() => setShotDubStatus(currentShot.id, key)}
                      className={`p-2.5 rounded-lg text-center border-2 transition-all ${
                        currentShot.dubStatus === key
                          ? 'border-brand-400 bg-brand-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <span className={`text-sm font-medium ${status.color.split(' ')[1]}`}>{status.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 台词 */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">台词</h4>
                <textarea
                  value={currentShot.lines || ''}
                  onChange={(e) => updateShot(currentShot.id, { lines: e.target.value })}
                  className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 resize-none"
                  rows={3}
                  placeholder="输入镜头台词..."
                />
              </div>

              {/* 模型推荐 */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">推荐模型</h4>
                <div className="space-y-2">
                  {MODEL_RECOMMEND.video.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setShotModel(currentShot.id, model.id)}
                      className={`w-full p-3 rounded-lg text-left border-2 transition-all flex items-center justify-between ${
                        currentShot.modelRec === model.id
                          ? 'border-purple-400 bg-purple-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium text-neutral-700">{model.name}</div>
                        <div className="text-xs text-neutral-400">{model.desc}</div>
                      </div>
                      {model.priority === 1 && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">推荐</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 涉及角色 */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-3">涉及角色</h4>
                <div className="space-y-2">
                  {shotCharacters.map((char) => (
                    <div key={char.id} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-lg">
                        {char.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-700">{char.name}</div>
                        <div className="text-xs text-neutral-400">{char.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 备注 */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 mb-2">制作备注</h4>
                <textarea
                  value={currentShot.notes || ''}
                  onChange={(e) => updateShot(currentShot.id, { notes: e.target.value })}
                  className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 resize-none"
                  rows={3}
                  placeholder="制作注意事项..."
                />
              </div>

              {/* S级后期提示 */}
              {currentShot.isSLevel && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎬</span>
                    <span className="font-medium text-red-700 text-sm">S级镜头 · 后期建议</span>
                  </div>
                  <p className="text-xs text-red-600 mb-3">
                    此镜头为S级重点镜头，建议采用"AI生成+真人绿幕补拍的双路径方案，确保表演质量
                  </p>
                  <button className="w-full py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                    发送到后期特效台
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-card p-10 text-center">
              <div className="text-4xl mb-3">🎬</div>
              <p className="text-neutral-500 text-sm">选择一个镜头查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
