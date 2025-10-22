export function sanitizeInput(s: string): string {
  let t = s.trim()
  
  // 같은 글자 3회 이상 반복 축약 (예: "오오오늘" → "오오늘")
  t = t.replace(/([가-힣A-Za-z])\1{2,}/g, '$1$1')
  
  // 단위어 반복 축약 (예: "오늘은오늘은" → "오늘은")
  t = t.replace(/([가-힣]{2,6})\1+/g, '$1')
  
  // 연속 공백 제거
  t = t.replace(/\s{2,}/g, ' ')
  
  return t
}

export function sanitizeOutput(s: string): string {
  let t = s
  
  // 같은 글자 3회 이상 반복 축약
  t = t.replace(/([가-힣A-Za-z])\1{2,}/g, '$1$1')
  
  // 단위어 반복 축약
  t = t.replace(/([가-힣]{2,6})\1+/g, '$1')
  
  // 연속 공백 제거
  t = t.replace(/\s{2,}/g, ' ')
  
  // 연속 동일 문장 제거
  const lines = t.split(/[.!?]\s*/).filter(Boolean)
  const uniqueLines = lines.filter((v, i, a) => a.indexOf(v) === i)
  
  return uniqueLines.join('. ') + (t.endsWith('.') || t.endsWith('!') || t.endsWith('?') ? '' : '.')
}
