import { NextResponse } from 'next/server'
import { alphaAnalyzeScript } from '../../../../lib/directors'

// POST /api/directors/alpha
// ALPHA导演 - 剧本分析
export async function POST(request) {
  try {
    const { content, options = {} } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: '请提供分析内容' },
        { status: 400 }
      )
    }

    const result = await alphaAnalyzeScript(content, options)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] ALPHA导演调用失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '调用失败',
      },
      { status: 500 }
    )
  }
}
