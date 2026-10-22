import { chromium } from 'playwright';

async function testMobileSwipe() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/#team', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const container = page.locator('#team div.overflow-x-auto');
  const initialScroll = await container.evaluate((el) => el.scrollLeft);
  console.log('Initial scrollLeft:', initialScroll);

  // Simulate touch swipe from (300, 400) to (100, 400)
  const box = await container.boundingBox();
  console.log('Container bounding box:', box);
  const startX = box.x + box.width * 0.8;
  const startY = box.y + box.height * 0.5;
  const endX = box.x + box.width * 0.2;
  const endY = startY;

  await page.touchscreen.tap(startX, startY);
  await page.waitForTimeout(200);

  // Try swiping
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();

  await page.waitForTimeout(500);
  const finalScroll = await container.evaluate((el) => el.scrollLeft);
  console.log('After swipe scrollLeft:', finalScroll);
  console.log('Delta:', finalScroll - initialScroll);

  await browser.close();
}

testMobileSwipe().catch(console.error);
