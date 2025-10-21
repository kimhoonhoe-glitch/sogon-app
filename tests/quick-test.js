/**
 * 빠른 테스트 - OpenAI Chat API
 * 
 * 실행:
 * node tests/quick-test.js
 */

async function quickTest() {
  console.log('🧪 OpenAI Chat API 빠른 테스트\n')

  // 테스트 1: 기본 대화
  console.log('1️⃣ 기본 대화 테스트...')
  const response = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '오늘 상사한테 혼났어요. 너무 화가 나요.',
      category: 'boss',
    }),
  })

  if (!response.ok) {
    console.error('❌ 실패:', response.status)
    const error = await response.json()
    console.error(error)
    process.exit(1)
  }

  console.log('감정:', response.headers.get('X-Emotion'))
  console.log('위기:', response.headers.get('X-Crisis'))
  console.log('\n💬 AI 응답:')
  console.log('-'.repeat(50))

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    process.stdout.write(decoder.decode(value))
  }

  console.log('\n' + '-'.repeat(50))
  console.log('\n✅ 테스트 완료!')
  console.log('\n📋 확인사항:')
  console.log('  - 반말을 사용하나요? (예: ~해, ~지, ~구나)')
  console.log('  - 2-4문장으로 간결한가요?')
  console.log('  - 이모지를 사용하나요? 💙')
  console.log('  - 공감하는 톤인가요?')
}

quickTest().catch(console.error)
