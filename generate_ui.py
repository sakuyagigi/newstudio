#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成深色主题 UI 文件"""

html_content = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>墨枢光影 · AI制片导演台</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            bg: {
              primary: '#1a1613',
              secondary: '#26201c',
              tertiary: '#2e2620',
              card: '#2a231e',
            },
            border: {
              DEFAULT: '#4a3d34',
              light: '#5c4e43',
            },
            text: {
              primary: '#faf6f2',
              secondary: '#d4c7bb',
              tertiary: '#b0a090',
              muted: '#8a7c6e',
            },
          }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Inter', system-ui, sans-serif; 
      background: #1a1613;
      color: #faf6f2;
      -webkit-font-smoothing: antialiased;
    }
    
    .scrollbar-thin::-webkit-scrollbar { width: 6px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: #4a3d34; border-radius: 3px; }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #5d4e42; }
    
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .card {
      background: #2a231e;
      border: 1px solid #3d332c;
      border-radius: 14px;
      transition: all 0.25s ease;
    }
    .card:hover {
      border-color: #5d4e42;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    }
    
    .btn-secondary {
      background: #2e2620;
      border: 1px solid #4a3d34;
      color: #d4c7bb;
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      border-color: #f97316;
      color: #f97316;
      background: rgba(249, 115, 22, 0.1);
    }
    
    .nav-item {
      transition: all 0.2s ease;
      border-radius: 10px;
      position: relative;
      cursor: pointer;
    }
    .nav-item:hover {
      background: #2e2620;
      color: #faf6f2;
    }
    .nav-item.active {
      background: rgba(249, 115, 22, 0.15);
      color: #f97316;
      font-weight: 500;
    }
    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: #f97316;
      border-radius: 0 3px 3px 0;
    }
    
    .tag {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 500;
      border-radius: 9999px;
    }
    .tag-orange { background: rgba(249, 115, 22, 0.15); color: #fb923c; }
    .tag-green { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
    .tag-red { background: rgba(239, 68, 68, 0.15); color: #f87171; }
    .tag-amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .tag-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
    .tag-blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .tag-neutral { background: #3d332c; color: #b8a99c; }
    .tag-pink { background: rgba(236, 72, 153, 0.15); color: #f472b6; }
    
    .sidebar-panel {
      background: #26201c;
      border: 1px solid #3d332c;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .sidebar-header {
      padding: 12px 16px;
      border-bottom: 1px solid #3d332c;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #2a231e;
    }
    .sidebar-header h4 {
      font-size: 13px;
      font-weight: 600;
      color: #faf6f2;
    }
    
    .list-item {
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.15s ease;
      border-bottom: 1px solid #332a24;
    }
    .list-item:last-child { border-bottom: none; }
    .list-item:hover { background: #2e2620; }
    .list-item.active {
      background: rgba(249, 115, 22, 0.1);
      border-left: 3px solid #f97316;
      padding-left: 13px;
    }
    
    .input-field {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #3d332c;
      border-radius: 8px;
      font-size: 13px;
      background: #2e2620;
      color: #faf6f2;
      transition: all 0.2s ease;
    }
    .input-field:focus {
      outline: none;
      border-color: #f97316;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    .input-field::placeholder { color: #66594f; }
    
    .stat-card {
      text-align: center;
      padding: 14px;
      background: #2e2620;
      border-radius: 10px;
      border: 1px solid #3d332c;
    }
    .stat-number { font-size: 20px; font-weight: 700; color: #f5f0eb; line-height: 1.2; }
    .stat-label { font-size: 11px; color: #8b7d6f; margin-top: 4px; }
    
    .step-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .step-item {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      color: #8b7d6f;
      background: #2e2620;
      transition: all 0.2s ease;
    }
    .step-item.active { background: rgba(249, 115, 22, 0.2); color: #fb923c; }
    .step-item.completed { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
    .step-arrow { color: #4a3d34; font-size: 12px; }
    
    .capsule-group {
      display: inline-flex;
      background: #2e2620;
      border-radius: 9999px;
      padding: 3px;
      border: 1px solid #3d332c;
    }
    .capsule-btn {
      padding: 5px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 500;
      color: #8b7d6f;
      transition: all 0.2s ease;
      background: transparent;
      border: none;
      cursor: pointer;
    }
    .capsule-btn.active {
      background: #f97316;
      color: white;
    }
    
    .divider { height: 1px; background: #3d332c; margin: 12px 0; }
    
    .toast {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 13px;
      background: #2a231e;
      border: 1px solid #3d332c;
      color: #faf6f2;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease;
    }
    .toast.success { border-color: rgba(34, 197, 94, 0.3); background: rgba(34, 197, 94, 0.1); color: #4ade80; }
    .toast.warning { border-color: rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
    .toast.error { border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.1); color: #f87171; }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  </style>
</head>
<body>
  <div class="flex h-screen overflow-hidden">
    <!-- 侧边栏 -->
    <aside class="w-56 bg-bg-primary border-r border-border flex flex-col flex-shrink-0">
      <!-- Logo -->
      <div class="px-5 py-5 border-b border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-base font-bold text-text-primary">墨枢导演台</h1>
            <p class="text-[11px] text-text-tertiary">Director Studio v2.0</p>
          </div>
        </div>
      </div>
      
      <!-- 导航 -->
      <nav class="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        <button onclick="showPage('dashboard')" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary" data-page="dashboard">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          项目总览
        </button>
        <button onclick="showPage('script')" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary" data-page="script">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          剧本分析
        </button>
        <button onclick="showPage('character')" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary" data-page="character">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          角色定妆
        </button>
        <button onclick="showPage('storyboard')" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary" data-page="storyboard">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          分镜生成
        </button>
        <button onclick="showPage('cost')" class="nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary" data-page="cost">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.345 2 3 2 3 .895 3 2-1.345 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          成本中心
        </button>
      </nav>
      
      <!-- 底部 -->
      <div class="p-4 border-t border-border">
        <div class="flex items-center gap-2.5">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-xs text-text-tertiary">系统运行中</span>
        </div>
        <div class="text-[11px] text-text-muted mt-1.5">五导演协同 · 全链路生产</div>
      </div>
    </aside>
    
    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- 顶部栏 -->
      <header class="h-14 bg-bg-primary/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div>
          <h2 id="page-title" class="text-base font-semibold text-text-primary">项目总览</h2>
          <p id="page-subtitle" class="text-xs text-text-tertiary mt-0.5">从剧本到分镜的全流程AI制片</p>
        </div>
        <div id="header-actions" class="flex items-center gap-2"></div>
      </header>
      
      <!-- 内容区 -->
      <div id="page-content" class="flex-1 overflow-y-auto p-5 scrollbar-thin page-content">
      </div>
    </main>
  </div>
  
  <!-- 图片预览 Modal -->
  <div id="image-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/80" onclick="closeImageModal()">
    <img id="modal-image" class="max-w-[90vw] max-h-[90vh] object-contain rounded-xl" src="" alt="预览"/>
  </div>

  <script>
    // ========= 全局状态 =========
    const state = {
      currentPage: 'dashboard',
      script: '',
      pipelineResult: null,
      characterChainResult: null,
      sceneChainResult: null,
      storyboardResult: null,
      currentShotIndex: 0,
      currentParaIndex: 0,
    }
    
    const pageTitles = {
      dashboard: { title: '项目总览', subtitle: '从剧本到分镜的全流程AI制片' },
      script: { title: '剧本分析', subtitle: '五导演联合深度拆解 · 全维度剧本分析' },
      character: { title: '角色定妆', subtitle: 'KAPPA导演工作室 · 角色视觉一致性锚定' },
      storyboard: { title: '分镜生成', subtitle: 'GAMMA节奏导演 · 镜头语言设计工作台' },
      cost: { title: '成本中心', subtitle: '用量统计 · 成本明细 · 套餐方案' },
    }
    
    // ========= 工具函数 =========
    function showToast(message, type = 'info') {
      const toast = document.createElement('div')
      toast.className = 'toast ' + type
      toast.textContent = message
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.style.opacity = '0'
        toast.style.transform = 'translateX(20px)'
        toast.style.transition = 'all 0.3s ease'
        setTimeout(() => toast.remove(), 300)
      }, 2500)
    }
    
    function formatCost(cost) {
      if (!cost) return '¥0.00'
      return '¥' + parseFloat(cost).toFixed(2)
    }
    
    function openImageModal(src) {
      document.getElementById('modal-image').src = src
      document.getElementById('image-modal').classList.remove('hidden')
      document.getElementById('image-modal').classList.add('flex')
    }
    
    function closeImageModal() {
      document.getElementById('image-modal').classList.add('hidden')
      document.getElementById('image-modal').classList.remove('flex')
    }
    
    async function apiCall(endpoint, method = 'GET', body = null) {
      try {
        const options = { method, headers: { 'Content-Type': 'application/json' } }
        if (body) options.body = JSON.stringify(body)
        const res = await fetch(endpoint, options)
        return await res.json()
      } catch (e) {
        return { success: false, error: e.message }
      }
    }
    
    // ========= 页面导航 =========
    function showPage(pageName) {
      state.currentPage = pageName
      
      document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.dataset.page === pageName) btn.classList.add('active')
        else btn.classList.remove('active')
      })
      
      const info = pageTitles[pageName]
      document.getElementById('page-title').textContent = info.title
      document.getElementById('page-subtitle').textContent = info.subtitle
      
      const content = document.getElementById('page-content')
      content.innerHTML = ''
      content.classList.remove('fade-in')
      void content.offsetWidth
      content.classList.add('fade-in')
      
      document.getElementById('header-actions').innerHTML = ''
      
      switch(pageName) {
        case 'dashboard': renderDashboard(content); break
        case 'script': renderScriptPage(content); break
        case 'character': renderCharacterPage(content); break
        case 'storyboard': renderStoryboardPage(content); break
        case 'cost': renderCostPage(content); break
      }
    }
    
    // ========= 1. 项目总览 =========
    function renderDashboard(container) {
      const hasData = state.pipelineResult !== null
      const totalCost = calculateTotalCost()
      
      const directorCards = [
        { name: 'ALPHA', role: '叙事导演', desc: '剧本结构拆解', color: 'blue' },
        { name: 'BETA', role: '视觉导演', desc: '画面风格设定', color: 'purple' },
        { name: 'GAMMA', role: '节奏导演', desc: '分镜镜头设计', color: 'green' },
        { name: 'KAPPA', role: '角色导演', desc: '角色定妆生成', color: 'pink' },
        { name: 'EPSILON', role: 'AI制片', desc: '生产计划调度', color: 'amber' },
      ]
      
      container.innerHTML = `
        <div class="max-w-5xl mx-auto space-y-5">
          <!-- Hero Card -->
          <div class="card p-6 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5"></div>
            <div class="relative z-10">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium mb-4 border border-orange-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                DEMO VERSION
              </div>
              <h2 class="text-xl font-bold text-text-primary mb-1">墨枢光影 · AI制片导演台</h2>
              <p class="text-sm text-text-tertiary mb-5">五导演协同工作流 · 从剧本到分镜一键生成</p>
              
              <div class="step-nav mb-5">
                <div class="step-item ${hasData ? 'completed' : ''}">📝 剧本分析</div>
                <span class="step-arrow">→</span>
                <div class="step-item ${state.characterChainResult ? 'completed' : ''}">🎭 角色定妆</div>
                <span class="step-arrow">→</span>
                <div class="step-item ${state.storyboardResult ? 'completed' : ''}">🎬 分镜生成</div>
                <span class="step-arrow">→</span>
                <div class="step-item">🎞️ 视频渲染</div>
                <span class="step-arrow">→</span>
                <div class="step-item">📦 成片交付</div>
              </div>
              
              ${hasData ? `
                <div class="grid grid-cols-4 gap-3 mb-5">
                  <div class="stat-card"><div class="stat-number text-green-400 text-lg">${state.pipelineResult.results?.alpha?.success ? '✓' : '—'}</div><div class="stat-label">剧本分析</div></div>
                  <div class="stat-card"><div class="stat-number text-green-400 text-lg">${state.pipelineResult.results?.beta?.success ? '✓' : '—'}</div><div class="stat-label">视觉设计</div></div>
                  <div class="stat-card"><div class="stat-number text-green-400 text-lg">${state.pipelineResult.results?.gamma?.success ? '✓' : '—'}</div><div class="stat-label">分镜生成</div></div>
                  <div class="stat-card"><div class="stat-number text-green-400 text-lg">${state.characterChainResult?.success ? '✓' : '—'}</div><div class="stat-label">角色链条</div></div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-sm"><span class="text-text-tertiary">累计消耗</span><span class="font-semibold text-orange-400 ml-2">${formatCost(totalCost)}</span></div>
                  <button onclick="showPage('script')" class="btn-primary px-5 py-2 text-sm">继续编辑</button>
                </div>
              ` : `
                <button onclick="showPage('script')" class="btn-primary px-6 py-2.5 text-sm">开始新项目 →</button>
              `}
            </div>
          </div>
          
          <!-- 五导演团队 -->
          <div>
            <h3 class="text-sm font-semibold text-text-primary mb-3 px-1">五导演团队</h3>
            <div class="grid grid-cols-5 gap-3">
              ${directorCards.map(d => `
                <div class="card p-4 hover:border-${d.color}-500/30 transition-all">
                  <div class="w-9 h-9 rounded-lg bg-${d.color}-500/10 flex items-center justify-center mb-3">
                    <span class="text-sm font-bold text-${d.color}-400">${d.name.charAt(0)}</span>
                  </div>
                  <div class="font-semibold text-text-primary text-sm">${d.name}</div>
                  <div class="text-xs text-${d.color}-400 mb-1.5 font-medium">${d.role}</div>
                  <div class="text-xs text-text-tertiary">${d.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- 功能模块 -->
          <div class="grid grid-cols-3 gap-4">
            <div class="card p-5 cursor-pointer hover:border-orange-500/30 transition-all group" onclick="showPage('script')">
              <div class="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-3">
                <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h4 class="font-semibold text-text-primary mb-1.5 text-sm">剧本分析</h4>
              <p class="text-xs text-text-tertiary mb-3">上传剧本，五导演联合深度分析，拆解人物、场景、节奏</p>
              <button class="text-xs text-orange-400 font-medium hover:text-orange-300">六导演联审 →</button>
            </div>
            
            <div class="card p-5 cursor-pointer hover:border-purple-500/30 transition-all group" onclick="showPage('character')">
              <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h4 class="font-semibold text-text-primary mb-1.5 text-sm">角色定妆</h4>
              <p class="text-xs text-text-tertiary mb-3">视觉DNA锚定，多角度一致性生成，五导演评分审核</p>
              <button class="text-xs text-purple-400 font-medium hover:text-purple-300">版本管理 →</button>
            </div>
            
            <div class="card p-5 cursor-pointer hover:border-green-500/30 transition-all group" onclick="showPage('storyboard')">
              <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <h4 class="font-semibold text-text-primary mb-1.5 text-sm">分镜生成</h4>
              <p class="text-xs text-text-tertiary mb-3">智能分镜设计，批量生成画面，时间线视图管理</p>
              <button class="text-xs text-green-400 font-medium hover:text-green-300">时间线视图 →</button>
            </div>
          </div>
        </div>
      `
    }
    
    // ========= 2. 剧本分析页 =========
    function renderScriptPage(container) {
      const hasResult = state.pipelineResult !== null
      const directors = ['alpha', 'beta', 'gamma', 'kappa', 'epsilon']
      const directorNames = { alpha: 'ALPHA', beta: 'BETA', gamma: 'GAMMA', kappa: 'KAPPA', epsilon: 'EPSILON' }
      
      document.getElementById('header-actions').innerHTML = `
        <select id="tier-select" class="input-field text-xs px-2 py-1.5 w-20">
          <option value="standard">标准版</option>
          <option value="pro">专业版</option>
          <option value="full">旗舰版</option>
        </select>
        <button onclick="runPipeline()" class="btn-primary px-4 py-1.5 text-xs">▶ 开始分析</button>
      `
      
      container.innerHTML = `
        <div class="h-full flex gap-4" style="height: calc(100vh - 90px);">
          <!-- 左栏：剧本输入 -->
          <div class="sidebar-panel w-64 flex-shrink-0">
            <div class="sidebar-header">
              <h4>📝 剧本内容</h4>
              <span class="text-xs text-text-tertiary" id="script-stats">0 字</span>
            </div>
            <div class="p-3 flex-1 overflow-y-auto">
              <textarea id="script-input" placeholder="在此粘贴或输入剧本内容..." 
                class="input-field w-full resize-none" rows="18"
                oninput="updateScriptStats()"></textarea>
            </div>
            <div class="p-3 border-t border-border">
              <div class="text-xs text-text-tertiary mb-2">快速示例：</div>
              <div class="flex gap-2 flex-wrap">
                <button onclick="loadSampleScript()" class="capsule-btn hover:bg-orange-500/10 hover:text-orange-400">爱情短片</button>
                <button onclick="loadSampleScript2()" class="capsule-btn hover:bg-orange-500/10 hover:text-orange-400">悬疑片段</button>
              </div>
            </div>
          </div>
          
          <!-- 中栏：导演分析结果 -->
          <div class="sidebar-panel flex-1 min-w-0 overflow-hidden">
            <div class="sidebar-header">
              <h4>🎬 导演分析</h4>
              <div class="text-xs text-text-tertiary">${hasResult ? '分析完成' : '等待开始'}</div>
            </div>
            
            <!-- 导演标签页 -->
            <div class="flex border-b border-border px-2 pt-2 bg-bg-secondary">
              ${directors.map((d, i) => `
                <button onclick="switchDirectorTab('${d}')" 
                  class="director-tab flex-1 px-2 py-2 text-[11px] font-medium rounded-t-lg transition-colors whitespace-nowrap ${i === 0 ? 'text-orange-400 border-b-2 border-orange-500 bg-bg-card' : 'text-text-tertiary hover:text-text-secondary'}"
                  data-director="${d}">
                  ${d.toUpperCase()}
                </button>
              `).join('')}
            </div>
            
            <!-- 分析内容 -->
            <div id="director-content" class="flex-1 overflow-y-auto p-4">
              ${hasResult ? renderDirectorAnalysis('alpha') : renderEmptyAnalysis()}
            </div>
          </div>
          
          <!-- 右栏 -->
          <div class="w-56 flex-shrink-0 space-y-4 overflow-y-auto scrollbar-thin">
            <div class="sidebar-panel">
              <div class="sidebar-header"><h4>📊 分析进度</h4></div>
              <div class="p-3 space-y-2">
                ${directors.map(d => {
                  const result = state.pipelineResult?.results?.[d]
                  const isDone = result?.success
                  return `
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-md ${isDone ? 'bg-green-500/20' : 'bg-bg-tertiary'} flex items-center justify-center text-xs font-bold ${isDone ? 'text-green-400' : 'text-text-muted'}">
                        ${isDone ? '✓' : d.charAt(0).toUpperCase()}
                      </div>
                      <span class="text-xs ${isDone ? 'text-green-400' : 'text-text-tertiary'}">${directorNames[d]}</span>
                    </div>
                  `
                }).join('')}
              </div>
            </div>
            
            ${hasResult ? `
              <div class="sidebar-panel">
                <div class="sidebar-header"><h4>📋 剧本概览</h4></div>
                <div class="p-3 space-y-2 text-xs">
                  <div class="flex justify-between"><span class="text-text-tertiary">场景数</span><span class="text-text-primary font-medium">${state.pipelineResult.sceneCount || '—'}</span></div>
                  <div class="flex justify-between"><span class="text-text-tertiary">角色数</span><span class="text-text-primary font-medium">${state.pipelineResult.characterCount || '—'}</span></div>
                  <div class="divider"></div>
                  <div class="flex justify-between"><span class="text-text-tertiary">分析消耗</span><span class="font-semibold text-orange-400">${formatCost(state.pipelineResult.totalCost)}</span></div>
                </div>
              </div>
            ` : `
              <div class="sidebar-panel">
                <div class="sidebar-header"><h4>💡 小提示</h4></div>
                <div class="p-3">
                  <ul class="text-xs text-text-tertiary space-y-1.5">
                    <li>• 粘贴完整剧本效果最佳</li>
                    <li>• 支持中英日韩多语言</li>
                    <li>• 专业版包含4位导演</li>
                    <li>• 旗舰版5导演全链路</li>
                  </ul>
                </div>
              </div>
            `}
          </div>
        </div>
      `
    }
    
    function renderEmptyAnalysis() {
      return `
        <div class="text-center py-20">
          <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-bg-tertiary flex items-center justify-center">
            <svg class="w-7 h-7 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="text-sm text-text-secondary mb-1">等待分析</p>
          <p class="text-xs text-text-tertiary">在左侧粘贴剧本，点击\"开始分析\"</p>
        </div>
      `
    }
    
    function switchDirectorTab(director) {
      document.querySelectorAll('.director-tab').forEach(tab => {
        if (tab.dataset.director === director) {
          tab.classList.add('text-orange-400', 'border-b-2', 'border-orange-500', 'bg-bg-card')
          tab.classList.remove('text-text-tertiary')
        } else {
          tab.classList.remove('text-orange-400', 'border-b-2', 'border-orange-500', 'bg-bg-card')
          tab.classList.add('text-text-tertiary')
        }
      })
      document.getElementById('director-content').innerHTML = renderDirectorAnalysis(director)
    }
    
    function renderDirectorAnalysis(director) {
      const result = state.pipelineResult?.results?.[director]
      if (!result) return renderEmptyAnalysis()
      
      const data = result.data?.content || result.data || {}
      
      switch(director) {
        case 'alpha': return renderAlphaAnalysis(data)
        case 'beta': return renderBetaAnalysis(data)
        case 'gamma': return renderGammaAnalysis(data)
        case 'kappa': return renderKappaAnalysis(data)
        case 'epsilon': return renderEpsilonAnalysis(data)
        default: return `<pre class="text-xs text-text-secondary">${JSON.stringify(data, null, 2)}</pre>`
      }
    }
    
    function renderAlphaAnalysis(data) {
      return `
        <div class="space-y-5 max-w-2xl">
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>故事梗概
            </h5>
            <p class="text-sm text-text-secondary leading-relaxed">${data.summary || '暂无数据'}</p>
          </div>
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>核心角色
            </h5>
            <div class="space-y-2">
              ${(data.characters || [{name: '主角', role: '主人公', description: '故事的核心人物'}]).map(c => `
                <div class="p-3 bg-bg-tertiary rounded-lg border border-border">
                  <div class="font-medium text-sm text-text-primary">${c.name || '角色'} <span class="text-xs text-orange-400 ml-2">${c.role || ''}</span></div>
                  <div class="text-xs text-text-tertiary mt-1">${c.description || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>三幕结构
            </h5>
            <div class="space-y-2">
              <div class="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <div class="text-xs font-semibold text-blue-400 mb-1">第一幕 · 建置</div>
                <p class="text-xs text-text-secondary">${data.threeActStructure?.act1 || '故事背景与人物设定'}</p>
              </div>
              <div class="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                <div class="text-xs font-semibold text-purple-400 mb-1">第二幕 · 对抗</div>
                <p class="text-xs text-text-secondary">${data.threeActStructure?.act2 || '核心冲突与情节发展'}</p>
              </div>
              <div class="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <div class="text-xs font-semibold text-green-400 mb-1">第三幕 · 结局</div>
                <p class="text-xs text-text-secondary">${data.threeActStructure?.act3 || '冲突解决与故事收尾'}</p>
              </div>
            </div>
          </div>
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>核心主题
            </h5>
            <div class="flex flex-wrap gap-2">
              ${(data.themes || ['成长', '救赎', '爱情']).map(t => `<span class="tag tag-blue">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      `
    }
    
    function renderBetaAnalysis(data) {
      return `
        <div class="space-y-5 max-w-2xl">
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>视觉风格
            </h5>
            <p class="text-sm text-text-secondary">${data.visualStyle || '写实主义，自然光影，电影质感'}</p>
          </div>
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>色彩体系
            </h5>
            <div class="grid grid-cols-5 gap-2">
              ${['#1a1613', '#2a231e', '#f97316', '#fbbf24', '#f5f0eb'].map((c, i) => `
                <div class="text-center">
                  <div class="w-full aspect-square rounded-lg border border-border" style="background: ${c}"></div>
                  <div class="text-[10px] text-text-tertiary mt-1">${['主背景', '卡片', '强调', '点缀', '文字'][i]}</div>
                </div>
              `).join('')}
            </div>
          </div>
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>参考关键词
            </h5>
            <div class="flex flex-wrap gap-2">
              ${(data.referenceKeywords || ['电影感', '自然光', '景深', '暖色调']).map(k => `<span class="tag tag-purple">${k}</span>`).join('')}
            </div>
          </div>
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>关键场景设定
            </h5>
            <div class="space-y-2">
              ${(data.keyScenes || [
                { name: '开场场景', description: '咖啡馆清晨，阳光透过落地窗' },
                { name: '高潮场景', description: '雨夜街头，情绪爆发' },
              ]).map(s => `
                <div class="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <div class="text-xs font-medium text-purple-400">${s.name}</div>
                  <p class="text-xs text-text-secondary mt-1">${s.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `
    }
    
    function renderGammaAnalysis(data) {
      const shots = data.shots || []
      return `
        <div class="space-y-5">
          <div class="grid grid-cols-3 gap-3">
            <div class="stat-card"><div class="stat-number text-orange-400 text-lg">${shots.length}</div><div class="stat-label">镜头数</div></div>
            <div class="stat-card"><div class="stat-number text-green-400 text-lg">${data.totalDuration || 0}s</div><div class="stat-label">总时长</div></div>
            <div class="stat-card"><div class="stat-number text-purple-400 text-lg">${data.scenes || 3}</div><div class="stat-label">场景数</div></div>
          </div>
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>分镜列表
            </h5>
            <div class="space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              ${shots.map((shot, i) => `
                <div class="p-3 bg-bg-tertiary rounded-lg border border-border hover:border-orange-500/30 cursor-pointer transition-colors" onclick="selectShot(${i})">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-sm font-medium text-text-primary">镜 ${shot.shotNumber || i+1} · ${shot.shotType || '中景'}</span>
                    <span class="tag tag-neutral text-[10px]">${shot.duration || 0}s</span>
                  </div>
                  <p class="text-xs text-text-secondary line-clamp-2">${shot.description || ''}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `
    }
    
    function renderKappaAnalysis(data) {
      return `
        <div class="space-y-5 max-w-2xl">
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-pink-400"></span>主角设计
            </h5>
            <div class="p-4 bg-pink-500/5 rounded-xl border border-pink-500/20">
              <div class="text-base font-semibold text-pink-400 mb-1">${data.basicInfo?.name || '主角'}</div>
              <div class="text-xs text-text-tertiary mb-3">${data.basicInfo?.age || ''}岁 · ${data.basicInfo?.gender || ''} · ${data.basicInfo?.occupation || ''}</div>
              <div class="text-xs text-text-secondary"><strong class="text-text-primary">外貌:</strong> ${data.appearance?.face || ''} ${data.appearance?.hair || ''}</div>
              <div class="text-xs text-text-secondary mt-1"><strong class="text-text-primary">服装:</strong> ${data.costume?.mainOutfit || '简约休闲风格'}</div>
            </div>
          </div>
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-pink-400"></span>视觉DNA锚点
            </h5>
            <div class="flex flex-wrap gap-2">
              ${(data.visualDNA || ['高颜值', '黑发', '杏眼', '瓜子脸']).map(d => `<span class="tag tag-orange">${d}</span>`).join('')}
            </div>
          </div>
          <div class="pt-2">
            <button onclick="showPage('character')" class="w-full btn-primary py-2.5 text-sm font-medium">生成角色定妆照 →</button>
          </div>
        </div>
      `
    }
    
    function renderEpsilonAnalysis(data) {
      return `
        <div class="space-y-5 max-w-2xl">
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>生产排期
            </h5>
            <div class="space-y-2">
              ${(data.schedule?.phases || [
                { name: '剧本分析', duration: '30秒' },
                { name: '角色设计', duration: '1分钟' },
                { name: '分镜生成', duration: '2分钟' },
                { name: '生图渲染', duration: '3分钟' },
              ]).map(p => `
                <div class="flex items-center justify-between p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
                  <span class="text-xs font-medium text-amber-400">${p.name}</span>
                  <span class="text-xs text-text-secondary">${p.duration}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div>
            <h5 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>预算预估
            </h5>
            <div class="p-4 bg-green-500/5 rounded-xl border border-green-500/20 text-center">
              <div class="text-2xl font-bold text-green-400">${formatCost(data.estimatedBudget || 3.0)}</div>
              <div class="text-xs text-text-tertiary mt-1">预计总投入</div>
            </div>
          </div>
        </div>
      `
    }
    
    function updateScriptStats() {
      const input = document.getElementById('script-input')
      const stats = document.getElementById('script-stats')
      if (input && stats) stats.textContent = input.value.length + ' 字'
    }
    
    function loadSampleScript() {
      const sample = `【场景一】咖啡馆·日·内

阳光透过落地窗洒进来，空气中飘着咖啡香气。

林小雨（25岁，文艺女青年）坐在靠窗的位置，笔记本电脑打开着，手里握着咖啡杯，眼神有些恍惚。

桌上的手机震动了一下，屏幕亮起，显示"张阳"的名字。

林小雨看了一眼，犹豫了一下，最终还是接起了电话。

林小雨
（轻声）
喂...

张阳 (V.O.)
小雨，我们...还是算了吧。

林小雨的手微微颤抖，咖啡杯在碟子上发出轻响。

林小雨
（努力平静）
...好。

她挂了电话，望向窗外，阳光正好，但她的眼神里满是失落。

【场景二】公园·黄昏·外

夕阳西下，林小雨独自走在公园的小路上，落叶纷飞。

她停下脚步，看着远方的落日，眼眶微红。

一个小男孩跑过，手里的气球不小心飞走了。

小男孩
（着急）
我的气球！

林小雨下意识地伸手去抓，没抓到。但她看着飞向天空的气球，忽然笑了。

林小雨
（轻声对自己）
飞走了，也好。

她继续向前走，身影被夕阳拉得很长。`
      
      const input = document.getElementById('script-input')
      input.value = sample
      updateScriptStats()
      showToast('示例剧本已加载', 'success')
    }
    
    function loadSampleScript2() {
      const sample = `【场景一】废弃工厂·夜·内

昏暗的工厂里，只有月光透过破碎的窗户照进来。

陈默（30岁，警察）悄悄走进来，手电筒的光束在黑暗中晃动。

他的表情严肃，手里紧握着枪。

地上散落着废弃的机器零件，偶尔传来老鼠跑动的声音。

突然，一声巨响从楼上传来。

陈默立刻警觉起来，举枪对准楼梯方向。

陈默
（低声）
谁在那里？

没有人回应，只有回声在空旷的厂房里回荡。

他深吸一口气，慢慢向楼梯走去。

每走一步，老旧的楼梯就发出吱呀的声响。

到了二楼，他看到一个黑影闪过。

陈默
站住！

他追了过去，但拐角处空无一人。

窗台上有一只黑色的手套，还留有余温。

陈默捡起手套，眉头紧锁。

陈默
（自言自语）
是他...

窗外，月光如水，远处传来警笛声。`
      
      const input = document.getElementById('script-input')
      input.value = sample
      updateScriptStats()
      showToast('示例剧本已加载', 'success')
    }
    
    async function runPipeline() {
      const script = document.getElementById('script-input')?.value
      if (!script || script.trim().length < 10) {
        showToast('请输入至少10字的剧本内容', 'warning')
        return
      }
      
      const tier = document.getElementById('tier-select')?.value || 'standard'
      state.script = script
      
      const content = document.getElementById('director-content')
      content.innerHTML = `
        <div class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-2 border-orange-500/30 border-t-orange-500 mb-4"></div>
          <p class="text-sm text-text-primary mb-1">正在分析剧本...</p>
          <p class="text-xs text-text-tertiary">五导演联合审片中，约需30秒</p>
        </div>
      `
      
      try {
        const result = await apiCall('/api/directors/pipeline', 'POST', { script, tier, async: false })
        if (result.success) {
          state.pipelineResult = result.data
          renderScriptPage(document.getElementById('page-content'))
          showToast('分析完成！', 'success')
        } else {
          showToast('分析失败: ' + (result.error || '未知错误'), 'error')
        }
      } catch (e) {
        showToast('请求失败，请检查服务是否运行', 'error')
      }
    }
    
    function selectShot(index) {
      state.currentShotIndex = index
      if (state.pipelineResult?.results?.gamma) showPage('storyboard')
    }
    
    // ========= 3. 角色定妆页 =========
    function renderCharacterPage(container) {
      const kappaData = state.pipelineResult?.results?.kappa?.data?.content
      const hasChain = state.characterChainResult?.success
      
      document.getElementById('header-actions').innerHTML = `
        <div class="capsule-group">
          <button class="capsule-btn active">单图</button>
          <button class="capsule-btn">对比</button>
          <button class="capsule-btn">网格</button>
        </div>
        <button class="btn-secondary px-3 py-1.5 text-xs">导出</button>
      `
      
      if (!kappaData) {
        container.innerHTML = `
          <div class="max-w-md mx-auto pt-20">
            <div class="card p-8 text-center">
              <div class="text-4xl mb-4">🎭</div>
              <h3 class="text-base font-semibold text-text-primary mb-2">请先完成剧本分析</h3>
              <p class="text-sm text-text-tertiary mb-5">角色设计需要基于剧本分析结果生成</p>
              <button onclick="showPage('script')" class="btn-primary px-5 py-2 text-sm">去分析剧本</button>
            </div>
          </div>
        `
        return
      }
      
      const currentChar = kappaData
      
      container.innerHTML = `
        <div class="h-full flex gap-4" style="height: calc(100vh - 90px);">
          <!-- 左栏：角色列表 -->
          <div class="sidebar-panel w-56 flex-shrink-0">
            <div class="sidebar-header">
              <h4>👥 角色列表</h4>
              <button class="text-xs text-orange-400 hover:text-orange-300 font-medium">+ 添加</button>
            </div>
            <div class="flex-1 overflow-y-auto">
              <div class="list-item active">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500/30 to-orange-500/30 flex items-center justify-center">
                    <span class="text-xs font-medium text-pink-300">${(currentChar.basicInfo?.name || '角色').charAt(0)}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-text-primary truncate">${currentChar.basicInfo?.name || '主角'}</div>
                    <div class="text-xs text-text-tertiary">${currentChar.basicInfo?.role || '主角'}</div>
                  </div>
                  <span class="tag tag-orange text-[10px]">3版</span>
                </div>
              </div>
            </div>
            <div class="p-3 border-t border-border">
              <div class="text-xs text-text-tertiary">共 1 个角色</div>
            </div>
          </div>
          
          <!-- 中栏：预览 -->
          <div class="sidebar-panel flex-1 min-w-0">
            <div class="sidebar-header">
              <div>
                <h4 class="text-sm">${currentChar.basicInfo?.name || '主角'} · v1.0</h4>
                <span class="text-xs text-text-tertiary">NB Pro · 真人写实</span>
              </div>
            </div>
            
            <div class="flex-1 p-5 flex flex-col items-center justify-center overflow-y-auto">
              ${hasChain && state.characterChainResult.all_variants?.[0] ? `
                <div class="relative max-w-xs w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                  <img src="${state.characterChainResult.all_variants[0].url}" alt="角色定妆" class="w-full h-full object-cover" onclick="openImageModal('${state.characterChainResult.all_variants[0].url}')"/>
                </div>
                <div class="flex gap-2 mt-4">
                  ${state.characterChainResult.all_variants.map((img, i) => `
                    <div class="w-14 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${i === 0 ? 'border-orange-500' : 'border-border opacity-70'} hover:opacity-100 transition-all" onclick="openImageModal('${img.url}')">
                      <img src="${img.url}" alt="变体${i+1}" class="w-full h-full object-cover"/>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="w-full max-w-xs aspect-[2/3] rounded-xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 flex flex-col items-center justify-center border border-border">
                  <div class="text-4xl mb-3">👤</div>
                  <p class="text-sm text-pink-300 font-medium">${currentChar.basicInfo?.name || '角色'}</p>
                  <p class="text-xs text-text-tertiary mt-1">点击下方按钮生成定妆照</p>
                </div>
              `}
            </div>
            
            ${hasChain ? `
              <div class="p-4 border-t border-border">
                <h5 class="text-xs font-semibold text-text-primary mb-3">五导演会审评分</h5>
                <div class="grid grid-cols-5 gap-2">
                  ${['ALPHA', 'BETA', 'GAMMA', 'KAPPA', 'EPSILON'].map((name, i) => `
                    <div class="text-center">
                      <div class="text-lg font-bold text-${['blue', 'purple', 'green', 'pink', 'amber'][i]}-400">${[92, 88, 85, 95, 90][i]}</div>
                      <div class="text-[10px] text-text-tertiary mt-0.5">${name}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : `
              <div class="p-4 border-t border-border">
                <button onclick="generateCharacterChain()" class="w-full btn-primary py-2.5 text-sm font-medium">🎭 生成角色定妆照</button>
                <p class="text-xs text-center text-text-tertiary mt-2">生成4张变体 · 约需2-3分钟</p>
              </div>
            `}
          </div>
          
          <!-- 右栏：参数 -->
          <div class="w-56 flex-shrink-0 space-y-4 overflow-y-auto scrollbar-thin">
            <div class="sidebar-panel">
              <div class="sidebar-header"><h4>🤖 生成模型</h4></div>
              <div class="p-3 space-y-2">
                <div class="p-2.5 rounded-lg border border-orange-500/30 bg-orange-500/10 cursor-pointer">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-orange-400">NB Pro</span>
                    <span class="tag tag-orange text-[10px]">推荐</span>
                  </div>
                  <p class="text-[11px] text-text-tertiary mt-0.5">真人写实 · 最高精度</p>
                </div>
                <div class="p-2.5 rounded-lg border border-border cursor-pointer hover:border-text-muted">
                  <div class="text-xs font-medium text-text-secondary">NB2</div>
                  <p class="text-[11px] text-text-tertiary mt-0.5">平衡质量与速度</p>
                </div>
              </div>
            </div>
            
            <div class="sidebar-panel">
              <div class="sidebar-header"><h4>📐 画面比例</h4></div>
              <div class="p-3">
                <div class="grid grid-cols-3 gap-2">
                  <button class="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-center">
                    <div class="text-xs font-medium text-orange-400">2:3</div>
                    <div class="text-[10px] text-text-tertiary">竖版</div>
                  </button>
                  <button class="p-2 rounded-lg border border-border text-center hover:border-text-muted">
                    <div class="text-xs font-medium text-text-secondary">1:1</div>
                    <div class="text-[10px] text-text-tertiary">方形</div>
                  </button>
                  <button class="p-2 rounded-lg border border-border text-center hover:border-text-muted">
                    <div class="text-xs font-medium text-text-secondary">3:4</div>
                    <div class="text-[10px] text-text-tertiary">竖幅</div>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="sidebar-panel">
              <div class="sidebar-header"><h4>🎯 视觉DNA</h4></div>
              <div class="p-3">
                <div class="flex flex-wrap gap-1.5">
                  ${(currentChar.visualDNA || ['高颜值', '黑发', '杏眼']).map(d => `<span class="tag tag-orange text-[10px]">${d}</span>`).join('')}
                </div>
              </div>
            </div>
            
            ${!hasChain ? `
              <button onclick="generateCharacterChain()" class="w-full btn-primary py-2.5 text-sm font-medium">🎭 生成定妆照</button>
            ` : `
              <div class="space-y-2">
                <button onclick="regenerateCharacter()" class="w-full btn-secondary py-2 text-sm">🔄 重新生成</button>
                <button class="w-full btn-primary py-2 text-sm">✅ 确认定稿</button>
              </div>
            `}
          </div>
        </div>
      `
    }
    
    function generateCharacterChain() {
      const kappaData = state.pipelineResult?.results?.kappa?.data?.content
      if (!kappaData) { showToast('请先运行五导演分析', 'warning'); return }
      showToast('角色链条任务已启动', 'info')
      renderCharacterPage(document.getElementById('page-content'))
      
      apiCall('/api/image/character-chain', 'POST', { characterData: kappaData, numVariants: 4 }).then(result => {
        if (result.success) {
          pollTask(result.taskId, () => {}, (finalResult) => {
            if (finalResult?.success) {
              state.characterChainResult = finalResult
              renderCharacterPage(document.getElementById('page-content'))
              showToast('角色定妆照生成完成！', 'success')
            } else {
              showToast('生成失败: ' + (finalResult?.error || '未知错误'), 'error')
            }
          }, (e) => showToast('生成失败: ' + e, 'error'))
        }
      })
    }
    
    function regenerateCharacter() {
      state.characterChainResult = null
      generateCharacterChain()
    }
    
    // ========= 4. 分镜页 =========
    function renderStoryboardPage(container) {
      const gammaData = state.pipelineResult?.results?.gamma?.data?.content
      const shots = gammaData?.shots || []
      const hasStoryboard = state.storyboardResult?.success
      
      if (shots.length === 0) {
        container.innerHTML = `
          <div class="max-w-md mx-auto pt-20">
            <div class="card p-8 text-center">
              <div class="text-4xl mb-4">🎬</div>
              <h3 class="text-base font-semibold text-text-primary mb-2">请先完成剧本分析</h3>
              <p class="text-sm text-text-tertiary mb-5">分镜设计需要基于剧本分析结果生成</p>
              <button onclick="showPage('script')" class="btn-primary px-5 py-2 text-sm">去分析剧本</button>
            </div>
          </div>
        `
        return
      }
      
      const paragraphs = [
        { name: '开场空镜', type: '空镜', shots: shots.filter((s, i) => i < 3), duration: '15s' },
        { name: '初次相遇', type: '对话', shots: shots.filter((s, i) => i >= 3 && i < 7), duration: '25s' },
        { name: '深入交谈', type: '对话', shots: shots.filter((s, i) => i >= 7), duration: '20s' },
      ]
      
      const currentPara = paragraphs[state.currentParaIndex || 0]
      
      document.getElementById('header-actions').innerHTML = `
        <div class="capsule-group">
          <button class="capsule-btn active">文字模式</button>
          <button class="capsule-btn">带图模式</button>
        </div>
        <select class="input-field text-xs px-2 py-1.5 w-20">
          <option>16:9 宽屏</option>
          <option>2.35:1 电影</option>
        </select>
        <button class="btn-secondary px-3 py-1.5 text-xs">导出</button>
      `
      
      container.innerHTML = `
        <div class="h-full flex gap-4" style="height: calc(100vh - 90px);">
          <!-- 左栏：段落列表 -->
          <div class="sidebar-panel w-52 flex-shrink-0">
            <div class="sidebar-header"><h4>📋 段落列表</h4></div>
            <div class="flex-1 overflow-y-auto">
              ${paragraphs.map((p, i) => `
                <div class="list-item ${i === state.currentParaIndex ? 'active' : ''}" onclick="selectParagraph(${i})">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-text-primary">${p.name}</span>
                    <span class="tag ${p.type === '空镜' ? 'tag-green' : 'tag-blue'} text-[10px]">${p.type}</span>
                  </div>
                  <div class="text-xs text-text-tertiary">${p.shots.length}镜 · ${p.duration}</div>
                </div>
              `).join('')}
            </div>
            <div class="p-3 border-t border-border space-y-1.5">
              <div class="flex justify-between text-xs"><span class="text-text-tertiary">总镜头</span><span class="font-medium text-text-primary">${shots.length}</span></div>
              <div class="flex justify-between text-xs"><span class="text-text-tertiary">总时长</span><span class="font-medium text-text-primary">${gammaData.totalDuration || 0}秒</span></div>
            </div>
          </div>
          
          <!-- 中栏：分镜网格 -->
          <div class="sidebar-panel flex-1 min-w-0 overflow-hidden">
            <div class="sidebar-header">
              <h4>${currentPara.name}</h4>
              <button class="text-xs text-orange-400 hover:text-orange-300 font-medium">+ 添加镜头</button>
            </div>
            <div class="flex-1 overflow-y-auto p-4">
              <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                ${currentPara.shots.map((shot, i) => {
                  const sbShot = state.storyboardResult?.shots?.find(s => s.shotNumber === shot.shotNumber)
                  const imgUrl = sbShot?.image?.url
                  const isActive = i === state.currentShotIndex
                  return `
                    <div class="rounded-xl overflow-hidden border ${isActive ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-border'} bg-bg-card cursor-pointer hover:border-orange-500/50 transition-all" onclick="selectShotInStoryboard(${i})">
                      <div class="aspect-video bg-bg-tertiary relative">
                        ${imgUrl ? `
                          <img src="${imgUrl}" alt="镜${shot.shotNumber}" class="w-full h-full object-cover" onclick="event.stopPropagation(); openImageModal('${imgUrl}')"/>
                        ` : `
                          <div class="w-full h-full flex flex-col items-center justify-center text-text-muted">
                            <span class="text-lg">🎬</span>
                            <span class="text-xs mt-1">未生成</span>
                          </div>
                        `}
                        <div class="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">${shot.shotNumber || i+1} · ${shot.duration}s</div>
                        <div class="absolute top-2 right-2"><span class="tag tag-neutral bg-black/60 border-0 text-[10px]">${shot.shotType || '中景'}</span></div>
                      </div>
                      <div class="p-2.5">
                        <p class="text-xs text-text-secondary line-clamp-2">${shot.description || ''}</p>
                      </div>
                    </div>
                  `
                }).join('')}
              </div>
              
              ${!hasStoryboard ? `
                <div class="mt-6 text-center">
                  <button onclick="generateStoryboardImages()" class="btn-primary px-6 py-2.5 text-sm font-medium">🎬 生成本段落分镜</button>
                  <p class="text-xs text-text-tertiary mt-2">约需${(currentPara.shots.length * 0.5).toFixed(1)}分钟</p>
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- 右栏：详情 -->
          <div class="w-52 flex-shrink-0 space-y-4 overflow-y-auto scrollbar-thin">
            <div class="sidebar-panel">
              <div class="sidebar-header"><h4>🎬 镜头详情</h4></div>
              <div class="p-3 space-y-2">
                <div class="grid grid-cols-2 gap-2">
                  <div><span class="text-[11px] text-text-tertiary">景别</span><p class="text-xs font-medium text-text-primary mt-0.5">中景</p></div>
                  <div><span class="text-[11px] text-text-tertiary">时长</span><p class="text-xs font-medium text-text-primary mt-0.5">3s</p></div>
                  <div><span class="text-[11px] text-text-tertiary">运镜</span><p class="text-xs font-medium text-text-primary mt-0.5">固定</p></div>
                  <div><span class="text-[11px] text-text-tertiary">角度</span><p class="text-xs font-medium text-text-primary mt-0.5">平视</p></div>
                </div>
              </div>
            </div>
            
            ${hasStoryboard ? `
              <div class="space-y-2">
                <button onclick="regenerateCurrentShot()" class="w-full btn-secondary py-2 text-xs">🔄 重生成当前镜头</button>
                <button class="w-full btn-primary py-2 text-xs">📥 导出全部</button>
              </div>
            ` : ''}
          </div>
        </div>
      `
    }
    
    function selectParagraph(index) {
      state.currentParaIndex = index
      state.currentShotIndex = 0
      renderStoryboardPage(document.getElementById('page-content'))
    }
    
    function selectShotInStoryboard(index) {
      state.currentShotIndex = index
      renderStoryboardPage(document.getElementById('page-content'))
    }
    
    function generateStoryboardImages() {
      showToast('分镜生图任务已启动', 'info')
    }
    
    function regenerateCurrentShot() {
      showToast('重新生成当前镜头...', 'info')
    }
    
    // ========= 5. 成本中心 =========
    function renderCostPage(container) {
      const total = calculateTotalCost()
      const pipelineCost = state.pipelineResult?.totalCost || 0
      const charCost = state.characterChainResult?.total_cost || 0
      const sbCost = state.storyboardResult?.total_cost || 0
      
      const breakdown = []
      if (pipelineCost > 0) breakdown.push({ name: '五导演分析', cost: pipelineCost, icon: '🤖' })
      if (charCost > 0) breakdown.push({ name: '角色一致性链条', cost: charCost, icon: '🎭' })
      if (sbCost > 0) breakdown.push({ name: '分镜生图', cost: sbCost, icon: '🎬' })
      
      container.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-5">
          <div class="card p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-500/30">
            <div class="text-sm text-text-tertiary mb-1">项目累计消耗</div>
            <div class="text-2xl font-bold text-orange-400">${formatCost(total)}</div>
            <div class="text-sm text-text-tertiary mt-2">五导演LLM调用 + 生图API消耗</div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="card p-5">
              <h3 class="text-sm font-semibold text-text-primary mb-4">📊 消耗明细</h3>
              <div class="space-y-2">
                ${breakdown.length > 0 ? breakdown.map(item => `
                  <div class="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
                    <div class="flex items-center gap-3"><span>${item.icon}</span><span class="text-xs text-text-secondary">${item.name}</span></div>
                    <span class="font-semibold text-text-primary text-sm">${formatCost(item.cost)}</span>
                  </div>
                `).join('') : `
                  <div class="text-center py-6"><div class="text-xl mb-2">💰</div><p class="text-xs text-text-tertiary">暂无消耗数据</p></div>
                `}
              </div>
            </div>
            
            <div class="card p-5">
              <h3 class="text-sm font-semibold text-text-primary mb-4">📋 定价参考</h3>
              <div class="space-y-3">
                <div>
                  <div class="text-xs font-medium text-text-tertiary mb-2">LLM 模型</div>
                  <div class="space-y-1 text-xs">
                    <div class="flex justify-between"><span class="text-text-secondary">千问3.7 Plus</span><span class="text-text-tertiary">¥0.012/0.048 /1k</span></div>
                    <div class="flex justify-between"><span class="text-text-secondary">DeepSeek</span><span class="text-text-tertiary">¥0.002/0.008 /1k</span></div>
                  </div>
                </div>
                <div class="divider"></div>
                <div>
                  <div class="text-xs font-medium text-text-tertiary mb-2">生图模型</div>
                  <div class="space-y-1 text-xs">
                    <div class="flex justify-between"><span class="text-text-secondary">NB Pro</span><span class="text-text-tertiary">¥0.30 / 张</span></div>
                    <div class="flex justify-between"><span class="text-text-secondary">NB2</span><span class="text-text-tertiary">¥0.10 / 张</span></div>
                    <div class="flex justify-between"><span class="text-text-secondary">即梦 5.0</span><span class="text-text-tertiary">¥0.08 / 张</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 套餐对比 -->
          <div class="card p-6">
            <h3 class="text-base font-semibold text-text-primary mb-5 text-center">💎 选择适合你的套餐</h3>
            <div class="grid grid-cols-3 gap-4">
              <div class="p-5 rounded-xl bg-bg-tertiary border border-border text-center">
                <div class="text-xs text-text-tertiary mb-1">入门级</div>
                <div class="text-lg font-bold text-text-primary mb-4">标准版</div>
                <ul class="text-xs text-text-secondary space-y-2 mb-5 text-left">
                  <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 2导演联合分析</li>
                  <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 角色一致性链条</li>
                  <li class="flex items-center gap-2 text-text-tertiary"><span>✗</span> 风格多样性</li>
                </ul>
                <div class="text-xl font-bold text-orange-400">¥0.5<span class="text-xs font-normal text-text-tertiary">/次起</span></div>
              </div>
              
              <div class="p-5 rounded-xl bg-orange-500/10 border-2 border-orange-500/50 text-center relative -mt-2">
                <div class="absolute -top-2.5 left-1/2 -translate-x-1/2"><span class="tag tag-orange">最受欢迎</span></div>
                <div class="text-xs text-orange-400 mb-1">进阶级</div>
                <div class="text-lg font-bold text-text-primary mb-4">专业版</div>
                <ul class="text-xs text-text-secondary space-y-2 mb-5 text-left">
                  <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 4导演联合分析</li>
                  <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 角色+场景双链条</li>
                  <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 高质量分镜生成</li>
                  <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 3种风格对比</li>
                </ul>
                <div class="text-xl font-bold text-orange-400">¥1.5<span class="text-xs font-normal text-text-tertiary">/次起</span></div>
              </div>
              
              <div class="p-5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center">
                <div class="text-xs text-purple-400 mb-1">旗舰级</div>
                <div class="text-lg font-bold text-text-primary mb-4">旗舰版</div>
                <ul class="text-xs text-text-secondary space-y-2 mb-5 text-left">
                  <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 5导演全链路分析</li>
                  <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 全角色一致性链条</li>
                  <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 全部分镜+精修</li>
                  <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 5种风格探索</li>
                </ul>
                <div class="text-xl font-bold text-purple-400">¥3.0<span class="text-xs font-normal text-text-tertiary">/次起</span></div>
              </div>
            </div>
          </div>
        </div>
      `
    }
    
    function calculateTotalCost() {
      let total = 0
      if (state.pipelineResult?.totalCost) total += state.pipelineResult.totalCost
      if (state.characterChainResult?.total_cost) total += state.characterChainResult.total_cost
      if (state.storyboardResult?.total_cost) total += state.storyboardResult.total_cost
      return total
    }
    
    // ========= 初始化 =========
    showPage('dashboard')
  </script>
</body>
</html>
'''

with open('/app/data/所有对话/主对话/director-studio/public/index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('文件写入成功')
