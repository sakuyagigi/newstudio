// 直接测试五导演LLM调用
import process from 'node:process'
import * as fs from 'node:fs'

// 手动加载.env.local
const envContent = fs.readFileSync('./.env.local', 'utf-8')
envContent.split('\n').forEach(line => {
  const [key, ...valParts] = line.split('=')
  if (key && !key.startsWith('#') && key.trim()) {
    process.env[key.trim()] = valParts.join('=').trim()
  }
})

console.log('环境变量检查:')
console.log('- DASHSCOPE_API_KEY:', process.env.DASHSCOPE_API_KEY ? '✅' : '❌')
console.log('- DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? '✅' : '❌')
console.log('- MOONSHOT_API_KEY:', process.env.MOONSHOT_API_KEY ? '✅' : '❌')
console.log('- VOLCENGINE_ARK_API_KEY:', process.env.VOLCENGINE_ARK_API_KEY ? '✅' : '❌')
console.log('')

// 简单的fetch测试 - 先测千问
async function testDashScope() {
  console.log('🧪 测试千问 (DashScope) ...')
  
  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: '你是一个测试助手' },
          { role: 'user', content: '请用一句话介绍你自己' }
        ],
        max_tokens: 100,
      })
    })

    if (!response.ok) {
      const text = await response.text()
      console.log(`❌ 失败: ${response.status} - ${text.substring(0, 200)}`)
      return false
    }

    const data = await response.json()
    console.log(`✅ 成功! 模型: ${data.model}`)
    console.log(`   回复: ${data.choices?.[0]?.message?.content?.substring(0, 100)}...`)
    console.log(`   Token: in=${data.usage?.prompt_tokens}, out=${data.usage?.completion_tokens}`)
    return true
  } catch (e) {
    console.log(`❌ 错误: ${e.message}`)
    return false
  }
}

// 测试DeepSeek
async function testDeepSeek() {
  console.log('\n🧪 测试DeepSeek ...')
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个测试助手' },
          { role: 'user', content: '请用一句话介绍你自己' }
        ],
        max_tokens: 100,
      })
    })

    if (!response.ok) {
      const text = await response.text()
      console.log(`❌ 失败: ${response.status} - ${text.substring(0, 200)}`)
      return false
    }

    const data = await response.json()
    console.log(`✅ 成功! 模型: ${data.model}`)
    console.log(`   回复: ${data.choices?.[0]?.message?.content?.substring(0, 100)}...`)
    console.log(`   Token: in=${data.usage?.prompt_tokens}, out=${data.usage?.completion_tokens}`)
    return true
  } catch (e) {
    console.log(`❌ 错误: ${e.message}`)
    return false
  }
}

// 测试Moonshot/Kimi
async function testMoonshot() {
  console.log('\n🧪 测试Kimi (Moonshot) ...')
  
  try {
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MOONSHOT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'kimi-k2.6',
        messages: [
          { role: 'system', content: '你是一个测试助手' },
          { role: 'user', content: '请用一句话介绍你自己' }
        ],
        max_tokens: 100,
        thinking: { type: 'disabled' },
      })
    })

    if (!response.ok) {
      const text = await response.text()
      console.log(`❌ 失败: ${response.status} - ${text.substring(0, 200)}`)
      return false
    }

    const data = await response.json()
    console.log(`✅ 成功! 模型: ${data.model}`)
    console.log(`   回复: ${data.choices?.[0]?.message?.content?.substring(0, 100)}...`)
    console.log(`   Token: in=${data.usage?.prompt_tokens}, out=${data.usage?.completion_tokens}`)
    return true
  } catch (e) {
    console.log(`❌ 错误: ${e.message}`)
    return false
  }
}

// 测试豆包/火山方舟
async function testVolcengine() {
  console.log('\n🧪 测试豆包 (火山方舟) ...')
  
  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VOLCENGINE_ARK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'doubao-seed-2-0-pro-260215',
        messages: [
          { role: 'system', content: '你是一个测试助手' },
          { role: 'user', content: '请用一句话介绍你自己' }
        ],
        max_tokens: 100,
      })
    })

    if (!response.ok) {
      const text = await response.text()
      console.log(`❌ 失败: ${response.status} - ${text.substring(0, 200)}`)
      return false
    }

    const data = await response.json()
    console.log(`✅ 成功! 模型: ${data.model}`)
    console.log(`   回复: ${data.choices?.[0]?.message?.content?.substring(0, 100)}...`)
    console.log(`   Token: in=${data.usage?.prompt_tokens}, out=${data.usage?.completion_tokens}`)
    return true
  } catch (e) {
    console.log(`❌ 错误: ${e.message}`)
    return false
  }
}

async function main() {
  const results = {}
  
  results.dashscope = await testDashScope()
  results.deepseek = await testDeepSeek()
  results.moonshot = await testMoonshot()
  results.volcengine = await testVolcengine()
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 测试结果汇总:')
  console.log(`  千问 (ALPHA/EPSILON): ${results.dashscope ? '✅' : '❌'}`)
  console.log(`  豆包 (BETA):          ${results.volcengine ? '✅' : '❌'}`)
  console.log(`  DeepSeek (GAMMA):     ${results.deepseek ? '✅' : '❌'}`)
  console.log(`  Kimi (KAPPA):         ${results.moonshot ? '✅' : '❌'}`)
  
  const passed = Object.values(results).filter(Boolean).length
  console.log(`\n总计: ${passed}/${Object.keys(results).length} 个API可用`)
}

main()
