// 导演降级重试模块
// 每个导演配置多层降级路径，调用失败自动切换模型

import { DIRECTOR_MODELS } from './directors'

const PROVIDERS = {
  dashscope: {
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: process.env.DASHSCOPE_API_KEY || '',
  },
  volcengine: {
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKey: process.env.VOLCENGINE_ARK_API_KEY || '',
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY || '',
  },
  moonshot: {
    baseUrl: 'https://api.moonshot.cn/v1',
    apiKey: process.env.MOONSHOT_API_KEY || '',
  },
  zhipu: {
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ZHIPU_API_KEY || '',
  },
}

// 每个导演的降级路径（主模型 → 备用1 → 备用2）
const FALLBACK_CHAINS = {
  alpha: [
    { provider: 'dashscope', model: 'qwen3.7-plus', label: '主模型' },
    { provider: 'dashscope', model: 'qwen-plus', label: '备用1 (千问Plus)' },
    { provider: 'zhipu', model: 'glm-4.7-flash', label: '备用2 (GLM)' },
  ],
  beta: [
    { provider: 'volcengine', model: 'doubao-seed-2-0-pro-260215', label: '主模型' },
    { provider: 'dashscope', model: 'qwen-plus', label: '备用1 (千问Plus)' },
    { provider: 'zhipu', model: 'glm-4.7-flash', label: '备用2 (GLM)' },
  ],
  gamma: [
    { provider: 'deepseek', model: 'deepseek-chat', label: '主模型' },
    { provider: 'dashscope', model: 'qwen-plus', label: '备用1 (千问Plus)' },
    { provider: 'zhipu', model: 'glm-4.7-flash', label: '备用2 (GLM)' },
  ],
  kappa: [
    { provider: 'moonshot', model: 'kimi-k2.6', label: '主模型' },
    { provider: 'dashscope', model: 'qwen-plus', label: '备用1 (千问Plus)' },
    { provider: 'zhipu', model: 'glm-4.7-flash', label: '备用2 (GLM)' },
  ],
  epsilon: [
    { provider: 'dashscope', model: 'qwen-plus', label: '主模型' },
    { provider: 'zhipu', model: 'glm-4.7-flash', label: '备用1 (GLM)' },
    { provider: 'deepseek', model: 'deepseek-chat', label: '备用2 (DeepSeek)' },
  ],
}

// 底层LLM调用
async function callLLM(provider, options) {
  const config = PROVIDERS[provider]
  if (!config) throw new Error(`未知提供商: ${provider}`)
  if (!config.apiKey) throw new Error(`${provider} API Key 未配置`)

  const {
    model,
    messages,
    temperature = 0.7,
    maxTokens = 2000,
    stream = false,
    response_format = null,
    specialParams = {},
  } = options

  const body = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream,
    ...specialParams,
  }

  if (response_format === 'json') {
    body.response_format = { type: 'json_object' }
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`[${provider}] ${response.status}: ${errorText.substring(0, 200)}`)
  }

  if (stream) return response.body

  const data = await response.json()
  const usage = data.usage || {}

  return {
    success: true,
    content: data.choices?.[0]?.message?.content || '',
    usage: {
      inputTokens: usage.prompt_tokens || 0,
      outputTokens: usage.completion_tokens || 0,
      totalTokens: usage.total_tokens || 0,
    },
    model: data.model || model,
  }
}

/**
 * 带降级重试的导演调用
 * @param {string} director - 导演名称
 * @param {object} callOptions - 调用参数
 * @param {number} callOptions.temperature - 温度
 * @param {number} callOptions.maxTokens - 最大token数
 * @param {Array} callOptions.messages - 消息数组
 * @param {string} callOptions.response_format - 响应格式 (json)
 * @returns {Promise<object>} 调用结果
 */
export async function callDirectorWithFallback(director, callOptions) {
  const chain = FALLBACK_CHAINS[director]
  if (!chain) throw new Error(`未知导演: ${director}`)

  const directorConfig = DIRECTOR_MODELS[director]
  const errors = []

  for (let i = 0; i < chain.length; i++) {
    const step = chain[i]
    const retries = i === 0 ? 2 : 1 // 主模型重试2次，备用1次

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[${directorConfig.name}] ${step.model} 第${attempt}次尝试 (${step.label})`)

        const result = await callLLM(step.provider, {
          ...callOptions,
          model: step.model,
          temperature: callOptions.temperature ?? directorConfig.temperature,
          maxTokens: callOptions.maxTokens ?? directorConfig.maxTokens,
          specialParams: directorConfig.specialParams,
        })

        if (i > 0) {
          console.warn(`[${directorConfig.name}] 降级成功，使用 ${step.label}`)
        }

        return {
          ...result,
          fallbackLevel: i,
          usedModel: step.model,
          label: step.label,
        }
      } catch (error) {
        console.warn(`[${directorConfig.name}] ${step.model} 失败: ${error.message}`)
        errors.push({ model: step.model, attempt, error: error.message })

        // 全部失败
        if (i === chain.length - 1 && attempt === retries) {
          throw new Error(
            `[${directorConfig.name}] 所有模型均失败: ${errors.map(e => `${e.model}(${e.attempt}次)`).join(', ')}`
          )
        }

        // 退避等待
        await new Promise(r => setTimeout(r, 300 * attempt))
      }
    }
  }
}

export default {
  callDirectorWithFallback,
  FALLBACK_CHAINS,
}
