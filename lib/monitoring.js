// 错误日志与监控系统
// 记录所有API调用错误、前端异常，支持查询和统计

// 内存存储（生产环境应存数据库）
let errorLogs = []
let apiCallLogs = []
const MAX_LOGS = 500

/**
 * 记录错误
 */
export function logError(type, error, metadata = {}) {
  const log = {
    id: Date.now() + Math.random(),
    type, // api_error, frontend_error, build_error, etc.
    message: error?.message || String(error),
    stack: error?.stack || null,
    metadata,
    timestamp: new Date().toISOString(),
    severity: metadata.severity || 'error', // info, warn, error, critical
  }
  
  errorLogs.unshift(log)
  if (errorLogs.length > MAX_LOGS) {
    errorLogs = errorLogs.slice(0, MAX_LOGS)
  }
  
  console.error(`[错误日志][${type}] ${log.message}`, metadata)
  
  return log
}

/**
 * 记录API调用
 */
export function logApiCall(endpoint, method, status, duration, metadata = {}) {
  const log = {
    id: Date.now() + Math.random(),
    endpoint,
    method,
    status,
    duration, // 毫秒
    timestamp: new Date().toISOString(),
    ...metadata,
  }
  
  apiCallLogs.unshift(log)
  if (apiCallLogs.length > MAX_LOGS) {
    apiCallLogs = apiCallLogs.slice(0, MAX_LOGS)
  }
  
  return log
}

/**
 * 获取错误统计
 */
export function getErrorStats(timeRange = 'today') {
  const now = new Date()
  let filtered = errorLogs
  
  if (timeRange === 'today') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    filtered = errorLogs.filter(log => new Date(log.timestamp) >= startOfDay)
  } else if (timeRange === 'hour') {
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    filtered = errorLogs.filter(log => new Date(log.timestamp) >= oneHourAgo)
  }
  
  // 按类型统计
  const byType = {}
  filtered.forEach(log => {
    if (!byType[log.type]) {
      byType[log.type] = { count: 0, severity: log.severity }
    }
    byType[log.type].count++
  })
  
  // 按严重程度统计
  const bySeverity = {
    info: 0,
    warn: 0,
    error: 0,
    critical: 0,
  }
  filtered.forEach(log => {
    if (bySeverity[log.severity] !== undefined) {
      bySeverity[log.severity]++
    }
  })
  
  return {
    totalErrors: filtered.length,
    byType,
    bySeverity,
    recentErrors: filtered.slice(0, 20),
  }
}

/**
 * 获取API调用统计
 */
export function getApiStats(timeRange = 'today') {
  const now = new Date()
  let filtered = apiCallLogs
  
  if (timeRange === 'today') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    filtered = apiCallLogs.filter(log => new Date(log.timestamp) >= startOfDay)
  }
  
  const successCount = filtered.filter(l => l.status >= 200 && l.status < 400).length
  const errorCount = filtered.filter(l => l.status >= 400).length
  const avgDuration = filtered.length > 0
    ? filtered.reduce((sum, l) => sum + l.duration, 0) / filtered.length
    : 0
  
  // 按端点统计
  const byEndpoint = {}
  filtered.forEach(log => {
    if (!byEndpoint[log.endpoint]) {
      byEndpoint[log.endpoint] = { calls: 0, errors: 0, avgDuration: 0, totalDuration: 0 }
    }
    byEndpoint[log.endpoint].calls++
    if (log.status >= 400) byEndpoint[log.endpoint].errors++
    byEndpoint[log.endpoint].totalDuration += log.duration
    byEndpoint[log.endpoint].avgDuration = 
      byEndpoint[log.endpoint].totalDuration / byEndpoint[log.endpoint].calls
  })
  
  return {
    totalCalls: filtered.length,
    successCount,
    errorCount,
    errorRate: filtered.length > 0 ? (errorCount / filtered.length * 100).toFixed(1) + '%' : '0%',
    avgDuration: Math.round(avgDuration) + 'ms',
    byEndpoint,
    recentCalls: filtered.slice(0, 20),
  }
}

/**
 * 系统健康检查
 */
export function getSystemHealth() {
  const errorStats = getErrorStats('hour')
  const apiStats = getApiStats('hour')
  
  let status = 'healthy'
  let issues = []
  
  // 错误率超过10%警告
  if (apiStats.errorCount > 0 && apiStats.errorRate) {
    const rate = parseFloat(apiStats.errorRate)
    if (rate > 20) {
      status = 'degraded'
      issues.push(`API错误率过高: ${apiStats.errorRate}`)
    } else if (rate > 10) {
      status = 'warning'
      issues.push(`API错误率偏高: ${apiStats.errorRate}`)
    }
  }
  
  // 有严重错误
  if (errorStats.bySeverity.critical > 0) {
    status = 'critical'
    issues.unshift(`存在${errorStats.bySeverity.critical}个严重错误`)
  }
  
  return {
    status, // healthy, warning, degraded, critical
    issues,
    lastHour: {
      errors: errorStats.totalErrors,
      apiCalls: apiStats.totalCalls,
      errorRate: apiStats.errorRate,
    },
    checkedAt: new Date().toISOString(),
  }
}

/**
 * 清空日志
 */
export function clearLogs() {
  errorLogs = []
  apiCallLogs = []
}

export default {
  logError,
  logApiCall,
  getErrorStats,
  getApiStats,
  getSystemHealth,
  clearLogs,
}
