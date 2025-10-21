'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { EMOTION_CATEGORIES } from '@/lib/openai'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface EmotionDataPoint {
  date: string
  emotions: { [key: string]: number }
}

interface EmotionLineChartProps {
  data: EmotionDataPoint[]
}

const EMOTION_COLORS = {
  joy: '#FFD93D',
  sadness: '#6C95C7',
  anger: '#FF6B6B',
  anxiety: '#A569BD',
  stress: '#F39C12',
}

export default function EmotionLineChart({ data }: EmotionLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
        <h2 className="text-xl font-bold text-text dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          감정 변화 추이
        </h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-text/60 dark:text-white/60">
            아직 데이터가 충분하지 않아요 📊
          </p>
        </div>
      </div>
    )
  }

  const labels = data.map(d => {
    const date = new Date(d.date)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })

  const emotionKeys = Object.keys(EMOTION_CATEGORIES)
  
  const datasets = emotionKeys.map(emotion => {
    const emotionData = data.map(d => d.emotions[emotion] || 0)
    const emotionInfo = EMOTION_CATEGORIES[emotion as keyof typeof EMOTION_CATEGORIES]
    const color = EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS]

    return {
      label: `${emotionInfo.emoji} ${emotionInfo.label}`,
      data: emotionData,
      borderColor: color,
      backgroundColor: `${color}20`,
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: color,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 3,
    }
  })

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            family: 'Pretendard Variable, sans-serif',
          },
          color: '#2D3436',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2D3436',
        bodyColor: '#2D3436',
        borderColor: '#B4A7D6',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 13,
          family: 'Pretendard Variable, sans-serif',
        },
        titleFont: {
          size: 14,
          weight: 'bold',
          family: 'Pretendard Variable, sans-serif',
        },
        displayColors: true,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Pretendard Variable, sans-serif',
          },
          color: '#666',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
            family: 'Pretendard Variable, sans-serif',
          },
          color: '#666',
          stepSize: 1,
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 transition-all duration-500 hover:shadow-xl animate-fadeIn">
      <h2 className="text-xl font-bold text-text dark:text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">📈</span>
        감정 변화 추이
      </h2>
      <div className="h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 mb-6"></div>
      
      <div className="h-80">
        <Line data={{ labels, datasets }} options={options} />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
