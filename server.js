import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.static(path.join(__dirname, 'public')))

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 导入API路由
import directorsRouter from './routes/directors.js'
import imageRouter from './routes/image.js'
import mediaRouter from './routes/media.js'
import monitorRouter from './routes/monitor.js'

// API路由
app.use('/api/directors', directorsRouter)
app.use('/api/image', imageRouter)
app.use('/api/media', mediaRouter)
app.use('/api/monitor', monitorRouter)

// SPA前端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 墨枢光影导演台已启动`)
  console.log(`📍 本地访问: http://localhost:${PORT}`)
  console.log(`📅 启动时间: ${new Date().toLocaleString('zh-CN')}`)
})
