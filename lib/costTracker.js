// 成本追踪系统
// 记录每次API调用的token消耗和费用，支持统计和预算预警

const COST_RATES = {
  // 千问3.5 Plus  - 输入: 0.008元/千token, 输出: 0.016元/千token
  qwenPlus: {
    input: 0.008,  // 元/千token
    output: 0.016, // 元/千token
  },
  // 豆包Seed 2.0 Pro - 输入: 0.004元/千token, 输出: 0.008元/千token
  doubao: {
    input: 0.004,
    output: 0.008,
  },
  // DeepSeek V3 - 输入: 0.002元/千token, 输出: 0.008元/千token
  deepseek: {
    input: 0.002,
    output: 0.008,
  },
  // Kimi K2.6 - 输入: 0.012元/千token, 输出: 0.024元/千token
  kimi: {
    input: 0.012,
    output: 0.024,
  },
  // 智谱GLM-4 - 输入: 0.005元/千token, 输出: 0.005元/千token
  glm: {
    input: 0.005,
    output: 0.005,
  },
  // 生图模型 - 按次计费
  image: {
    nanoBanana: 0.08,   // 8分钱一次
    midjourney: 0.3,     // 3毛一次
    diffuser: 0.02,      // 2分钱一次
  },
}

// 内存中的调用日志（生产环境应该存数据库）
let callLogs = []
const MAX_LOGS = 1000 // 最多保留1000条

/**
 * 记录一次LLM调用成本
 */
export function recordLLMCall(model, inputTokens, outputTokens, metadata = {}) {
  const rates = COST_RATES[model] || COST_RATES.qwenPlus
  const cost = (inputTokens * rates.input + outputTokens * rates.output) / 1000
  
  const log = {
    id: Date.now() + Math.random(),
    type: 'llm',
    model,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    cost,
    timestamp: new Date().toISOString(),
    director: metadata.director || 'unknown',
    endpoint: metadata.endpoint || 'unknown',
    ...metadata,
  }
  
  callLogs.unshift(log)
  if (callLogs.length > MAX_LOGS) {
    callLogs = callLogs.slice(0, MAX_LOGS)
  }
  
  return log
}

/**
 * 记录一次图像生成成本
 */
export function recordImageCall(model, count = 1, metadata = {}) {
  const rate = COST_RATES.image[model] || 0.08
  const cost = rate * count
  
  const log = {
    id: Date.now() + Math.random(),
    type: 'image',
    model,
    count,
    cost,
    timestamp: new Date().toISOString(),
    ...metadata,
  }
  
  callLogs.unshift(log)
  if (callLogs.length > MAX_LOGS) {
    callLogs = callLogs.slice(0, MAX_LOGS)
  }
  
  return log
}

/**
 * 获取统计数据
 */
export function getStats(timeRange = 'today') {
  const now = new Date()
  let filtered = callLogs
  
  if (timeRange === 'today') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    filtered = callLogs.filter(log => new Date(log.timestamp) >= startOfDay)
  } else if (timeRange === 'week') {
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - 7)
    filtered = callLogs.filter(log => new Date(log.timestamp) >= startOfWeek)
  } else if (timeRange === 'all') {
    filtered = callLogs
  }
  
  const llmLogs = filtered.filter(l => l.type === 'llm')
  const imageLogs = filtered.filter(l => l.type === 'image')
  
  const totalCost = filtered.reduce((sum, log) => sum + log.cost, 0)
  const totalTokens = llmLogs.reduce((sum, log) => sum + log.totalTokens, 0)
  const totalImages = imageLogs.reduce((sum, log) => sum + log.count, 0)
  
  // 按导演统计
  const byDirector = {}
  llmLogs.forEach(log => {
    const director = log.director || 'unknown'
    if (!byDirector[director]) {
      byDirector[director] = { calls: 0, tokens: 0, cost: 0 }
    }
    byDirector[director].calls++
    byDirector[director].tokens += log.totalTokens
    byDirector[director].cost += log.cost
  })
  
  // 按模型统计
  const byModel = {}
  filtered.forEach(log => {
    const model = log.model
    if (!byModel[model]) {
      byModel[model] = { calls: 0, cost: 0 }
    }
    byModel[model].calls++
    byModel[model].cost += log.cost
  })
  
  return {
    totalCalls: filtered.length,
    totalCost,
    totalTokens,
    totalImages,
    byDirector,
    byModel,
    logs: filtered.slice(0, 50), // 最近50条
  }
}

/**
 * 清空日志
 */
export function clearLogs() {
  callLogs = []
}

export default {
  recordLLMCall,
  recordImageCall,
  getStats,
  clearLogs,
}
