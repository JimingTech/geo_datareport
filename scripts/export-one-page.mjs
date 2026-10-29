#!/usr/bin/env node
/**
 * 按标题导出单页 PPTX。默认走正在运行的开发服务。
 *
 *   node scripts/export-one-page.mjs --title=核心数据总览
 *   node scripts/export-one-page.mjs --title=核心数据总览 --url=http://localhost:5180 --output=核心数据总览.pptx
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import PptxGenJS from 'pptxgenjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const TITLE = flag('title', null);
if (!TITLE) {
  console.error('用法：node scripts/export-one-page.mjs --title=核心数据总览');
  process.exit(1);
}

const { port: DEV_PORT } = JSON.parse(readFileSync(path.join(root, 'port.json'), 'utf-8'));
const URL = flag('url', `http://localhost:${DEV_PORT}`);
const OUTPUT = path.resolve(root, flag('output', `${TITLE}.pptx`));
const SCALE = Number(flag('scale', 2));
const SLIDE_W = 1920;
const SLIDE_H = 1080;
const SLIDE_SELECTOR = 'div[style*="width: 1920px"]';

const EXPORT_CSS = `
  div[style*="1920"] {
    zoom: 1 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  button[title="打开目录"],
  button[title="全屏演示"],
  div.pointer-events-none.opacity-20 {
    display: none !important;
  }
`;

async function waitForSlideReady(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const pending = [...document.images].filter((im) => !im.complete);
    await Promise.all(
      pending.map((im) => new Promise((res) => { im.onload = im.onerror = res; }))
    );
    await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
  });
}

async function main() {
  const started = Date.now();
  try {
    const probe = await fetch(URL, { signal: AbortSignal.timeout(4000) });
    if (!probe.ok) throw new Error(`HTTP ${probe.status}`);
  } catch (err) {
    console.error(`无法访问 ${URL}（${err.message}）。请先确认开发服务已启动。`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    protocolTimeout: 120000,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: SLIDE_W + 128,
      height: SLIDE_H + 128,
      deviceScaleFactor: SCALE,
    });
    const isTargetPage = (text) =>
      text.includes(TITLE) && (TITLE !== '核心数据总览' || text.includes('高位波动属正常现象'));

    let index = -1;
    let foundText = '';
    const maxScan = 30;
    for (let i = 0; i < maxScan; i++) {
      await page.goto(`${URL}#slide=${i}`, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.addStyleTag({ content: EXPORT_CSS });
      await waitForSlideReady(page);
      const text = await page.evaluate(() => document.body.innerText);
      if (isTargetPage(text)) {
        index = i;
        foundText = text;
        break;
      }
      // 已经翻到最后一页再往后 hash 不会再变
      if (i > 0 && !text.trim()) break;
    }
    if (index === -1) {
      throw new Error(`扫过前 ${maxScan} 页都找不到「${TITLE}」`);
    }
    await new Promise((r) => setTimeout(r, 400));

    const el = await page.$(SLIDE_SELECTOR);
    if (!el) throw new Error('找不到幻灯片节点');
    const buf = Buffer.from(await el.screenshot({ type: 'png' }));

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.addSlide().addImage({
      data: `data:image/png;base64,${buf.toString('base64')}`,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
    });
    await pptx.writeFile({ fileName: OUTPUT });

    const rankHint = /古16[\s\S]{0,80}NO\.\s*[12]/.test(foundText)
      ? `；古16 竞品排名命中 ${foundText.match(/NO\.\s*[12]/)?.[0]}`
      : '';
    console.log(`已导出第 ${index + 1} 页「${TITLE}」→ ${OUTPUT}（${(buf.length / 1048576).toFixed(1)} MB，${((Date.now() - started) / 1000).toFixed(1)}s${rankHint}）`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(`导出失败：${err.message}`);
  process.exit(1);
});
