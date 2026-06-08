import { NextResponse } from 'next/server'
import { epsilonCreateSchedule } from '../../../../lib/directors'

// POST /api/directors/epsilon
// EPSILON导演 - 制片计划
export async function POST(request) {
  try {
    const { projectData, options = {} } = await request.json()

    if (!projectData) {
      return NextResponse.json(
        { error: '请提供项目数据' },
        { status: 400 }
      )
    }

    const result = await epsilonCreateSchedule(projectData, options)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] EPSILON导演调用失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '调用失败',
      },
      { status: 500 }
    )
  }
}
