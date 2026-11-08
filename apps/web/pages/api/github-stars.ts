import type { NextApiRequest, NextApiResponse } from 'next'

// GitHub allows 60 unauthenticated requests/hour per IP, so cache the count in
// memory for an hour and let the CDN cache the response too.
const REPO = 'searchkit/searchkit'
const TTL_MS = 60 * 60 * 1000

let cached: { stars: number; fetchedAt: number } | null = null

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

  if (cached && Date.now() - cached.fetchedAt < TTL_MS) {
    return res.status(200).json({ stars: cached.stars })
  }

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'searchkit-docs'
    }
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

    const r = await fetch(`https://api.github.com/repos/${REPO}`, { headers })
    if (!r.ok) throw new Error(`GitHub responded ${r.status}`)

    const data = (await r.json()) as { stargazers_count: number }
    cached = { stars: data.stargazers_count, fetchedAt: Date.now() }
    return res.status(200).json({ stars: cached.stars })
  } catch (err) {
    // Serve the last good value if GitHub is unavailable or rate limited.
    if (cached) return res.status(200).json({ stars: cached.stars })
    return res.status(502).json({ error: 'GitHub stars unavailable' })
  }
}
