import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../screenshots');
const SLIDE_URL = 'http://localhost:7650';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
    defaultViewport: { width: 1984, height: 1144, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  console.log("Navigating to slide environment...");
  await page.goto(SLIDE_URL, { waitUntil: 'networkidle2', timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 3500));

  await page.click('button[title="打开目录"]');
  await new Promise(r => setTimeout(r, 600));
  const totalSlides = await page.$$eval('nav.flex-grow [draggable]', els => els.length);
  const closeBtn = await page.$('button.text-zinc-500');
  if (closeBtn) await closeBtn.click();
  await new Promise(r => setTimeout(r, 400));

  for (let i = 0; i < totalSlides; i++) {
    await page.keyboard.press('ArrowLeft');
  }
  await new Promise(r => setTimeout(r, 600));

  console.log("Scanning slides to find '各平台热搜词'...");
  for (let i = 0; i < totalSlides; i++) {
    const text = await page.evaluate(() => document.body.innerText);
    if (text.includes('各平台热搜词') && text.includes('百度移动')) {
        await page.evaluate(() =>
          Promise.all([...document.images].map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })))
        );
        await new Promise(r => setTimeout(r, 500));
        
        const outputPath = path.join(OUTPUT_DIR, 'Page_GeoOptKeywords_Fixed.png');
        const slideEl = await page.$('.bg-white.overflow-hidden');
        if (slideEl) {
            await slideEl.screenshot({ path: outputPath });
        } else {
            await page.screenshot({ path: outputPath });
        }
        console.log(`✅ Successfully saved target slide to screenshots/Page_GeoOptKeywords_Fixed.png`);
        break;
    }
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 400));
  }

  await browser.close();
}

main().catch(err => {
    console.error("Error occurred:", err);
    process.exit(1);
});
