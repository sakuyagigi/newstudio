import { NextResponse } from 'next/server'
import { initTables, testConnection } from '../../../../lib/database'

// POST /api/db/init
// 初始化数据库表
export async function POST() {
  try {
    // 先测试连接
    const connTest = await testConnection()
    if (!connTest.success) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败: ' + connTest.error },
        { status: 500 }
      )
    }

    // 初始化表
    const result = await initTables()

    return NextResponse.json({
      success: true,
      message: '数据库初始化完成',
      ...result,
    })
  } catch (error) {
    console.error('[API] 数据库初始化失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '初始化失败',
      },
      { status: 500 }
    )
  }
}

// GET /api/db/init
// 测试数据库连接
export async function GET() {
  try {
    const result = await testConnection()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
