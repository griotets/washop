import { hfChatRequest, MODEL_TEXT } from '~/server/utils/ai'
import * as cheerio from 'cheerio'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({ statusCode: 400, statusMessage: 'URL is required' })
  }

  try {
    // 1. Scrape the HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove scripts, styles, etc.
    $('script').remove()
    $('style').remove()
    $('nav').remove()
    $('footer').remove()

    // Extract basic info
    const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || ''
    const metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || ''
    const image = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || ''
    
    // Get main content text (truncated)
    let content = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 3000)

    // 2. Ask AI to structure it
    const prompt = `Analyse le texte suivant extrait d'une page produit e-commerce et extrais les informations au format JSON.
Texte :
Titre: ${title}
Description Meta: ${metaDescription}
Contenu: ${content}

Réponds UNIQUEMENT avec un objet JSON valide suivant cette structure (si une info est introuvable, mets null ou 0) :
{
  "name": "Nom du produit",
  "price": 0,
  "description": "Description complète",
  "sku": "Code produit ou null",
  "stock_quantity": 0
}
Le prix doit être un nombre (si c'est "10 000 FCFA", mets 10000).
JSON :`

    const jsonStr = await hfChatRequest(MODEL_TEXT, 
      [{ role: 'user', content: prompt }],
      {
        max_tokens: 500,
        temperature: 0.1, // Low temp for deterministic JSON
      }
    )

    // Attempt to clean and parse JSON
    try {
      // Find JSON object in response (in case of extra text)
      let cleanJsonStr = jsonStr
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanJsonStr = jsonMatch[0]
      }
      const data = JSON.parse(cleanJsonStr)
      
      // Add the scraped image if not present (AI doesn't see images)
      return {
        ...data,
        images: image ? [image.startsWith('http') ? image : new URL(image, url).toString()] : []
      }
    } catch (parseError) {
      // Fallback if AI fails to generate valid JSON
      return {
        name: title,
        description: metaDescription,
        price: 0,
        images: image ? [image] : [],
        error: "AI parsing failed, returned raw data: " + jsonStr
      }
    }

  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e.message
    })
  }
})
