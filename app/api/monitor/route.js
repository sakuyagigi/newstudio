import { NextResponse } from 'next/server'
import { getSystemHealth, getErrorStats, getApiStats } from '../../../lib/monitoring'
import { getStats as getCostStats } from '../../../lib/costTracker'

// 系统监控API - 查看健康状态、错误统计、成本统计
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    
    let data = {}
    
    if (type === 'all' || type === 'health') {
      data.health = getSystemHealth()
    }
    
    if (type === 'all' || type === 'errors') {
      data.errors = getErrorStats('today')
    }
    
    if (type === 'all' || type === 'api') {
      data.api = getApiStats('today')
    }
    
    if (type === 'all' || type === 'cost') {
      data.cost = getCostStats('today')
    }
    
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('[监控API] 错误:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
