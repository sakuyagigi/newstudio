'use client'

import { useState } from 'react'
import { useStudio } from '../../context/StudioContext'

const tabs = [
  { id: 'green-screen', name: '绿幕合成', icon: '🟢' },
  { id: 'lut', name: 'LUT调色', icon: '🎨' },
  { id: 'layers', name: '分层合成', icon: '📚' },
  { id: 's-shots', name: 'S级镜头库', icon: '⭐' },
]

export default function PostProductionPage() {
  const { storyboards, luts, updateShot, toggleSLevel, MODEL_RECOMMEND } = useStudio()
  const [activeTab, setActiveTab] = useState('s-shots')
  const [selectedLUT, setSelectedLUT] = useState(null)
  const [uploadedGreenScreen, setUploadedGreenScreen] = useState(null)
  const [compositeMode, setCompositeMode] = useState('ai-inpaint') // ai-inpaint / green-screen

  const sLevelShots = storyboards.filter(s => s.isSLevel)

  return (
    <div className="h-full flex flex-col">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">后期特效台</h1>
          <p className="text-neutral-500 mt-1 text-sm">SIGMA · 后期特效总监工作台</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50">
            导出成片
          </button>
          <button className="px-4 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium shadow-card hover:shadow-card-hover transition-all">
            批量处理
          </button>
        </div>
      </div>

      {/* Tab 导航 */}
      <div className="bg-white rounded-xl shadow-card p-2 mb-6 flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? 'bg-brand-50 text-brand-600'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.name}
            {tab.id === 's-shots' && (
              <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                {sLevelShots.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 主内容区 */}
      <div className="flex-1 min-h-0">
        {/* S级镜头库 */}
        {activeTab === 's-shots' && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-red-50 to-amber-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⭐</span>
                <div>
                  <h3 className="font-semibold text-neutral-800">S级镜头库</h3>
                  <p className="text-sm text-neutral-500">全项目S级重点镜头统一管理，支持绿幕补拍、精修合成</p>
                </div>
              </div>
            </div>

            {sLevelShots.length === 0 ? (
              <div className="bg-white rounded-xl shadow-card p-16 text-center">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">暂无S级镜头</h3>
                <p className="text-sm text-neutral-500 mb-6">在分镜台中标记重要镜头为S级，即可在这里统一处理</p>
                <button className="px-6 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
                  前往分镜台
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {sLevelShots.map((shot) => (
                  <div key={shot.id} className="bg-white rounded-xl shadow-card overflow-hidden">
                    <div className="aspect-video bg-neutral-900 relative">
                      <img src={shot.image} alt="" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full">
                          S级
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                          {shot.duration}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-neutral-800">{shot.title}</h4>
                        <span className="text-xs text-neutral-400">{shot.shotNo}</span>
                      </div>
                      <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{shot.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="p-2 bg-neutral-50 rounded-lg">
                          <div className="text-xs text-neutral-400">景别</div>
                          <div className="text-sm font-medium text-neutral-700">{shot.shotSize}</div>
                        </div>
                        <div className="p-2 bg-neutral-50 rounded-lg">
                          <div className="text-xs text-neutral-400">运镜</div>
                          <div className="text-sm font-medium text-neutral-700">{shot.cameraMove}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setActiveTab('green-screen')}
                          className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                        >
                          绿幕补拍
                        </button>
                        <button 
                          onClick={() => setActiveTab('lut')}
                          className="flex-1 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                        >
                          调色
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 绿幕合成 */}
        {activeTab === 'green-screen' && (
          <div className="grid grid-cols-2 gap-6 h-full">
            {/* 左侧：上传区 */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="font-semibold text-neutral-800 mb-4">绿幕素材上传</h3>
              
              <div className="space-y-4">
                {/* 模式选择 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setCompositeMode('ai-inpaint')}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                      compositeMode === 'ai-inpaint'
                        ? 'border-brand-400 bg-brand-50 text-brand-600'
                        : 'border-neutral-200 text-neutral-500'
                    }`}
                  >
                    🤖 AI融合
                  </button>
                  <button
                    onClick={() => setCompositeMode('green-screen')}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium border-2 transition-all ${
                      compositeMode === 'green-screen'
                        ? 'border-green-400 bg-green-50 text-green-600'
                        : 'border-neutral-200 text-neutral-500'
                    }`}
                  >
                    🟢 绿幕抠像
                  </button>
                </div>

                {/* 上传区域 */}
                <div className="border-2 border-dashed border-neutral-200 rounded-xl p-10 text-center hover:border-brand-300 transition-colors cursor-pointer">
                  <div className="text-4xl mb-3">📹</div>
                  <p className="text-sm text-neutral-600 mb-1">
                    {compositeMode === 'green-screen' ? '上传绿幕拍摄素材' : '上传真人拍摄素材'}
                  </p>
                  <p className="text-xs text-neutral-400">支持 MP4, MOV, WebM 格式</p>
                  <button className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
                    选择文件
                  </button>
                </div>

                {uploadedGreenScreen && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">✅</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-green-700">素材已上传</div>
                        <div className="text-xs text-green-600">greenscreen_001.mp4 · 15s · 1080p</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 参数设置 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-neutral-700">合成参数</h4>
                  
                  <div>
                    <label className="text-sm text-neutral-600 mb-2 block">抠像强度</label>
                    <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
                  </div>
                  
                  <div>
                    <label className="text-sm text-neutral-600 mb-2 block">边缘羽化</label>
                    <input type="range" min="0" max="100" defaultValue="30" className="w-full" />
                  </div>
                  
                  <div>
                    <label className="text-sm text-neutral-600 mb-2 block">色彩匹配</label>
                    <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white">
                      <option>自动匹配</option>
                      <option>手动调整</option>
                      <option>保留原色</option>
                    </select>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm">
                  开始合成
                </button>
              </div>
            </div>

            {/* 右侧：预览区 */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-800">合成预览</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-600">
                    原图
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-brand-50 text-brand-600 border border-brand-200 rounded-lg">
                    合成
                  </button>
                </div>
              </div>

              <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-3">🎬</div>
                  <p className="text-neutral-400 text-sm">合成预览</p>
                  <p className="text-neutral-500 text-xs mt-1">上传素材后点击合成查看效果</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
                <h4 className="text-sm font-medium text-neutral-700 mb-2">工作流程</h4>
                <div className="space-y-2">
                  {[
                    { step: 1, text: 'AI生成基础镜头', status: 'done' },
                    { step: 2, text: '提取运镜与光影参考', status: 'done' },
                    { step: 3, text: '真人绿幕表演补拍', status: 'current' },
                    { step: 4, text: 'AI抠像与合成', status: 'pending' },
                    { step: 5, text: '色彩匹配与精修', status: 'pending' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        item.status === 'done' ? 'bg-emerald-500 text-white' :
                        item.status === 'current' ? 'bg-brand-500 text-white' :
                        'bg-neutral-200 text-neutral-500'
                      }`}>
                        {item.status === 'done' ? '✓' : item.step}
                      </div>
                      <span className={`text-sm ${
                        item.status === 'done' ? 'text-emerald-600' :
                        item.status === 'current' ? 'text-brand-600 font-medium' :
                        'text-neutral-400'
                      }`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LUT调色 */}
        {activeTab === 'lut' && (
          <div className="grid grid-cols-3 gap-6">
            {/* LUT 预设列表 */}
            <div className="col-span-1 bg-white rounded-xl shadow-card p-5">
              <h3 className="font-semibold text-neutral-800 mb-4">LUT 预设</h3>
              <div className="space-y-3">
                {luts.map((lut) => (
                  <div
                    key={lut.id}
                    onClick={() => setSelectedLUT(lut.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
                      selectedLUT === lut.id
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-2 bg-neutral-100">
                      <img src={lut.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="font-medium text-sm text-neutral-700">{lut.name}</div>
                    <div className="text-xs text-neutral-400">{lut.desc}</div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 border-2 border-dashed border-neutral-200 rounded-lg text-sm text-neutral-500 hover:border-brand-300 hover:text-brand-500 transition-colors">
                + 上传自定义LUT
              </button>
            </div>

            {/* 预览区 */}
            <div className="col-span-2 bg-white rounded-xl shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-800">调色预览</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs bg-neutral-100 text-neutral-600 rounded-lg">
                    原图
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-brand-50 text-brand-600 rounded-lg">
                    调色后
                  </button>
                </div>
              </div>

              <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-3">🎨</div>
                  <p className="text-neutral-400 text-sm">选择LUT查看预览效果</p>
                </div>
              </div>

              {/* 调色参数 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-neutral-600 mb-2 block">强度</label>
                  <input type="range" min="0" max="100" defaultValue="70" className="w-full" />
                  <div className="text-xs text-neutral-400 text-center mt-1">70%</div>
                </div>
                <div>
                  <label className="text-sm text-neutral-600 mb-2 block">对比度</label>
                  <input type="range" min="-50" max="50" defaultValue="10" className="w-full" />
                  <div className="text-xs text-neutral-400 text-center mt-1">+10</div>
                </div>
                <div>
                  <label className="text-sm text-neutral-600 mb-2 block">饱和度</label>
                  <input type="range" min="-50" max="50" defaultValue="5" className="w-full" />
                  <div className="text-xs text-neutral-400 text-center mt-1">+5</div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button className="flex-1 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
                  应用到选中镜头
                </button>
                <button className="px-6 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50">
                  批量应用
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 分层合成 */}
        {activeTab === 'layers' && (
          <div className="grid grid-cols-12 gap-6">
            {/* 图层列表 */}
            <div className="col-span-4 bg-white rounded-xl shadow-card p-5">
              <h3 className="font-semibold text-neutral-800 mb-4">图层管理</h3>
              <div className="space-y-2">
                {[
                  { name: '背景层', type: 'scene', visible: true, locked: false },
                  { name: '角色层', type: 'character', visible: true, locked: false },
                  { name: '道具层', type: 'prop', visible: true, locked: false },
                  { name: '前景装饰', type: 'overlay', visible: true, locked: false },
                  { name: '特效层', type: 'fx', visible: false, locked: true },
                  { name: '调色层', type: 'color', visible: true, locked: false },
                ].map((layer, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-neutral-200 flex items-center gap-3 hover:bg-neutral-50 cursor-pointer"
                  >
                    <button className="text-neutral-400 hover:text-neutral-600 text-sm">
                      {layer.visible ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-neutral-700">{layer.name}</div>
                      <div className="text-xs text-neutral-400">{layer.type}</div>
                    </div>
                    <button className="text-neutral-400 hover:text-neutral-600 text-sm">
                      {layer.locked ? '🔒' : '🔓'}
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 border-2 border-dashed border-neutral-200 rounded-lg text-sm text-neutral-500 hover:border-brand-300 hover:text-brand-500 transition-colors">
                + 添加图层
              </button>
            </div>

            {/* 画布预览 */}
            <div className="col-span-8 bg-white rounded-xl shadow-card p-5">
              <h3 className="font-semibold text-neutral-800 mb-4">合成预览</h3>
              <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-neutral-400">分层合成预览</p>
                  <p className="text-neutral-500 text-sm mt-2">调整图层顺序和透明度</p>
                </div>
              </div>

              {/* 混合模式 */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {['正常', '正片叠底', '滤色', '叠加', '柔光', '强光', '颜色', '亮度'].map((mode) => (
                  <button
                    key={mode}
                    className={`py-2 text-xs rounded-lg border ${
                      mode === '正常'
                        ? 'bg-brand-50 text-brand-600 border-brand-200'
                        : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
