import { NextResponse } from 'next/server'
import { runDirectorPipeline } from '../../../../lib/directors'

// POST /api/directors/analyze
// 五导演流水线协同分析剧本
export async function POST(request) {
  try {
    const { script, options = {} } = await request.json()

    if (!script) {
      return NextResponse.json(
        { error: '请提供剧本内容' },
        { status: 400 }
      )
    }

    console.log('[API] 五导演流水线启动')
    
    // 执行完整流水线
    const result = await runDirectorPipeline(script)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] 五导演分析失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '分析失败',
      },
      { status: 500 }
    )
  }
}
