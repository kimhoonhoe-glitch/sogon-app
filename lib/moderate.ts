const bannedPhrases = [
  '안아줄게',
  '안아줄게요',
  '포옹',
  '술 한잔',
  '만나서',
  '데이트',
  '밥 사줄게',
  '계좌',
  '송금',
  '상품권',
  '키스',
  '만나자',
  '직접 만나',
  '오프라인',
]

const replacements: Record<string, string> = {
  '안아줄게': '따뜻한 마음을 보낼게요',
  '안아줄게요': '따뜻한 마음을 보낼게요',
  '포옹': '따뜻한 마음',
  '술 한잔': '차 한 잔 마시며 쉬는 건 어때요',
  '만나서': '지금 여기서부터 시작해볼까요',
  '데이트': '지금 이 순간부터 시작해볼까요',
  '밥 사줄게': '좋아하는 음식 생각하며 휴식 취해요',
  '계좌': '',
  '송금': '',
  '상품권': '',
  '키스': '',
  '만나자': '지금 여기서 대화해요',
  '직접 만나': '이렇게 대화하며',
  '오프라인': '온라인으로',
}

export function guardrails(text: string): string {
  let t = text
  
  for (const phrase of bannedPhrases) {
    const regex = new RegExp(phrase, 'gi')
    t = t.replace(regex, (matched) => {
      const lowerMatched = matched.toLowerCase()
      return replacements[lowerMatched] || replacements[phrase] || '현실적인 위로로 바꿀게요'
    })
  }
  
  return t
}
