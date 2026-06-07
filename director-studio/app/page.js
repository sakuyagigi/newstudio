'use client'

import { useState } from 'react'

const stages = [
  { name: '项目立项', status: 'completed', icon: '📋' },
  { name: '剧本分析', status: 'completed', icon: '📝' },
  { name: '角色定妆', status: 'completed', icon: '👤' },
  { name: '分镜生成', status: 'active', icon: '🎨' },
  { name: '视频渲染', status: 'pending', icon: '🎞️' },
  { name: '逐镜审核', status: 'pending', icon: '✅' },
  { name: '成片交付', status: 'pending', icon: '✨' },
]

const projects = [
  {
    id: 1,
    name: '星河旅人',
    stage: '分镜生成',
    progress: 65,
    updateTime: '2小时前',
    characters: 8,
    shots: 120,
    status: '进行中',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 2,
    name: '城市记忆',
    stage: '剧本分析',
    progress: 30,
    updateTime: '5小时前',
    characters: 5,
    shots: 80,
    status: '进行中',
    color: 'from-purple-400 to-indigo-500',
  },
  {
    id: 3,
    name: '森林秘境',
    stage: '成片交付',
    progress: 100,
    updateTime: '1天前',
    characters: 6,
    shots: 150,
    status: '已完成',
    color: 'from-green-400 to-emerald-500',
  },
  {
    id: 4,
    name: '时光杂货店',
    stage: '角色定妆',
    progress: 45,
    updateTime: '3小时前',
    characters: 10,
    shots: 200,
    status: '进行中',
    color: 'from-pink-400 to-rose-500',
  },
  {
    id: 5,
    name: '深海回声',
    stage: '项目立项',
    progress: 10,
    updateTime: '今天 09:30',
    characters: 4,
    shots: 0,
    status: '待启动',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 6,
    name: '梦境建筑师',
    stage: '视频渲染',
    progress: 78,
    updateTime: '30分钟前',
    characters: 7,
    shots: 180,
    status: '有问题',
    color: 'from-red-400 to-rose-500',
  },
]

const directors = [
  { id: 1, name: 'ALPHA', role: '叙事导演', status: 'working', statusText: '分析中', progress: 65, task: '《星河旅人》剧本深度分析', avatar: '🎬' },
  { id: 2, name: 'BETA', role: '视觉导演', status: 'working', statusText: '生成中', progress: 42, task: '《城市记忆》视觉DNA提取', avatar: '🎨' },
  { id: 3, name: 'KAPPA', role: '角色导演', status: 'completed', statusText: '完成', progress: 100, task: '《森林秘境》角色定妆完成', avatar: '👤' },
  { id: 4, name: 'GAMMA', role: '分镜导演', status: 'idle', statusText: '待命', progress: 0, task: '暂无任务', avatar: '📐' },
  { id: 5, name: 'EPSILON', role: 'AI制片', status: 'issue', statusText: '需关注', progress: 78, task: '《梦境建筑师》渲染异常', avatar: '📊' },
  { id: 6, name: 'SIGMA', role: '财务导演', status: 'idle', statusText: '待命', progress: 0, task: '暂无任务', avatar: '💰' },
]

const getStatusStyle = (status) => {
  switch (status) {
    case 'working':
      return { bg: 'bg-amber-50 text-amber-700', ring: '#f59e0b', dot: 'bg-amber-500' }
    case 'completed':
      return { bg: 'bg-green-50 text-green-700', ring: '#10b981', dot: 'bg-green-500' }
    case 'idle':
      return { bg: 'bg-gray-100 text-gray-600', ring: '#9ca3af', dot: 'bg-gray-400' }
    case 'issue':
      return { bg: 'bg-red-50 text-red-700', ring: '#ef4444', dot: 'bg-red-500' }
    default:
      return { bg: 'bg-gray-100 text-gray-600', ring: '#9ca3af', dot: 'bg-gray-400' }
  }
}

export default function Home() {
  const [expandedDirector, setExpandedDirector] = useState(null)

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">项目总览</h1>
        <p className="text-gray-500 mt-1">墨枢光影AI导演台 · 实时进度监控</p>
      </div>

      {/* 七阶段进度条 */}
      <section className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
          制作全流程
        </h2>
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => {
            const isCompleted = stage.status === 'completed'
            const isActive = stage.status === 'active'
            return (
              <div key={stage.name} className="flex flex-col items-center relative z-10">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-md text-xl ${
                  isCompleted
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                    : isActive
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white breathing'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : stage.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{stage.name}</span>
              <span className={`text-xs mt-1 ${isActive ? 'text-orange-600 font-medium' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                {isCompleted ? '已完成' : isActive ? '进行中' : '未开始'}
              </span>
            </div>
            )
          })}
        </div>
        {/* 连接线 */}
        <div className="relative -mt-11 mx-16">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: '42%' }}></div>
          </div>
        </div>
      </section>

      {/* 项目卡片网格 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
            项目列表
          </h2>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
            + 新建项目
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const statusColor = project.status === '已完成' ? 'text-green-600 bg-green-50' :
                             project.status === '有问题' ? 'text-red-600 bg-red-50' :
                             project.status === '待启动' ? 'text-gray-600 bg-gray-100' : 'text-amber-700 bg-amber-50'
            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer card-hover"
              >
                <div className={`h-32 bg-gradient-to-br ${project.color} relative flex items-center justify-center`}>
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 ${statusColor} rounded-full text-xs font-medium`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="text-white text-5xl font-bold opacity-30">
                    {project.name.charAt(0)}
                  </div>
                  <div className="absolute bottom-3 right-3 text-white/80 text-xs">
                    {project.stage}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{project.name}</h3>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>当前进度</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full progress-gradient rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {project.updateTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {project.characters}角色
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                      </svg>
                      {project.shots}镜
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 六导演状态卡片 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
          AI导演组
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {directors.map((director) => {
            const style = getStatusStyle(director.status)
            const circumference = 2 * Math.PI * 28
            const offset = circumference - (director.progress / 100) * circumference
            const isExpanded = expandedDirector === director.id

            return (
              <div
                key={director.id}
                className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setExpandedDirector(isExpanded ? null : director.id)}
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <div className={`w-16 h-16 rounded-full ${style.bg} flex items-center justify-center text-2xl ${director.status === 'working' ? 'breathing' : ''}`}>
                      {director.avatar}
                    </div>
                    {(director.status === 'working' || director.status === 'issue') && (
                      <svg className="absolute -top-1 -right-1 w-8 h-8" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                        <circle
                          cx="30"
                          cy="30"
                          r="28"
                          fill="none"
                          stroke={style.ring}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          className="transition-all duration-500"
                        />
                      </svg>
                    )}
                    {director.status === 'completed' && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 text-sm">{director.name}</h4>
                  <p className="text-xs text-gray-400 mb-2">{director.role}</p>
                  
                  <span className={`px-2.5 py-0.5 ${style.bg} rounded-full text-xs font-medium`}>
                    {director.statusText}
                  </span>
                  
                  <div
                    className={`mt-3 pt-3 border-t border-gray-100 w-full text-center overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-xs text-gray-500 leading-relaxed">{director.task}</p>
                    {director.progress > 0 && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${director.progress}%`, backgroundColor: style.ring }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{director.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
