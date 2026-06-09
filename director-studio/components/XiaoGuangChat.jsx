'use client'

import { useState, useRef, useEffect } from 'react'

const mockMessages = [
  { id: 1, role: 'ai', text: '您好！我是小光助手，有什么可以帮您的吗？', time: '18:00' },
  { id: 2, role: 'ai', text: '您可以让我分析剧本、生成角色定妆、创建分镜，或者查询项目进度。', time: '18:00' },
]

const quickReplies = ['帮我分析这个剧本', '生成角色定妆', '查看项目成本']

const commands = [
  { cmd: '/analyze', desc: '剧本深度分析', icon: '📝' },
  { cmd: '/character', desc: '生成角色定妆', icon: '👤' },
  { cmd: '/storyboard', desc: '创建分镜脚本', icon: '🎨' },
  { cmd: '/render', desc: '视频渲染任务', icon: '🎞️' },
  { cmd: '/help', desc: '查看帮助文档', icon: '❓' },
]

export default function XiaoGuangChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(mockMessages)
  const [inputText, setInputText] = useState('')
  const [showCommands, setShowCommands] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputText(value)
    setShowCommands(value.startsWith('/'))
  }

  const handleSend = () => {
    if (!inputText.trim()) return

    const userMsg = {
      id: messages.length + 1,
      role: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages([...messages, userMsg])
    setInputText('')
    setShowCommands(false)
    setIsTyping(true)

    // 模拟AI回复
    setTimeout(() => {
      const aiMsg = {
        id: messages.length + 2,
        role: 'ai',
        text: '好的，我来帮您处理这个任务。请稍等片刻...',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickReply = (text) => {
    setInputText(text)
  }

  const handleCommand = (cmd) => {
    setInputText(cmd + ' ')
    setShowCommands(false)
  }

  const filteredCommands = commands.filter(c =>
    c.cmd.startsWith(inputText.toLowerCase())
  )

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center text-2xl"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* 聊天面板 */}
      <div
        className={`fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h3 className="font-bold">小光助手</h3>
              <p className="text-xs text-white/80">AI制片助理 · 在线</p>
            </div>
          </div>
        </div>

        {/* 消息区域 */}
        <div className="h-[300px] overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
                  光
                </div>
              )}
              <div
                className={`max-w-[220px] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md'
                    : 'bg-white text-gray-700 shadow-sm rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
                光
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 快捷回复 */}
        <div className="px-4 py-2 border-t border-gray-100 flex gap-2 overflow-x-auto">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleQuickReply(reply)}
              className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs whitespace-nowrap hover:bg-orange-100 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* 命令面板 */}
        {showCommands && filteredCommands.length > 0 && (
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
            {filteredCommands.map((cmd) => (
              <button
                key={cmd.cmd}
                onClick={() => handleCommand(cmd.cmd)}
                className="w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center gap-3"
              >
                <span className="text-lg">{cmd.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-700">{cmd.cmd}</div>
                  <div className="text-xs text-gray-400">{cmd.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 输入区域 */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入消息或 / 唤起命令..."
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium hover:shadow-md transition-shadow"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
