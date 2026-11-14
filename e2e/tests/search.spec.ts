import { expect, test } from '@playwright/test'
import { hits, openApp, resultCount, search } from './helpers'

test.describe('search', () => {
  test('renders the full seeded catalogue and a page of hits on load', async ({ page }) => {
    await openApp(page)
    expect(await resultCount(page)).toBe(10000)
    await expect(hits(page)).toHaveCount(15)
  })

  test('narrows results and highlights matches for a query', async ({ page }) => {
    await openApp(page)
    await search(page, 'samsung')

    await expect.poll(() => resultCount(page)).toBeLessThan(10000)
    await expect(hits(page).first()).toBeVisible()
    await expect(page.locator('.ais-Highlight-highlighted').first()).toContainText(/samsung/i)
  })

  test('shows an empty state for a query with no matches', async ({ page }) => {
    await openApp(page)
    await search(page, 'zzzzqqqxxnotaproduct')

    await expect(hits(page)).toHaveCount(0)
    await expect.poll(() => resultCount(page)).toBe(0)
  })

  test('restores search state from the URL', async ({ page }) => {
    await openApp(page, '?products%5Bquery%5D=iphone')
    await expect(page.locator('.ais-SearchBox-input')).toHaveValue('iphone')
    await expect.poll(() => resultCount(page)).toBeLessThan(10000)
  })
})

test.describe('pagination', () => {
  test('moves to the next page and shows different hits', async ({ page }) => {
    await openApp(page)
    const firstPage = await hits(page).allInnerTexts()

    await page.locator('.ais-Pagination-item--nextPage a').click()
    await expect(page.locator('.ais-Pagination-item--selected')).toHaveText('2')
    await expect.poll(async () => (await hits(page).allInnerTexts())[0]).not.toBe(firstPage[0])
    await expect(hits(page)).toHaveCount(15)
  })

  test('keeps the page after a reload (URL routing round-trip)', async ({ page }) => {
    await openApp(page)
    const firstPageHits = await hits(page).allInnerTexts()
    await page.locator('.ais-Pagination-item--nextPage a').click()
    await expect(page.locator('.ais-Pagination-item--selected')).toHaveText('2')
    await expect(page).toHaveURL(/page%5D=2|page\]=2|page=2/)
    await expect.poll(async () => (await hits(page).allInnerTexts())[0]).not.toBe(firstPageHits[0])
    const secondPageHits = await hits(page).allInnerTexts()

    await page.reload()
    await expect(page.locator('.ais-Pagination-item--selected')).toHaveText('2')
    await expect(hits(page).first()).toBeVisible()
    expect(await hits(page).allInnerTexts()).toEqual(secondPageHits)
  })
})
