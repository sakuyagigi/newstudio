// 图像生成API统一封装 - 服务端调用
// 支持多模型：NanoBanana NB2 / NB Pro / GPT Image 2 / 即梦 / 万相

// 优先级：NB2 > NB Pro > GPT Image 2 > 即梦 > 万相

const NANO_BANANA_API_KEY = process.env.NANO_BANANA_API_KEY || process.env.SUCHUANG_API_KEY || ''
const NANO_BANANA_BASE_URL = 'https://api.suchuang.vip'

const VOLCENGINE_ARK_API_KEY = process.env.VOLCENGINE_ARK_API_KEY || ''
const VOLCENGINE_ARK_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3'

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || ''

// 模型配置
export const IMAGE_MODELS = {
  nb2: {
    name: 'NanoBanana 2',
    code: 'nb2',
    provider: 'nanoBanana',
    price: 0.1, // 元/张
    quality: 'high',
    description: '性价比最高，优先使用',
  },
  nbPro: {
    name: 'NanoBanana Pro',
    code: 'nbPro',
    provider: 'nanoBanana',
    price: 0.3, // 元/张
    quality: 'premium',
    description: '高质量，次选',
  },
  gptImage2: {
    name: 'GPT Image 2',
    code: 'gptImage2',
    provider: 'nanoBanana',
    price: 0.1, // 元/张
    quality: 'good',
    description: '兜底方案',
  },
  seedream: {
    name: '即梦 Seedream 4.0',
    code: 'seedream',
    provider: 'volcengine',
    price: 0.08, // 元/张
    quality: 'good',
    modelId: 'doubao-seedream-4-0-250828',
    description: '火山引擎即梦，备用',
  },
  wanx: {
    name: '万相 WANX',
    code: 'wanx',
    provider: 'dashscope',
    price: 0.08, // 元/张
    quality: 'good',
    description: '阿里万相，备用',
  },
}

// 默认优先级
export const DEFAULT_PRIORITY = ['nb2', 'nbPro', 'gptImage2', 'seedream', 'wanx']

// ========== NanoBanana / 速创平台 ==========
// OpenAI兼容格式
async function generateWithNanoBanana({
  model = 'gpt-image-2', // gpt-image-2 / image_nanoBanana2 / image_nanoBanana_pro
  prompt,
  size = '1024*1024',
  aspectRatio = '1:1',
  n = 1,
  referenceImages = [],
}) {
  if (!NANO_BANANA_API_KEY) {
    throw new Error('NanoBanana API Key 未配置')
  }

  // 不同模型走不同端点
  let endpoint = '/v1/images/generations'
  let body = {
    model,
    prompt,
    n,
    size,
    response_format: 'b64_json',
  }

  // NB2和NB Pro是旧格式API
  if (model === 'image_nanoBanana2' || model === 'image_nanoBanana_pro') {
    endpoint = '/api/async/image_nanoBanana2'
    if (model === 'image_nanoBanana_pro') {
      endpoint = '/api/async/image_nanoBanana_pro'
    }
    body = {
      prompt,
      size,
      aspectRatio,
      ...(referenceImages.length > 0 && { urls: referenceImages }),
    }
  }

  const response = await fetch(`${NANO_BANANA_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NANO_BANANA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`NanoBanana 生图失败 [${response.status}]: ${errorText}`)
  }

  const data = await response.json()
  
  // 新格式（OpenAI兼容）
  if (data.data) {
    return {
      success: true,
      images: data.data.map((item, i) => ({
        id: `img_${Date.now()}_${i}`,
        b64_json: item.b64_json,
        url: item.url,
      })),
      model,
      provider: 'nanoBanana',
    }
  }
  
  // 旧格式（异步任务）
  if (data.id || data.task_id) {
    return {
      success: true,
      taskId: data.id || data.task_id,
      status: 'pending',
      model,
      provider: 'nanoBanana',
      async: true,
    }
  }

  return { success: false, error: '未知返回格式', raw: data }
}

// 查询NanoBanana异步任务
async function getNanoBananaTaskStatus(taskId) {
  const response = await fetch(
    `${NANO_BANANA_BASE_URL}/api/async/detail?id=${taskId}&key=${NANO_BANANA_API_KEY}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  if (!response.ok) {
    throw new Error(`任务查询失败 [${response.status}]`)
  }

  const data = await response.json()
  return {
    taskId,
    status: data.status || data.code === 0 ? 'succeeded' : 'pending',
    images: data.images || (data.url ? [{ url: data.url }] : []),
    raw: data,
  }
}

// ========== 火山引擎 即梦 ==========
async function generateWithSeedream({
  prompt,
  size = '1024x1024',
  n = 1,
  model = 'doubao-seedream-4-0-250828',
}) {
  if (!VOLCENGINE_ARK_API_KEY) {
    throw new Error('火山引擎 Ark API Key 未配置')
  }

  const response = await fetch(`${VOLCENGINE_ARK_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VOLCENGINE_ARK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      n,
      size,
      response_format: 'url',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`即梦生图失败 [${response.status}]: ${errorText}`)
  }

  const data = await response.json()
  
  return {
    success: true,
    images: data.data?.map((item, i) => ({
      id: `img_${Date.now()}_${i}`,
      url: item.url,
      b64_json: item.b64_json,
    })) || [],
    model,
    provider: 'volcengine',
  }
}

// ========== 阿里万相 ==========
async function generateWithWanx({
  prompt,
  size = '1024*1024',
  n = 1,
  style = '<photography>',
}) {
  if (!DASHSCOPE_API_KEY) {
    throw new Error('DashScope API Key 未配置')
  }

  const response = await fetch(
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: { prompt },
        parameters: { size, n, style },
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`万相生图失败 [${response.status}]: ${errorText}`)
  }

  const data = await response.json()
  
  return {
    success: true,
    taskId: data.output?.task_id,
    status: data.output?.task_status || 'pending',
    model: 'wanx-v1',
    provider: 'dashscope',
    async: true,
  }
}

// 查询万相任务
async function getWanxTaskStatus(taskId) {
  const response = await fetch(
    `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`万相任务查询失败 [${response.status}]`)
  }

  const data = await response.json()
  return {
    taskId,
    status: data.output?.task_status,
    images: data.output?.results?.map(r => ({ url: r.url })) || [],
    raw: data,
  }
}

// ========== 统一入口 ==========
// 自动按优先级降级尝试
export async function generateImage({
  prompt,
  size = '1024*1024',
  aspectRatio = '1:1',
  n = 1,
  priority = DEFAULT_PRIORITY,
  referenceImages = [],
  style = 'photography',
}) {
  const errors = []

  for (const modelCode of priority) {
    const modelConfig = IMAGE_MODELS[modelCode]
    if (!modelConfig) continue

    try {
      console.log(`[生图] 尝试 ${modelConfig.name}...`)
      
      let result
      
      switch (modelConfig.provider) {
        case 'nanoBanana':
          // 映射模型名
          const nbModelMap = {
            nb2: 'image_nanoBanana2',
            nbPro: 'image_nanoBanana_pro',
            gptImage2: 'gpt-image-2',
          }
          result = await generateWithNanoBanana({
            model: nbModelMap[modelCode],
            prompt,
            size,
            aspectRatio,
            n,
            referenceImages,
          })
          break
          
        case 'volcengine':
          result = await generateWithSeedream({
            prompt,
            size: size.replace('*', 'x'),
            n,
            model: modelConfig.modelId,
          })
          break
          
        case 'dashscope':
          result = await generateWithWanx({
            prompt,
            size,
            n,
            style: `<${style}>`,
          })
          break
          
        default:
          continue
      }

      console.log(`[生图] ${modelConfig.name} 成功`)
      return {
        ...result,
        modelCode,
        modelName: modelConfig.name,
        price: modelConfig.price * n,
      }
    } catch (error) {
      console.warn(`[生图] ${modelConfig.name} 失败:`, error.message)
      errors.push({ model: modelConfig.name, error: error.message })
      // 继续尝试下一个
    }
  }

  // 全部失败
  return {
    success: false,
    error: '所有生图模型均失败',
    errors,
  }
}

// 查询异步任务状态
export async function getImageTaskStatus(taskId, provider) {
  switch (provider) {
    case 'nanoBanana':
      return getNanoBananaTaskStatus(taskId)
    case 'dashscope':
      return getWanxTaskStatus(taskId)
    default:
      return { taskId, status: 'unknown', error: '未知provider' }
  }
}
