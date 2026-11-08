import { expect, test } from '@playwright/test'
import { hits, openApp, resultCount, search } from './helpers'

test.describe('query rules', () => {
  test('"cheap tvs" rewrites the query and filters to TVs, boosting LG', async ({ page }) => {
    await openApp(page)
    await search(page, 'cheap tvs')

    // QueryRewrite -> '' + QueryFilter (price<=500 AND categories:TVs) keeps this well below the catalogue
    await expect.poll(() => resultCount(page)).toBeLessThan(200)
    expect(await resultCount(page)).toBeGreaterThan(0)
    // QueryBoost brand:LG puts LG products first
    await expect(hits(page).first()).toContainText(/LG/)
  })

  test('selecting the TVs category shows the banner from the RenderUserData rule', async ({
    page
  }) => {
    await openApp(page)
    await expect(page.locator('.query-rules__item')).toHaveCount(0)

    const menu = page.locator('.ais-HierarchicalMenu')
    await menu
      .getByRole('link', { name: /^TV & Home Theater/ })
      .first()
      .click()
    await menu.getByRole('link', { name: /^TVs/ }).first().click()

    await expect(page.locator('.query-rules__item-title')).toHaveText('We have TVs!')
    await expect(page.locator('.query-rules__item a')).toHaveAttribute(
      'href',
      'https://www.samsung.com'
    )
  })
})
