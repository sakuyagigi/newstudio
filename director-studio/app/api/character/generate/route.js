import { NextResponse } from 'next/server'
import { generateCharacter } from '../../../../lib/api516'

// 角色定妆生成 API
export async function POST(request) {
  try {
    const { description, style, characterName } = await request.json()

    if (!description) {
      return NextResponse.json(
        { error: '请提供角色描述' },
        { status: 400 }
      )
    }

    const result = await generateCharacter(description, style)

    console.log('[API调用] 角色生成', {
      timestamp: new Date().toISOString(),
      character: characterName || '未命名',
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('[API错误] 角色生成:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '生成失败',
      },
      { status: 500 }
    )
  }
}
