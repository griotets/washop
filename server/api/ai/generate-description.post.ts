import { hfChatRequest, MODEL_TEXT } from '~/server/utils/ai'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, keywords } = body

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  }

  const prompt = `Rédige une description de produit professionnelle, persuasive et optimisée pour la vente (en français) pour le produit suivant :
Nom : ${name}
${keywords ? `Mots-clés/Caractéristiques : ${keywords}` : ''}

La description doit être engageante, mettre en avant les bénéfices, et faire environ 100-150 mots.
Format de réponse : Uniquement le texte de la description, sans introduction ni guillemets. c'est pour la fiche d'un produit de ecommerce donc il doit etre claire pour le client`

  try {
    const text = await hfChatRequest(MODEL_TEXT, 
      [{ role: 'user', content: prompt }], 
      { 
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9,
      }
    )

    return { description: text.trim() }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e.message
    })
  }
})
