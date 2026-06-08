import { Router } from 'express'
import {
  alphaAnalyzeScript,
  betaDesignVisual,
  gammaGenerateStoryboard,
  kappaDesignCharacter,
  epsilonCreateSchedule,
  runDirectorPipeline,
} from '../lib/directors.js'

const router = Router()

// 五导演流水线
router.post('/analyze', async (req, res) => {
  try {
    const { script, options } = req.body
    const result = await runDirectorPipeline(script, options)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Director pipeline error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// ALPHA - 剧本分析
router.post('/alpha', async (req, res) => {
  try {
    const { script, options } = req.body
    const result = await alphaAnalyzeScript(script, options)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Alpha error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// BETA - 视觉设计
router.post('/beta', async (req, res) => {
  try {
    const { sceneDescription, options } = req.body
    const result = await betaDesignVisual(sceneDescription, options)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Beta error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GAMMA - 分镜生成
router.post('/gamma', async (req, res) => {
  try {
    const { sceneContent, options } = req.body
    const result = await gammaGenerateStoryboard(sceneContent, options)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Gamma error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// KAPPA - 角色定妆
router.post('/kappa', async (req, res) => {
  try {
    const { characterDescription, options } = req.body
    const result = await kappaDesignCharacter(characterDescription, options)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Kappa error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// EPSILON - 制片计划
router.post('/epsilon', async (req, res) => {
  try {
    const { projectData, options } = req.body
    const result = await epsilonCreateSchedule(projectData, options)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Epsilon error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
