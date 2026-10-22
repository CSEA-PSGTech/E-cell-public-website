import { chromium } from '@playwright/test';
import * as fs from 'fs';

async function verify() {
  const beforeStyles = JSON.parse(fs.readFileSync('e2e/before_styles.json', 'utf8'));
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5173/#collaboration', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const getComputed = async (selector, description) => {
    try {
      const loc = page.locator(selector).first();
      return await loc.evaluate((el, desc) => {
        const cs = window.getComputedStyle(el);
        return {
          description: desc,
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          letterSpacing: cs.letterSpacing,
          lineHeight: cs.lineHeight,
          textTransform: cs.textTransform,
        };
      }, description);
    } catch (e) {
      return { description, error: e.message };
    }
  };

  const partnerFormElements = [
    { sel: '#collaboration h1', desc: 'Heading above partner form' },
    { sel: '#collaboration p', desc: 'Subtitle below partner form heading' },
    { sel: '#collaboration span.text-\\[11px\\]', desc: 'Step title label' },
    { sel: '#collaboration h3', desc: 'Step content title (Company Info)' },
    { sel: '#collaboration label', desc: 'Field label (Company Name)' },
    { sel: '#companyName', desc: 'Input field (companyName)' },
    { sel: '#collaboration .text-muted-foreground', desc: 'Helper text' },
    { sel: '#companySize', desc: 'Select dropdown' },
    { sel: '#collaboration button:has(svg.lucide-chevron-left)', desc: 'Back button' },
    { sel: '#collaboration button:has(svg.lucide-chevron-right)', desc: 'Continue button' },
    { sel: '#collaboration p:has-text("Step")', desc: 'Stepper counter (Step 1 of 5)' },
  ];

  const contactFormElements = [
    { sel: '#contact h2', desc: 'Heading above contact form (Get in Touch)' },
    { sel: '#contact p', desc: 'Description below contact heading' },
    { sel: '#contact label', desc: 'Contact field label (Full Name)' },
    { sel: '#contact-fullName', desc: 'Contact input (fullName)' },
    { sel: '#contact-message', desc: 'Contact textarea (message)' },
    { sel: '#contact button[type="submit"]', desc: 'Contact submit button' },
  ];

  const currentResults = {
    partnerForm: [],
    contactForm: []
  };

  for (const item of partnerFormElements) {
    currentResults.partnerForm.push(await getComputed(item.sel, item.desc));
  }

  for (const item of contactFormElements) {
    currentResults.contactForm.push(await getComputed(item.sel, item.desc));
  }

  console.log('--- FORM COMPARISON AUDIT ---');
  let formDiffs = [];

  // Compare partner inner form elements (skip index 0 & 1 which are heading and subtitle above form)
  for (let i = 2; i < currentResults.partnerForm.length; i++) {
    const before = beforeStyles.partnerForm[i];
    const after = currentResults.partnerForm[i];
    const match = JSON.stringify(before) === JSON.stringify(after);
    console.log(`[Partner Form] ${before.description}: ${match ? 'EXACT MATCH' : 'DIFF DETECTED'}`);
    if (!match) {
      formDiffs.push({ before, after });
      console.log('  BEFORE:', before);
      console.log('  AFTER: ', after);
    }
  }

  // Compare contact inner form elements (skip index 0 & 1 which are heading and description above form)
  for (let i = 2; i < currentResults.contactForm.length; i++) {
    const before = beforeStyles.contactForm[i];
    const after = currentResults.contactForm[i];
    const match = JSON.stringify(before) === JSON.stringify(after);
    console.log(`[Contact Form] ${before.description}: ${match ? 'EXACT MATCH' : 'DIFF DETECTED'}`);
    if (!match) {
      formDiffs.push({ before, after });
      console.log('  BEFORE:', before);
      console.log('  AFTER: ', after);
    }
  }

  // Verify Heading Fonts (no fallback to Times New Roman)
  console.log('\n--- HEADINGS FONT VERIFICATION ---');
  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1, h2, h3, .font-display')).map(h => {
      const cs = window.getComputedStyle(h);
      return {
        tag: h.tagName,
        text: (h.textContent || '').trim().slice(0, 40),
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
      };
    });
  });

  const timesFallback = headings.filter(h => h.fontFamily.toLowerCase().includes('times new roman') && !h.fontFamily.toLowerCase().includes('playfair'));
  console.log(`Headings checked: ${headings.length}. Unintended Times New Roman fallbacks: ${timesFallback.length}`);
  if (timesFallback.length > 0) {
    console.log('Times New Roman fallbacks found:', timesFallback);
  }

  // Test Hero at 1440, 1024, 375px
  console.log('\n--- HERO RESPONSIVE TEST AT 1440px, 1024px, 375px ---');
  const viewports = [1440, 1024, 375];
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp, height: 900 });
    await page.goto('http://localhost:5173/#home', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const heroMetrics = await page.evaluate(() => {
      const h1 = document.querySelector('.hero-headline-text');
      const ready = document.querySelector('.hero-ready-static');
      if (!h1 || !ready) return { error: 'Hero element not found' };
      const h1Rect = h1.getBoundingClientRect();
      const readyRect = ready.getBoundingClientRect();
      const bodyWidth = document.body.clientWidth;
      const h1Lines = h1.querySelectorAll('span.block');
      return {
        bodyWidth,
        h1Width: h1Rect.width,
        h1Height: h1Rect.height,
        readyWidth: readyRect.width,
        readyHeight: readyRect.height,
        line1Text: h1Lines[0]?.textContent?.trim(),
        line2Text: h1Lines[1]?.textContent?.trim(),
        overflowsH1: h1Rect.right > bodyWidth + 2,
        overflowsReady: readyRect.right > bodyWidth + 2,
      };
    });
    console.log(`Viewport ${vp}px:`, heroMetrics);
  }

  await browser.close();
}

verify().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
