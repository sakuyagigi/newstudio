'use client'

import { useState } from 'react'

// 制作阶段
const stages = [
  { name: '剧本分析', status: 'completed', icon: '📝', director: 'ALPHA' },
  { name: '角色定妆', status: 'completed', icon: '👤', director: 'KAPPA' },
  { name: '场景设定', status: 'active', icon: '🏔️', director: 'BETA' },
  { name: '分镜生成', status: 'pending', icon: '🎨', director: 'GAMMA' },
  { name: '视频渲染', status: 'pending', icon: '🎞️', director: 'EPSILON' },
  { name: '质量质检', status: 'pending', icon: '✅', director: '质检台' },
  { name: '成片交付', status: 'pending', icon: '✨', director: '总秘书' },
]

// 项目列表
const projects = [
  {
    id: 1,
    name: '星河旅人',
    episode: '第3集',
    stage: '场景设定',
    progress: 45,
    updateTime: '2小时前',
    characters: 8,
    scenes: 12,
    shots: 0,
    status: '进行中',
    color: 'from-brand-300 to-brand-500',
    priority: 'high',
  },
  {
    id: 2,
    name: '城市记忆',
    episode: '第1集',
    stage: '剧本分析',
    progress: 30,
    updateTime: '5小时前',
    characters: 5,
    scenes: 8,
    shots: 0,
    status: '进行中',
    color: 'from-blue-300 to-blue-500',
    priority: 'normal',
  },
  {
    id: 3,
    name: '森林秘境',
    episode: '全12集',
    stage: '成片交付',
    progress: 100,
    updateTime: '1天前',
    characters: 6,
    scenes: 15,
    shots: 320,
    status: '已完成',
    color: 'from-emerald-300 to-emerald-500',
    priority: 'low',
  },
  {
    id: 4,
    name: '时光杂货店',
    episode: '第5集',
    stage: '分镜生成',
    progress: 68,
    updateTime: '30分钟前',
    characters: 10,
    scenes: 20,
    shots: 156,
    status: '进行中',
    priority: 'high',
    color: 'from-rose-300 to-rose-500',
  },
]

// 六导演状态
const directors = [
  { id: 'alpha', name: 'ALPHA', role: '叙事导演', status: 'working', statusText: '分析中', progress: 65, task: '《城市记忆》剧本深度分析', avatar: '🎭', specialty: '剧本拆解/人物弧光/合规审查' },
  { id: 'beta', name: 'BETA', role: '视觉导演', status: 'working', statusText: '创作中', progress: 42, task: '《星河旅人》场景概念设计', avatar: '🎨', specialty: '视觉风格/色彩体系/道具设计' },
  { id: 'gamma', name: 'GAMMA', role: '节奏导演', status: 'idle', statusText: '待命', progress: 0, task: '等待分配', avatar: '⏱️', specialty: '分镜设计/空间调度/镜头语言' },
  { id: 'kappa', name: 'KAPPA', role: '角色导演', status: 'idle', statusText: '待命', progress: 0, task: '等待分配', avatar: '👤', specialty: '角色定妆/服化道/一致性把控' },
  { id: 'epsilon', name: 'EPSILON', role: 'AI制片', status: 'working', statusText: '调度中', progress: 78, task: '《时光杂货店》分镜并行调度', avatar: '📊', specialty: '资源调度/风险预警/进度管理' },
  { id: 'sigma', name: 'SIGMA', role: '财务导演', status: 'idle', statusText: '待命', progress: 0, task: '等待分配', avatar: '💰', specialty: '成本核算/方案建模/ROI分析' },
]

// 中台导演
const staffDirectors = [
  { name: '质检台', role: '质量审核', status: 'idle', avatar: '✅' },
  { name: '情报官', role: '竞品调研', status: 'working', avatar: '🔍' },
  { name: '安全巡检', role: '合规安全', status: 'working', avatar: '🛡️' },
  { name: '研发台', role: '工具开发', status: 'idle', avatar: '⚙️' },
  { name: '总秘书', role: '归档整理', status: 'idle', avatar: '📋' },
  { name: '方案导演', role: '对客包装', status: 'idle', avatar: '📑' },
]

const getStatusStyle = (status) => {
  switch (status) {
    case 'working':
      return { bg: 'bg-brand-50 text-brand-600', ring: '#d4a574', dot: 'bg-brand-400', bar: 'bg-brand-400' }
    case 'completed':
      return { bg: 'bg-emerald-50 text-emerald-600', ring: '#10b981', dot: 'bg-emerald-500', bar: 'bg-emerald-500' }
    case 'idle':
      return { bg: 'bg-neutral-100 text-neutral-500', ring: '#a3a3a3', dot: 'bg-neutral-400', bar: 'bg-neutral-300' }
    case 'issue':
      return { bg: 'bg-red-50 text-red-600', ring: '#ef4444', dot: 'bg-red-500', bar: 'bg-red-500' }
    default:
      return { bg: 'bg-neutral-100 text-neutral-500', ring: '#a3a3a3', dot: 'bg-neutral-400', bar: 'bg-neutral-300' }
  }
}

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-50 text-red-600'
    case 'normal':
      return 'bg-brand-50 text-brand-600'
    case 'low':
      return 'bg-neutral-100 text-neutral-500'
    default:
      return 'bg-neutral-100 text-neutral-500'
  }
}

const getPriorityText = (priority) => {
  switch (priority) {
    case 'high': return '紧急'
    case 'normal': return '正常'
    case 'low': return '低优'
    default: return '正常'
  }
}

export default function Home() {
  const [selectedDirector, setSelectedDirector] = useState(null)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">项目指挥中心</h1>
          <p className="text-neutral-500 mt-1 text-sm">墨枢光影AI制片系统 · 12位导演协同作业</p>
        </div>
        <button className="px-4 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium shadow-card hover:shadow-card-hover transition-all">
          + 新建项目
        </button>
      </div>

      {/* 七阶段进度条 */}
      <section className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-5 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-400 rounded-full"></span>
          《星河旅人》制作进度
        </h2>
        <div className="flex items-center justify-between relative">
          {/* 连接线 */}
          <div className="absolute top-7 left-8 right-8 h-0.5 bg-neutral-100 -z-0">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: '35%' }}></div>
          </div>

          {stages.map((stage, index) => {
            const isCompleted = stage.status === 'completed'
            const isActive = stage.status === 'active'
            return (
              <div key={stage.name} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-sm text-xl transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white'
                      : isActive
                      ? 'bg-gradient-to-br from-brand-300 to-brand-500 text-white breathing'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {isCompleted ? '✓' : stage.icon}
                </div>
                <span className="text-xs font-medium text-neutral-600">{stage.name}</span>
                <span className={`text-xs mt-0.5 ${isActive ? 'text-brand-500 font-medium' : isCompleted ? 'text-emerald-500' : 'text-neutral-400'}`}>
                  {stage.director}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* 左侧：项目列表 */}
        <div className="col-span-8 space-y-6">
          {/* 项目卡片 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-400 rounded-full"></span>
                全部项目
              </h2>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50">
                  全部状态
                </button>
                <button className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50">
                  按时间
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {projects.map((project) => {
                const statusColor = project.status === '已完成' ? 'text-emerald-600 bg-emerald-50' :
                                 project.status === '有问题' ? 'text-red-600 bg-red-50' :
                                 project.status === '待启动' ? 'text-neutral-500 bg-neutral-100' : 'text-brand-600 bg-brand-50'
                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl shadow-card overflow-hidden cursor-pointer card-hover group"
                  >
                    <div className={`h-24 bg-gradient-to-br ${project.color} relative flex items-center justify-center`}>
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 ${getPriorityBadge(project.priority)} rounded-full text-xs font-medium`}>
                          {getPriorityText(project.priority)}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 ${statusColor} rounded-full text-xs font-medium`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="text-white text-4xl font-bold opacity-30 group-hover:opacity-40 transition-opacity">
                        {project.name.charAt(0)}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-neutral-800">{project.name}</h3>
                        <span className="text-xs text-neutral-400">{project.episode}</span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-neutral-400 mb-1">
                          <span>{project.stage}</span>
                          <span className="font-medium text-neutral-500">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full progress-gradient rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-neutral-400 pt-3 border-t border-neutral-50">
                        <span className="flex items-center gap-1">
                          <span>👤</span>
                          {project.characters}角色
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🏔️</span>
                          {project.scenes}场景
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🎬</span>
                          {project.shots}镜
                        </span>
                        <span className="ml-auto flex items-center gap-1">
                          <span>⏰</span>
                          {project.updateTime}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 快捷操作区 */}
          <section className="bg-white rounded-xl shadow-card p-5">
            <h2 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-400 rounded-full"></span>
              快捷入口
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { name: '新建剧本', icon: '📝', desc: '导入或粘贴剧本', color: 'bg-brand-50 text-brand-600' },
                { name: '生成角色', icon: '👤', desc: 'AI角色定妆', color: 'bg-purple-50 text-purple-600' },
                { name: '创建分镜', icon: '🎨', desc: '一键拆分镜', color: 'bg-blue-50 text-blue-600' },
                { name: '风格预览', icon: '✨', desc: '试拍一张看效果', color: 'bg-emerald-50 text-emerald-600' },
              ].map((item) => (
                <button
                  key={item.name}
                  className={`p-4 rounded-xl ${item.color} text-left hover:opacity-80 transition-opacity`}
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs opacity-70 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* 右侧：导演组状态 */}
        <div className="col-span-4 space-y-6">
          {/* 一线主创导演 */}
          <section className="bg-white rounded-xl shadow-card p-5">
            <h2 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-400 rounded-full"></span>
              主创导演组
            </h2>
            <div className="space-y-3">
              {directors.map((director) => {
                const style = getStatusStyle(director.status)
                return (
                  <div
                    key={director.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedDirector(selectedDirector === director.id ? null : director.id)}
                  >
                    <div className={`w-11 h-11 rounded-full ${style.bg} flex items-center justify-center text-xl flex-shrink-0 ${director.status === 'working' ? 'breathing' : ''}`}>
                      {director.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-700 text-sm">{director.name}</span>
                        <span className="text-xs text-neutral-400">{director.role}</span>
                      </div>
                      <div className="text-xs text-neutral-500 truncate mt-0.5">{director.task}</div>
                      {selectedDirector === director.id && (
                        <div className="text-xs text-neutral-400 mt-2 pt-2 border-t border-neutral-100">
                          擅长：{director.specialty}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.bg}`}>
                        {director.statusText}
                      </span>
                      {director.progress > 0 && (
                        <span className="text-xs text-neutral-400">{director.progress}%</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 中台支持组 */}
          <section className="bg-white rounded-xl shadow-card p-5">
            <h2 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-neutral-300 rounded-full"></span>
              中台支持组
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {staffDirectors.map((staff) => {
                const isWorking = staff.status === 'working'
                return (
                  <div
                    key={staff.name}
                    className="p-3 rounded-xl text-center hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg mb-1.5 ${isWorking ? 'bg-brand-50 breathing' : 'bg-neutral-100'}`}>
                      {staff.avatar}
                    </div>
                    <div className="text-xs font-medium text-neutral-600">{staff.name}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{staff.role}</div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 消耗概览 */}
          <section className="bg-gradient-to-br from-brand-50 to-white rounded-xl shadow-card p-5 border border-brand-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <span>💴</span>
                本月消耗
              </h2>
              <span className="text-xs text-brand-600 font-medium">查看明细 →</span>
            </div>
            <div className="text-3xl font-bold text-brand-600 mb-1">¥ 2,586.50</div>
            <div className="text-xs text-neutral-500 mb-4">已使用积分 25,865 / 月额度 100,000</div>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <div className="h-full bg-brand-gradient rounded-full" style={{ width: '26%' }}></div>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-neutral-500">
              <span>剩 74%</span>
              <span>约可用 28 天</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
