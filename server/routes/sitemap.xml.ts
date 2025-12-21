import { load } from 'cheerio'
import { getServerSupabase } from '~/server/utils/supabase'

type SitemapEntry = {
  loc: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: string
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function isoDate(input?: string | null) {
  if (!input) return new Date().toISOString()
  const d = new Date(input)
  const t = d.getTime()
  if (Number.isFinite(t)) return d.toISOString()
  return new Date().toISOString()
}

function buildXml(urls: SitemapEntry[]) {
  const items = urls.map((u) => {
    return [
      '<url>',
      `<loc>${escapeXml(u.loc)}</loc>`,
      `<lastmod>${escapeXml(u.lastmod)}</lastmod>`,
      `<changefreq>${escapeXml(u.changefreq)}</changefreq>`,
      `<priority>${escapeXml(u.priority)}</priority>`,
      '</url>'
    ].join('')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...items,
    '</urlset>'
  ].join('')
}

function validateXml(xml: string) {
  const errors: string[] = []
  const $ = load(xml, { xmlMode: true })
  const urlset = $('urlset')
  if (urlset.length !== 1) errors.push('Missing <urlset>')
  if (urlset.attr('xmlns') !== 'http://www.sitemaps.org/schemas/sitemap/0.9') errors.push('Invalid urlset xmlns')

  const allowedChangefreq = new Set(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
  const urls = $('url')
  urls.each((_, el) => {
    const loc = $(el).find('loc').text().trim()
    const lastmod = $(el).find('lastmod').text().trim()
    const changefreq = $(el).find('changefreq').text().trim()
    const priority = $(el).find('priority').text().trim()

    if (!loc) errors.push('Missing <loc>')
    if (loc && !/^https?:\/\//i.test(loc)) errors.push(`Invalid <loc>: ${loc}`)
    if (!lastmod) errors.push(`Missing <lastmod> for ${loc || '(unknown loc)'}`)
    if (lastmod && Number.isNaN(Date.parse(lastmod))) errors.push(`Invalid <lastmod>: ${lastmod}`)
    if (!changefreq) errors.push(`Missing <changefreq> for ${loc || '(unknown loc)'}`)
    if (changefreq && !allowedChangefreq.has(changefreq)) errors.push(`Invalid <changefreq>: ${changefreq}`)
    if (!priority) errors.push(`Missing <priority> for ${loc || '(unknown loc)'}`)
    const pr = Number(priority)
    if (priority && (!Number.isFinite(pr) || pr < 0 || pr > 1)) errors.push(`Invalid <priority>: ${priority}`)
  })

  return { ok: errors.length === 0, errors }
}

export default defineEventHandler(async (event) => {
  const baseUrl = getRequestURL(event).origin
  const supabase = await getServerSupabase()

  const now = new Date().toISOString()
  const urls: SitemapEntry[] = [
    { loc: `${baseUrl}/`, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/pricing`, lastmod: now, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/products`, lastmod: now, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/about_us`, lastmod: now, changefreq: 'monthly', priority: '0.5' },
    { loc: `${baseUrl}/industry`, lastmod: now, changefreq: 'weekly', priority: '0.6' },
    { loc: `${baseUrl}/products/whatsapp-order`, lastmod: now, changefreq: 'monthly', priority: '0.4' },
    { loc: `${baseUrl}/products/whatsapp-business-api`, lastmod: now, changefreq: 'monthly', priority: '0.4' },
    { loc: `${baseUrl}/products/telegram-order`, lastmod: now, changefreq: 'monthly', priority: '0.4' },
    { loc: `${baseUrl}/products/chatbot`, lastmod: now, changefreq: 'monthly', priority: '0.4' }
  ]

  const industrySlugs = [
    'restaurants',
    'cafes',
    'home-based-food-business',
    'bakery-pastry',
    'catering-meal-subscription',
    'hotel-bars-restaurants',
    'grocer-butcher',
    'b2b-wholesale',
    'ecommerce',
    'fashion-apparel',
    'pharmacies-health',
    'mobile-electronics',
    'digital-products-services',
    'popup-event-store',
    'personal-shopping',
    'jewelry-accessories',
    'religious-community',
    'salon',
    'laundry',
    'professional-services',
    'pets-grooming',
    'hotel-booking',
    'education',
    'printing-services',
    'rental',
    'tour-travel-services',
    'ticketing'
  ]
  for (const slug of industrySlugs) {
    urls.push({ loc: `${baseUrl}/industry/${slug}`, lastmod: now, changefreq: 'monthly', priority: '0.4' })
  }

  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('id,slug,created_at,is_active')
    .eq('is_active', true)

  if (storesError) {
    setResponseStatus(event, 500)
    return `Sitemap generation failed: ${storesError.message}`
  }

  const storeIdToSlug = new Map<string, string>()
  for (const s of (stores || [])) {
    if (!s?.id || !s?.slug) continue
    storeIdToSlug.set(String(s.id), String(s.slug))
    urls.push({
      loc: `${baseUrl}/${String(s.slug)}`,
      lastmod: isoDate(s.created_at),
      changefreq: 'daily',
      priority: '0.8'
    })
  }

  const storeIds = Array.from(storeIdToSlug.keys())
  if (storeIds.length) {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id,store_id,created_at,is_visible')
      .in('store_id', storeIds)
      .eq('is_visible', true)

    if (productsError) {
      setResponseStatus(event, 500)
      return `Sitemap generation failed: ${productsError.message}`
    }

    for (const p of (products || [])) {
      const storeSlug = storeIdToSlug.get(String(p.store_id))
      if (!storeSlug || p?.id == null) continue
      urls.push({
        loc: `${baseUrl}/${storeSlug}/product/${String(p.id)}`,
        lastmod: isoDate(p.created_at),
        changefreq: 'weekly',
        priority: '0.7'
      })
    }
  }

  const xml = buildXml(urls)
  const validation = validateXml(xml)
  if (!validation.ok) {
    setResponseStatus(event, 500)
    return `Invalid sitemap.xml: ${validation.errors.join('; ')}`
  }

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=0, s-maxage=3600')
  return xml
})

