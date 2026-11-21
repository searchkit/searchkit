import { expect, Page, test } from '@playwright/test'
import { resultCount, statsText } from './helpers'

// /facet-order shows the brand facet twice: `brand` ordered by count (the default) and
// `brand_az`, configured with `order: 'alpha'`. The catalogue has hundreds of brands, so the
// ten values each one returns don't overlap.
const byCount = (page: Page) => page.getByTestId('brand-by-count').locator('.ais-RefinementList')
const aToZ = (page: Page) => page.getByTestId('brand-a-z').locator('.ais-RefinementList')
const labels = (list: ReturnType<typeof byCount>) =>
  list.locator('.ais-RefinementList-labelText').allInnerTexts()

async function openFacetOrder(page: Page) {
  await page.goto('/facet-order')
  await expect(statsText(page)).toContainText('results found')
  await expect(aToZ(page).locator('.ais-RefinementList-item')).toHaveCount(10)
}

test.describe('facet value order (UI)', () => {
  test('a facet without order lists the most common brands', async ({ page }) => {
    await openFacetOrder(page)
    expect(await labels(byCount(page))).toEqual([
      'Insignia™',
      'Samsung',
      'Apple',
      'HP',
      'Sony',
      'Metra',
      'LG',
      'Dynex™',
      'Canon',
      'Speck'
    ])
  })

  test("order: 'alpha' lists the brands from the start of the alphabet", async ({ page }) => {
    await openFacetOrder(page)
    expect(await labels(aToZ(page))).toEqual([
      '-40 Below',
      '2K',
      '360fly',
      '3DR',
      '3M',
      '72-9301',
      'ADOPTED',
      'AMC Theatres',
      'AOC',
      'APC'
    ])
    const counts = await aToZ(page).locator('.ais-RefinementList-count').allInnerTexts()
    expect(counts).toEqual(['3', '10', '1', '4', '10', '1', '22', '2', '8', '8'])
  })

  test('refining an alphabetically ordered value filters the results', async ({ page }) => {
    await openFacetOrder(page)
    await aToZ(page).getByRole('checkbox', { name: /^3M/ }).check()
    await expect.poll(() => resultCount(page)).toBe(10)
    await expect(page.locator('.ais-CurrentRefinements')).toContainText('3M')
  })

  test('searching the facet returns matches alphabetically', async ({ page }) => {
    await openFacetOrder(page)
    await aToZ(page).locator('.ais-SearchBox-input').fill('son')
    // by count Sony (251) would come first
    await expect(aToZ(page).locator('.ais-RefinementList-labelText')).toHaveText([
      'Philips Sonicare',
      'SONOS',
      'Sonax',
      'Sonic Alert',
      'Sony',
      'Spa Sonic'
    ])
  })
})
