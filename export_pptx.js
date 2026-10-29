import puppeteer from 'puppeteer';
import pptxgen from 'pptxgenjs';
import fs from 'fs';

// dynamically fetch totalSlides later

async function run() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
        args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();

    console.log('Navigating to http://localhost:7650...');
    try {
        await page.goto('http://localhost:7650', { waitUntil: 'networkidle0', timeout: 60000 });
    } catch (e) {
        console.error('Failed to load page. Make sure Vite server is running on port 7650.', e);
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

    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    const slideOrder = JSON.parse(fs.readFileSync(new URL('./src/slideOrder.json', import.meta.url), 'utf-8'));
    const totalSlides = slideOrder.length;

    console.log(`Found ${totalSlides} slides from slideOrder.json. Starting capture...`);

    const args = process.argv.slice(2);
    let startPage = 1;
    let endPage = totalSlides;
    let hasPageFilter = false;
    const pageIndex = args.indexOf('--pages');
    if (pageIndex !== -1 && args[pageIndex + 1]) {
        const pageArg = args[pageIndex + 1];
        if (pageArg.includes('-')) {
            const [s, e] = pageArg.split('-').map(Number);
            startPage = s;
            endPage = e;
        } else {
            startPage = parseInt(pageArg, 10);
            endPage = startPage;
        }
        hasPageFilter = true;
        console.log(`Targeting pages ${startPage} to ${endPage}`);
    }

    for (let i = 0; i < totalSlides; i++) {
        const pageNum = i + 1;
        const isTargetPage = pageNum >= startPage && pageNum <= endPage;

        if (isTargetPage) {
            console.log(`Processing slide ${i + 1}/${totalSlides}...`);

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

            const slide = pptx.addSlide();
            slide.background = { fill: '000000' };
            slide.addImage({
                data: `image/png;base64,${screenshotBuffer.toString('base64')}`,
                x: 0,
                y: 0,
                w: 10,
                h: 5.625
            });
        }

        if (i < totalSlides - 1) {
            await page.keyboard.press('ArrowRight');
            if (!isTargetPage) {
                await new Promise(r => setTimeout(r, 100));
            }
        }
    }

    const outputName = hasPageFilter
        ? `Presentation_P${startPage}-${endPage}.pptx`
        : `Presentation.pptx`;
    console.log('Generating PPTX file...');
    await pptx.writeFile({ fileName: outputName });
    console.log(`Export complete: ${outputName}`);
    await browser.close();
}

run();
