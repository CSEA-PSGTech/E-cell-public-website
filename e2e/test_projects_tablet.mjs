import { chromium } from 'playwright';

async function testProjectsTablet() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const viewports = [
    { name: 'iphone_375x667', width: 375, height: 667 },
    { name: 'ipad_portrait_768x1024', width: 768, height: 1024 },
    { name: 'ipad_air_820x1180', width: 820, height: 1180 },
    { name: 'ipad_landscape_1024x768', width: 1024, height: 768 },
    { name: 'desktop_1280x800', width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForSelector('#projects', { state: 'attached' });
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const projectsSection = page.locator('#projects');
    await projectsSection.screenshot({ path: `projects_${vp.name}.png` });
    console.log(`Saved projects_${vp.name}.png`);
    await page.close();
  }

  await browser.close();
}

testProjectsTablet().catch(console.error);
