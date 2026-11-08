import { expect, test } from '@playwright/test'
import { hits, openApp, resultCount } from './helpers'

const menu = (page: import('@playwright/test').Page) => page.locator('.ais-HierarchicalMenu')

test.describe('hierarchical category facet', () => {
  test('lists top level categories with the default facet order', async ({ page }) => {
    await openApp(page)
    await expect(menu(page).getByRole('link', { name: /Cell Phones/ })).toBeVisible()
    await expect(menu(page).getByRole('link', { name: /TV & Home Theater/ })).toBeVisible()
    // brand only appears once a TVs category is selected (query rule), not by default
    await expect(page.locator('.ais-RefinementList')).toHaveCount(0)
  })

  test('drills down lvl0 -> lvl1 and filters the results', async ({ page }) => {
    await openApp(page)
    const total = await resultCount(page)

    await menu(page)
      .getByRole('link', { name: /^TV & Home Theater/ })
      .first()
      .click()
    await expect.poll(() => resultCount(page)).toBeLessThan(total)
    const tvAndHomeTheater = await resultCount(page)

    await menu(page).getByRole('link', { name: /^TVs/ }).first().click()
    await expect.poll(() => resultCount(page)).toBeLessThan(tvAndHomeTheater)
    await expect(page.locator('.ais-CurrentRefinements-item').first()).toBeVisible()
    await expect(hits(page).first()).toBeVisible()
  })

  test('removing the refinement restores the full result set', async ({ page }) => {
    await openApp(page)
    await menu(page)
      .getByRole('link', { name: /Cell Phones/ })
      .first()
      .click()
    await expect.poll(() => resultCount(page)).toBeLessThan(10000)

    await page.locator('.ais-CurrentRefinements-delete').first().click()
    await expect.poll(() => resultCount(page)).toBe(10000)
    await expect(page.locator('.ais-CurrentRefinements-item')).toHaveCount(0)
  })
})

test.describe('brand refinement list', () => {
  test('selecting a brand narrows the results and shows a current refinement', async ({ page }) => {
    await openApp(page)
    await menu(page)
      .getByRole('link', { name: /^TV & Home Theater/ })
      .first()
      .click()
    await menu(page).getByRole('link', { name: /^TVs/ }).first().click()

    const brandList = page.locator('.ais-RefinementList')
    await expect(brandList).toBeVisible()
    const before = await resultCount(page)

    await brandList.locator('.ais-RefinementList-checkbox').first().check()
    await expect.poll(() => resultCount(page)).toBeLessThan(before)
    await expect(page.locator('.ais-CurrentRefinements')).toContainText(/brand/i)
  })

  test('searching within the brand facet filters its values', async ({ page }) => {
    await openApp(page)
    await menu(page)
      .getByRole('link', { name: /^TV & Home Theater/ })
      .first()
      .click()
    await menu(page).getByRole('link', { name: /^TVs/ }).first().click()

    const brandList = page.locator('.ais-RefinementList')
    await expect(brandList).toBeVisible()
    await brandList.locator('.ais-SearchBox-input').fill('samsung')
    await expect(brandList.locator('.ais-RefinementList-item')).toHaveCount(1)
    await expect(brandList.locator('.ais-RefinementList-item')).toContainText(/samsung/i)
  })

  // https://github.com/searchkit/searchkit/issues/1378
  for (const facetQuery of ['Samsung', 'SAMSUNG', 'sAmSuNg']) {
    test(`facet search is case insensitive ("${facetQuery}")`, async ({ page }) => {
      await openApp(page)
      await menu(page)
        .getByRole('link', { name: /^TV & Home Theater/ })
        .first()
        .click()
      await menu(page).getByRole('link', { name: /^TVs/ }).first().click()

      const brandList = page.locator('.ais-RefinementList')
      await expect(brandList).toBeVisible()
      await brandList.locator('.ais-SearchBox-input').fill(facetQuery)
      await expect(brandList.locator('.ais-RefinementList-item')).toHaveCount(1)
      await expect(brandList.locator('.ais-RefinementList-item')).toContainText(/samsung/i)
    })
  }
})

test.describe('price range facet', () => {
  test('applying a min/max narrows the results', async ({ page }) => {
    await openApp(page)
    const total = await resultCount(page)

    const range = page.locator('.ais-RangeInput')
    await expect(range).toBeVisible()
    await range.locator('.ais-RangeInput-input--min').fill('100')
    await range.locator('.ais-RangeInput-input--max').fill('200')
    await range.locator('.ais-RangeInput-submit').click()

    await expect.poll(() => resultCount(page)).toBeLessThan(total)
    await expect(page.locator('.ais-CurrentRefinements')).toContainText(/price/i)
    await expect(page).toHaveURL(/price/)
  })
})
