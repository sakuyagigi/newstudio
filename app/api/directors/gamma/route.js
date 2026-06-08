import { NextResponse } from 'next/server'
import { gammaGenerateStoryboard } from '../../../../lib/directors'

// POST /api/directors/gamma
// GAMMA导演 - 分镜生成
export async function POST(request) {
  try {
    const { content, options = {} } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: '请提供分镜内容' },
        { status: 400 }
      )
    }

    const result = await gammaGenerateStoryboard(content, options)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] GAMMA导演调用失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '调用失败',
      },
      { status: 500 }
    )
  }
}
