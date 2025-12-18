export const HF_API_URL = 'https://router.huggingface.co/hf-inference/models'
export const HF_CHAT_URL = 'https://router.huggingface.co/v1/chat/completions'

// Models
export const MODEL_TEXT = 'meta-llama/Meta-Llama-3-8B-Instruct'
export const MODEL_IMAGE = 'stabilityai/stable-diffusion-xl-base-1.0'

export async function hfChatRequest(model: string, messages: any[], options: any = {}) {
  const config = useRuntimeConfig()
  const token = config.huggingfaceApiKey || process.env.HUGGINGFACE_API_KEY

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'HUGGINGFACE_API_KEY is missing'
    })
  }

  try {
    const response = await fetch(HF_CHAT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, ...options }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hugging Face Chat API Error: ${response.status} - ${errorText}`)
    }

    const json = await response.json()
    return json.choices?.[0]?.message?.content || ''
  } catch (error: any) {
    console.error('AI Chat Request Failed:', error)
    throw createError({
      statusCode: 502,
      statusMessage: error.message || 'Failed to communicate with AI Chat service'
    })
  }
}

export async function hfRequest(model: string, inputs: any, options: any = {}) {
  const config = useRuntimeConfig()
  const token = config.huggingfaceApiKey || process.env.HUGGINGFACE_API_KEY

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'HUGGINGFACE_API_KEY is missing in environment variables'
    })
  }

  try {
    const response = await fetch(`${HF_API_URL}/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs, ...options }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hugging Face API Error: ${response.status} - ${errorText}`)
    }

    // For image models, response is a Blob/Buffer. For text, it's JSON.
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    } else {
      return await response.arrayBuffer()
    }
  } catch (error: any) {
    console.error('AI Request Failed:', error)
    throw createError({
      statusCode: 502,
      statusMessage: error.message || 'Failed to communicate with AI service'
    })
  }
}
