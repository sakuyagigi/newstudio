import { NextResponse } from 'next/server'
import { betaDesignVisual } from '../../../../lib/directors'

// POST /api/directors/beta
// BETA导演 - 视觉设计
export async function POST(request) {
  try {
    const { content, options = {} } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: '请提供场景描述' },
        { status: 400 }
      )
    }

    const result = await betaDesignVisual(content, options)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] BETA导演调用失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '调用失败',
      },
      { status: 500 }
    )
  }
}
