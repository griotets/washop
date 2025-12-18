import { hfRequest, MODEL_IMAGE } from '~/server/utils/ai'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { prompt } = body

  if (!prompt) {
    throw createError({ statusCode: 400, statusMessage: 'Prompt is required' })
  }

  const enhancedPrompt = `professional product photography of ${prompt}, highly detailed, studio lighting, white background, 8k resolution, commercial photography`

  try {
    const buffer = await hfRequest(MODEL_IMAGE, enhancedPrompt)
    
    // Convert buffer to base64
    const base64 = Buffer.from(buffer).toString('base64')
    const dataUrl = `data:image/jpeg;base64,${base64}`

    return { imageUrl: dataUrl }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e.message
    })
  }
})
