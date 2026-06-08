// 测试五导演API
require('dotenv').config({ path: './.env.local' })

const { alphaAnalyzeScript, kappaDesignCharacter, gammaGenerateStoryboard } = require('./lib/directors.js')

async function test() {
  console.log('=== 测试ALPHA剧本分析 ===')
  try {
    const result = await alphaAnalyzeScript(`
      夜空下的天文台，苏沐月独自守着望远镜。
      屏幕上的星光数据突然出现异常波动。
      她愣住了，这是她研究了三年的那颗星。
      萧玦的电话打了进来："苏小姐，你那边也看到了？"
    `)
    console.log('成功!')
    console.log('内容片段:', JSON.stringify(result).substring(0, 500))
  } catch (e) {
    console.error('失败:', e.message)
  }

  console.log('\n=== 测试KAPPA角色设计 ===')
  try {
    const result = await kappaDesignCharacter('28岁女建筑师，清冷知性，短直发，戴细框眼镜')
    console.log('成功!')
    console.log('内容片段:', JSON.stringify(result).substring(0, 500))
  } catch (e) {
    console.error('失败:', e.message)
  }
}

test()
