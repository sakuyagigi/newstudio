'use client'

import { useState } from 'react'

const characters = [
  {
    id: 1,
    name: '苏沐月',
    role: '女主角',
    type: '主角',
    status: 'locked',
    avatar: '🌙',
    description: '25岁，清冷气质的天文研究员，性格内敛但内心坚韧',
    versions: [
      { id: 1, version: 'v1.0', date: '2024-01-15', status: 'draft', image: 'https://picsum.photos/400/600?random=1' },
      { id: 2, version: 'v1.1', date: '2024-01-16', status: 'draft', image: 'https://picsum.photos/400/600?random=2' },
      { id: 3, version: 'v2.0', date: '2024-01-18', status: 'locked', image: 'https://picsum.photos/400/600?random=3', isCurrent: true },
    ],
    dna: {
      hairstyle: '长直发，深棕色',
      costume: '白色研究员制服 / 休闲毛衣',
      color: '冷色调为主，蓝白灰',
      temperament: '清冷、知性、略带忧郁',
      era: '现代都市',
    },
    rules: ['禁止笑露齿', '保持清冷眼神', '发型不能变'],
  },
  {
    id: 2,
    name: '萧玦',
    role: '男主角',
    type: '主角',
    status: 'draft',
    avatar: '⭐',
    description: '28岁，天才建筑师，外冷内热，对建筑有近乎偏执的追求',
    versions: [
      { id: 1, version: 'v1.0', date: '2024-01-15', status: 'draft', image: 'https://picsum.photos/400/600?random=4' },
      { id: 2, version: 'v1.2', date: '2024-01-17', status: 'draft', image: 'https://picsum.photos/400/600?random=5', isCurrent: true },
    ],
    dna: {
      hairstyle: '利落短发，黑色',
      costume: '深色西装 / 建筑师工装',
      color: '黑、灰、藏蓝',
      temperament: '冷峻、专注、精英感',
      era: '现代都市',
    },
    rules: ['保持冷峻表情', '眼神要有深度'],
  },
  {
    id: 3,
    name: '夜罗刹',
    role: '反派',
    type: '配角',
    status: 'draft',
    avatar: '🦇',
    description: '神秘组织首领，年龄不详，行踪诡谲',
    versions: [
      { id: 1, version: 'v0.9', date: '2024-01-14', status: 'draft', image: 'https://picsum.photos/400/600?random=6', isCurrent: true },
    ],
    dna: {
      hairstyle: '黑色长发',
      costume: '黑色长袍 / 斗篷',
      color: '全黑，暗红点缀',
      temperament: '神秘、危险、优雅',
      era: '架空奇幻',
    },
    rules: ['面部始终半遮', '身姿挺拔'],
  },
  {
    id: 4,
    name: '阿阮',
    role: '女二号',
    type: '配角',
    status: 'draft',
    avatar: '🌸',
    description: '22岁，活泼开朗的实习生，苏沐月的师妹',
    versions: [
      { id: 1, version: 'v1.0', date: '2024-01-16', status: 'draft', image: 'https://picsum.photos/400/600?random=7', isCurrent: true },
    ],
    dna: {
      hairstyle: '双马尾 / 丸子头',
      costume: '可爱休闲装',
      color: '粉色、浅色系',
      temperament: '活泼、元气、阳光',
      era: '现代都市',
    },
    rules: [],
  },
]

export default function CharacterPage() {
  const [selectedId, setSelectedId] = useState(1)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const selected = characters.find(c => c.id === selectedId)

  const stats = {
    total: characters.length,
    main: characters.filter(c => c.type === '主角').length,
    supporting: characters.filter(c => c.type === '配角').length,
    locked: characters.filter(c => c.status === 'locked').length,
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* 左侧：角色列表 */}
      <div className="w-72 bg-white rounded-2xl shadow-lg p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">角色列表</h2>
          <button className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center text-xl hover:shadow-md transition-shadow">
            +
          </button>
        </div>

        {/* 统计面板 */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            <div className="text-xs text-gray-500">总角色</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.main}</div>
            <div className="text-xs text-gray-500">主角</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.supporting}</div>
            <div className="text-xs text-gray-500">配角</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.locked}</div>
            <div className="text-xs text-gray-500">已锁定</div>
          </div>
        </div>

        {/* 角色卡片列表 */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {characters.map((char) => (
            <div
              key={char.id}
              onClick={() => setSelectedId(char.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                selectedId === char.id
                  ? 'border-orange-400 bg-orange-50 shadow-md'
                  : 'border-transparent bg-gray-50 hover:bg-orange-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  char.status === 'locked' ? 'bg-gradient-to-br from-green-300 to-emerald-400' : 'bg-gradient-to-br from-amber-300 to-orange-400'
                }`}>
                  {char.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 truncate">{char.name}</h3>
                    {char.status === 'locked' && <span className="text-green-500 text-xs">🔒</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{char.role} · {char.type}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400 line-clamp-2">{char.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧：角色详情 */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 overflow-y-auto">
        {selected && (
          <>
            {/* 角色头部信息 */}
            <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-100">
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl ${
                selected.status === 'locked' ? 'bg-gradient-to-br from-green-200 to-emerald-300' : 'bg-gradient-to-br from-amber-200 to-orange-300'
              }`}>
                {selected.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{selected.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selected.status === 'locked' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selected.status === 'locked' ? '🔒 已锁定' : '✏️ 草稿中'}
                  </span>
                </div>
                <p className="text-gray-500 mb-3">{selected.role} · {selected.type}</p>
                <p className="text-gray-600 text-sm">{selected.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
                  生成新版本
                </button>
                {selected.status !== 'locked' && (
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
                    锁定定妆
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* 定妆版本时间线 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
                  定妆版本
                </h3>
                <div className="space-y-4">
                  {selected.versions.map((v, index) => (
                    <div
                      key={v.id}
                      className={`relative pl-6 pb-4 ${
                        index < selected.versions.length - 1 ? 'border-l-2 border-gray-200' : ''
                      }`}
                    >
                      <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full ${
                        v.status === 'locked' ? 'bg-green-500' : 'bg-amber-500'
                      }`}></div>
                      <div
                        onClick={() => setSelectedVersion(v)}
                        className="bg-gray-50 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                      >
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={v.image}
                            alt={v.version}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {v.isCurrent && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                              当前版本
                            </div>
                          )}
                          {v.status === 'locked' && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                              🔒 已锁定
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{v.version}</span>
                            <span className="text-xs text-gray-400">{v.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 视觉DNA + 铁律禁令 */}
              <div className="space-y-6">
                {/* 视觉DNA */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
                    视觉 DNA
                  </h3>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selected.dna).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-xs text-gray-500 mb-1">
                            {key === 'hairstyle' && '发型'}
                            {key === 'costume' && '服装'}
                            {key === 'color' && '配色'}
                            {key === 'temperament' && '气质'}
                            {key === 'era' && '年代感'}
                          </div>
                          <div className="text-sm text-gray-700 font-medium">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 铁律禁令 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-red-400 to-rose-500 rounded-full"></span>
                    铁律禁令
                  </h3>
                  <div className="bg-red-50 rounded-xl p-5">
                    {selected.rules.length > 0 ? (
                      <ul className="space-y-2">
                        {selected.rules.map((rule, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-red-700">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 text-center">暂无禁令</p>
                    )}
                  </div>
                </div>

                {/* 操作区 */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                    🎨 调整参数重绘
                  </button>
                  <button className="flex-1 py-3 bg-white border-2 border-orange-200 text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-colors">
                    💬 对话式修改
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 大图预览模态框 */}
      {selectedVersion && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedVersion(null)}
        >
          <div className="relative max-w-2xl max-h-full">
            <img
              src={selectedVersion.image}
              alt={selectedVersion.version}
              className="max-w-full max-h-[80vh] rounded-2xl"
            />
            <button
              onClick={() => setSelectedVersion(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-lg hover:bg-gray-100"
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800">{selected.name} - {selectedVersion.version}</h4>
                  <p className="text-sm text-gray-500">{selectedVersion.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedVersion.status === 'locked' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedVersion.status === 'locked' ? '已锁定' : '草稿'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
