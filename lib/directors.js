// 五导演LLM统一封装 - 服务端调用，API Key永不暴露
// 每个导演对应专属模型，各司其职
// 所有模型均为 OpenAI 兼容格式，统一调用入口

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

// 五导演模型配置
export const DIRECTOR_MODELS = {
  alpha: {
    name: 'ALPHA',
    role: '叙事导演',
    provider: 'dashscope',
    model: 'qwen3.7-plus',
    temperature: 0.6,
    maxTokens: 4000,
    description: '剧本分析、人物拆解、叙事结构、合规审查',
  },
  beta: {
    name: 'BETA',
    role: '视觉导演',
    provider: 'volcengine',
    model: 'doubao-seed-2-0-pro-260215',
    temperature: 0.8,
    maxTokens: 3000,
    description: '视觉风格、场景设计、色彩体系、道具链',
  },
  gamma: {
    name: 'GAMMA',
    role: '节奏导演',
    provider: 'deepseek',
    model: 'deepseek-chat',
    temperature: 0.5,
    maxTokens: 4000,
    description: '分镜拆解、节奏设计、空间链、转场方案',
  },
  kappa: {
    name: 'KAPPA',
    role: '角色导演',
    provider: 'moonshot',
    model: 'kimi-k2.6',
    temperature: 0.6,
    maxTokens: 3500,
    description: '角色定妆、表演设计、OOC禁令、视觉DNA',
    specialParams: {
      thinking: { type: 'disabled' }, // Kimi K2.6 必须参数
    },
  },
  epsilon: {
    name: 'EPSILON',
    role: 'AI制片',
    provider: 'dashscope',
    model: 'qwen-plus',
    temperature: 0.4,
    maxTokens: 3000,
    description: '生产调度、风险评估、成本估算、交付节奏',
  },
}

// 通用LLM调用
async function callLLM(provider, options) {
  const config = PROVIDERS[provider]
  if (!config) {
    throw new Error(`未知的LLM提供商: ${provider}`)
  }
  if (!config.apiKey) {
    throw new Error(`${provider} API Key 未配置`)
  }

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
    throw new Error(`[${provider}] API调用失败 [${response.status}]: ${errorText}`)
  }

  if (stream) {
    return response.body
  }

  const data = await response.json()
  
  // 统计token消耗
  const usage = data.usage || {}
  console.log(`[LLM调用] ${provider}/${model}`, {
    inputTokens: usage.prompt_tokens || 0,
    outputTokens: usage.completion_tokens || 0,
    totalTokens: usage.total_tokens || 0,
  })

  return {
    success: true,
    content: data.choices?.[0]?.message?.content || '',
    usage: {
      inputTokens: usage.prompt_tokens || 0,
      outputTokens: usage.completion_tokens || 0,
      totalTokens: usage.total_tokens || 0,
    },
    model: data.model || model,
    raw: data,
  }
}

// ========== 五导演专用方法 ==========

// ALPHA - 剧本分析
export async function alphaAnalyzeScript(scriptContent, options = {}) {
  const director = DIRECTOR_MODELS.alpha
  
  const messages = [
    {
      role: 'system',
      content: `你是ALPHA，墨枢光影导演台的叙事导演。
你的专长：剧本深度分析、人物关系梳理、叙事结构设计、合规风险审查。
输出要求：严格JSON格式，不要任何多余文字。`,
    },
    {
      role: 'user',
      content: `深度分析以下剧本，输出结构化JSON：

${scriptContent}

需要包含：
1. characters: 角色列表（name, description, arc, motivation）
2. scenes: 场景拆解（id, location, time, keyEvent, emotionalBeat）
3. structure: 叙事结构（act1/act2/act3的转折点）
4. compliance: 合规审查（rating: safe/caution/risk, notes）
5. themes: 主题关键词（数组）
6. logline: 一句话梗概`,
    },
  ]

  return callLLM(director.provider, {
    model: director.model,
    messages,
    temperature: director.temperature,
    maxTokens: director.maxTokens,
    response_format: 'json',
  })
}

// BETA - 视觉设计
export async function betaDesignVisual(sceneDescription, options = {}) {
  const director = DIRECTOR_MODELS.beta
  
  const messages = [
    {
      role: 'system',
      content: `你是BETA，墨枢光影导演台的视觉导演。
你的专长：场景视觉设计、色彩体系、光影方案、道具链设计。
输出要求：严格JSON格式，不要任何多余文字。`,
    },
    {
      role: 'user',
      content: `为以下场景设计完整视觉方案：

${sceneDescription}

需要包含：
1. visualStyle: 整体视觉风格描述
2. colorPalette: 色彩体系（primary, secondary, accent, mood）
3. lighting: 光影方案（type, direction, intensity, mood）
4. keyProps: 核心道具列表（name, description, visualWeight）
5. composition: 构图建议（shotTypes, cameraMovement, rhythm）
6. referenceKeywords: AI生图关键词（数组，中英文混合）`,
    },
  ]

  return callLLM(director.provider, {
    model: director.model,
    messages,
    temperature: director.temperature,
    maxTokens: director.maxTokens,
    response_format: 'json',
  })
}

// GAMMA - 分镜生成
export async function gammaGenerateStoryboard(sceneContent, options = {}) {
  const director = DIRECTOR_MODELS.gamma
  const { shotsPerMinute = 20, includeDialogue = true } = options
  
  const messages = [
    {
      role: 'system',
      content: `你是GAMMA，墨枢光影导演台的节奏导演。
你的专长：分镜拆解、节奏设计、空间轴线、镜头运动。
输出要求：严格JSON格式，不要任何多余文字。`,
    },
    {
      role: 'user',
      content: `将以下内容拆解为详细分镜：

${sceneContent}

要求：
- 每分钟约${shotsPerMinute}个镜头
- 每个镜头包含：shotNumber, shotType（景别）, angle（角度）, movement（运动）, duration（秒）, description（画面描述）, dialogue（台词，如有）
- 注意180度轴线规则
- 标注关键转场方式
- 输出JSON格式：{ shots: [...], transitions: [...], totalDuration }`,
    },
  ]

  return callLLM(director.provider, {
    model: director.model,
    messages,
    temperature: director.temperature,
    maxTokens: director.maxTokens,
    response_format: 'json',
  })
}

// KAPPA - 角色定妆
export async function kappaDesignCharacter(characterDescription, options = {}) {
  const director = DIRECTOR_MODELS.kappa
  
  const messages = [
    {
      role: 'system',
      content: `你是KAPPA，墨枢光影导演台的角色导演。
你的专长：角色定妆设计、表演风格设定、OOC规则、视觉DNA锚定。
输出要求：严格JSON格式，不要任何多余文字。`,
    },
    {
      role: 'user',
      content: `为以下角色设计完整定妆方案：

${characterDescription}

需要包含：
1. basicInfo: 基本信息（name, age, gender, occupation）
2. appearance: 外貌特征（face, hair, eyes, build, distinguishingFeatures）
3. costume: 服装造型（mainOutfit, accessories, footwear, styleKeywords）
4. props: 随身道具（name, description, significance）
5. performance: 表演风格（posture, gestures, voice, expressions, mannerisms）
6. oocRules: OOC禁令（绝对不能做的事，数组）
7. visualDNA: 视觉DNA锚点（3-5个核心识别特征，确保AI出图一致性）
8. promptKeywords: 生图关键词（数组，中英文混合，可直接用于生图）`,
    },
  ]

  return callLLM(director.provider, {
    model: director.model,
    messages,
    temperature: director.temperature,
    maxTokens: director.maxTokens,
    response_format: 'json',
    specialParams: director.specialParams,
  })
}

// EPSILON - 制片计划
export async function epsilonCreateSchedule(projectData, options = {}) {
  const director = DIRECTOR_MODELS.epsilon
  
  const messages = [
    {
      role: 'system',
      content: `你是EPSILON，墨枢光影导演台的AI制片。
你的专长：生产调度、风险评估、成本估算、交付节奏。
输出要求：严格JSON格式，不要任何多余文字。`,
    },
    {
      role: 'user',
      content: `为以下项目制定制片生产计划：

${JSON.stringify(projectData, null, 2)}

需要包含：
1. schedule: 生产排期（phases数组，含name, duration, tasks）
2. shotBatches: 镜头批次（batches数组，含batchId, count, priority, estimatedTime）
3. risks: 风险评估（risks数组，含risk, probability, impact, mitigation）
4. costEstimate: 成本估算（total, breakdown明细）
5. milestones: 里程碑节点（数组，含name, deliverable, deadline）
6. parallelism: 并行度建议（maxParallelJobs, reasoning）`,
    },
  ]

  return callLLM(director.provider, {
    model: director.model,
    messages,
    temperature: director.temperature,
    maxTokens: director.maxTokens,
    response_format: 'json',
  })
}

// ========== 批量调用 - 五导演协同 ==========
// 依次调用所有导演，流水线作业
export async function runDirectorPipeline(scriptContent) {
  const results = {}
  const startTime = Date.now()
  
  console.log('[导演流水线] 启动五导演协同分析...')
  
  try {
    // 第一步：ALPHA剧本分析
    console.log('[导演流水线] ALPHA 开始剧本分析...')
    results.alpha = await alphaAnalyzeScript(scriptContent)
    console.log('[导演流水线] ALPHA 完成')
    
    // 第二步：BETA视觉设计（基于ALPHA的场景）
    console.log('[导演流水线] BETA 开始视觉设计...')
    const scenesText = results.alpha.content?.scenes?.map(s => s.keyEvent).join('\n') || scriptContent
    results.beta = await betaDesignVisual(scenesText)
    console.log('[导演流水线] BETA 完成')
    
    // 第三步：GAMMA分镜生成
    console.log('[导演流水线] GAMMA 开始分镜生成...')
    results.gamma = await gammaGenerateStoryboard(scriptContent)
    console.log('[导演流水线] GAMMA 完成')
    
    // 第四步：KAPPA角色设计（基于ALPHA的角色）
    console.log('[导演流水线] KAPPA 开始角色设计...')
    const charactersText = results.alpha.content?.characters?.map(c => `${c.name}: ${c.description}`).join('\n') || scriptContent
    results.kappa = await kappaDesignCharacter(charactersText)
    console.log('[导演流水线] KAPPA 完成')
    
    // 第五步：EPSILON制片计划
    console.log('[导演流水线] EPSILON 开始制片计划...')
    results.epsilon = await epsilonCreateSchedule({
      scriptLength: scriptContent.length,
      scenesCount: results.alpha.content?.scenes?.length || 0,
      charactersCount: results.alpha.content?.characters?.length || 0,
      shotsCount: results.gamma.content?.shots?.length || 0,
    })
    console.log('[导演流水线] EPSILON 完成')
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`[导演流水线] 全部完成，耗时 ${duration} 秒`)
    
    return {
      success: true,
      duration: `${duration}s`,
      results,
    }
  } catch (error) {
    console.error('[导演流水线] 失败:', error)
    return {
      success: false,
      error: error.message,
      partialResults: results,
    }
  }
}

// ========== 成本估算 ==========
const MODEL_PRICING = {
  // 千问（DashScope）
  'qwen3.7-plus': { input: 0.012, output: 0.048 },   // 元/千token
  'qwen-plus': { input: 0.008, output: 0.008 },
  'qwen-turbo': { input: 0.003, output: 0.006 },
  'qwen-max': { input: 0.04, output: 0.12 },
  
  // 豆包（火山引擎）
  'doubao-seed-2-0-pro-260215': { input: 0.02, output: 0.06 },
  'doubao-seedance-2-0-260128': { input: 0.08, output: 0.16 },
  
  // DeepSeek
  'deepseek-chat': { input: 0.002, output: 0.008 },
  
  // Kimi
  'kimi-k2.6': { input: 0.015, output: 0.06 },
  'moonshot-v1-8k': { input: 0.012, output: 0.012 },
  
  // 智谱
  'glm-4.7-flash': { input: 0.001, output: 0.002 },
}

export function estimateCost(model, inputTokens, outputTokens = 0) {
  const pricing = MODEL_PRICING[model]
  if (!pricing) return 0
  return (pricing.input * inputTokens + pricing.output * outputTokens) / 1000
}
