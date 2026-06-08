// 516平台API兼容层 - 内部调用五导演体系
// 保留旧接口，底层走新的五导演架构

import { alphaAnalyzeScript, gammaGenerateStoryboard, kappaDesignCharacter } from './directors'

/**
 * 剧本分析
 * 兼容旧接口，底层调用ALPHA导演
 */
export async function analyzeScript(content, options = {}) {
  const result = await alphaAnalyzeScript(content, options)
  
  return {
    success: true,
    characters: result.content?.characters || [],
    scenes: result.content?.scenes || [],
    plotStructure: result.content?.plotStructure || [],
    themes: result.content?.themes || [],
    estimatedShots: result.content?.estimatedShots || 0,
    estimatedDuration: result.content?.estimatedDuration || '0分钟',
    raw: result,
  }
}

/**
 * 角色生成
 * 兼容旧接口，底层调用KAPPA导演
 */
export async function generateCharacter(description, options = {}) {
  const result = await kappaDesignCharacter(description, options)
  
  return {
    success: true,
    character: result.content,
    raw: result,
  }
}

/**
 * 分镜生成
 * 兼容旧接口，底层调用GAMMA导演
 */
export async function generateStoryboard(script, options = {}) {
  const result = await gammaGenerateStoryboard(script, options)
  
  return {
    success: true,
    storyboards: result.content?.shots || [],
    raw: result,
  }
}

export default {
  analyzeScript,
  generateCharacter,
  generateStoryboard,
}
