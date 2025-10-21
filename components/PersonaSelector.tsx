'use client'

import { useState, useEffect } from 'react'
import { PERSONAS, Persona } from '@/lib/personas'

interface PersonaSelectorProps {
  onSelect: (persona: Persona) => void
  initialPersona?: string
}

export default function PersonaSelector({ onSelect, initialPersona }: PersonaSelectorProps) {
  const [selectedId, setSelectedId] = useState(initialPersona || 'lover')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // localStorage에서 저장된 페르소나 불러오기
    const saved = localStorage.getItem('sogon_persona')
    if (saved) {
      setSelectedId(saved)
      const persona = PERSONAS.find(p => p.id === saved)
      if (persona) onSelect(persona)
    } else {
      // 기본값: 애인 모드
      onSelect(PERSONAS[0])
    }
  }, [])

  const handleSelect = (persona: Persona) => {
    setSelectedId(persona.id)
    localStorage.setItem('sogon_persona', persona.id)
    onSelect(persona)
    setIsOpen(false)
  }

  const currentPersona = PERSONAS.find(p => p.id === selectedId) || PERSONAS[0]

  return (
    <div className="relative">
      {/* 현재 선택된 페르소나 표시 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
      >
        <span className="text-2xl">{currentPersona.emoji}</span>
        <div className="text-left">
          <div className="text-sm font-semibold text-text dark:text-white">
            {currentPersona.name}
          </div>
          <div className="text-xs text-text/60 dark:text-white/60">
            {currentPersona.description}
          </div>
        </div>
        <span className="text-text/40 dark:text-white/40 ml-2">▼</span>
      </button>

      {/* 페르소나 선택 드롭다운 */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-text dark:text-white">대화 모드 선택</h3>
              <p className="text-xs text-text/60 dark:text-white/60 mt-1">
                오늘은 누구와 이야기하고 싶으세요?
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => handleSelect(persona)}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${
                    selectedId === persona.id ? 'bg-primary/10 dark:bg-primary/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${persona.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {persona.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text dark:text-white">
                          {persona.name}
                        </span>
                        {selectedId === persona.id && (
                          <span className="text-primary text-xs">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-text/60 dark:text-white/60 mt-1">
                        {persona.description}
                      </p>
                      <p className="text-sm text-text/80 dark:text-white/80 mt-2 italic">
                        "{persona.greeting}"
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
