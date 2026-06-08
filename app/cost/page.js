'use client'

import { useState, useMemo } from 'react'
import { useStudio } from '../../context/StudioContext'

const modelCosts = {
  'seedance-2': { name: 'Seedance 2.0', perSecond: 0.15, perImage: 0.08, quality: '高' },
  'kling-35': { name: '可灵3.5', perSecond: 0.12, perImage: 0.06, quality: '中高' },
  'wan-27': { name: '万相Wan 2.7', perSecond: 0.18, perImage: 0.10, quality: '高' },
  'nb-pro': { name: 'NB Pro', perSecond: 0, perImage: 0.15, quality: '极高' },
  'gpt-image': { name: 'GPT Image 2', perSecond: 0, perImage: 0.20, quality: '极高' },
}

const dubCosts = {
  'basic': { name: '基础配音', perMinute: 5 },
  'pro': { name: '专业配音', perMinute: 15 },
  'clone': { name: '声音克隆', perMinute: 30 },
}

export default function CostPage() {
  const { storyboards, characters, scenes, PERF_LEVELS, MODEL_RECOMMEND } = useStudio()
  const [selectedModel, setSelectedModel] = useState('seedance-2')
  const [dubMode, setDubMode] = useState('basic')
  const [perfLevel, setPerfLevel] = useState('LV2')

  // 计算当前项目成本
  const costBreakdown = useMemo(() => {
    const totalSeconds = storyboards.reduce((sum, s) => sum + parseInt(s.duration), 0)
    const model = modelCosts[selectedModel] || modelCosts['seedance-2']
    const perfMult = PERF_LEVELS[perfLevel]?.costMult || 1.0
    const sLevelCount = storyboards.filter(s => s.isSLevel).length
    
    // 视频生成成本
    const videoCost = totalSeconds * model.perSecond * perfMult
    
    // 图片（分镜预览）成本
    const imageCost = storyboards.length * model.perImage * 1.5 // 每个镜头1.5张图（含变体）
    
    // 配音成本
    const dubMinutes = totalSeconds / 60 * 0.6 // 假设60%时间有对白
    const dubCost = dubMinutes * dubCosts[dubMode].perMinute
    
    // S级镜头额外成本
    const sLevelExtra = sLevelCount * 5 // 每个S级额外5元后期成本
    
    // 管理费
    const platformFee = (videoCost + imageCost + dubCost + sLevelExtra) * 0.15
    
    const total = videoCost + imageCost + dubCost + sLevelExtra + platformFee

    return {
      totalSeconds,
      totalMinutes: (totalSeconds / 60).toFixed(1),
      totalShots: storyboards.length,
      sLevelCount,
      videoCost: videoCost.toFixed(2),
      imageCost: imageCost.toFixed(2),
      dubCost: dubCost.toFixed(2),
      sLevelExtra: sLevelExtra.toFixed(2),
      platformFee: platformFee.toFixed(2),
      total: total.toFixed(2),
      perSecond: (total / totalSeconds).toFixed(3),
      perMinute: (total / (totalSeconds / 60)).toFixed(2),
    }
  }, [storyboards, selectedModel, perfLevel, dubMode, PERF_LEVELS])

  // 多方案对比
  const planComparisons = useMemo(() => [
    {
      name: '经济方案',
      model: 'kling-35',
      perfLevel: 'LV1',
      dub: 'basic',
      total: (storyboards.length * 0.06 * 1.0 + storyboards.reduce((s, x) => s + parseInt(x.duration), 0) * 0.12 * 1.0 * 0.6).toFixed(2),
      quality: '基础',
      recommended: false,
    },
    {
      name: '平衡方案',
      model: 'seedance-2',
      perfLevel: 'LV2',
      dub: 'basic',
      total: costBreakdown.total,
      quality: '良好',
      recommended: true,
    },
    {
      name: '品质方案',
      model: 'wan-27',
      perfLevel: 'LV3',
      dub: 'pro',
      total: (storyboards.length * 0.10 * 1.5 + storyboards.reduce((s, x) => s + parseInt(x.duration), 0) * 0.18 * 1.8 * 0.7).toFixed(2),
      quality: '优秀',
      recommended: false,
    },
    {
      name: '影院级方案',
      model: 'nb-pro',
      perfLevel: 'LV4',
      dub: 'clone',
      total: (storyboards.length * 0.15 * 2.0 + storyboards.reduce((s, x) => s + parseInt(x.duration), 0) * 0.25 * 2.5 * 0.8).toFixed(2),
      quality: '极佳',
      recommended: false,
    },
  ], [storyboards, costBreakdown.total])

  // 成本占比数据
  const costDistribution = [
    { name: '视频生成', value: parseFloat(costBreakdown.videoCost), color: 'bg-brand-500' },
    { name: '分镜预览图', value: parseFloat(costBreakdown.imageCost), color: 'bg-blue-500' },
    { name: '配音', value: parseFloat(costBreakdown.dubCost), color: 'bg-purple-500' },
    { name: 'S级后期', value: parseFloat(costBreakdown.sLevelExtra), color: 'bg-red-500' },
    { name: '平台服务费', value: parseFloat(costBreakdown.platformFee), color: 'bg-neutral-400' },
  ]

  const maxCost = Math.max(...costDistribution.map(d => d.value))

  return (
    <div className="h-full flex flex-col">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">成本中心</h1>
          <p className="text-neutral-500 mt-1 text-sm">SIGMA · 财务总监工作台</p>
        </div>
        <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50">
          导出报表
        </button>
      </div>

      {/* 顶部核心指标 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="text-xs text-neutral-500 mb-1">预估总成本</div>
          <div className="text-3xl font-bold text-neutral-800">¥ {costBreakdown.total}</div>
          <div className="text-xs text-neutral-400 mt-1">约 {costBreakdown.perMinute} 元/分钟</div>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="text-xs text-neutral-500 mb-1">总镜头数</div>
          <div className="text-3xl font-bold text-blue-600">{costBreakdown.totalShots}</div>
          <div className="text-xs text-neutral-400 mt-1">含 {costBreakdown.sLevelCount} 个S级</div>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="text-xs text-neutral-500 mb-1">总时长</div>
          <div className="text-3xl font-bold text-emerald-600">{costBreakdown.totalMinutes}</div>
          <div className="text-xs text-neutral-400 mt-1">分钟</div>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="text-xs text-neutral-500 mb-1">预算使用</div>
          <div className="text-3xl font-bold text-amber-600">23%</div>
          <div className="text-xs text-neutral-400 mt-1">¥ 10,000 预算内</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* 左侧：成本明细 */}
        <div className="col-span-8 space-y-6">
          {/* 成本构成 */}
          <div className="bg-white rounded-xl shadow-card p-5">
            <h3 className="font-semibold text-neutral-800 mb-4">成本构成</h3>
            <div className="space-y-4">
              {costDistribution.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm text-neutral-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-800">¥ {item.value.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(item.value / maxCost) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 方案对比 */}
          <div className="bg-white rounded-xl shadow-card p-5">
            <h3 className="font-semibold text-neutral-800 mb-4">方案对比</h3>
            <div className="grid grid-cols-4 gap-3">
              {planComparisons.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                    plan.recommended
                      ? 'border-brand-400 bg-brand-50/50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <span className="px-2 py-0.5 bg-brand-500 text-white text-xs rounded-full font-medium">
                        推荐
                      </span>
                    </div>
                  )}
                  <h4 className="font-semibold text-neutral-800 text-sm mb-2 mt-1">{plan.name}</h4>
                  <div className="text-2xl font-bold text-neutral-800 mb-2">¥{plan.total}</div>
                  <div className="space-y-1.5 text-xs text-neutral-500">
                    <div className="flex justify-between">
                      <span>生成模型</span>
                      <span className="text-neutral-700">{modelCosts[plan.model]?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>表演等级</span>
                      <span className="text-neutral-700">{plan.perfLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>配音质量</span>
                      <span className="text-neutral-700">{dubCosts[plan.dub]?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>成片质量</span>
                      <span className="text-neutral-700">{plan.quality}</span>
                    </div>
                  </div>
                  <button
                    className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      plan.recommended
                        ? 'bg-brand-500 text-white hover:bg-brand-600'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    使用此方案
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 镜头成本明细 */}
          <div className="bg-white rounded-xl shadow-card p-5">
            <h3 className="font-semibold text-neutral-800 mb-4">镜头成本明细</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-2 text-xs font-medium text-neutral-500">镜头</th>
                    <th className="text-left py-3 px-2 text-xs font-medium text-neutral-500">场景</th>
                    <th className="text-center py-3 px-2 text-xs font-medium text-neutral-500">时长</th>
                    <th className="text-center py-3 px-2 text-xs font-medium text-neutral-500">等级</th>
                    <th className="text-center py-3 px-2 text-xs font-medium text-neutral-500">表演</th>
                    <th className="text-center py-3 px-2 text-xs font-medium text-neutral-500">模型</th>
                    <th className="text-right py-3 px-2 text-xs font-medium text-neutral-500">预估成本</th>
                  </tr>
                </thead>
                <tbody>
                  {storyboards.slice(0, 8).map((shot) => {
                    const model = modelCosts[shot.modelRec || selectedModel] || modelCosts['seedance-2']
                    const perfMult = PERF_LEVELS[shot.perfLevel || perfLevel]?.costMult || 1.0
                    const cost = (parseInt(shot.duration) * model.perSecond * perfMult).toFixed(2)
                    
                    return (
                      <tr key={shot.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                        <td className="py-3 px-2">
                          <div className="text-sm text-neutral-800 font-medium">{shot.shotNo}</div>
                          <div className="text-xs text-neutral-500">{shot.title}</div>
                        </td>
                        <td className="py-3 px-2 text-sm text-neutral-600">{shot.scene}</td>
                        <td className="py-3 px-2 text-center text-sm text-neutral-600">{shot.duration}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            shot.level === 'S' ? 'bg-red-100 text-red-600' :
                            shot.level === 'A' ? 'bg-brand-100 text-brand-600' :
                            'bg-neutral-100 text-neutral-600'
                          }`}>
                            {shot.level}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-xs text-neutral-600">{shot.perfLevel || 'LV2'}</span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-xs text-neutral-600">
                            {MODEL_RECOMMEND.video.find(m => m.id === shot.modelRec)?.name || 'Seedance 2.0'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right text-sm font-medium text-neutral-800">¥{cost}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {storyboards.length > 8 && (
              <div className="mt-3 text-center">
                <button className="text-sm text-brand-600 hover:text-brand-700">
                  查看全部 {storyboards.length} 个镜头 →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：参数调节 + 预算预警 */}
        <div className="col-span-4 space-y-6">
          {/* 成本计算器 */}
          <div className="bg-white rounded-xl shadow-card p-5">
            <h3 className="font-semibold text-neutral-800 mb-4">成本计算器</h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm text-neutral-600 mb-2 block">生成模型</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-400"
                >
                  {Object.entries(modelCosts).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.name} - ¥{val.perSecond}/秒
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-neutral-600 mb-2 block">表演等级</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.entries(PERF_LEVELS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setPerfLevel(key)}
                      className={`py-2 rounded-lg text-xs font-medium transition-all ${
                        perfLevel === key
                          ? 'bg-brand-500 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-neutral-400 mt-1.5">成本系数 ×{PERF_LEVELS[perfLevel]?.costMult}</div>
              </div>

              <div>
                <label className="text-sm text-neutral-600 mb-2 block">配音方案</label>
                <div className="space-y-2">
                  {Object.entries(dubCosts).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setDubMode(key)}
                      className={`w-full p-3 rounded-lg text-left border-2 transition-all flex items-center justify-between ${
                        dubMode === key
                          ? 'border-brand-400 bg-brand-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <span className="text-sm font-medium text-neutral-700">{val.name}</span>
                      <span className="text-xs text-neutral-500">¥{val.perMinute}/分钟</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 预算预警 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-card p-5 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">预算预警</h3>
                <p className="text-xs text-amber-600">当前预算使用正常</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-amber-700">已使用</span>
                  <span className="font-medium text-amber-800">¥ {costBreakdown.total}</span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-amber-600">总预算 ¥10,000</span>
                <span className="text-amber-700 font-medium">剩 77%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-amber-200/50">
              <div className="text-xs text-amber-600 mb-2">💡 成本优化建议</div>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• 非关键镜头可降低表演等级至LV2</li>
                <li>• 批量生成可享阶梯折扣</li>
                <li>• 推荐使用平衡方案，性价比最高</li>
              </ul>
            </div>
          </div>

          {/* 计费说明 */}
          <div className="bg-white rounded-xl shadow-card p-5">
            <h3 className="font-semibold text-neutral-800 mb-3 text-sm">计费说明</h3>
            <div className="space-y-2 text-xs text-neutral-500">
              <p>• 视频生成按实际生成秒数计费</p>
              <p>• 表演等级影响生成难度，对应成本系数</p>
              <p>• S级镜头额外收取后期合成费用</p>
              <p>• 平台服务费为总费用的15%</p>
              <p>• 实际费用以生成结果为准</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
