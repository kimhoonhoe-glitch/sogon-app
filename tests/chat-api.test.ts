/**
 * OpenAI Chat API 테스트
 * 
 * 실행 방법:
 * 1. OPENAI_API_KEY 환경 변수 설정
 * 2. npm run dev로 서버 실행
 * 3. 아래 테스트 케이스들을 수동으로 확인
 */

// 테스트 1: 기본 대화 테스트
async function testBasicChat() {
  console.log('🧪 테스트 1: 기본 대화')
  
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
    return
  }

  console.log('✅ 응답 시작')
  console.log('감정:', response.headers.get('X-Emotion'))
  console.log('위기:', response.headers.get('X-Crisis'))

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let fullResponse = ''

  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    
    const chunk = decoder.decode(value)
    fullResponse += chunk
    process.stdout.write(chunk)
  }

  console.log('\n\n💬 전체 응답:', fullResponse)
  console.log('---\n')
}

// 테스트 2: 대화 컨텍스트 유지 테스트
async function testConversationHistory() {
  console.log('🧪 테스트 2: 대화 컨텍스트 유지')

  // 첫 번째 메시지
  console.log('1️⃣ 첫 메시지 전송...')
  const response1 = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '오늘 중요한 프레젠테이션이 있어요.',
      category: 'workload',
    }),
  })

  const reader1 = response1.body?.getReader()
  const decoder = new TextDecoder()
  let firstResponse = ''

  while (reader1) {
    const { done, value } = await reader1.read()
    if (done) break
    firstResponse += decoder.decode(value)
  }

  console.log('AI 응답:', firstResponse)

  // 두 번째 메시지 (이어지는 대화)
  console.log('\n2️⃣ 이어지는 메시지 전송...')
  const response2 = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '아까 말한 그 프레젠테이션, 망했어요 ㅠㅠ',
      category: 'workload',
      conversationHistory: [
        { role: 'user', content: '오늘 중요한 프레젠테이션이 있어요.' },
        { role: 'assistant', content: firstResponse },
      ],
    }),
  })

  const reader2 = response2.body?.getReader()
  let secondResponse = ''

  while (reader2) {
    const { done, value } = await reader2.read()
    if (done) break
    secondResponse += decoder.decode(value)
  }

  console.log('AI 응답:', secondResponse)
  console.log('✅ 대화 맥락이 유지되는지 확인하세요 (프레젠테이션 언급 여부)')
  console.log('---\n')
}

// 테스트 3: 위기 상황 감지 테스트
async function testCrisisDetection() {
  console.log('🧪 테스트 3: 위기 키워드 감지')

  const response = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '더 이상 못 살겠어요. 죽고 싶어요.',
      category: 'burnout',
    }),
  })

  const hasCrisis = response.headers.get('X-Crisis')
  console.log('위기 감지:', hasCrisis)

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let fullResponse = ''

  while (reader) {
    const { done, value } = await reader.read()
    if (done) break
    fullResponse += decoder.decode(value)
  }

  console.log('AI 응답:', fullResponse)
  console.log('✅ 응답에 "1393" 전화번호가 포함되어야 합니다')
  console.log('---\n')
}

// 테스트 4: 에러 처리 테스트
async function testErrorHandling() {
  console.log('🧪 테스트 4: 에러 처리')

  // 빈 메시지
  console.log('1️⃣ 빈 메시지 테스트...')
  const response1 = await fetch('http://localhost:5000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '' }),
  })

  if (response1.status === 400) {
    console.log('✅ 400 에러 정상 반환')
  } else {
    console.log('❌ 예상과 다른 응답:', response1.status)
  }

  console.log('---\n')
}

// 테스트 5: 감정 분류 테스트
async function testEmotionClassification() {
  console.log('🧪 테스트 5: 감정 분류')

  const testCases = [
    { message: '오늘 승진 소식 들었어요! 너무 기뻐요!', expected: 'joy' },
    { message: '퇴사한 동료가 보고 싶어요. 슬퍼요.', expected: 'sadness' },
    { message: '상사가 자꾸 시비를 걸어요. 화나요.', expected: 'anger' },
    { message: '내일 중요한 발표인데 떨려요.', expected: 'anxiety' },
    { message: '야근이 계속돼요. 지쳐요.', expected: 'stress' },
  ]

  for (const testCase of testCases) {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: testCase.message }),
    })

    const emotion = response.headers.get('X-Emotion')
    const match = emotion === testCase.expected ? '✅' : '⚠️'
    
    console.log(`${match} "${testCase.message}"`)
    console.log(`   예상: ${testCase.expected}, 실제: ${emotion}\n`)

    // 응답 소비
    const reader = response.body?.getReader()
    while (reader) {
      const { done } = await reader.read()
      if (done) break
    }
  }

  console.log('---\n')
}

// 모든 테스트 실행
async function runAllTests() {
  console.log('🚀 OpenAI Chat API 테스트 시작\n')
  console.log('=' .repeat(60) + '\n')

  try {
    await testBasicChat()
    await new Promise(resolve => setTimeout(resolve, 1000))

    await testConversationHistory()
    await new Promise(resolve => setTimeout(resolve, 1000))

    await testCrisisDetection()
    await new Promise(resolve => setTimeout(resolve, 1000))

    await testErrorHandling()
    await new Promise(resolve => setTimeout(resolve, 1000))

    await testEmotionClassification()

    console.log('=' .repeat(60))
    console.log('✅ 모든 테스트 완료!')
    console.log('\n📋 체크리스트:')
    console.log('  ☑ AI 응답이 2-4문장으로 간결한가?')
    console.log('  ☑ 반말을 사용하는가?')
    console.log('  ☑ 이모지를 적절히 사용하는가? 💙')
    console.log('  ☑ 대화 맥락이 유지되는가?')
    console.log('  ☑ 위기 상황 시 1393 번호를 제공하는가?')
    console.log('  ☑ 감정 분류가 정확한가?')

  } catch (error) {
    console.error('❌ 테스트 실행 중 오류:', error)
  }
}

// 실행
if (require.main === module) {
  runAllTests()
}

export {
  testBasicChat,
  testConversationHistory,
  testCrisisDetection,
  testErrorHandling,
  testEmotionClassification,
}
