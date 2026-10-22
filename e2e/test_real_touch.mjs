import { chromium } from 'playwright';

async function testRealTouchSwipe() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/#team', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#team', { state: 'attached' });
  await page.locator('#team').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const container = page.locator('#team div.overflow-x-auto');
  await container.waitFor({ state: 'attached' });
  const initialScroll = await container.evaluate((el) => el.scrollLeft);
  console.log('Initial scrollLeft:', initialScroll);

  const box = await container.boundingBox();
  console.log('Container bounding box:', box);
  const startX = box.x + box.width * 0.8;
  const startY = box.y + box.height * 0.5;
  const endX = box.x + box.width * 0.2;

  // Dispatch real touch events simulating finger swipe across the cards
  await page.evaluate(({ startX, startY, endX }) => {
    const card = document.querySelector('.team-member-card');
    if (!card) {
      console.log('Card not found');
      return;
    }

    const createTouch = (x, y, id = 0) => new Touch({
      identifier: id,
      target: card,
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y,
      screenX: x,
      screenY: y,
    });

    const tStart = createTouch(startX, startY);
    card.dispatchEvent(new TouchEvent('touchstart', {
      touches: [tStart],
      targetTouches: [tStart],
      changedTouches: [tStart],
      bubbles: true,
      cancelable: true,
    }));

    // Move in 5 steps (simulating horizontal swipe of 200px)
    for (let i = 1; i <= 5; i++) {
      const curX = startX + (endX - startX) * (i / 5);
      const tMove = createTouch(curX, startY);
      card.dispatchEvent(new TouchEvent('touchmove', {
        touches: [tMove],
        targetTouches: [tMove],
        changedTouches: [tMove],
        bubbles: true,
        cancelable: true,
      }));
    }

    const tEnd = createTouch(endX, startY);
    card.dispatchEvent(new TouchEvent('touchend', {
      touches: [],
      targetTouches: [],
      changedTouches: [tEnd],
      bubbles: true,
      cancelable: true,
    }));
  }, { startX, startY, endX });

  await page.waitForTimeout(600);
  const finalScroll = await container.evaluate((el) => el.scrollLeft);
  console.log('After touch swipe scrollLeft:', finalScroll);
  console.log('Delta scrolled:', finalScroll - initialScroll);

  // Take screenshot of mobile view to verify visual appearance
  const teamSection = page.locator('#team');
  await teamSection.screenshot({ path: 'team_mobile_swiped.png' });
  console.log('Screenshot saved to team_mobile_swiped.png');

  await browser.close();
}

testRealTouchSwipe().catch(console.error);
