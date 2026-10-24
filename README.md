# Shopware QA

End-to-end tests for a [Shopware 6](https://www.shopware.com/) storefront, written with [Playwright](https://playwright.dev/).

The tests run against a public Shopware 6 demo shop and cover the main path a customer takes: finding a product, adding it to the cart and reaching the checkout.

<img src="https://skillicons.dev/icons?i=js,nodejs" alt="JavaScript, Node.js" /> &nbsp;<img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" height="48" />

## What is tested

| Test | What it checks |
|---|---|
| Homepage loads | the storefront opens and has the right title |
| Product search | searching sends the user to the results page |
| Search with no results | an unknown term shows the "no products found" message |
| Product details | name, price, product number and "add to cart" button are visible |
| Add to cart | the product appears in the cart drawer |
| Cart price | the cart shows the correct product and price |
| Cart quantity | the quantity can be increased from 1 to 2 |
| Remove from cart | the product disappears after removing it |
| Checkout page | the checkout opens with the right product and total |

Every test runs in **Chromium, Firefox and WebKit** (Safari's engine), so each scenario is checked in all three browsers.

## Approach

- **User-facing locators** like `getByRole` and `getByText` instead of fragile CSS paths where possible, so the tests read like what a user does and break less when the markup changes.
- **Independent tests:** each one starts from a fresh page and sets up its own state, so they can run in parallel and in any order.
- **Language-tolerant assertions:** the demo shop is German, so some checks accept both the German and the English text (`Zur Kasse` / `Checkout`).
- **CI-ready config:** retries and a single worker on CI, `test.only` is blocked on CI, and a trace is recorded when a test is retried.

## Running the tests

You need [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npx playwright install
npx playwright test
```

Open the HTML report afterwards:

```bash
npx playwright show-report
```

Run a single browser or watch the tests in a visible browser window:

```bash
npx playwright test --project=chromium
npx playwright test --headed
```

## What I'd add next

- page objects for the product page, cart and checkout to remove repeated code
- a GitHub Actions workflow that runs the tests on every push
- tests for customer registration and login
- visual regression tests for the product page

## Author

Erion Janova · [GitHub](https://github.com/erionjanova) · [LinkedIn](https://www.linkedin.com/in/erion-janova-60bb42340)
