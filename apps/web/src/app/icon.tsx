import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'
export const revalidate = 86400

export default async function Icon() {
  try {
    const imageData = await fetch(new URL('../../public/logo.png', import.meta.url), {
      next: { revalidate: 86400 },
    }).then((res) => res.arrayBuffer())
    
    if (!imageData || imageData.byteLength === 0) {
      throw new Error('Logo image is empty')
    }
    
    return new ImageResponse(imageData as any, {
      ...size,
    })
  } catch (e) {
    console.error('Icon generation failed:', e)
    return new Response('Icon unavailable', { status: 500 })
  }
}
