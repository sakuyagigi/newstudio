import { NextResponse } from 'next/server'
import mediaKit from '../../../../lib/mediaKit'
import { logApiCall, logError } from '../../../../lib/monitoring'

// MediaKit 视频后期处理 API
// POST /api/media/process
// body: { action: 'erase-subtitles'|'erase-watermark'|'enhance'|'erase-object', videoUrl, options }
export async function POST(request) {
  const startTime = Date.now()
  
  try {
    const { action, videoUrl, options = {} } = await request.json()

    if (!videoUrl) {
      return NextResponse.json(
        { error: '请提供视频URL' },
        { status: 400 }
      )
    }

    let result
    
    switch (action) {
      case 'erase-subtitles':
        result = await mediaKit.eraseSubtitles(videoUrl, options)
        break
      case 'erase-watermark':
        result = await mediaKit.eraseWatermark(videoUrl, options)
        break
      case 'erase-object':
        result = await mediaKit.eraseObject(videoUrl, options.bboxes, options)
        break
      case 'enhance':
        result = await mediaKit.enhanceVideo(videoUrl, options.strength || 'medium')
        break
      case 'restore':
        result = await mediaKit.restoreOldVideo(videoUrl)
        break
      case 'anime':
        result = await mediaKit.videoToAnime(videoUrl, options.style || 'anime')
        break
      default:
        return NextResponse.json(
          { error: `未知的操作: ${action}` },
          { status: 400 }
        )
    }

    const duration = Date.now() - startTime
    logApiCall('/api/media/process', 'POST', 200, duration, { action })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    logApiCall('/api/media/process', 'POST', 500, duration, { action: request.body?.action })
    logError('media_kit_error', error, { action: request.body?.action })

    console.error('[MediaKit API] 错误:', error)
    return NextResponse.json(
      { success: false, error: error.message || '处理失败' },
      { status: 500 }
    )
  }
}
