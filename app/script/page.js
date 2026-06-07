'use client'

import { useState } from 'react'

const directors = [
  {
    id: 'alpha',
    name: 'ALPHA',
    role: '叙事导演',
    icon: '🎬',
    color: 'from-purple-400 to-purple-600',
    confidence: 'high',
    summary: '三幕式结构完整，起承转合清晰，人物弧光饱满',
    fullAnalysis: '剧本采用经典三幕式结构：\n\n**第一幕（建置）**：大明宫夜宴，四位主要人物悉数登场，人物关系与核心矛盾初步建立。李隆基对杨玉环一见钟情，但碍于身份无法表白。安禄山的出现为后续冲突埋下伏笔。\n\n**第二幕（对抗）**：华清宫赐浴，两人感情升温，但面临巨大的伦理压力。这一幕将情感冲突推向高潮。\n\n**第三幕（转折）**：安禄山谋反，将个人情感卷入家国大义。剧情从爱情片转向历史正剧。\n\n**优点**：人物塑造立体，情感细腻，历史氛围浓厚。\n**建议**：第三幕节奏可再紧凑些，增加马嵬坡的重头戏。',
  },
  {
    id: 'beta',
    name: 'BETA',
    role: '视觉导演',
    icon: '🎨',
    color: 'from-blue-400 to-blue-600',
    confidence: 'high',
    summary: '盛唐气象视觉化潜力巨大，建议采用浓墨重彩风格',
    fullAnalysis: '视觉风格建议：\n\n**整体调性**：浓墨重彩的盛唐气象，参考《妖猫传》的视觉风格\n\n**色彩体系**：\n- 皇宫：金色、红色为主，富丽堂皇\n- 华清宫：暖色调，雾气朦胧，暧昧氛围\n- 范阳：冷色调，铁灰色，压抑感\n\n**关键场景视觉**：\n1. 大明宫夜宴 - 灯笼海、金碧辉煌、群舞\n2. 海棠汤赐浴 - 水雾、薄纱、朦胧美\n3. 节度使府 - 铠甲、地图、烛光\n\n**摄影建议**：大量使用对称构图，展现大唐的恢宏气度',
  },
  {
    id: 'gamma',
    name: 'GAMMA',
    role: '分镜导演',
    icon: '📐',
    color: 'from-green-400 to-green-600',
    confidence: 'medium',
    summary: '预计可拆解为42个主要镜头，A级镜头8个',
    fullAnalysis: '分镜拆解预估：\n\n**第一幕（夜宴）**：15个镜头\n- 开场大远景（A）：大明宫全景\n- 杨玉环独舞（A）：多角度展示\n- 李隆基视角（A）：主观镜头，一见钟情\n- 安禄山登场（B）：低角度拍摄，压迫感\n\n**第二幕（赐浴）**：12个镜头\n- 温泉雾气（A）：唯美意境\n- 四目相对（A）：情感高潮\n- 轻抚发丝（B）：细腻动作\n\n**第三幕（谋反）**：15个镜头\n- 地图前独白（A）：野心展现\n- 甲士列阵（B）：军威展示\n- 结尾黑场（A）：悬念留白\n\n**总计**：42镜，A级8个，B级18个，C级16个',
  },
  {
    id: 'kappa',
    name: 'KAPPA',
    role: '角色导演',
    icon: '👤',
    color: 'from-pink-400 to-pink-600',
    confidence: 'high',
    summary: '4位核心角色立体丰满，三角恋+反派结构稳固',
    fullAnalysis: '角色分析：\n\n**李隆基**：\n- 身份：大唐皇帝，30岁\n- 性格：前期英明果敢，后期沉迷情爱\n- 弧光：从明君到昏君的转变\n- 关键台词："朕这一生，见过无数美人..."\n\n**杨玉环**：\n- 身份：寿王妃→贵妃，18岁\n- 性格：纯真善良，身不由己\n- 弧光：从懵懂到接受命运\n- 关键动作：霓裳羽衣舞\n\n**安禄山**：\n- 身份：范阳节度使，35岁\n- 性格：外表憨厚，内心狡诈\n- 功能：反派推动剧情\n- 标志性动作："嘿嘿"憨笑\n\n**高力士**：\n- 身份：大太监，40岁\n- 性格：城府深沉，察言观色\n- 功能：叙事串联者\n\n**人物关系**：李隆基→杨玉环（爱慕），安禄山→皇位（觊觎），高力士→平衡者',
  },
  {
    id: 'epsilon',
    name: 'EPSILON',
    role: '制片导演',
    icon: '📊',
    color: 'from-amber-400 to-orange-500',
    confidence: 'medium',
    summary: '预计制作周期15天，成本可控，商业潜力大',
    fullAnalysis: '制片评估：\n\n**制作周期**：15天\n- 角色定妆：2天（4个主要角色）\n- 分镜生成：3天（42镜）\n- 视频渲染：7天（含返工）\n- 后期剪辑：3天\n\n**成本预估**：\n- 角色生成：约2000元\n- 分镜生成：约5000元\n- 视频渲染：约15000元\n- 总计：约22000元\n\n**商业评估**：\n- 题材：历史爱情，受众广泛\n- 时长：约15分钟，适合短视频平台\n- 爆点："四大美女"IP自带流量\n- 建议：可做成系列短剧，每集5分钟\n\n**风险点**：\n- 历史题材需注意合规\n- 人物造型准确性要求高',
  },
  {
    id: 'sigma',
    name: 'SIGMA',
    role: '财务导演',
    icon: '💰',
    color: 'from-emerald-400 to-emerald-600',
    confidence: 'low',
    summary: 'ROI预计1:3，适合走平台分账模式',
    fullAnalysis: '财务分析：\n\n**投入成本**：\n- 制作成本：约22,000元\n- 宣发成本：约8,000元\n- 总计：约30,000元\n\n**收益预估**：\n- 平台分账：预计80,000-120,000元\n- 广告植入：约20,000元\n- IP衍生：待定\n- 总计：约100,000-140,000元\n\n**ROI**：1:3.3 ~ 1:4.7\n\n**建议模式**：\n1. 抖音/快手短剧分账\n2. 视频平台会员付费\n3. 品牌定制合作\n\n**风险提示**：\n- 平台政策变化风险\n- 内容审核风险\n- 竞品扎堆风险',
  },
]

const fourCards = {
  characters: [
    { name: '李隆基', type: '男主', desc: '大唐皇帝，英武果敢' },
    { name: '杨玉环', type: '女主', desc: '四大美女之一，清丽脱俗' },
    { name: '安禄山', type: '反派', desc: '范阳节度使，野心勃勃' },
    { name: '高力士', type: '配角', desc: '大太监，城府深沉' },
  ],
  scenes: [
    { name: '大明宫麟德殿', atmosphere: '富丽堂皇·恢弘大气', time: '夜' },
    { name: '华清宫海棠汤', atmosphere: '雾气氤氲·暧昧朦胧', time: '晨' },
    { name: '范阳节度使府', atmosphere: '铁马冰河·压抑紧张', time: '夜' },
  ],
  actions: [
    '杨玉环献舞《霓裳羽衣曲》',
    '李隆基与杨玉环四目相对',
    '安禄山闯殿打破氛围',
    '高力士察言观色',
    '李隆基华清宫探望',
    '温泉池中情愫渐生',
    '安禄山密室谋反',
    '一拳砸在地图上',
  ],
  spaces: [
    { level: '第一层', name: '皇宫内院', desc: '权力核心，等级森严' },
    { level: '第二层', name: '私人空间', desc: '温泉池、寝宫，情感私密' },
    { level: '第三层', name: '边疆府衙', desc: '范阳，阴谋酝酿之地' },
  ],
}

const conflicts = [
  { id: 1, level: 'high', type: '历史准确性', description: '杨玉环入宫年龄与史实不符，史载22岁，剧本写18岁', director: 'KAPPA' },
  { id: 2, level: 'high', type: '人物动机', description: '安禄山谋反动机过于单薄，建议增加背景铺垫', director: 'ALPHA' },
  { id: 3, level: 'medium', type: '场景连续性', description: '大明宫到华清宫的转场缺少交代，建议增加过渡镜头', director: 'GAMMA' },
  { id: 4, level: 'medium', type: '角色一致性', description: '李隆基后期性格转变太突兀，需要更多细节铺垫', director: 'BETA' },
  { id: 5, level: 'low', type: '服装考据', description: '唐代服饰纹样需进一步考证，建议咨询历史顾问', director: 'KAPPA' },
  { id: 6, level: 'low', type: '配乐建议', description: '第二幕情感戏配乐建议使用琵琶而非古筝，更符合年代', director: 'EPSILON' },
]

export default function ScriptPage() {
  const [activeTab, setActiveTab] = useState('directors')
  const [expandedDirector, setExpandedDirector] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setAnalyzeProgress(0)
    const interval = setInterval(() => {
      setAnalyzeProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const getConfidenceStyle = (level) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-amber-100 text-amber-700'
      case 'low': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getConfidenceText = (level) => {
    switch (level) {
      case 'high': return '高置信度'
      case 'medium': return '中置信度'
      case 'low': return '低置信度'
      default: return '未知'
    }
  }

  const getConflictStyle = (level) => {
    switch (level) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-amber-500 bg-amber-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-6rem)]">
      {/* 左侧：剧本内容区 */}
      <div className="w-2/5 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-amber-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">📄 剧本内容</span>
          </h2>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 hover:shadow-md transition-shadow">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              上传剧本
              <input type="file" accept=".txt,.pdf,.docx" className="hidden" />
            </label>
            <span className="text-sm text-gray-500 truncate flex-1">长安月.txt</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          <div className="text-gray-700 leading-relaxed text-sm space-y-4">
            <p className="text-center text-lg font-semibold text-amber-700 mb-6">《长安月》</p>
            
            <p className="text-gray-500 italic mb-4">【第一幕：夜宴】</p>
            <p><span className="font-semibold text-amber-600">场景：</span>大明宫，麟德殿内。夜。</p>
            <p><span className="font-semibold text-amber-600">人物：</span>李隆基、杨玉环、高力士、安禄山</p>
            <p className="text-gray-500 italic">【灯影幢幢，乐声袅袅。大殿之上，歌舞升平。】</p>
            <p><span className="font-semibold text-purple-600">高力士：</span>陛下，这杨氏玉环，乃是寿王妃。</p>
            <p><span className="font-semibold text-blue-600">李隆基：</span>朕知道...只是没想到，她的《霓裳羽衣曲》，跳得如此动人。</p>
            
            <p className="text-gray-500 italic mt-6 mb-4">【第二幕：赐浴】</p>
            <p><span className="font-semibold text-amber-600">场景：</span>华清宫，海棠汤。晨。</p>
            <p><span className="font-semibold text-pink-600">杨玉环：</span>（轻叹）陛下...为何要召我入宫...</p>
            <p><span className="font-semibold text-blue-600">李隆基：</span>你可知，朕这一生，见过无数美人。却从未有人，能像你一样...</p>
            
            <p className="text-gray-500 italic mt-6 mb-4">【第三幕：谋反】</p>
            <p><span className="font-semibold text-amber-600">场景：</span>范阳，节度使府。夜。</p>
            <p><span className="font-semibold text-orange-600">安禄山：</span>（沉声）李隆基老了！这天下，该换个主人了！</p>
            <p><span className="font-semibold text-orange-600">安禄山：</span>（一拳砸在地图上）下个月！以"清君侧"为名，挥师长安！</p>
          </div>
        </div>

        <div className="p-5 border-t border-amber-100">
          {isAnalyzing ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">AI导演分析中...</span>
                <span className="text-amber-600 font-medium">{analyzeProgress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-200"
                  style={{ width: `${analyzeProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 text-center">
                {analyzeProgress < 30 ? '正在解析剧本结构...' : 
                 analyzeProgress < 60 ? '六位导演分头分析中...' :
                 analyzeProgress < 90 ? '交叉验证冲突检测...' : '生成最终报告...'}
              </p>
            </div>
          ) : (
            <button 
              onClick={handleAnalyze}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              开始五导演分析
            </button>
          )}
        </div>
      </div>

      {/* 右侧：分析结果区 */}
      <div className="w-3/5 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tab 标题 */}
        <div className="relative px-5 pt-5 border-b border-amber-100">
          <div className="flex gap-1">
            {[
              { key: 'directors', label: '🎬 五导演分析' },
              { key: 'overview', label: '📊 四卡总览' },
              { key: 'conflicts', label: '⚠️ 冲突看板' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-medium rounded-t-lg transition-colors relative z-10 ${
                  activeTab === tab.key ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.key === 'conflicts' && (
                  <span className="ml-1.5 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    {conflicts.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="absolute bottom-0 left-5 w-24 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 tab-indicator"></div>
        </div>

        {/* Tab 内容 */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* 五导演分析 */}
          {activeTab === 'directors' && (
            <div className="grid grid-cols-2 gap-4">
              {directors.map(director => (
                <div
                  key={director.id}
                  className={`bg-gray-50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    expandedDirector === director.id ? 'ring-2 ring-amber-300' : ''
                  }`}
                  onClick={() => setExpandedDirector(
                    expandedDirector === director.id ? null : director.id
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${director.color} flex items-center justify-center text-xl flex-shrink-0`}>
                      {director.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-800">{director.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getConfidenceStyle(director.confidence)}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                            director.confidence === 'high' ? 'bg-green-500 pulse-dot' :
                            director.confidence === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                          }`}></span>
                          {getConfidenceText(director.confidence)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{director.role}</p>
                      <p className="text-sm text-gray-600">{director.summary}</p>
                    </div>
                  </div>
                  
                  {expandedDirector === director.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                        {director.fullAnalysis}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 四卡总览 */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-4">
              {/* 角色卡 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5">
                <h3 className="text-lg font-bold text-purple-700 mb-4">👤 角色卡</h3>
                <div className="space-y-3">
                  {fourCards.characters.map((char, i) => (
                    <div key={i} className="bg-white/80 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800">{char.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                          {char.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{char.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 场景卡 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
                <h3 className="text-lg font-bold text-blue-700 mb-4">🏞️ 场景卡</h3>
                <div className="space-y-3">
                  {fourCards.scenes.map((scene, i) => (
                    <div key={i} className="bg-white/80 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800">{scene.name}</span>
                        <span className="text-xs text-gray-400">{scene.time}</span>
                      </div>
                      <p className="text-xs text-gray-500">{scene.atmosphere}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 动作链 */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-5">
                <h3 className="text-lg font-bold text-amber-700 mb-4">⚡ 动作链</h3>
                <div className="space-y-2">
                  {fourCards.actions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 空间链 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-5">
                <h3 className="text-lg font-bold text-emerald-700 mb-4">🌌 空间链</h3>
                <div className="space-y-3">
                  {fourCards.spaces.map((space, i) => (
                    <div key={i} className="bg-white/80 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full">
                          {space.level}
                        </span>
                        <span className="font-semibold text-gray-800 text-sm">{space.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{space.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 冲突看板 */}
          {activeTab === 'conflicts' && (
            <div className="space-y-3">
              {conflicts.map(conflict => (
                <div
                  key={conflict.id}
                  className={`border-l-4 rounded-r-xl p-4 cursor-pointer hover:shadow-md transition-all ${getConflictStyle(conflict.level)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        conflict.level === 'high' ? 'bg-red-500' :
                        conflict.level === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                      }`}></span>
                      <span className="font-medium text-gray-800">{conflict.type}</span>
                      <span className="text-xs px-2 py-0.5 bg-white/60 rounded-full text-gray-500">
                        {conflict.director} 提出
                      </span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      conflict.level === 'high' ? 'bg-red-200 text-red-700' :
                      conflict.level === 'medium' ? 'bg-amber-200 text-amber-700' : 'bg-green-200 text-green-700'
                    }`}>
                      {conflict.level === 'high' ? '严重' : conflict.level === 'medium' ? '中等' : '轻微'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-5">{conflict.description}</p>
                  <div className="flex gap-2 mt-3 ml-5">
                    <button className="px-3 py-1.5 bg-white/80 text-gray-600 rounded-lg text-xs font-medium hover:bg-white transition-colors">
                      ✓ 确认修复
                    </button>
                    <button className="px-3 py-1.5 bg-white/50 text-gray-400 rounded-lg text-xs font-medium hover:bg-white/80 transition-colors">
                      忽略
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
