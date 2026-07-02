import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const screenshotsDir = '/Users/ivan/Downloads/Клод сайти/Сайт грумінг/temporary screenshots';
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

const existing = fs.readdirSync(screenshotsDir)
  .map(f => { const m = f.match(/^screenshot-(\d+)/); return m ? parseInt(m[1]) : 0; });
let n = existing.length ? Math.max(...existing) + 1 : 1;

const viewports = [
  { width: 375,  height: 812,  label: 'mobile-375'  },
  { width: 390,  height: 844,  label: 'mobile-390'  },
  { width: 430,  height: 932,  label: 'mobile-430'  },
  { width: 768,  height: 1024, label: 'tablet-768'  },
  { width: 1024, height: 768,  label: 'desktop-1024' },
  { width: 1280, height: 800,  label: 'desktop-1280' },
  { width: 1440, height: 900,  label: 'desktop-1440' },
];

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  });
  await new Promise(r => setTimeout(r, 600));
  const filename = `screenshot-${n}-${vp.label}.png`;
  const outPath = path.join(screenshotsDir, filename);
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved: ${outPath}`);
  n++;
  await page.close();
}

await browser.close();
console.log('All done.');
