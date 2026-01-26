import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN')
    const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      console.error('Missing WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID')
      throw new Error('Server configuration error: Missing WhatsApp credentials')
    }

    let body
    try {
      body = await req.json()
    } catch (e) {
      console.error('Error parsing JSON body:', e)
      throw new Error('Invalid JSON body')
    }

    const { phone, code } = body

    if (!phone || !code) {
      throw new Error('Phone and code are required')
    }

    // Formatage pour le Cameroun (ex: +2376xxxxxxxx)
    // Remove spaces and +
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+/, '')

    console.log(`Sending OTP ${code} to ${cleanPhone}`)

    // Add timeout for WhatsApp API call (10s)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: cleanPhone,
          type: "template",
          template: {
            name: "otp_code",
            language: { code: "en" }, // Template semble être en anglais d'après le texte fourni
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: code },           // {{code}}
                  { type: "text", text: "Wa-Shop" },      // {{texte}} - Nom de l'app
                  { type: "text", text: "10 minutes" },   // {{texte}} - Durée de validité
                  { type: "text", text: "+237690000000" } // {{Téléphone}} - Numéro support
                ]
              },
              {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [{ type: "text", text: code }]
              }
            ]
          }
        }),
        signal: controller.signal
      }
    )
    clearTimeout(timeoutId)

    const result = await response.json()
    console.log('WhatsApp API Response:', result)

    if (result.error) {
      console.error('WhatsApp API Error:', result.error)
      throw new Error(result.error.message || 'WhatsApp API Error')
    }

    return new Response(JSON.stringify(result), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    })
  } catch (error: any) {
    console.error('Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    })
  }
})
