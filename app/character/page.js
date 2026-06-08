'use client'

import { useState } from 'react'
import { useStudio } from '../../context/StudioContext'

const tabs = [
  { id: 'dna', name: '视觉DNA', icon: '🧬' },
  { id: 'costume', name: '服化道套装', icon: '👔' },
  { id: 'voice', name: '配音音色', icon: '🎙️' },
  { id: 'ooc', name: 'OOC禁令', icon: '🚫' },
  { id: 'perf', name: '表演等级', icon: '🎭' },
  { id: 'versions', name: '版本管理', icon: '📋' },
]

const voicePresets = [
  { id: 'qingleng', name: '清冷知性女声', desc: '适合御姐、知性角色', gender: 'female' },
  { id: 'tianmei', name: '甜美活泼女声', desc: '适合少女、元气角色', gender: 'female' },
  { id: 'wenrou', name: '温柔治愈女声', desc: '适合温婉、治愈系角色', gender: 'female' },
  { id: 'dichen', name: '低沉磁性男声', desc: '适合成熟、霸道角色', gender: 'male' },
  { id: 'yangguang', name: '阳光少年男声', desc: '适合少年、元气角色', gender: 'male' },
  { id: 'wenzhong', name: '稳重中年男声', desc: '适合长辈、领袖角色', gender: 'male' },
]

export default function CharacterPage() {
  const { characters, selectedCharacter, setSelectedCharacter, addCharacter, updateCharacter, updateVoice, addOocRule, updateOocRule, deleteOocRule, PERF_LEVELS } = useStudio()
  const [activeTab, setActiveTab] = useState('dna')
  const [newOocRule, setNewOocRule] = useState('')
  const [newOocCategory, setNewOocCategory] = useState('性格')
  const [newOocLevel, setNewOocLevel] = useState('medium')
  const [showGenerator, setShowGenerator] = useState(false)
  const [charDescription, setCharDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const currentChar = characters.find(c => c.id === selectedCharacter)

  const getLevelColor = (level) => {
    switch (level) {
      case 'strict': return 'bg-red-50 text-red-600 border-red-200'
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'soft': return 'bg-blue-50 text-blue-600 border-blue-200'
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200'
    }
  }

  const getLevelText = (level) => {
    switch (level) {
      case 'strict': return '严格'
      case 'medium': return '中等'
      case 'soft': return '宽松'
      default: return '中等'
    }
  }

  const handleAddOocRule = () => {
    if (!newOocRule.trim()) return
    addOocRule(selectedCharacter, {
      category: newOocCategory,
      rule: newOocRule,
      level: newOocLevel,
    })
    setNewOocRule('')
  }

  if (!currentChar) return null

  // AI生成角色
  const handleGenerateCharacter = async () => {
    if (!charDescription.trim()) return
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/directors/kappa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: charDescription }),
      })

      const data = await response.json()

      if (data.success && data.content) {
        const charData = data.content
        const newChar = {
          id: `char_${Date.now()}`,
          name: charData.basicInfo?.name || '新角色',
          role: charData.basicInfo?.occupation || '',
          description: charData.description || charDescription,
          avatar: '👤',
          status: 'draft',
          defaultPerfLevel: 'LV2',
          dna: {
            hairstyle: charData.appearance?.hair || '未设置',
            costume: charData.costume?.mainOutfit || '未设置',
            color: charData.costume?.styleKeywords?.[0] || '未设置',
            temperament: charData.dna?.temperament || charData.appearance?.facialFeatures || '未设置',
            era: '现代',
            facialFeatures: charData.appearance?.facialFeatures || '未设置',
            bodyType: charData.appearance?.build || '未设置',
          },
          costumes: [
            {
              id: 'costume_1',
              name: charData.costume?.mainOutfit || '默认服装',
              desc: charData.costume?.accessories || '',
              image: 'https://placehold.co/200x300/e5e7eb/9ca3af?text=服装',
            }
          ],
          voice: {
            name: '未设置',
            speed: 1.0,
            pitch: 0,
          },
          oocRules: charData.oocRules?.map((rule, i) => ({
            id: `ooc_${i}`,
            category: '行为',
            rule: typeof rule === 'string' ? rule : rule.text || '',
            level: 'medium',
          })) || [],
          versions: [
            {
              id: 'v1',
              version: 'v1.0',
              date: new Date().toLocaleDateString('zh-CN'),
              isCurrent: true,
              status: 'draft',
              image: 'https://placehold.co/200x300/e5e7eb/9ca3af?text=角色',
            }
          ],
          promptKeywords: charData.promptKeywords || [],
          visualDNA: charData.visualDNA || [],
        }

        addCharacter(newChar)
        setSelectedCharacter(newChar.id)
        setShowGenerator(false)
        setCharDescription('')
      } else {
        throw new Error(data.error || '生成失败')
      }
    } catch (error) {
      console.error('角色生成失败:', error)
      alert('生成失败: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">角色定妆</h1>
          <p className="text-neutral-500 mt-1 text-sm">KAPPA · 角色导演工作台</p>
        </div>
        <button 
          onClick={() => setShowGenerator(!showGenerator)}
          className="px-4 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium shadow-card hover:shadow-card-hover transition-all"
        >
          ✨ AI生成角色
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* 左侧：角色列表 */}
        <div className="w-72 flex-shrink-0 space-y-3 overflow-y-auto">
          {/* AI生成面板 */}
          {showGenerator && (
            <div className="p-4 bg-brand-50/50 border border-brand-200 rounded-xl">
              <h4 className="font-medium text-neutral-700 text-sm mb-3">KAPPA导演生成角色</h4>
              <textarea
                value={charDescription}
                onChange={(e) => setCharDescription(e.target.value)}
                placeholder="描述角色的外形、性格、身份...

如：28岁女建筑师，清冷知性，短直发，戴细框眼镜，常穿简约风西装"
                className="w-full p-3 border border-brand-200 rounded-lg text-sm focus:outline-none focus:border-brand-400 resize-none h-32 bg-white"
              />
              <button
                onClick={handleGenerateCharacter}
                disabled={isGenerating || !charDescription.trim()}
                className="w-full mt-3 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
              >
                {isGenerating ? '生成中...' : '开始生成'}
              </button>
            </div>
          )}

          {characters.map((char) => (
            <div
              key={char.id}
              onClick={() => setSelectedCharacter(char.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedCharacter === char.id
                  ? 'bg-brand-50 border-2 border-brand-300 shadow-sm'
                  : 'bg-white border border-neutral-200 hover:border-neutral-300 shadow-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-2xl flex-shrink-0">
                  {char.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-800">{char.name}</span>
                    {char.status === 'locked' && (
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs">已锁定</span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">{char.role}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs text-neutral-400">默认表演等级</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PERF_LEVELS[char.defaultPerfLevel]?.color || 'bg-neutral-100 text-neutral-600'}`}>
                  {char.defaultPerfLevel}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：角色详情 */}
        <div className="flex-1 bg-white rounded-xl shadow-card flex flex-col min-h-0">
          {/* Tab 导航 */}
          <div className="p-4 border-b border-neutral-100 flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
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
          <div className="flex-1 overflow-y-auto p-6">
            {/* 视觉DNA */}
            {activeTab === 'dna' && (
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-48 h-64 rounded-xl overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100 flex-shrink-0">
                    <img src={currentChar.versions.find(v => v.isCurrent)?.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-1">{currentChar.name}</h3>
                      <p className="text-sm text-neutral-500">{currentChar.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(currentChar.dna).map(([key, value]) => (
                        <div key={key} className="p-3 bg-neutral-50 rounded-lg">
                          <div className="text-xs text-neutral-400 mb-1">
                            {key === 'hairstyle' && '发型'}
                            {key === 'costume' && '服装'}
                            {key === 'color' && '色系'}
                            {key === 'temperament' && '气质'}
                            {key === 'era' && '时代'}
                            {key === 'facialFeatures' && '面部特征'}
                            {key === 'bodyType' && '体型'}
                          </div>
                          <div className="text-sm text-neutral-700">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 服化道套装 */}
            {activeTab === 'costume' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-700">服装造型套装</h3>
                  <button className="text-sm text-brand-600 hover:text-brand-700">+ 添加套装</button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {currentChar.costumes?.map((costume) => (
                    <div key={costume.id} className="border border-neutral-200 rounded-xl overflow-hidden hover:border-brand-300 transition-colors cursor-pointer">
                      <div className="aspect-[2/3] bg-neutral-100">
                        <img src={costume.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <div className="font-medium text-sm text-neutral-700">{costume.name}</div>
                        <div className="text-xs text-neutral-400 mt-1">{costume.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 配音音色 */}
            {activeTab === 'voice' && (
              <div className="space-y-6">
                <div className="p-4 bg-brand-50/50 rounded-xl border border-brand-100">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🎙️</span>
                    <div>
                      <h3 className="font-semibold text-neutral-800">当前音色</h3>
                      <p className="text-sm text-neutral-500">配音先行模式下，口型同步准确率提升40%+</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-neutral-700">{currentChar.voice?.name || '未设置'}</div>
                      <div className="text-xs text-neutral-400 mt-1">语速: {currentChar.voice?.speed || 1.0}x · 音调: {currentChar.voice?.pitch || 0}</div>
                    </div>
                    <button className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 transition-colors">
                      试听
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-700 mb-4">选择预设音色</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {voicePresets.map((voice) => (
                      <div
                        key={voice.id}
                        onClick={() => updateVoice(selectedCharacter, { ...currentChar.voice, name: voice.name, voiceId: voice.id })}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          currentChar.voice?.name === voice.name
                            ? 'border-brand-400 bg-brand-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-neutral-700 text-sm">{voice.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            voice.gender === 'female' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {voice.gender === 'female' ? '女声' : '男声'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">{voice.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-neutral-700">参数调整</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-neutral-600 mb-2 block">语速</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={currentChar.voice?.speed || 1.0}
                        onChange={(e) => updateVoice(selectedCharacter, { speed: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-400 text-center mt-1">{currentChar.voice?.speed || 1.0}x</div>
                    </div>
                    <div>
                      <label className="text-sm text-neutral-600 mb-2 block">音调</label>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.5"
                        value={currentChar.voice?.pitch || 0}
                        onChange={(e) => updateVoice(selectedCharacter, { pitch: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-xs text-neutral-400 text-center mt-1">{currentChar.voice?.pitch || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OOC禁令 */}
            {activeTab === 'ooc' && (
              <div className="space-y-6">
                <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <h3 className="font-semibold text-neutral-800">OOC 行为禁令</h3>
                      <p className="text-sm text-neutral-500">禁止角色出现不符合人设的行为，生成时自动校验</p>
                    </div>
                  </div>
                </div>

                {/* 添加规则 */}
                <div className="flex gap-3">
                  <select
                    value={newOocCategory}
                    onChange={(e) => setNewOocCategory(e.target.value)}
                    className="px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
                  >
                    <option>性格</option>
                    <option>行为</option>
                    <option>表情</option>
                    <option>语言</option>
                    <option>气质</option>
                    <option>其他</option>
                  </select>
                  <select
                    value={newOocLevel}
                    onChange={(e) => setNewOocLevel(e.target.value)}
                    className="px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white"
                  >
                    <option value="strict">严格</option>
                    <option value="medium">中等</option>
                    <option value="soft">宽松</option>
                  </select>
                  <input
                    type="text"
                    value={newOocRule}
                    onChange={(e) => setNewOocRule(e.target.value)}
                    placeholder="输入禁令规则..."
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-brand-400"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddOocRule()}
                  />
                  <button
                    onClick={handleAddOocRule}
                    className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 transition-colors"
                  >
                    添加
                  </button>
                </div>

                {/* 规则列表 */}
                <div className="space-y-3">
                  {currentChar.oocRules?.map((rule, index) => (
                    <div key={rule.id} className="p-4 bg-white border border-neutral-200 rounded-xl flex items-start gap-4 group">
                      <span className="text-neutral-300 text-sm font-mono w-6">{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">{rule.category}</span>
                          <span className={`px-2 py-0.5 rounded text-xs border ${getLevelColor(rule.level)}`}>
                            {getLevelText(rule.level)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-700">{rule.rule}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => deleteOocRule(selectedCharacter, rule.id)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 表演等级 */}
            {activeTab === 'perf' && (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎭</span>
                    <div>
                      <h3 className="font-semibold text-neutral-800">默认表演等级</h3>
                      <p className="text-sm text-neutral-500">该角色在分镜中的默认表演难度，可在具体镜头中调整</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(PERF_LEVELS).map(([key, level]) => (
                    <div
                      key={key}
                      onClick={() => updateCharacter(selectedCharacter, { defaultPerfLevel: key })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        currentChar.defaultPerfLevel === key
                          ? 'border-brand-400 bg-brand-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-neutral-800">{level.label}</span>
                        <span className="text-xs text-neutral-400">×{level.costMult}</span>
                      </div>
                      <p className="text-xs text-neutral-500">{level.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl">
                  <h4 className="font-medium text-neutral-700 mb-3 text-sm">表演等级说明</h4>
                  <div className="space-y-2 text-xs text-neutral-500">
                    <p>• LV1：适合背景板、路人、无台词角色，AI生成最稳定</p>
                    <p>• LV2：常规角色戏，有简单动作和台词，主流模型均可胜任</p>
                    <p>• LV3：需要情绪表达和微表情，推荐使用万相/Seedance等优质模型</p>
                    <p>• LV4：高难度内心戏/长镜头，AI生成难度大，建议真人绿幕补拍+后期合成</p>
                  </div>
                </div>
              </div>
            )}

            {/* 版本管理 */}
            {activeTab === 'versions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-700">版本历史</h3>
                  <button className="text-sm text-brand-600 hover:text-brand-700">+ 生成新版本</button>
                </div>
                <div className="space-y-3">
                  {currentChar.versions?.map((ver, index) => (
                    <div
                      key={ver.id}
                      className={`p-4 rounded-xl border-2 flex items-center gap-4 ${
                        ver.isCurrent
                          ? 'border-brand-400 bg-brand-50'
                          : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                        <img src={ver.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-700">{ver.version}</span>
                          {ver.isCurrent && (
                            <span className="px-2 py-0.5 bg-brand-500 text-white text-xs rounded-full">当前版本</span>
                          )}
                          {ver.status === 'locked' && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">已锁定</span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">{ver.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!ver.isCurrent && (
                          <button className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50">
                            设为当前
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
