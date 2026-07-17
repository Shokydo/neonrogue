import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:8000/index.html';

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];

page.on('pageerror', e => {
  errors.push(String(e));
});

await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);

await browser.close();

const hasW = errors.some(e => e.includes('Identifier') && e.includes("'W'"));
const hasPlayer = errors.some(e => e.includes('player is not defined'));

console.log(JSON.stringify({ url, errors, hasW, hasPlayer }));
process.exit(hasW || hasPlayer ? 1 : 0);

