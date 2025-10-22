import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#B4A7D6',
          borderRadius: '20%',
        }}
      >
        <div style={{ fontSize: 100 }}>💙</div>
      </div>
    ),
    {
      ...size,
    }
  )
}
