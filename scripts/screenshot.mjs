import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, '..', 'architecture-visual.html');
const outPath = join(__dirname, '..', 'architecture-flow.png');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.setViewportSize({ width: 1920, height: 1080 });
await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`);

// Wait for fonts to load
await page.waitForTimeout(2000);

await page.screenshot({
  path: outPath,
  clip: { x: 0, y: 0, width: 1920, height: 1080 },
});

await browser.close();
console.log('Screenshot saved:', outPath);
