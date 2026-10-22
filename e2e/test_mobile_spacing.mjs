import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.locator('#projects').screenshot({ path: 'projects_iphone14_current.png' });
  console.log('Saved projects_iphone14_current.png');
  await browser.close();
}

capture().catch(console.error);
