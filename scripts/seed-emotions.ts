import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedEmotions() {
  try {
    const user = await prisma.user.findFirst()
    
    if (!user) {
      console.log('❌ 사용자를 찾을 수 없습니다. 먼저 로그인해주세요.')
      return
    }

    console.log(`✅ 사용자 찾음: ${user.email}`)
    console.log('📝 샘플 감정 데이터 생성 중...\n')

    const emotions = ['joy', 'sadness', 'anger', 'anxiety', 'stress']
    const categories = ['boss', 'workload', 'colleague', 'achievement', 'deadline']
    
    const messages = {
      joy: ['오늘 프로젝트 성공했어요!', '칭찬받았어요', '좋은 일이 있었어요'],
      sadness: ['힘든 하루였어요', '우울해요', '슬픈 일이 있었어요'],
      anger: ['화가 나요', '짜증나요', '상사한테 혼났어요'],
      anxiety: ['불안해요', '걱정돼요', '긴장돼요'],
      stress: ['스트레스 받아요', '너무 힘들어요', '일이 많아요'],
    }

    const aiResponses = {
      joy: '정말 기쁜 일이구나! 축하해. 💙 이런 좋은 날을 오래 간직하길 바라.',
      sadness: '많이 힘들었겠다. 괜찮아, 내가 옆에 있어. 💙',
      anger: '화가 나는 건 당연해. 잠시 쉬었다가 생각해보자. 💙',
      anxiety: '불안한 마음 충분히 이해해. 깊게 숨 쉬어봐. 💙',
      stress: '스트레스 많이 받았구나. 오늘은 푹 쉬는 게 어때? 💙',
    }

    const now = new Date()
    let created = 0

    for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
      const date = new Date(now)
      date.setDate(date.getDate() - daysAgo)
      
      const numConversations = Math.floor(Math.random() * 4) + 1
      
      for (let i = 0; i < numConversations; i++) {
        const emotion = emotions[Math.floor(Math.random() * emotions.length)]
        const category = categories[Math.floor(Math.random() * categories.length)]
        const userMessage = messages[emotion as keyof typeof messages][
          Math.floor(Math.random() * messages[emotion as keyof typeof messages].length)
        ]
        const aiMessage = aiResponses[emotion as keyof typeof aiResponses]
        
        const conversationDate = new Date(date)
        conversationDate.setHours(
          Math.floor(Math.random() * 14) + 8,
          Math.floor(Math.random() * 60),
          0,
          0
        )

        await prisma.conversation.create({
          data: {
            userId: user.id,
            messages: JSON.stringify([
              { role: 'user', content: userMessage },
              { role: 'assistant', content: aiMessage }
            ]),
            emotion,
            category,
            createdAt: conversationDate,
          },
        })

        created++
      }
    }

    console.log(`\n✅ ${created}개의 샘플 대화 생성 완료!`)
    console.log('\n📊 이제 대시보드에서 확인할 수 있습니다.')
    console.log('👉 http://localhost:5000/dashboard\n')

  } catch (error) {
    console.error('❌ 에러 발생:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedEmotions()
