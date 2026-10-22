import { chromium } from '@playwright/test';
import * as fs from 'fs';

async function capture() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/#collaboration', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

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

  const results = {
    partnerForm: [],
    contactForm: []
  };

  for (const item of partnerFormElements) {
    results.partnerForm.push(await getComputed(item.sel, item.desc));
  }

  for (const item of contactFormElements) {
    results.contactForm.push(await getComputed(item.sel, item.desc));
  }

  // Also check placeholder styles
  const placeholderStyle = await page.evaluate(() => {
    const input = document.querySelector('#companyName');
    if (!input) return null;
    const cs = window.getComputedStyle(input, '::placeholder');
    return {
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      letterSpacing: cs.letterSpacing,
      lineHeight: cs.lineHeight,
      textTransform: cs.textTransform,
    };
  });
  results.placeholderStyle = placeholderStyle;

  fs.writeFileSync('e2e/before_styles.json', JSON.stringify(results, null, 2));
  console.log('REAL_STYLES_CAPTURED');
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

capture().catch(err => {
  console.error('Error capturing styles:', err);
  process.exit(1);
});
