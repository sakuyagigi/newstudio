import { NextResponse } from 'next/server'
import { generateImage, getImageTaskStatus } from '../../../../lib/imageGen'

// POST /api/image/generate
// 图像生成 - 支持多模型自动降级
export async function POST(request) {
  try {
    const { 
      prompt, 
      size = '1024*1024',
      aspectRatio = '1:1',
      n = 1,
      priority,
      referenceImages = [],
      style = 'photography',
    } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: '请提供生成提示词' },
        { status: 400 }
      )
    }

    console.log('[API] 图像生成开始:', prompt.substring(0, 50))

    const result = await generateImage({
      prompt,
      size,
      aspectRatio,
      n,
      priority,
      referenceImages,
      style,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] 图像生成失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '生成失败',
      },
      { status: 500 }
    )
  }
}

// GET /api/image/generate?taskId=xxx&provider=xxx
// 查询异步任务状态
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    const provider = searchParams.get('provider')

    if (!taskId || !provider) {
      return NextResponse.json(
        { error: '请提供 taskId 和 provider' },
        { status: 400 }
      )
    }

    const result = await getImageTaskStatus(taskId, provider)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('[API] 查询任务状态失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '查询失败',
      },
      { status: 500 }
    )
  }
}
