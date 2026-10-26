// Usage: node tools/frames.mjs <film dir> <out dir> <t1> <t2> ...
// Seeks the film to each time, waits 2 rAF, saves <out>/<t>.png at the film's native size.
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const [film, out, ...times] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("file://" + path.resolve(film, "index.html") + "?clean");
const size = await page.evaluate(() => ({ width: window.FILM_W || 1920, height: window.FILM_H || 1080 }));
await page.setViewportSize(size);
await page.evaluate(() => document.fonts.ready);
for (const t of times) {
  await page.evaluate((t) => new Promise((ok) => {
    window.seek(t);
    requestAnimationFrame(() => requestAnimationFrame(ok));
  }), parseFloat(t));
  await page.screenshot({ path: path.join(out, `${t}.png`) });
}
await browser.close();
