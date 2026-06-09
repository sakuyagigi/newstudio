'use client'

import { useState } from 'react'

const storyboards = [
  {
    id: 1,
    shot: 'S01E01',
    title: '开场 - 星空下的天文台',
    scene: '第1场',
    duration: '8s',
    level: 'A',
   景别: '远景',
   运镜: '推镜头',
    description: '繁星点点的夜空下，一座白色天文台矗立在山顶。镜头缓缓推进，天文台的圆顶缓缓打开。',
    image: 'https://picsum.photos/800/450?random=11',
    role: '苏沐月',
  },
  {
    id: 2,
    shot: 'S01E02',
    title: '主角登场',
    scene: '第1场',
    duration: '5s',
    level: 'A',
   景别: '中景',
   运镜: '固定',
    description: '苏沐月站在望远镜前，专注地调试着设备。她的侧脸被仪器的蓝光照亮。',
    image: 'https://picsum.photos/800/450?random=12',
    role: '苏沐月',
  },
  {
    id: 3,
    shot: 'S01E03',
    title: '发现异象',
    scene: '第1场',
    duration: '6s',
    level: 'A',
   景别: '近景',
   运镜: '推镜头',
    description: '苏沐月的眼睛突然睁大，她看到了什么不可思议的东西。镜头推向她的眼睛，瞳孔里映着奇异的光芒。',
    image: 'https://picsum.photos/800/450?random=13',
    role: '苏沐月',
  },
  {
    id: 4,
    shot: 'S02E01',
    title: '建筑事务所',
    scene: '第2场',
    duration: '7s',
    level: 'B',
   景别: '全景',
   运镜: '横移',
    description: '现代化的建筑事务所内，萧玦站在巨大的落地窗前，看着城市天际线。阳光在他身上投下长长的影子。',
    image: 'https://picsum.photos/800/450?random=14',
    role: '萧玦',
  },
  {
    id: 5,
    shot: 'S02E02',
    title: '神秘来电',
    scene: '第2场',
    duration: '4s',
    level: 'B',
   景别: '特写',
   运镜: '固定',
    description: '手机屏幕亮起，显示一个未知号码。萧玦皱眉，接起电话。',
    image: 'https://picsum.photos/800/450?random=15',
    role: '萧玦',
  },
  {
    id: 6,
    shot: 'S03E01',
    title: '咖啡馆相遇',
    scene: '第3场',
    duration: '10s',
    level: 'A',
   景别: '中景',
   运镜: '环绕',
    description: '街角咖啡馆，苏沐月和萧玦在门口偶遇。两人对视，时间仿佛静止。慢镜头处理。',
    image: 'https://picsum.photos/800/450?random=16',
    role: '苏沐月 / 萧玦',
  },
  {
    id: 7,
    shot: 'S03E02',
    title: '对话 - 命运的安排',
    scene: '第3场',
    duration: '15s',
    level: 'B',
   景别: '正反打',
   运镜: '固定',
    description: '两人在咖啡馆内交谈。苏沐月讲述她的发现，萧玦从怀疑到产生兴趣。',
    image: 'https://picsum.photos/800/450?random=17',
    role: '苏沐月 / 萧玦',
  },
  {
    id: 8,
    shot: 'S03E03',
    title: '决定合作',
    scene: '第3场',
    duration: '5s',
    level: 'A',
   景别: '近景',
   运镜: '推镜头',
    description: '萧玦伸出手："合作愉快。" 苏沐月握住，两人眼中都有光。',
    image: 'https://picsum.photos/800/450?random=18',
    role: '苏沐月 / 萧玦',
  },
]

const levelColors = {
  A: { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700', label: 'A级 · 关键镜头' },
  B: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700', label: 'B级 · 重要镜头' },
  C: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', label: 'C级 · 过渡镜头' },
}

export default function StoryboardPage() {
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const selected = storyboards.find(s => s.id === selectedId)

  const filtered = filter === 'all' ? storyboards : storyboards.filter(s => s.level === filter)
  
  const stats = {
    total: storyboards.length,
    totalDuration: '1:00',
    aCount: storyboards.filter(s => s.level === 'A').length,
    bCount: storyboards.filter(s => s.level === 'B').length,
    cCount: storyboards.filter(s => s.level === 'C').length,
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* 主区域：分镜时间线 */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 overflow-hidden flex flex-col">
        {/* 顶部工具栏 */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800">分镜生成</h1>
              <p className="text-sm text-gray-500">《星河旅人》· 第1集</p>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-gray-800">{stats.total}</div>
                <div className="text-gray-400 text-xs">总镜数</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800">{stats.totalDuration}</div>
                <div className="text-gray-400 text-xs">总时长</div>
              </div>
              <div className="text-center">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                <span className="text-gray-600">{stats.aCount}A</span>
              </div>
              <div className="text-center">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
                <span className="text-gray-600">{stats.bCount}B</span>
              </div>
              <div className="text-center">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                <span className="text-gray-600">{stats.cCount}C</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'all', label: '全部' },
                { key: 'A', label: 'A级' },
                { key: 'B', label: 'B级' },
                { key: 'C', label: 'C级' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    filter === item.key
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
              📤 导出分镜表
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
              ✨ 生成全部
            </button>
          </div>
        </div>

        {/* 分镜卡片流 */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative pl-8">
            {/* 时间轴竖线 */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {filtered.map((shot, index) => {
                const level = levelColors[shot.level]
                const prevShot = filtered[index - 1]
                const sceneChanged = !prevShot || prevShot.scene !== shot.scene

                return (
                  <div key={shot.id}>
                    {/* 场景分界 */}
                    {sceneChanged && (
                      <div className="relative -ml-8 mb-4 mt-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          <span className="text-sm font-medium text-orange-700">{shot.scene}</span>
                        </div>
                      </div>
                    )}

                    {/* 分镜卡片 */}
                    <div
                      onClick={() => setSelectedId(shot.id)}
                      className={`relative bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                        selectedId === shot.id ? 'border-orange-400 shadow-lg' : 'border-gray-200'
                      }`}
                    >
                      {/* 左侧级别标识条 */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${level.border.replace('border-', 'bg-')}`}></div>
                      
                      {/* 时间轴节点 */}
                      <div className={`absolute -left-6 top-6 w-4 h-4 rounded-full border-2 border-white ${level.border.replace('border-', 'bg-')} shadow-md z-10`}></div>

                      <div className="flex">
                        {/* 缩略图 */}
                        <div className="w-48 h-28 bg-gray-100 relative overflow-hidden flex-shrink-0">
                          <img
                            src={shot.image}
                            alt={shot.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                            {shot.duration}
                          </div>
                        </div>

                        {/* 信息区 */}
                        <div className="flex-1 p-4 pl-5">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-400">{shot.shot}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${level.bg} ${level.text}`}>
                                  {level.label}
                                </span>
                              </div>
                              <h3 className="font-semibold text-gray-800 mt-1">{shot.title}</h3>
                            </div>
                            <div className="text-right text-xs text-gray-400">
                              <div>{shot.景别}</div>
                              <div>{shot.运镜}</div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">{shot.description}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              👤 {shot.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 右侧详情面板 */}
      {selected && (
        <div className="w-96 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col animate-fade-in">
          {/* 大图预览 */}
          <div className="relative h-56 bg-gray-100">
            <img
              src={selected.image}
              alt={selected.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[selected.level].bg} ${levelColors[selected.level].text}`}>
                {levelColors[selected.level].label}
              </span>
            </div>
          </div>

          {/* 详情内容 */}
          <div className="flex-1 overflow-y-auto p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{selected.title}</h2>
            <p className="text-sm text-gray-400 mb-4">{selected.shot} · {selected.scene}</p>

            {/* 参数网格 */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-400 mb-1">景别</div>
                <div className="text-sm font-medium text-gray-700">{selected.景别}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-400 mb-1">运镜</div>
                <div className="text-sm font-medium text-gray-700">{selected.运镜}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-400 mb-1">时长</div>
                <div className="text-sm font-medium text-gray-700">{selected.duration}</div>
              </div>
            </div>

            {/* 画面描述 */}
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">画面描述</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>
            </div>

            {/* AI提示词 */}
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">AI 提示词</h4>
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800 font-mono leading-relaxed">
                {selected.description}... cinematic lighting, film grain, 35mm lens, shallow depth of field
              </div>
            </div>

            {/* 涉及角色 */}
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">涉及角色</h4>
              <div className="flex gap-2">
                {selected.role.split(' / ').map((r, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-lg">👤</span>
                    <span className="text-sm text-gray-700">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 底部操作区 */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-md transition-shadow">
              🎨 重新生成分镜
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                ⚙️ 调整参数
              </button>
              <button className="py-2.5 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors">
                🔒 锁定此镜
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
