import { Router } from 'express'
import { getSystemHealth, getErrorStats, getApiStats } from '../lib/monitoring.js'
import { getStats as getCostStats } from '../lib/costTracker.js'

const router = Router()

// 系统监控总览
router.get('/', async (req, res) => {
  try {
    const [health, errors, apiStats, costStats] = await Promise.all([
      getSystemHealth(),
      getErrorStats(),
      getApiStats(),
      getCostStats(),
    ])
    
    res.json({
      success: true,
      data: { health, errors, apiStats, costStats },
    })
  } catch (error) {
    console.error('Monitor error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 健康检查
router.get('/health', async (req, res) => {
  try {
    const health = await getSystemHealth()
    res.json({ success: true, data: health })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 成本统计
router.get('/cost', async (req, res) => {
  try {
    const costStats = await getCostStats()
    res.json({ success: true, data: costStats })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 错误统计
router.get('/errors', async (req, res) => {
  try {
    const errorStats = await getErrorStats()
    res.json({ success: true, data: errorStats })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
