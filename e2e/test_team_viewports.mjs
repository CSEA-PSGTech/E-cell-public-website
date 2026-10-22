import { chromium } from 'playwright';

async function testViewports() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const viewports = [
    { name: 'desktop_1440', width: 1440, height: 900 },
    { name: 'tablet_1024', width: 1024, height: 768 },
    { name: 'mobile_375', width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#team', { state: 'attached' });
    await page.locator('#team').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const teamSection = page.locator('#team');
    await teamSection.screenshot({ path: `team_${vp.name}.png` });
    console.log(`Saved team_${vp.name}.png`);
    await page.close();
  }

  await browser.close();
}

testViewports().catch(console.error);
