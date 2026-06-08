// 火山引擎 AI MediaKit 封装
// 提供视频后期处理能力：字幕擦除、水印擦除、画质增强等

const MEDIAKIT_CONFIG = {
  baseUrl: 'https://mediakit.cn-beijing.volces.com/api/v1',
  apiKey: process.env.VOLC_MEDIAKIT_API_KEY || process.env.VOLCENGINE_ARK_API_KEY || '',
}

// 任务状态轮询配置
const POLL_INTERVAL = 3000 // 3秒轮询一次
const MAX_POLLS = 60 // 最多轮询60次（3分钟）

/**
 * 调用 MediaKit 工具
 */
async function callMediaKit(action, body) {
  if (!MEDIAKIT_CONFIG.apiKey) {
    throw new Error('MediaKit API Key 未配置')
  }

  const response = await fetch(`${MEDIAKIT_CONFIG.baseUrl}/tools/${action}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MEDIAKIT_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`MediaKit ${action} 调用失败 [${response.status}]: ${errorText}`)
  }

  return response.json()
}

/**
 * 查询任务状态
 */
async function getTaskStatus(taskId) {
  const response = await fetch(`${MEDIAKIT_CONFIG.baseUrl}/tasks/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${MEDIAKIT_CONFIG.apiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error(`查询任务状态失败 [${response.status}]`)
  }

  return response.json()
}

/**
 * 轮询任务直到完成
 */
async function waitForTask(taskId, onProgress) {
  for (let i = 0; i < MAX_POLLS; i++) {
    const status = await getTaskStatus(taskId)
    
    if (onProgress) {
      onProgress(status)
    }

    if (status.status === 'completed' || status.status === 'success') {
      return status
    }

    if (status.status === 'failed' || status.status === 'error') {
      throw new Error(`任务失败: ${status.error || status.message || '未知错误'}`)
    }

    await new Promise(r => setTimeout(r, POLL_INTERVAL))
  }

  throw new Error('任务超时')
}

// ========== 具体功能 ==========

/**
 * 字幕擦除
 * @param {string} videoUrl - 视频URL（公网可访问）
 * @param {object} options - 选项
 */
export async function eraseSubtitles(videoUrl, options = {}) {
  const result = await callMediaKit('erase-video-subtitle-pro', {
    video_url: videoUrl,
    ...options,
  })

  if (result.task_id) {
    return waitForTask(result.task_id)
  }

  return result
}

/**
 * 水印擦除
 * @param {string} videoUrl - 视频URL
 * @param {object} options - 选项
 */
export async function eraseWatermark(videoUrl, options = {}) {
  const result = await callMediaKit('erase-video-watermark-pro', {
    video_url: videoUrl,
    ...options,
  })

  if (result.task_id) {
    return waitForTask(result.task_id)
  }

  return result
}

/**
 * 物体擦除
 * @param {string} videoUrl - 视频URL
 * @param {Array} bboxes - 要擦除的区域 [{x, y, w, h}]
 */
export async function eraseObject(videoUrl, bboxes, options = {}) {
  const result = await callMediaKit('erase-video-object-pro', {
    video_url: videoUrl,
    bboxes,
    ...options,
  })

  if (result.task_id) {
    return waitForTask(result.task_id)
  }

  return result
}

/**
 * 画质增强
 * @param {string} videoUrl - 视频URL
 * @param {string} strength - 强度: low/medium/high
 */
export async function enhanceVideo(videoUrl, strength = 'medium') {
  const result = await callMediaKit('enhance-video-quality', {
    video_url: videoUrl,
    strength,
  })

  if (result.task_id) {
    return waitForTask(result.task_id)
  }

  return result
}

/**
 * 老片修复
 * @param {string} videoUrl - 视频URL
 */
export async function restoreOldVideo(videoUrl) {
  const result = await callMediaKit('restore-old-video', {
    video_url: videoUrl,
  })

  if (result.task_id) {
    return waitForTask(result.task_id)
  }

  return result
}

/**
 * 漫剧转绘
 * @param {string} videoUrl - 视频URL
 * @param {string} style - 风格: anime/3d-cartoon/sketch/oil-painting
 */
export async function videoToAnime(videoUrl, style = 'anime') {
  const result = await callMediaKit('video-to-anime', {
    video_url: videoUrl,
    style,
  })

  if (result.task_id) {
    return waitForTask(result.task_id)
  }

  return result
}

export default {
  eraseSubtitles,
  eraseWatermark,
  eraseObject,
  enhanceVideo,
  restoreOldVideo,
  videoToAnime,
  getTaskStatus,
}
