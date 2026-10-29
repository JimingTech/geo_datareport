import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../screenshots');
const browser = await puppeteer.launch({
  headless: 'new',
  channel: 'chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1984, height: 1144, deviceScaleFactor: 1 });

for (const [idx, file] of [
  [0, '_check_cover.png'],
  [3, '_check_overview.png'],
  [4, '_check_kpi.png'],
  [5, '_check_comp.png'],
  [7, '_check_content.png'],
  [9, '_check_entries_ds1.png'],
]) {
  await page.goto(`http://localhost:7650/#slide=${idx}`, { waitUntil: 'networkidle2', timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));
  const el = await page.$('div[style*="width: 1920px"]');
  const dest = path.join(dir, file);
  if (el) await el.screenshot({ path: dest });
  else await page.screenshot({ path: dest });
  console.log('saved:', file);
}

await browser.close();
