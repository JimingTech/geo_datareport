import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../screenshots');
const SLIDE_URL = 'http://localhost:7650';

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',  // 新版 headless，字体渲染质量更好
    channel: 'chrome', // 自动查找系统安装的 Chrome 流水线
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',  // 禁用字体微调，保持锐利
    ],
  });

  const page = await browser.newPage();
  // 4K 分辨率：deviceScaleFactor 2 → 截图输出 1920×2=3840, 1080×2=2160
  await page.setViewport({ width: 1984, height: 1144, deviceScaleFactor: 2 });

  console.log(`正在打开 ${SLIDE_URL}...`);
  await page.goto(SLIDE_URL, { waitUntil: 'networkidle2', timeout: 20000 });

  // 等待所有自定义字体（MiSans、AlimamaShuHeiTi 等）加载完毕
  await page.evaluate(() => document.fonts.ready);

  // 额外等待图片和首屏动画稳定
  await new Promise((r) => setTimeout(r, 3500));

  // ① 打开目录面板，从 DOM 中读取真实总页数
  await page.click('button[title="打开目录"]');
  await new Promise((r) => setTimeout(r, 600));

  const totalSlides = await page.$$eval('nav.flex-grow [draggable]', (els) => els.length);
  console.log(`✅ 检测到总页数：${totalSlides}`);

  // ② 关闭目录面板，回到第一页
  const closeBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(
      b => b.textContent.includes('✕') || b.className.includes('text-zinc-400')
    );
  });
  if (closeBtn) {
    await closeBtn.click();
  } else {
    // 备用方案：通过 Selector 点击
    const fallbackClose = await page.$('button.text-zinc-400');
    if (fallbackClose) await fallbackClose.click();
  }
  await new Promise((r) => setTimeout(r, 400));

  for (let i = 0; i < totalSlides; i++) {
    await page.keyboard.press('ArrowLeft');
  }
  await new Promise((r) => setTimeout(r, 600));

  // 注入样式以隐藏导出的 PPT 中不需要的 UI 元素，确保截图完全干净
  await page.addStyleTag({
    content: `
      button[title="打开目录"],
      button[title="全屏演示"],
      div.pointer-events-none.opacity-20 {
        display: none !important;
      }
    `
  });

  // ③ 逐页截图
  for (let i = 0; i < totalSlides; i++) {
    const outputPath = path.join(OUTPUT_DIR, `slide_${String(i + 1).padStart(3, '0')}.png`);

    // 等待图片和字体在当前页面渲染完毕
    await page.evaluate(() =>
      Promise.all(
        [...document.images].map((img) =>
          img.complete ? Promise.resolve() : new Promise((r) => { img.onload = r; img.onerror = r; })
        )
      )
    );
    await new Promise((r) => setTimeout(r, 400));

    const slideEl = await page.$('.bg-white.overflow-hidden');
    if (slideEl) {
      await slideEl.screenshot({ path: outputPath });
    } else {
      await page.screenshot({ path: outputPath });
    }

    console.log(`[${i + 1}/${totalSlides}] 截图 → ${path.basename(outputPath)}`);

    if (i < totalSlides - 1) {
      await page.keyboard.press('ArrowRight');
      await new Promise((r) => setTimeout(r, 1200));
    }
  }

  await browser.close();
  console.log(`\n✅ 全部 ${totalSlides} 张截图已保存至 screenshots/`);
}

main().catch((err) => {
  console.error('截图失败:', err);
  process.exit(1);
});
