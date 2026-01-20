
import { defineEventHandler, readBody } from 'h3'

import { HfInference } from '@huggingface/inference'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const HF_TOKEN = config.huggingfaceApiKey || process.env.HUGGINGFACE_API_KEY
  
  if (!HF_TOKEN) {
    throw createError({
      statusCode: 500,
      message: 'Hugging Face Token not configured'
    })
  }

  const client = new HfInference(HF_TOKEN)
  const body = await readBody(event)
  const { productName, price, description, productId, imageUrl, tone = 'professional', platform = 'facebook' } = body

  // Fetch Store Info if productId is provided
  let storeName = 'MyWatShop'
  let productLink = 'MyWatShop.com'
  let storeColor = '#25D366' // Default WhatsApp Green

  if (productId) {
    try {
      const supabase = await getServerSupabase()
      const { data: product } = await supabase
        .from('products')
        .select('*, stores(name, slug, color)')
        .eq('id', productId)
        .single()
      
      if (product && product.stores) {
        storeName = product.stores.name
        // Use configured base URL or default
        const baseUrl = config.public.appBaseUrl || 'https://mywatshop.com'
        productLink = `${baseUrl}/${product.stores.slug}/product/${product.id}`
        
        // Use store color for branding
        if (product.stores.color) {
           storeColor = product.stores.color
        }
      }
    } catch (e) {
      console.error('Error fetching store info:', e)
    }
  }

  // Determine Platform/Tone nuances
  let platformContext = ''
  switch (platform) {
    case 'whatsapp':
      platformContext = 'Format pour WhatsApp Status : Court, direct, beaucoup d\'emojis, urgence.'
      break
    case 'twitter':
      platformContext = 'Format pour Twitter : Très court (moins de 280 caractères), hashtags pertinents, punchy.'
      break
    case 'linkedin':
      platformContext = 'Format pour LinkedIn : Professionnel, orienté B2B, focus sur la valeur ajoutée.'
      break
    default: // facebook/instagram
      platformContext = 'Format pour Facebook/Instagram : Visuel, engageant, story-telling, hashtags.'
  }

  let toneContext = ''
  switch (tone) {
    case 'fun':
      toneContext = 'Ton : Amusant, décontracté, jeune, tutoiement.'
      break
    case 'urgent':
      toneContext = 'Ton : Urgent, offre limitée, "FOMO", impératif.'
      break
    case 'luxury':
      toneContext = 'Ton : Luxueux, exclusif, élégant, vouvoiement.'
      break
    default: // professional
      toneContext = 'Ton : Professionnel, fiable, informatif.'
  }

  // 1. TEXT GENERATION (Marketing Copy)
  // Using Llama-3.1-8B-Instruct via the chatCompletion method (OpenAI-compatible)
  const textPrompt = `Génère un post publicitaire pour ce produit.
Produit: ${productName}
Prix: ${price}
Description: ${description}
Boutique: ${storeName}
Lien: ${productLink}
${toneContext}
${platformContext}
Inclus un appel à l'action clair qui mentionne le lien ci-dessus.
Le résultat doit être le texte du post uniquement.`

  let generatedText = ''
  try {
    const chatCompletion = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        { role: "user", content: textPrompt }
      ],
      max_tokens: 500
    })
    generatedText = chatCompletion.choices[0].message.content || ''
  } catch (e) {
    console.error('Text gen error:', e)
    generatedText = `Découvrez ${productName} sur ${storeName} ! Cliquez ici : ${productLink}`
  }

  // 2. IMAGE GENERATION (Visual)
  // Determine color name or hex for prompt
  const colorPrompt = `brand color hex code ${storeColor}`
  
  let stylePrompt = `luxury aesthetic, minimalist background with ${colorPrompt} accents, high resolution, 8k, tech style, colored lighting matching ${colorPrompt}`
  
  if (tone === 'fun') stylePrompt = `colorful, bright, vibrant, energetic, pop art style, high saturation, using ${colorPrompt} as main theme`
  if (tone === 'urgent') stylePrompt = `bold, dynamic, red and ${colorPrompt} accents, sale aesthetic, impactful`
  if (tone === 'luxury') stylePrompt = `elegant, black and ${colorPrompt}, premium texture, studio lighting, cinematic`

  const imagePrompt = `Professional commercial photography of ${productName}, 
${description}, 
${stylePrompt}`

  let base64Image = ''
  
  try {
    if (imageUrl && imageUrl.startsWith('http')) {
       // A. IMAGE-TO-IMAGE (Enhance existing product photo)
       console.log('Using Image-to-Image with URL:', imageUrl)
       const imageRes = await fetch(imageUrl)
       if (!imageRes.ok) throw new Error('Failed to fetch product image')
       const inputBlob = await imageRes.blob()

       const imageBlob = await client.imageToImage({
         model: 'stabilityai/stable-diffusion-xl-base-1.0',
         inputs: inputBlob,
         parameters: { 
            prompt: imagePrompt,
            strength: 0.3, // Low strength to preserve the product, just enhance lighting/style
            num_inference_steps: 30
         }
       })
       
       const buffer = Buffer.from(await imageBlob.arrayBuffer())
       base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`

    } else {
       // B. TEXT-TO-IMAGE (Generate from scratch)
       // Try FLUX.1-schnell first (Better than SDXL, faster than Dev)
       const imageBlob = await client.textToImage({
         model: 'black-forest-labs/FLUX.1-schnell',
         inputs: imagePrompt,
         parameters: { num_inference_steps: 4 }
       })
       
       const buffer = Buffer.from(await imageBlob.arrayBuffer())
       base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`
    }
  } catch (e) {
    console.warn('Primary generation failed, falling back to SDXL T2I:', e)
    
    try {
      // Fallback to SDXL Text-to-Image
      const imageBlob = await client.textToImage({
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        inputs: imagePrompt
      })
      
      const buffer = Buffer.from(await imageBlob.arrayBuffer())
      base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`
    } catch (e2) {
       console.error('All image generation failed:', e2)
       // Return empty image, client will handle it
    }
  }

  return {
    text: generatedText.trim(),
    image: base64Image
  }
})
