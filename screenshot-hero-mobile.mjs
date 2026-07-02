import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 600));
await page.screenshot({
  path: '/Users/ivan/Downloads/Клод сайти/Сайт грумінг/temporary screenshots/screenshot-54-hero-mobile.png',
  fullPage: false
});
await browser.close();
console.log('done');
