import { NextRequest, NextResponse } from 'next/server'
import API from '@searchkit/api'
import type { SemanticSearchConfig } from '@searchkit/api'
import { getSearchkitConfig, sharedSettings } from '../../searchkit'
import { embed } from '../../embedding'

// Semantic search over the e2e data (e2e/tests/semantic.spec.ts): POST /api/semantic/<mode> with an
// InstantSearch request body searches with `semantic_search` in that mode ('hybrid', 'semantic_only' or
// 'text_only'). Both e2e seeders store an 8-dim `embedding` per product, made by the same deterministic
// function as `embed` here, so this route needs the e2e data (the public demo cluster has no `embedding`).
const MODES = ['hybrid', 'semantic_only', 'text_only'] as const
type Mode = (typeof MODES)[number]

const clients = new Map(
  MODES.map((mode) => {
    const semantic_search: SemanticSearchConfig = { field: 'embedding', embed, k: 50, mode }
    // brand is returned so the tests can check that filters apply to the vector search
    const result_attributes = [...sharedSettings.result_attributes, 'brand']
    return [mode, API(getSearchkitConfig({ semantic_search, result_attributes }), { debug: true })]
  })
)

export async function POST(req: NextRequest, { params }: { params: { mode: string } }) {
  const client = clients.get(params.mode as Mode)
  if (!client) {
    return NextResponse.json(
      { error: `Unknown mode "${params.mode}". Use one of: ${MODES.join(', ')}` },
      { status: 404 }
    )
  }
  const data = await req.json()
  const results = await client.handleRequest(data)
  return NextResponse.json(results)
}
