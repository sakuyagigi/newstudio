import { NextResponse } from 'next/server'
import { generateStoryboard } from '../../../../lib/api516'

// 分镜生成 API
export async function POST(request) {
  try {
    const { description, options } = await request.json()

    if (!description) {
      return NextResponse.json(
        { error: '请提供场景描述' },
        { status: 400 }
      )
    }

    const result = await generateStoryboard(description, options)

    console.log('[API调用] 分镜生成', {
      timestamp: new Date().toISOString(),
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('[API错误] 分镜生成:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '生成失败',
      },
      { status: 500 }
    )
  }
}
