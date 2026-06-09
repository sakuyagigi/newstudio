// 516平台API封装 - 服务端调用，API Key永不暴露给前端

const API_BASE_URL = process.env.NEXT_PUBLIC_516_API_URL || 'https://api.516platform.com'
const API_KEY = process.env.STRAPP_API_KEY || ''

export async function fetch516API(endpoint, options = {}) {
  if (!API_KEY) {
    throw new Error('API Key 未配置，请在环境变量中设置 STRAPP_API_KEY')
  }

  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`516 API 调用失败: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// 剧本分析
export async function analyzeScript(scriptContent, options = {}) {
  return fetch516API('/v1/script/analyze', {
    method: 'POST',
    body: JSON.stringify({
      content: scriptContent,
      ...options,
    }),
  })
}

// 角色生成
export async function generateCharacter(characterDescription, style = 'film') {
  return fetch516API('/v1/image/generate', {
    method: 'POST',
    body: JSON.stringify({
      prompt: characterDescription,
      style,
      model: 'realistic-v3',
    }),
  })
}

// 分镜生成
export async function generateStoryboard(sceneDescription, options = {}) {
  return fetch516API('/v1/storyboard/generate', {
    method: 'POST',
    body: JSON.stringify({
      description: sceneDescription,
      ...options,
    }),
  })
}

// 视频生成
export async function generateVideo(prompt, options = {}) {
  return fetch516API('/v1/video/generate', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      ...options,
    }),
  })
}

// 查询任务状态
export async function getTaskStatus(taskId) {
  return fetch516API(`/v1/tasks/${taskId}`)
}
