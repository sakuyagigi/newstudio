import { NextResponse } from 'next/server'
import { analyzeScript } from '../../../lib/api516'

// 剧本分析 API - 服务端转发，保护API Key
export async function POST(request) {
  try {
    const { content, options } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: '请提供剧本内容' },
        { status: 400 }
      )
    }

    // 调用516平台API（服务端调用，API Key永不暴露）
    const result = await analyzeScript(content, options)

    // 记录调用日志（用于计费和审计）
    console.log('[API调用] 剧本分析', {
      timestamp: new Date().toISOString(),
      contentLength: content.length,
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('[API错误] 剧本分析:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '分析失败',
      },
      { status: 500 }
    )
  }
}
