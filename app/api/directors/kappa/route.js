import { NextResponse } from 'next/server'
import { kappaDesignCharacter } from '../../../../lib/directors'

// POST /api/directors/kappa
// KAPPA导演 - 角色定妆
export async function POST(request) {
  try {
    const { content, options = {} } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: '请提供角色描述' },
        { status: 400 }
      )
    }

    const result = await kappaDesignCharacter(content, options)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] KAPPA导演调用失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '调用失败',
      },
      { status: 500 }
    )
  }
}
