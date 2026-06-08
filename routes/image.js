import { Router } from 'express'
import { generateImage, getImageTaskStatus } from '../lib/imageGen.js'

const router = Router()

// 生成图像
router.post('/generate', async (req, res) => {
  try {
    const { prompt, model, options } = req.body
    const result = await generateImage(prompt, model, options)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Image generation error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 查询任务状态
router.get('/status/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params
    const { model } = req.query
    const result = await getImageTaskStatus(taskId, model)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Image status error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
