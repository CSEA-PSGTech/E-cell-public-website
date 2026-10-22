import { chromium } from 'playwright';

async function testHeroTablet() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const viewports = [
    { name: 'ipad_portrait_768x1024', width: 768, height: 1024 },
    { name: 'ipad_air_820x1180', width: 820, height: 1180 },
    { name: 'iphone_375x667', width: 375, height: 667 },
    { name: 'desktop_1280x800', width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    // Scroll down to the blue reveal section (fully revealed state: ~2.6x viewport height)
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 2.6);
    });
    await page.waitForTimeout(600);
    
    await page.screenshot({ path: `hero_blue_${vp.name}.png` });
    console.log(`Saved hero_blue_${vp.name}.png`);
    await page.close();
  }

  await browser.close();
}

testHeroTablet().catch(console.error);
