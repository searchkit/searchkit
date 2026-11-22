import { NextRequest, NextResponse } from 'next/server'
import API from '@searchkit/api'
import { getSearchkitConfig } from '../searchkit'

const apiClient = API(getSearchkitConfig(), { debug: true })

export async function POST(req: NextRequest) {
  const data = await req.json()

  const results = await apiClient.handleRequest(data)
  return NextResponse.json(results)
}
