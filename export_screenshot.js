import puppeteer from 'puppeteer';
import fs from 'fs';

const slideOrder = JSON.parse(fs.readFileSync('./src/slideOrder.json', 'utf-8'));
const totalSlides = slideOrder.length;

const args = process.argv.slice(2);
const pageIndex = args.indexOf('--page');
if (pageIndex === -1 || !args[pageIndex + 1]) {
    console.error('Usage: node export_screenshot.js --page <pageNumber>');
    process.exit(1);
}
const targetPage = parseInt(args[pageIndex + 1], 10);

async function run() {
    console.log(`Exporting page ${targetPage} as 4K PNG...`);
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
        args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();

    console.log('Navigating to http://localhost:7649...');
    try {
        await page.goto('http://localhost:7649', { waitUntil: 'networkidle0', timeout: 60000 });
    } catch (e) {
        console.error('Failed to load page. Make sure Vite server is running on port 7649.', e);
        await browser.close();
        return;
    }

    await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.title === '打开目录' || btn.title === '全屏演示' || btn.innerHTML.includes('w-5 h-4 flex')) {
                btn.style.display = 'none';
            }
        });
        const hints = document.querySelectorAll('.pointer-events-none.opacity-20');
        hints.forEach(hint => hint.style.display = 'none');
    });

    for (let i = 1; i < targetPage; i++) {
        await page.keyboard.press('ArrowRight');
        await new Promise(r => setTimeout(r, 100));
    }

    await new Promise(r => setTimeout(r, 1500));

    const screenshotBuffer = await page.evaluateHandle(() => {
        const wrapper = document.querySelector('.origin-center');
        if (wrapper) {
            wrapper.style.transform = 'none';
            wrapper.style.zoom = '1';
            return wrapper;
        }
        return document.body;
    }).then(handle => handle.screenshot({ type: 'png' }));

    const slideName = slideOrder[targetPage - 1] || `slide_${targetPage}`;
    const fileName = `Slide_${targetPage}_${slideName}_4K.png`;
    fs.writeFileSync(fileName, screenshotBuffer);
    console.log(`Saved: ${fileName}`);

    await browser.close();
}

run();
