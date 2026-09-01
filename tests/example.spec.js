// @ts-check
import { test, expect } from '@playwright/test';

test('Shopware homepage loads successfully', async ({ page }) => {
  await page.goto('https://www.shopware6-demo.development-s25.com/');

  await expect(page).toHaveTitle('Catalogue #1');
});

test('Shopware product search works', async ({ page }) => {
  await page.goto('https://www.shopware6-demo.development-s25.com/');

  const searchInput = page.locator('input[type="search"]').first();

  await searchInput.fill('test');
  await searchInput.press('Enter');

  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(/search/);
});

test('Shopware product details are displayed', async ({ page }) => {
  await page.goto(
    'https://www.shopware6-demo.development-s25.com/Westin-Test-12cm/SW10003.1'
  );

  await expect(
    page.getByRole('heading', {
      name: 'Westin Test 12cm',
      exact: true
    })
  ).toBeVisible();

  await expect(page.getByText('€10.00')).toBeVisible();

  await expect(
    page.getByRole('button', { name: /In den Warenkorb/i })
  ).toBeVisible();

  await expect(page.getByText('SW10003.1')).toBeVisible();
});

test('Shopware product can be added to cart', async ({ page }) => {
  await page.goto(
    'https://www.shopware6-demo.development-s25.com/Westin-Test-12cm/SW10003.1'
  );

  await page.getByRole('button', { name: /In den Warenkorb/i }).click();

  await expect(page.locator('.offcanvas-cart')).toBeVisible();

  await expect(
    page.locator('.offcanvas-cart')
  ).toContainText('Westin Test 12cm');
});

test('Shopware cart shows correct product and price', async ({ page }) => {
  await page.goto(
    'https://www.shopware6-demo.development-s25.com/Westin-Test-12cm/SW10003.1'
  );

  await page.getByRole('button', { name: /In den Warenkorb/i }).click();

  const cart = page.locator('.offcanvas-cart');

  await expect(cart).toBeVisible();
  await expect(cart).toContainText('Westin Test 12cm');
  await expect(cart).toContainText('€10.00');
});

test('Shopware cart quantity can be increased', async ({ page }) => {
  await page.goto(
    'https://www.shopware6-demo.development-s25.com/Westin-Test-12cm/SW10003.1'
  );

  await page.getByRole('button', { name: /In den Warenkorb/i }).click();

  const cart = page.locator('.offcanvas-cart');

  await expect(cart).toBeVisible();

  const quantityInput = cart.locator('input[type="number"]').first();

  await expect(quantityInput).toHaveValue('1');

  await quantityInput.fill('2');
  await quantityInput.press('Enter');

  await expect(quantityInput).toHaveValue('2');

  await expect(cart).toContainText('Westin Test 12cm');
});

test('Shopware shows no results for an invalid search', async ({ page }) => {
  await page.goto('https://www.shopware6-demo.development-s25.com/');

  const searchInput = page.locator('input[type="search"]').first();

  await searchInput.fill('xyznonexistent123');
  await searchInput.press('Enter');

  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(/search/);

  await expect(
    page.getByText(/Keine Produkte gefunden|No products found/i)
  ).toBeVisible();
});

test('Shopware product can be removed from cart', async ({ page }) => {
  await page.goto(
    'https://www.shopware6-demo.development-s25.com/Westin-Test-12cm/SW10003.1'
  );

  await page.getByRole('button', { name: /In den Warenkorb/i }).click();

  const cart = page.locator('.offcanvas-cart');

  await expect(cart).toBeVisible();
  await expect(cart).toContainText('Westin Test 12cm');

  const removeButton = cart.locator(
    'button[class*="remove"], button[class*="delete"], button[aria-label*="remove" i], button[aria-label*="delete" i]'
  ).first();

  await expect(removeButton).toBeVisible();

  await removeButton.click();

  await expect(cart).not.toContainText('Westin Test 12cm');
});

test('Shopware checkout page is displayed correctly', async ({ page }) => {
  await page.goto(
    'https://www.shopware6-demo.development-s25.com/Westin-Test-12cm/SW10003.1'
  );

  await page.getByRole('button', { name: /In den Warenkorb/i }).click();

  const cart = page.locator('.offcanvas-cart');

  await expect(cart).toBeVisible();

  const checkoutLink = cart.getByRole('link', {
    name: /Zur Kasse|Checkout/i
  }).first();

  await expect(checkoutLink).toBeVisible();

  await checkoutLink.click();

  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(/checkout/);

  await expect(page.getByText('Westin Test 12cm')).toBeVisible();

  await expect(
    page.locator('dd.checkout-aside-summary-total')
  ).toContainText('€10.00');
});