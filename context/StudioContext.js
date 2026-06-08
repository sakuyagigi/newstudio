'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const StudioContext = createContext(null)

// 表演等级定义
export const PERF_LEVELS = {
  LV1: { label: 'LV1 基础', desc: '静态站位、无表情、背景板角色', costMult: 1.0, color: 'bg-neutral-100 text-neutral-600' },
  LV2: { label: 'LV2 标准', desc: '常规动作、基本表情、台词口型', costMult: 1.2, color: 'bg-blue-50 text-blue-600' },
  LV3: { label: 'LV3 复杂', desc: '多动作组合、情绪转变、微表情、对手戏', costMult: 1.8, color: 'bg-amber-50 text-amber-600' },
  LV4: { label: 'LV4 高阶', desc: '内心戏、复杂情绪、长镜头、S级特写（建议后期补拍）', costMult: 2.5, color: 'bg-red-50 text-red-600' },
}

// 配音状态
export const DUB_STATUS = {
  NONE: { label: '无对白', color: 'bg-neutral-100 text-neutral-500' },
  PENDING: { label: '待配音', color: 'bg-amber-50 text-amber-600' },
  PARTIAL: { label: '部分完成', color: 'bg-blue-50 text-blue-600' },
  DONE: { label: '已配音', color: 'bg-emerald-50 text-emerald-600' },
}

// 模型推荐
export const MODEL_RECOMMEND = {
  image: [
    { id: 'nb-pro', name: 'NB Pro', desc: '出图质量最优', priority: 1 },
    { id: 'nb2', name: 'NB2', desc: '性价比之选', priority: 2 },
    { id: 'gpt-image', name: 'GPT Image 2', desc: '创意表现佳', priority: 3 },
  ],
  video: [
    { id: 'seedance-2', name: 'Seedance 2.0', desc: 'API友好，开发者首选', priority: 1 },
    { id: 'kling-35', name: '可灵3.5', desc: '运镜控制最强', priority: 2 },
    { id: 'wan-27', name: '万相Wan 2.7', desc: '口型同步好', priority: 3 },
  ],
}

// 初始角色数据
const initialCharacters = [
  {
    id: 'char-001',
    name: '苏沐月',
    role: '女主角',
    type: '主角',
    status: 'locked',
    avatar: '🌙',
    description: '25岁，清冷气质的天文研究员，性格内敛但内心坚韧',
    defaultPerfLevel: 'LV3',
    voice: {
      type: 'preset',
      name: '清冷知性女声',
      provider: 'tencent-tts',
      voiceId: 'zh_female_danbing',
      speed: 1.0,
      pitch: 0,
      sample: null,
    },
    versions: [
      { id: 'v1', version: 'v1.0', date: '2024-01-15', status: 'draft', image: 'https://picsum.photos/400/600?random=1' },
      { id: 'v2', version: 'v2.0', date: '2024-01-18', status: 'locked', image: 'https://picsum.photos/400/600?random=3', isCurrent: true },
    ],
    dna: {
      hairstyle: '长直发，深棕色',
      costume: '白色研究员制服 / 休闲毛衣',
      color: '冷色调为主，蓝白灰',
      temperament: '清冷、知性、略带忧郁',
      era: '现代都市',
      facialFeatures: '鹅蛋脸，眉毛细长，眼睛偏细长',
      bodyType: '偏瘦，身高168cm',
    },
    oocRules: [
      { id: 'ooc-1', category: '性格', rule: '禁止活泼开朗、大声说笑，保持内敛克制', level: 'strict' },
      { id: 'ooc-2', category: '行为', rule: '禁止夸张肢体动作，动作幅度小而优雅', level: 'strict' },
      { id: 'ooc-3', category: '表情', rule: '情绪波动仅限眼神和微表情，面部大动作禁止', level: 'strict' },
      { id: 'ooc-4', category: '语言', rule: '语速偏慢、音量偏低，禁止大喊大叫', level: 'medium' },
      { id: 'ooc-5', category: '气质', rule: '整体保持清冷疏离感，禁止过于接地气', level: 'medium' },
    ],
    costumes: [
      { id: 'c1', name: '研究员制服', desc: '白色大褂+浅色衬衫+长裤', image: 'https://picsum.photos/200/300?random=101' },
      { id: 'c2', name: '休闲日常', desc: '米白毛衣+牛仔裤', image: 'https://picsum.photos/200/300?random=102' },
      { id: 'c3', name: '正装', desc: '藏蓝西装套裙', image: 'https://picsum.photos/200/300?random=103' },
    ],
  },
  {
    id: 'char-002',
    name: '萧玦',
    role: '男主角',
    type: '主角',
    status: 'draft',
    avatar: '⭐',
    description: '28岁，天才建筑师，外冷内热，对建筑有近乎偏执的追求',
    defaultPerfLevel: 'LV3',
    voice: {
      type: 'preset',
      name: '低沉磁性男声',
      provider: 'tencent-tts',
      voiceId: 'zh_male_yunxi',
      speed: 0.95,
      pitch: 0,
      sample: null,
    },
    versions: [
      { id: 'v1', version: 'v1.2', date: '2024-01-17', status: 'draft', image: 'https://picsum.photos/400/600?random=5', isCurrent: true },
    ],
    dna: {
      hairstyle: '利落短发，黑色',
      costume: '深色西装 / 建筑师工装',
      color: '黑、灰、藏蓝',
      temperament: '冷峻、专注、精英感',
      era: '现代都市',
      facialFeatures: '轮廓分明，高鼻梁',
      bodyType: '高挑，身高185cm',
    },
    oocRules: [
      { id: 'ooc-1', category: '性格', rule: '禁止轻浮油滑，保持冷峻克制', level: 'strict' },
      { id: 'ooc-2', category: '行为', rule: '动作果断利落，禁止拖泥带水', level: 'medium' },
      { id: 'ooc-3', category: '表情', rule: '笑容罕见且克制，禁止大笑', level: 'strict' },
    ],
    costumes: [
      { id: 'c1', name: '建筑师西装', desc: '深灰西装+白衬衫', image: 'https://picsum.photos/200/300?random=104' },
      { id: 'c2', name: '工装', desc: '深色工装+牛仔裤', image: 'https://picsum.photos/200/300?random=105' },
    ],
  },
  {
    id: 'char-003',
    name: '林小星',
    role: '女二号',
    type: '配角',
    status: 'draft',
    avatar: '🌟',
    description: '22岁，活泼开朗的天文台实习生，苏沐月的师妹',
    defaultPerfLevel: 'LV2',
    voice: {
      type: 'preset',
      name: '活泼甜美女声',
      provider: 'tencent-tts',
      voiceId: 'zh_female_tianmei',
      speed: 1.1,
      pitch: 1,
      sample: null,
    },
    versions: [
      { id: 'v1', version: 'v1.0', date: '2024-01-20', status: 'draft', image: 'https://picsum.photos/400/600?random=7', isCurrent: true },
    ],
    dna: {
      hairstyle: '齐肩短发，栗色',
      costume: '休闲卫衣+牛仔裤',
      color: '暖色调，黄橙红',
      temperament: '活泼、阳光、元气满满',
      era: '现代都市',
    },
    oocRules: [
      { id: 'ooc-1', category: '性格', rule: '保持活泼开朗，禁止阴郁沉默', level: 'medium' },
    ],
    costumes: [
      { id: 'c1', name: '休闲卫衣', desc: '黄色卫衣+牛仔裤', image: 'https://picsum.photos/200/300?random=106' },
    ],
  },
]

// 初始分镜数据
const initialStoryboards = [
  {
    id: 'shot-001',
    shotNo: 'S01E01',
    title: '开场 - 星空下的天文台',
    scene: '第1场',
    sequence: 1,
    duration: '8s',
    level: 'A',
    shotSize: '远景',
    cameraMove: '推镜头',
    description: '繁星点点的夜空下，一座白色天文台矗立在山顶。镜头缓缓推进，天文台的圆顶缓缓打开。',
    image: 'https://picsum.photos/800/450?random=11',
    characters: [],
    perfLevel: null,
    dubStatus: 'NONE',
    isSLevel: false,
    modelRec: null,
    sceneType: '空镜',
    notes: '',
  },
  {
    id: 'shot-002',
    shotNo: 'S01E02',
    title: '主角登场',
    scene: '第1场',
    sequence: 2,
    duration: '5s',
    level: 'A',
    shotSize: '中景',
    cameraMove: '固定',
    description: '苏沐月站在望远镜前，专注地调试着设备。她的侧脸被仪器的蓝光照亮。',
    image: 'https://picsum.photos/800/450?random=12',
    characters: ['char-001'],
    perfLevel: 'LV2',
    dubStatus: 'PENDING',
    isSLevel: false,
    modelRec: 'seedance-2',
    sceneType: '角色戏',
    lines: '（内心）又一颗新星...',
    notes: '',
  },
  {
    id: 'shot-003',
    shotNo: 'S01E03',
    title: '发现异象',
    scene: '第1场',
    sequence: 3,
    duration: '6s',
    level: 'S',
    shotSize: '近景→特写',
    cameraMove: '推镜头',
    description: '苏沐月的眼睛突然睁大，她看到了什么不可思议的东西。镜头推向她的眼睛，瞳孔里映着奇异的光芒。',
    image: 'https://picsum.photos/800/450?random=13',
    characters: ['char-001'],
    perfLevel: 'LV3',
    dubStatus: 'PENDING',
    isSLevel: true,
    modelRec: 'wan-27',
    sceneType: '角色戏',
    lines: '这...不可能...',
    notes: 'S级镜头，注意眼神光。建议后期补拍眼部特写',
  },
  {
    id: 'shot-004',
    shotNo: 'S02E01',
    title: '建筑事务所',
    scene: '第2场',
    sequence: 4,
    duration: '7s',
    level: 'B',
    shotSize: '全景',
    cameraMove: '横移',
    description: '现代化的建筑事务所内，萧玦站在巨大的落地窗前，看着城市天际线。阳光在他身上投下长长的影子。',
    image: 'https://picsum.photos/800/450?random=14',
    characters: ['char-002'],
    perfLevel: 'LV2',
    dubStatus: 'NONE',
    isSLevel: false,
    modelRec: 'seedance-2',
    sceneType: '角色戏',
    lines: '',
    notes: '',
  },
  {
    id: 'shot-005',
    shotNo: 'S02E02',
    title: '神秘来电',
    scene: '第2场',
    sequence: 5,
    duration: '4s',
    level: 'B',
    shotSize: '特写',
    cameraMove: '固定',
    description: '手机屏幕亮起，显示一个未知号码。萧玦皱眉，接起电话。',
    image: 'https://picsum.photos/800/450?random=15',
    characters: ['char-002'],
    perfLevel: 'LV2',
    dubStatus: 'PENDING',
    isSLevel: false,
    modelRec: 'kling-35',
    sceneType: '角色戏',
    lines: '喂？...你说什么？',
    notes: '',
  },
  {
    id: 'shot-006',
    shotNo: 'S03E01',
    title: '咖啡馆相遇',
    scene: '第3场',
    sequence: 6,
    duration: '10s',
    level: 'A',
    shotSize: '中景',
    cameraMove: '环绕',
    description: '街角咖啡馆，苏沐月和萧玦在门口偶遇。两人对视，时间仿佛静止。慢镜头处理。',
    image: 'https://picsum.photos/800/450?random=16',
    characters: ['char-001', 'char-002'],
    perfLevel: 'LV3',
    dubStatus: 'PENDING',
    isSLevel: false,
    modelRec: 'seedance-2',
    sceneType: '对手戏',
    lines: '（两人同时）是你？',
    notes: '',
  },
]

// 场景数据
const initialScenes = [
  { id: 'scene-001', name: '天文台山顶', desc: '夜晚，繁星满天，白色天文台矗立', time: '夜晚', location: '山顶', image: 'https://picsum.photos/600/400?random=201' },
  { id: 'scene-002', name: '建筑事务所', desc: '现代化高层办公室，落地窗，城市天际线', time: '白天', location: '市中心CBD', image: 'https://picsum.photos/600/400?random=202' },
  { id: 'scene-003', name: '街角咖啡馆', desc: '温馨文艺的咖啡馆，玻璃橱窗', time: '下午', location: '老城区', image: 'https://picsum.photos/600/400?random=203' },
]

// LUT预设
const initialLUTs = [
  { id: 'lut-001', name: '电影感·暖金', desc: '暖色调，黄金时刻质感', type: 'color', image: 'https://picsum.photos/200/150?random=301' },
  { id: 'lut-002', name: '清冷·蓝调', desc: '冷色调，科技感', type: 'color', image: 'https://picsum.photos/200/150?random=302' },
  { id: 'lut-003', name: '复古胶片', desc: '颗粒感，低对比', type: 'film', image: 'https://picsum.photos/200/150?random=303' },
  { id: 'lut-004', name: '高对比度', desc: '强烈明暗，戏剧感', type: 'contrast', image: 'https://picsum.photos/200/150?random=304' },
]

export function StudioProvider({ children }) {
  const [currentProject, setCurrentProject] = useState({
    id: 'proj-001',
    name: '星河旅人',
    episode: '第3集',
    status: 'in-progress',
    aspectRatio: '16:9',
    workflowMode: 'dub-first', // dub-first / sync
  })

  const [characters, setCharacters] = useState(initialCharacters)
  const [storyboards, setStoryboards] = useState(initialStoryboards)
  const [scenes, setScenes] = useState(initialScenes)
  const [selectedCharacter, setSelectedCharacter] = useState('char-001')
  const [selectedShot, setSelectedShot] = useState(null)
  const [luts] = useState(initialLUTs)

  // 角色操作
  const updateCharacter = useCallback((id, data) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }, [])

  const addOocRule = useCallback((charId, rule) => {
    setCharacters(prev => prev.map(c => {
      if (c.id === charId) {
        return { ...c, oocRules: [...c.oocRules, { ...rule, id: `ooc-${Date.now()}` }] }
      }
      return c
    }))
  }, [])

  const updateOocRule = useCallback((charId, ruleId, data) => {
    setCharacters(prev => prev.map(c => {
      if (c.id === charId) {
        return {
          ...c,
          oocRules: c.oocRules.map(r => r.id === ruleId ? { ...r, ...data } : r)
        }
      }
      return c
    }))
  }, [])

  const deleteOocRule = useCallback((charId, ruleId) => {
    setCharacters(prev => prev.map(c => {
      if (c.id === charId) {
        return { ...c, oocRules: c.oocRules.filter(r => r.id !== ruleId) }
      }
      return c
    }))
  }, [])

  const updateVoice = useCallback((charId, voiceData) => {
    setCharacters(prev => prev.map(c => {
      if (c.id === charId) {
        return { ...c, voice: { ...c.voice, ...voiceData } }
      }
      return c
    }))
  }, [])

  // 添加新角色
  const addCharacter = useCallback((character) => {
    setCharacters(prev => [...prev, character])
  }, [])

  // 分镜操作
  const updateShot = useCallback((shotId, data) => {
    setStoryboards(prev => prev.map(s => s.id === shotId ? { ...s, ...data } : s))
  }, [])

  const setShotPerfLevel = useCallback((shotId, level) => {
    updateShot(shotId, { perfLevel: level })
  }, [updateShot])

  const setShotDubStatus = useCallback((shotId, status) => {
    updateShot(shotId, { dubStatus: status })
  }, [updateShot])

  const toggleSLevel = useCallback((shotId) => {
    setStoryboards(prev => prev.map(s => {
      if (s.id === shotId) {
        const isS = !s.isSLevel
        return { ...s, isSLevel: isS, level: isS ? 'S' : s.level }
      }
      return s
    }))
  }, [])

  const setShotModel = useCallback((shotId, modelId) => {
    updateShot(shotId, { modelRec: modelId })
  }, [updateShot])

  // 按场景分组的分镜
  const scenesWithShots = storyboards.reduce((acc, shot) => {
    if (!acc[shot.scene]) {
      acc[shot.scene] = []
    }
    acc[shot.scene].push(shot)
    return acc
  }, {})

  // 统计数据
  const stats = {
    totalShots: storyboards.length,
    sLevelShots: storyboards.filter(s => s.isSLevel).length,
    totalDuration: storyboards.reduce((sum, s) => sum + parseInt(s.duration), 0) + 's',
    dubProgress: {
      done: storyboards.filter(s => s.dubStatus === 'DONE').length,
      pending: storyboards.filter(s => s.dubStatus === 'PENDING' || s.dubStatus === 'PARTIAL').length,
      none: storyboards.filter(s => s.dubStatus === 'NONE').length,
    }
  }

  const value = {
    currentProject,
    setCurrentProject,
    characters,
    setCharacters,
    selectedCharacter,
    setSelectedCharacter,
    updateCharacter,
    addCharacter,
    addOocRule,
    updateOocRule,
    deleteOocRule,
    updateVoice,
    storyboards,
    setStoryboards,
    selectedShot,
    setSelectedShot,
    updateShot,
    setShotPerfLevel,
    setShotDubStatus,
    toggleSLevel,
    setShotModel,
    scenesWithShots,
    scenes,
    luts,
    stats,
    PERF_LEVELS,
    DUB_STATUS,
    MODEL_RECOMMEND,
  }

  return (
    <StudioContext.Provider value={value}>
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  const context = useContext(StudioContext)
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider')
  }
  return context
}
