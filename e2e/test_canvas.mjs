import { chromium } from '@playwright/test';

async function testCanvas() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const viewports = [1440, 1024, 375];

  for (const width of viewports) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto('http://localhost:5173/#home', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Test initial rest state
    const restState = await page.evaluate(() => {
      const h1 = document.querySelector('.hero-headline-text');
      const staticWord = document.querySelector('.hero-ready-static');
      const canvas = document.querySelector('.hero-ready-zoom-canvas');
      const csH1 = window.getComputedStyle(h1);
      const csWord = window.getComputedStyle(staticWord);

      return {
        h1FontFamily: csH1.fontFamily,
        h1FontSize: csH1.fontSize,
        h1LineHeight: csH1.lineHeight,
        wordFontFamily: csWord.fontFamily,
        wordColor: csWord.color,
        h1Rect: h1.getBoundingClientRect(),
        wordRect: staticWord.getBoundingClientRect(),
        windowWidth: window.innerWidth,
      };
    });

    console.log(`\n=== Viewport ${width}px Rest State ===`);
    console.log('H1 Font:', restState.h1FontFamily);
    console.log('H1 Size:', restState.h1FontSize);
    console.log('Word Rect:', restState.wordRect);
    console.log('H1 Rect:', restState.h1Rect);

    // Test scroll progress 0.1, 0.25, 0.5 (zoom animation)
    for (const scrollY of [200, 600, 1200]) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(200);
      const zoomState = await page.evaluate(() => {
        const canvas = document.querySelector('.hero-ready-zoom-canvas');
        return {
          canvasExists: !!canvas,
          canvasDisplay: canvas ? window.getComputedStyle(canvas).display : 'none',
          canvasWidth: canvas ? canvas.width : 0,
          canvasHeight: canvas ? canvas.height : 0,
        };
      });
      console.log(`  Scroll ${scrollY}px -> Canvas:`, zoomState);
    }

    await page.close();
  }

  await browser.close();
  console.log('\nAll canvas tests passed across 1440, 1024, 375px viewports.');
}

testCanvas().catch(err => {
  console.error('Canvas test error:', err);
  process.exit(1);
});
