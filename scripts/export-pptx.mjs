#!/usr/bin/env node
/**
 * 把每一页截图后合成 PPTX。
 *
 * 流程：构建 → 起本地静态服务 → 多个浏览器进程并行截图 → 合成，全程不依赖 npm run dev。
 *
 * 两个关键点（都是实测出来的）：
 *   1. 必须用多个独立的浏览器进程。同一个浏览器开多个标签页会被 Chrome 后台节流，
 *      非前台标签的 requestAnimationFrame 不再触发，截图会直接卡死。
 *   2. 必须走构建产物。开发服务器要给每个进程现场下发几百个 ES 模块，光加载就是几十秒。
 *
 * 用法：
 *   npm run export:pptx -- [选项]
 *     --output=<路径>      输出文件，默认 Awada_GEO阶段性报告_2026年10月.pptx
 *     --url=<地址>         导出已在运行的地址，跳过构建与静态服务
 *     --no-build           复用现有 dist，不重新构建
 *     --build              强制重新构建
 *     --concurrency=<N>    并行浏览器数，默认按 CPU 核数取，上限 6
 *     --scale=<N>          截图像素密度，默认 2（1920×1080 → 3840×2160）
 *     --format=png|jpeg    截图格式，默认 png；jpeg 快约一倍、体积小三成
 *     --quality=<N>        jpeg 质量，默认 92
 *     --keep-shots         同时把图片留在 export-screenshots/
 */
import { readFileSync, mkdirSync, writeFileSync, statSync, readdirSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { cpus } from 'node:os';
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
const has = (name) => args.includes(`--${name}`);

const EXTERNAL_URL = flag('url', null);
const OUTPUT = path.resolve(root, flag('output', 'Awada_GEO阶段性报告_2026年10月.pptx'));
const FORMAT = flag('format', 'png');
const QUALITY = Number(flag('quality', 92));
const SCALE = Number(flag('scale', 2));
const KEEP_SHOTS = has('keep-shots');
const DIST = path.join(root, 'dist');
const SLIDE_W = 1920;
const SLIDE_H = 1080;
const SLIDE_SELECTOR = 'div[style*="width: 1920px"]';

const slideOrder = JSON.parse(readFileSync(path.join(root, 'src/slideOrder.json'), 'utf-8'));
const TOTAL = slideOrder.length;
const CONCURRENCY = Math.max(
  1,
  Math.min(Number(flag('concurrency', Math.min(6, Math.ceil(cpus().length / 4)))), TOTAL)
);

// 隐藏只在预览时出现的控件，并把自适应缩放还原成 1:1
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

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

function newestMtime(dir) {
  let newest = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    newest = Math.max(newest, entry.isDirectory() ? newestMtime(full) : statSync(full).mtimeMs);
  }
  return newest;
}

// dist 比所有源文件都新就不用重建
function distIsFresh() {
  const marker = path.join(DIST, 'index.html');
  if (!existsSync(marker)) return false;
  const built = statSync(marker).mtimeMs;
  return ['src', 'public', 'index.html', 'vite.config.js', 'package.json']
    .map((p) => path.join(root, p))
    .filter(existsSync)
    .every((p) => (statSync(p).isDirectory() ? newestMtime(p) : statSync(p).mtimeMs) < built);
}

function serveDist() {
  const server = createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.join(DIST, url === '/' ? 'index.html' : url);
    if (!file.startsWith(DIST) || !existsSync(file) || statSync(file).isDirectory()) {
      file = path.join(DIST, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

// 这一页是否已经可以截图：字体就绪、图片加载完、渲染满两帧
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
  let url = EXTERNAL_URL;
  let server = null;

  if (!url) {
    if (has('build') || (!has('no-build') && !distIsFresh())) {
      const t = Date.now();
      const { build } = await import('vite');
      await build({ root, logLevel: 'error' });
      console.log(`构建完成（${((Date.now() - t) / 1000).toFixed(1)}s）`);
    } else {
      console.log('源码无改动，复用现有 dist');
    }
    const hosted = await serveDist();
    server = hosted.server;
    url = `http://127.0.0.1:${hosted.port}`;
  } else {
    try {
      const probe = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!probe.ok) throw new Error(`HTTP ${probe.status}`);
    } catch (err) {
      console.error(`无法访问 ${url}（${err.message}）`);
      process.exit(1);
    }
  }

  console.log(`共 ${TOTAL} 页，${CONCURRENCY} 个浏览器并行，${FORMAT.toUpperCase()} @${SCALE}x`);

  const shots = new Array(TOTAL);
  const shotOptions =
    FORMAT === 'jpeg' ? { type: 'jpeg', quality: QUALITY } : { type: 'png' };
  let finished = 0;

  // 每个浏览器负责一段连续页码，用 #slide=N 直达段首再逐页截图
  const perWorker = Math.ceil(TOTAL / CONCURRENCY);
  const chunks = [];
  for (let start = 0; start < TOTAL; start += perWorker) {
    chunks.push([start, Math.min(start + perWorker, TOTAL)]);
  }

  const browsers = [];
  try {
    await Promise.all(
      chunks.map(async ([start, end]) => {
        const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        const browser = await puppeteer.launch({
          headless: 'new',
          executablePath: existsSync(chromePath) ? chromePath : undefined,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          protocolTimeout: 120000,
        });
        browsers.push(browser);

        const page = await browser.newPage();
        await page.setViewport({
          width: SLIDE_W + 128,
          height: SLIDE_H + 128,
          deviceScaleFactor: SCALE,
        });
        await page.goto(`${url}#slide=${start}`, { waitUntil: 'networkidle0', timeout: 60000 });
        await page.addStyleTag({ content: EXPORT_CSS });
        await waitForSlideReady(page);

        for (let i = start; i < end; i++) {
          if (i > start) {
            await page.keyboard.press('ArrowRight');
            await waitForSlideReady(page);
          }

          const el = await page.$(SLIDE_SELECTOR);
          if (!el) throw new Error(`第 ${i + 1} 页找不到幻灯片节点`);
          shots[i] = Buffer.from(await el.screenshot(shotOptions));

          finished += 1;
          process.stdout.write(`\r  已截图 ${finished}/${TOTAL}`);
        }
      })
    );
  } finally {
    await Promise.all(browsers.map((b) => b.close().catch(() => {})));
    server?.close();
  }

  process.stdout.write('\n');

  const ext = FORMAT === 'jpeg' ? 'jpg' : 'png';
  if (KEEP_SHOTS) {
    const dir = path.join(root, 'export-screenshots');
    mkdirSync(dir, { recursive: true });
    shots.forEach((buf, i) =>
      writeFileSync(path.join(dir, `slide-${String(i).padStart(3, '0')}.${ext}`), buf)
    );
  }

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  const mime = FORMAT === 'jpeg' ? 'image/jpeg' : 'image/png';
  for (const buf of shots) {
    pptx.addSlide().addImage({
      data: `data:${mime};base64,${buf.toString('base64')}`,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
    });
  }
  await pptx.writeFile({ fileName: OUTPUT });

  const mb = (shots.reduce((s, b) => s + b.length, 0) / 1048576).toFixed(1);
  console.log(`完成：${OUTPUT}（${mb} MB 图源，耗时 ${((Date.now() - started) / 1000).toFixed(1)}s）`);
}

main().catch((err) => {
  console.error(`导出失败：${err.message}`);
  process.exit(1);
});
