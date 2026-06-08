import { Router } from 'express'
import mediaKit from '../lib/mediaKit.js'

const router = Router()

// 后期处理统一接口
router.post('/process', async (req, res) => {
  try {
    const { action, videoUrl, options } = req.body
    const result = await mediaKit.process(action, videoUrl, options)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Media processing error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 查询任务状态
router.get('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params
    const result = await mediaKit.getTaskStatus(taskId)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Media task status error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
