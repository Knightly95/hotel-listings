import { expect, test } from '@playwright/test';

const cards = '[data-testid^="hotel-card-"]';

test.beforeEach(async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator(cards).first()).toBeVisible();
});

test('lists the hotels in the map area, with a price marker each', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /stays in this map area/ })).toBeVisible();
  await expect(page.locator(cards)).toHaveCount(12);
  await expect(page.locator('.maplibregl-marker button')).toHaveCount(12);
});

test('loads more hotels when scrolling to the end of the list', async ({ page }) => {
  await page.getByTestId('results-panel').evaluate((panel) => panel.scrollTo(0, panel.scrollHeight));
  await expect(page.locator(cards)).toHaveCount(24);
});

test('filters by star rating and maximum price', async ({ page }) => {
  // The pills are labels around visually hidden inputs: click what people see.
  await page.locator('label', { has: page.getByTestId('checkbox-5') }).click();
  await page.locator('label', { has: page.getByTestId('price-300') }).click();

  await expect(page.getByRole('button', { name: 'Clear filters (2)' })).toBeVisible();
  const ratings = await page.locator(`${cards} [role="img"]`).evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('aria-label'))
  );
  expect(ratings.length).toBeGreaterThan(0);
  expect(new Set(ratings)).toEqual(new Set(['5 stars']));

  await page.getByRole('button', { name: 'Clear filters (2)' }).click();
  await expect(page.getByRole('radio', { name: 'Any' })).toBeChecked();
});

test('searches by town, ignoring accents', async ({ page }) => {
  await page.getByRole('searchbox', { name: 'Search hotels or towns' }).fill('medano');
  const towns = page.locator(`${cards} article span.truncate`);
  await expect(towns.first()).toHaveText('El Médano');
  expect(new Set(await towns.allTextContents())).toEqual(new Set(['El Médano']));
});

test('opens the details, closes them with Escape, and shows the hotel on the map', async ({ page }) => {
  const firstName = await page.locator(`${cards} h3 button`).first().textContent();
  await page.locator(`${cards} h3 button`).first().click();

  const dialog = page.getByRole('dialog', { name: firstName ?? '' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Amenities' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator(`${cards} h3 button`).first()).toBeFocused();

  await page.locator(`${cards} h3 button`).first().click();
  await dialog.getByRole('button', { name: 'Show on map' }).click();
  await expect(page.locator('.hotel-popup')).toContainText(firstName ?? '');
});

test('switches to Spanish', async ({ page }) => {
  await page.getByRole('link', { name: /Español/ }).click();
  await expect(page).toHaveURL(/\/es\/?$/);
  await expect(page.getByRole('heading', { name: /alojamientos en esta zona del mapa/ })).toBeVisible();
  // Spanish puts the euro sign after the amount.
  await expect(page.locator(cards).first()).toContainText(/\d+\s€/);
  await expect(page.locator(cards).first()).toContainText('/ noche');
});

test('stays readable when the system uses a dark theme', async ({ browser }) => {
  const page = await browser.newPage({ colorScheme: 'dark' });
  await page.goto('/en/');
  await expect(page.locator(cards).first()).toBeVisible();
  const color = await page
    .getByRole('heading', { name: /stays in this map area/ })
    .evaluate((node) => getComputedStyle(node).color);
  expect(color).not.toBe('rgb(255, 255, 255)');
  await page.close();
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('switches between the list and the map', async ({ page }) => {
    await expect(page.getByTestId('map-panel')).toBeHidden();
    await page.getByRole('button', { name: 'Show map' }).click();
    await expect(page.getByTestId('map-panel')).toBeVisible();
    await expect(page.getByTestId('results-panel')).toBeHidden();
    await page.getByRole('button', { name: 'Show list' }).click();
    await expect(page.locator(cards).first()).toBeVisible();
  });
});
