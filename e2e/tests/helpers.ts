import { expect, Page } from '@playwright/test'

export const hits = (page: Page) => page.locator('.ais-Hits-item')
export const statsText = (page: Page) => page.locator('.ais-Stats-text')

/**
 * Number of results as reported by the <Stats /> widget, e.g. "1,234 results found in 12ms" -> 1234.
 * Newer react-instantsearch releases (e.g. 7.54) word an empty result set as "No results found in 12ms".
 */
export async function resultCount(page: Page): Promise<number> {
  const text = (await statsText(page).innerText()).trim()
  if (/^No results\b/.test(text)) return 0
  const match = text.match(/^([\d,]+)\s+result/)
  if (!match) throw new Error(`Could not read result count from stats text: "${text}"`)
  return Number(match[1].replace(/,/g, ''))
}

/** Loads the app and waits until the first page of results has rendered. */
export async function openApp(page: Page, search = '') {
  await page.goto(`/${search}`)
  await expect(hits(page).first()).toBeVisible()
  await expect(statsText(page)).toContainText('results found')
}

export async function search(page: Page, query: string) {
  await page.locator('.ais-SearchBox-input').fill(query)
  // routing writes the state to the URL as products[query]=<query> (debounced)
  await expect
    .poll(() => decodeURIComponent(page.url()).replace(/\+/g, ' '))
    .toContain(`[query]=${query}`)
}
