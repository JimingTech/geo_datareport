import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../screenshots/chapter6');
const SLIDE_URL = 'http://localhost:7649';

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    channel: 'chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1984, height: 1144, deviceScaleFactor: 2 });

  console.log(`Navigating to ${SLIDE_URL}...`);
  await page.goto(SLIDE_URL, { waitUntil: 'networkidle2', timeout: 20000 });

  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 3500));

  await page.click('button[title="打开目录"]');
  await new Promise((r) => setTimeout(r, 600));

  const totalSlides = await page.$$eval('nav.flex-grow [draggable]', (els) => els.length);

  const closeBtn = await page.$('button.text-zinc-500');
  if (closeBtn) await closeBtn.click();
  await new Promise((r) => setTimeout(r, 400));

  for (let i = 0; i < totalSlides; i++) {
    await page.keyboard.press('ArrowLeft');
  }
  await new Promise((r) => setTimeout(r, 600));

  console.log("Looking for Chapter 6...");

  for (let i = 0; i < totalSlides; i++) {
    const text = await page.evaluate(() => {
      // Find the main slide container which is a sibling of the sidebar, or just get elements that are not the sidebar
      const mainContent = document.querySelector('div[class*="w-full"][class*="h-full"]');
      return mainContent ? mainContent.innerText : document.body.innerText;
    });
    
    // We also can check the current slide index from the sidebar's highlighted item, but let's just use text
    if (text.includes('系统回看当前GEO效果与问题') || text.includes('重构下一阶段GEO优化目标') || (text.includes('阶段性复盘报告') && text.includes('PHASED REVIEW REPORT'))) {
        await page.evaluate(() =>
          Promise.all([...document.images].map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })))
        );
        await new Promise((r) => setTimeout(r, 1000));

        let filename = 'page_unknown.png';
        if (text.includes('PHASED REVIEW REPORT')) filename = '01_Chapter6_Cover.png';
        else if (text.includes('系统回看当前GEO效果与问题')) filename = '02_Review.png';
        else if (text.includes('重构下一阶段GEO优化目标')) filename = '03_Next_Goals.png';

        const outputPath = path.join(OUTPUT_DIR, filename);
        const slideEl = await page.$('.bg-white.overflow-hidden, .bg-black.overflow-hidden, .w-full.h-full.relative.bg-black');
        if (slideEl) {
            await slideEl.screenshot({ path: outputPath });
        } else {
            await page.screenshot({ path: outputPath });
        }
        console.log(`✅ Saved: ${filename}`);
    }
    
    await page.keyboard.press('ArrowRight');
    await new Promise((r) => setTimeout(r, 600));
  }

  await browser.close();
  console.log('✅ Finished generating Chapter 6 screenshots.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
