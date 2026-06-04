const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const BASE = process.argv[2] || 'http://localhost:5173';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const pages = [
    { url: `${BASE}/register`, name: 'register' },
    { url: `${BASE}/login`, name: 'login' },
    { url: `${BASE}/dashboard`, name: 'dashboard' },
  ];

  for (const p of pages) {
    try {
      await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 10000 });
      await page.setViewport({ width: 1200, height: 800 });
      const file = path.join(OUT, `${p.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log('Saved', file);
    } catch (err) {
      console.error('Failed to capture', p.url, err.message);
    }
  }

  await browser.close();
})();
