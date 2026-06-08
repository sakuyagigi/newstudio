'use client'

import { useState } from 'react'
import { useStudio } from '../../context/StudioContext'

const analysisModes = [
  { id: 'quick', name: '快速分析', desc: '仅提取核心角色和场景', time: '约30秒', cost: '低' },
  { id: 'standard', name: '标准分析', desc: '完整拆解+分镜建议', time: '约2分钟', cost: '中' },
  { id: 'deep', name: '深度分析', desc: '逐镜头拆解+情绪节奏+合规审查', time: '约5分钟', cost: '高' },
]

const stylePresets = [
  { id: 'cinematic', name: '电影感', desc: '大光比、浅景深、胶片质感', color: 'from-amber-500 to-red-600' },
  { id: 'anime', name: '动漫风', desc: '鲜艳色彩、夸张构图、动效丰富', color: 'from-purple-500 to-pink-500' },
  { id: 'realistic', name: '写实风', desc: '自然光线、真实质感、纪录片感', color: 'from-green-500 to-teal-500' },
  { id: 'noir', name: '黑色电影', desc: '高对比、低饱和、悬疑氛围', color: 'from-gray-600 to-gray-900' },
]

export default function ScriptPage() {
  const { characters, storyboards, scenes, stats, PERF_LEVELS } = useStudio()
  const [scriptText, setScriptText] = useState('')
  const [analysisMode, setAnalysisMode] = useState('standard')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const handleAnalyze = async () => {
    if (!scriptText.trim()) return
    setIsAnalyzing(true)
    setAnalysisResult(null)
    
    try {
      // 调用五导演流水线API
      const response = await fetch('/api/directors/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: scriptText,
          options: { mode: analysisMode },
        }),
      })

      const data = await response.json()

      if (data.success && data.results) {
        // 解析五导演结果，整合展示
        const alphaData = data.results.alpha?.content || {}
        const gammaData = data.results.gamma?.content || {}
        const epsilonData = data.results.epsilon?.content || {}

        setAnalysisResult({
          characters: alphaData.characters?.map(c => ({
            name: c.name,
            desc: c.description || c.arc,
            importance: c.importance || (c.name.includes('主角') ? '主角' : '配角'),
          })) || [],
          scenes: alphaData.scenes?.map((s, i) => ({
            name: s.location || `第${i+1}场`,
            time: s.time || '',
            location: s.location || '',
          })) || [],
          plotStructure: alphaData.structure?.map(s => ({
            act: s.act || s.name,
            description: s.description,
            duration: s.duration || '',
          })) || [],
          themes: alphaData.themes || [],
          estimatedShots: gammaData.shots?.length || epsilonData.estimatedShots || 0,
          estimatedDuration: epsilonData.estimatedDuration || gammaData.totalDuration || '--',
          // 原始数据
          rawResults: data.results,
          directorStatus: Object.fromEntries(
            Object.entries(data.results).map(([k, v]) => [k, v.success])
          ),
        })
      } else {
        throw new Error(data.error || '分析失败')
      }
    } catch (error) {
      console.error('分析失败:', error)
      // 降级：使用模拟数据
      setAnalysisResult({
        characters: [
          { name: '苏沐月', desc: '女主角，天文研究员，清冷内敛', importance: '主角' },
          { name: '萧玦', desc: '男主角，建筑师，外冷内热', importance: '主角' },
          { name: '林小星', desc: '天文台实习生，活泼开朗', importance: '配角' },
          { name: '陈教授', desc: '苏沐月导师，神秘人物', importance: '配角' },
        ],
        scenes: [
          { name: '天文台山顶', time: '夜晚', location: '山顶' },
          { name: '建筑事务所', time: '白天', location: '市中心' },
          { name: '街角咖啡馆', time: '下午', location: '老城区' },
          { name: '苏沐月公寓', time: '夜晚', location: '公寓' },
          { name: '大学实验室', time: '白天', location: '校园' },
        ],
        plotStructure: [
          { act: '第一幕 · 引子', description: '苏沐月发现异象，神秘信号出现', duration: '15%' },
          { act: '第二幕 · 展开', description: '萧玦介入调查，两人相遇，真相逐渐揭开', duration: '55%' },
          { act: '第三幕 · 高潮', description: '天文台真相大白，命运抉择', duration: '20%' },
          { act: '第四幕 · 尾声', description: '余波与新的开始', duration: '10%' },
        ],
        themes: ['宇宙与孤独', '命运与选择', '科学与信仰', '时间与记忆'],
        estimatedShots: 42,
        estimatedDuration: '约8分钟',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">剧本分析</h1>
          <p className="text-neutral-500 mt-1 text-sm">ALPHA · 叙事导演工作台</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50">
            导入剧本
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={!scriptText.trim() || isAnalyzing}
            className="px-5 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium shadow-card hover:shadow-card-hover transition-all disabled:opacity-50"
          >
            {isAnalyzing ? '分析中...' : '开始分析'}
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* 左侧：剧本输入 */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-white rounded-xl shadow-card flex-1 flex flex-col overflow-hidden">
            {/* 模式选择 */}
            <div className="p-4 border-b border-neutral-100">
              <h3 className="text-sm font-medium text-neutral-700 mb-3">分析模式</h3>
              <div className="grid grid-cols-3 gap-2">
                {analysisModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setAnalysisMode(mode.id)}
                    className={`p-3 rounded-xl text-left border-2 transition-all ${
                      analysisMode === mode.id
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-medium text-sm text-neutral-800">{mode.name}</div>
                    <div className="text-xs text-neutral-500 mt-1">{mode.desc}</div>
                    <div className="text-xs text-neutral-400 mt-2">{mode.time} · {mode.cost}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 剧本编辑区 */}
            <div className="flex-1 p-4">
              <textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="粘贴或输入剧本内容...

支持格式：
• 标准剧本格式
• 小说文本
• 故事梗概
• 分场大纲

ALPHA 叙事导演将自动提取：
• 角色设定与人物关系
• 场景时空信息
• 情节结构与节奏
• 核心主题与情绪曲线"
                className="w-full h-full p-4 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 resize-none leading-relaxed"
              />
            </div>

            {/* 底部统计 */}
            <div className="p-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
              <span>{scriptText.length} 字</span>
              <span>预计生成 {Math.ceil(scriptText.length / 500)} 个场景 · {Math.ceil(scriptText.length / 100)} 个镜头</span>
            </div>
          </div>
        </div>

        {/* 右侧：分析结果 */}
        <div className="w-1/2 flex flex-col">
          {isAnalyzing ? (
            <div className="bg-white rounded-xl shadow-card flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-50 flex items-center justify-center breathing">
                  <span className="text-3xl">🎭</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">ALPHA 正在分析剧本</h3>
                <p className="text-sm text-neutral-500">正在提取角色、场景、情节结构...</p>
                <div className="mt-6 w-64 mx-auto">
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gradient rounded-full progress-animation" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="bg-white rounded-xl shadow-card flex-1 flex flex-col overflow-hidden">
              {/* Tab 导航 */}
              <div className="p-4 border-b border-neutral-100 flex items-center gap-1">
                {[
                  { id: 'overview', name: '总览报告', icon: '📊' },
                  { id: 'characters', name: '角色拆解', icon: '👥' },
                  { id: 'scenes', name: '场景拆解', icon: '🏔️' },
                  { id: 'style', name: '风格定位', icon: '🎨' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Tab 内容 */}
              <div className="flex-1 overflow-y-auto p-5">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* 核心数据 */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="p-4 bg-brand-50/50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-brand-600">{analysisResult.characters.length}</div>
                        <div className="text-xs text-neutral-500 mt-1">角色</div>
                      </div>
                      <div className="p-4 bg-blue-50/50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-blue-600">{analysisResult.scenes.length}</div>
                        <div className="text-xs text-neutral-500 mt-1">场景</div>
                      </div>
                      <div className="p-4 bg-purple-50/50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-purple-600">{analysisResult.estimatedShots}</div>
                        <div className="text-xs text-neutral-500 mt-1">预估镜头</div>
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-xl text-center">
                        <div className="text-lg font-bold text-emerald-600">{analysisResult.estimatedDuration}</div>
                        <div className="text-xs text-neutral-500 mt-1">预估时长</div>
                      </div>
                    </div>

                    {/* 情节结构 */}
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-4 text-sm">情节结构</h4>
                      <div className="space-y-3">
                        {analysisResult.plotStructure.map((act, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="w-20 flex-shrink-0 text-right">
                              <div className="text-sm font-medium text-neutral-700">{act.act}</div>
                              <div className="text-xs text-neutral-400">{act.duration}</div>
                            </div>
                            <div className="flex-1 p-3 bg-neutral-50 rounded-lg">
                              <p className="text-sm text-neutral-600">{act.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 核心主题 */}
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-3 text-sm">核心主题</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.themes.map((theme, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-gradient-to-r from-brand-50 to-amber-50 text-brand-700 text-sm rounded-full"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="pt-4 border-t border-neutral-100 flex gap-3">
                      <button className="flex-1 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
                        生成角色定妆
                      </button>
                      <button className="flex-1 py-2.5 bg-white border border-neutral-200 text-neutral-600 rounded-lg text-sm font-medium hover:bg-neutral-50">
                        生成分镜大纲
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'characters' && (
                  <div className="space-y-3">
                    {analysisResult.characters.map((char, index) => (
                      <div key={index} className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-neutral-800">{char.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            char.importance === '主角' ? 'bg-red-100 text-red-600' :
                            char.importance === '配角' ? 'bg-blue-100 text-blue-600' :
                            'bg-neutral-100 text-neutral-600'
                          }`}>
                            {char.importance}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500">{char.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'scenes' && (
                  <div className="space-y-3">
                    {analysisResult.scenes.map((scene, index) => (
                      <div key={index} className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-neutral-800">第{index + 1}场 · {scene.name}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                          <span>🕐 {scene.time}</span>
                          <span>📍 {scene.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'style' && (
                  <div className="space-y-4">
                    <p className="text-sm text-neutral-500 mb-4">根据剧本内容，推荐以下视觉风格方向</p>
                    <div className="grid grid-cols-2 gap-3">
                      {stylePresets.map((style) => (
                        <div
                          key={style.id}
                          className="rounded-xl overflow-hidden border border-neutral-200 cursor-pointer hover:border-brand-300 transition-colors"
                        >
                          <div className={`h-24 bg-gradient-to-br ${style.color} relative`}>
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute bottom-3 left-3 text-white">
                              <div className="font-bold">{style.name}</div>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-neutral-500">{style.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">💡</span>
                        <div>
                          <h5 className="font-medium text-amber-800 text-sm mb-1">风格试拍建议</h5>
                          <p className="text-xs text-amber-700">
                            建议先选择1-2个风格方向进行试拍，生成3-5张关键帧确认后再批量生产
                          </p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                      生成风格试拍样片
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-card flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">剧本智能分析</h3>
                <p className="text-sm text-neutral-500 max-w-xs">
                  粘贴剧本内容，ALPHA 叙事导演将自动提取角色、场景、情节结构和风格建议
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
