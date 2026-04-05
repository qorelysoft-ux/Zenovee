import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'

export default async function Icon() {
  try {
    const imageData = await fetch(new URL('../../public/logo.png', import.meta.url)).then((res) =>
      res.arrayBuffer(),
    )
    return new ImageResponse(imageData as any, {
      ...size,
    })
  } catch (e) {
    return new Response(`Failed to generate icon`, { status: 500 })
  }
}
