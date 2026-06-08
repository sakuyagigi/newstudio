'use client'

import { useState } from 'react'

// 导演数据模板
const directorData = {
  alpha: {
    name: 'ALPHA',
    fullName: 'ALPHA · 叙事导演',
    avatar: '🎭',
    role: '剧本分析 / 人物弧光 / 合规审查',
    description: '擅长深度拆解剧本结构，挖掘人物内心弧光，确保故事逻辑自洽。同时负责内容合规审查，规避风险。',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    skills: [
      { name: '剧本深度分析', level: 95 },
      { name: '人物弧光设计', level: 92 },
      { name: '情节逻辑校验', level: 88 },
      { name: '合规风险审查', level: 90 },
      { name: '对话台词优化', level: 85 },
    ],
    stats: {
      projects: 47,
      scripts: 128,
      avgRating: 4.8,
      avgTime: '12分钟',
    },
    recentWorks: [
      { id: 1, name: '《星河旅人》第3集剧本分析', time: '2小时前', status: 'completed' },
      { id: 2, name: '《城市记忆》第1集深度分析', time: '5小时前', status: 'completed' },
      { id: 3, name: '《时光杂货店》第5集审查', time: '昨天', status: 'completed' },
    ],
  },
  beta: {
    name: 'BETA',
    fullName: 'BETA · 视觉导演',
    avatar: '🎨',
    role: '视觉风格 / 色彩体系 / 道具设计',
    description: '负责整部作品的视觉语言设计，从主风格定调到色彩体系构建，再到细节道具设计，确保视觉一致性。',
    color: 'from-purple-400 to-indigo-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    skills: [
      { name: '视觉风格设计', level: 96 },
      { name: '色彩体系构建', level: 94 },
      { name: '场景概念设计', level: 90 },
      { name: '道具设计', level: 85 },
      { name: '光影设计', level: 92 },
    ],
    stats: {
      projects: 52,
      concepts: 268,
      avgRating: 4.9,
      avgTime: '15分钟',
    },
    recentWorks: [
      { id: 1, name: '《星河旅人》赛博朋克风格定调', time: '3小时前', status: 'completed' },
      { id: 2, name: '异星荒原地貌概念设计', time: '昨天', status: 'completed' },
      { id: 3, name: '太空酒吧场景概念图', time: '2天前', status: 'completed' },
    ],
  },
  gamma: {
    name: 'GAMMA',
    fullName: 'GAMMA · 节奏导演',
    avatar: '⏱️',
    role: '分镜设计 / 空间调度 / 镜头语言',
    description: '精通影视语言和剪辑节奏，擅长通过镜头调度和场景衔接掌控叙事节奏，让故事张弛有度。',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    skills: [
      { name: '分镜设计', level: 95 },
      { name: '空间调度', level: 90 },
      { name: '节奏把控', level: 93 },
      { name: '镜头语言', level: 94 },
      { name: '转场设计', level: 88 },
    ],
    stats: {
      projects: 45,
      storyboards: 1560,
      avgRating: 4.7,
      avgTime: '20分钟',
    },
    recentWorks: [
      { id: 1, name: '《时光杂货店》开场段落分镜', time: '30分钟前', status: 'working' },
      { id: 2, name: '《星河旅人》动作戏分镜优化', time: '昨天', status: 'completed' },
      { id: 3, name: '对话戏镜头调度方案', time: '2天前', status: 'completed' },
    ],
  },
  kappa: {
    name: 'KAPPA',
    fullName: 'KAPPA · 角色导演',
    avatar: '👤',
    role: '角色定妆 / 服化道 / 一致性把控',
    description: '专注角色视觉设计，从面部特征到服装道具，确保角色形象立体饱满且全片风格统一。',
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    skills: [
      { name: '角色定妆设计', level: 96 },
      { name: '服化道设计', level: 93 },
      { name: '角色一致性', level: 95 },
      { name: '表情动作设计', level: 88 },
      { name: '角色档案构建', level: 90 },
    ],
    stats: {
      projects: 48,
      characters: 234,
      avgRating: 4.8,
      avgTime: '10分钟',
    },
    recentWorks: [
      { id: 1, name: '林远·夜行衣造型设计', time: '1天前', status: 'completed' },
      { id: 2, name: '苏晴·宴会礼服设计', time: '1天前', status: 'completed' },
      { id: 3, name: '舰长角色定妆', time: '2天前', status: 'completed' },
    ],
  },
  epsilon: {
    name: 'EPSILON',
    fullName: 'EPSILON · AI制片',
    avatar: '📊',
    role: '资源调度 / 风险预警 / 进度管理',
    description: '智能制片管家，统筹所有导演的工作调度，优化资源分配，预警风险，确保项目按时交付。',
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    skills: [
      { name: '任务调度优化', level: 94 },
      { name: '进度追踪', level: 96 },
      { name: '风险预警', level: 92 },
      { name: '资源分配', level: 90 },
      { name: '多项目并行', level: 88 },
    ],
    stats: {
      projects: 56,
      onTimeRate: '94%',
      avgSaving: '28%',
      tasksManaged: 2340,
    },
    recentWorks: [
      { id: 1, name: '《时光杂货店》分镜并行调度', time: '30分钟前', status: 'working' },
      { id: 2, name: '《星河旅人》进度规划', time: '3小时前', status: 'completed' },
      { id: 3, name: '4月项目资源优化方案', time: '3天前', status: 'completed' },
    ],
  },
  sigma: {
    name: 'SIGMA',
    fullName: 'SIGMA · 财务导演',
    avatar: '💰',
    role: '成本核算 / 方案建模 / ROI分析',
    description: '智能财务管家，精准计算每一分成本，提供多档预算方案，最大化投入产出比。',
    color: 'from-brand-400 to-brand-600',
    bgColor: 'bg-brand-50',
    textColor: 'text-brand-600',
    skills: [
      { name: '成本精准核算', level: 95 },
      { name: '多方案对比', level: 93 },
      { name: 'ROI分析', level: 90 },
      { name: '预算优化', level: 94 },
      { name: '实时账单', level: 96 },
    ],
    stats: {
      projects: 56,
      totalSaved: '¥28.5万',
      avgSaving: '22%',
      accuracy: '99.2%',
    },
    recentWorks: [
      { id: 1, name: '《星河旅人》三档预算方案', time: '2天前', status: 'completed' },
      { id: 2, name: 'Q1成本分析报告', time: '4天前', status: 'completed' },
      { id: 3, name: '模型切换成本对比', time: '1周前', status: 'completed' },
    ],
  },
}

export default function DirectorPage({ directorKey = 'alpha' }) {
  const director = directorData[directorKey] || directorData.alpha
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      {/* 导演名片 */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className={`h-32 bg-gradient-to-r ${director.color}`}></div>
        <div className="px-8 pb-6 -mt-12">
          <div className="flex items-end gap-6">
            <div className={`w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center text-4xl border-4 border-white`}>
              {director.avatar}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-neutral-800">{director.fullName}</h1>
              <p className="text-neutral-500 mt-1">{director.role}</p>
            </div>
            <div className="flex items-center gap-3 pb-2">
              <button className={`px-4 py-2 ${director.bgColor} ${director.textColor} rounded-lg text-sm font-medium`}>
                指派任务
              </button>
              <button className="px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50">
                查看设置
              </button>
            </div>
          </div>
          <p className="text-sm text-neutral-500 mt-4 max-w-3xl">{director.description}</p>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-card w-fit">
        {[
          { id: 'overview', name: '能力概览' },
          { id: 'works', name: '作品记录' },
          { id: 'settings', name: '参数设置' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === tab.id ? `${director.bgColor} ${director.textColor} font-medium` : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-12 gap-6">
          {/* 能力值 */}
          <div className="col-span-8 bg-white rounded-xl shadow-card p-6">
            <h2 className="font-semibold text-neutral-800 mb-5">能力维度</h2>
            <div className="space-y-5">
              {director.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">{skill.name}</span>
                    <span className="text-sm font-medium text-neutral-700">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${director.color} rounded-full transition-all duration-500`}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 统计数据 */}
          <div className="col-span-4 bg-white rounded-xl shadow-card p-6">
            <h2 className="font-semibold text-neutral-800 mb-5">工作数据</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(director.stats).map(([key, value]) => (
                <div key={key} className={`${director.bgColor} rounded-xl p-4 text-center`}>
                  <div className={`text-2xl font-bold ${director.textColor} mb-1`}>{value}</div>
                  <div className="text-xs text-neutral-500">
                    {key === 'projects' ? '参与项目' :
                     key === 'scripts' ? '分析剧本' :
                     key === 'concepts' ? '概念设计' :
                     key === 'storyboards' ? '分镜数量' :
                     key === 'characters' ? '角色设计' :
                     key === 'avgRating' ? '平均评分' :
                     key === 'avgTime' ? '平均耗时' :
                     key === 'onTimeRate' ? '准时率' :
                     key === 'avgSaving' ? '平均节省' :
                     key === 'tasksManaged' ? '管理任务' :
                     key === 'totalSaved' ? '累计节省' :
                     key === 'accuracy' ? '准确率' : key}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'works' && (
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-semibold text-neutral-800 mb-5">近期作品</h2>
          <div className="space-y-3">
            {director.recentWorks.map((work) => (
              <div key={work.id} className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl hover:border-neutral-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${director.bgColor} flex items-center justify-center text-xl`}>
                    {director.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700">{work.name}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{work.time}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  work.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {work.status === 'completed' ? '已完成' : '进行中'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="font-semibold text-neutral-800 mb-5">参数设置</h2>
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-2 block">输出风格</label>
              <select className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400">
                <option>专业详细版</option>
                <option>简洁精华版</option>
                <option>创意发散版</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-2 block">创意程度</label>
              <div className="flex items-center gap-4">
                <span className="text-xs text-neutral-400">保守</span>
                <input type="range" className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer" />
                <span className="text-xs text-neutral-400">创意</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-2 block">默认模型</label>
              <select className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400">
                <option>GPT-4 Turbo</option>
                <option>Claude 3 Opus</option>
                <option>GPT-3.5 Turbo</option>
              </select>
            </div>
            <button className={`px-6 py-2.5 ${director.bgColor} ${director.textColor} rounded-lg text-sm font-medium`}>
              保存设置
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
