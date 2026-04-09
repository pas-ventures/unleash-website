import puppeteer from 'puppeteer';
import GIFEncoder from 'gif-encoder-2';
import { PNG } from 'pngjs';
import { writeFileSync, readFileSync, createReadStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'paperclip-gif');
const WIDTH = 1200;
const HEIGHT = 675;

// Theunis PDF — pick the most visual/interesting pages
const THEUNIS_PDF = join(process.cwd(), 'work-and-craft/content-creation/theunis-paperclip.pdf');
const THEUNIS_PAGES = [1, 2, 3, 4, 5, 7, 8, 9, 10, 17, 18, 19, 25, 26]; // key slides

// Unleash takeaways PDF
const TAKEAWAYS_PDF = join(process.cwd(), 'work-and-craft/content-creation/unleash-s4-paperclip.pdf');
const TAKEAWAYS_PAGES = [1, 2, 3, 4, 5, 6, 7]; // topic slides

const PRESENTATION_PATH = join(process.cwd(), 'unleash-website/learning-event/paperclip2/index.html');
const SLIDE_COUNT = 9;

async function loadPNG(filepath) {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filepath);
    const png = new PNG();
    stream.pipe(png)
      .on('parsed', function() { resolve(this); })
      .on('error', reject);
  });
}

async function renderPDFPages(browser, pdfPath, pages, prefix) {
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  const pdfBase64 = readFileSync(pdfPath).toString('base64');

  // Use PDF.js via a simple HTML page
  const html = `<!DOCTYPE html>
<html><head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<style>
  body { margin: 0; background: #111; display: flex; align-items: center; justify-content: center; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
  canvas { max-width: 100%; max-height: 100%; object-fit: contain; }
</style>
</head><body>
<canvas id="canvas"></canvas>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  window.renderPage = async function(pageNum) {
    const data = atob('${pdfBase64}');
    const uint8 = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) uint8[i] = data.charCodeAt(i);
    const pdf = await pdfjsLib.getDocument({data: uint8}).promise;
    const pg = await pdf.getPage(pageNum);
    const vp = pg.getViewport({scale: 1});
    // Scale to fit our viewport
    const scale = Math.min(${WIDTH} / vp.width, ${HEIGHT} / vp.height);
    const viewport = pg.getViewport({scale});
    const canvas = document.getElementById('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await pg.render({canvasContext: ctx, viewport}).promise;
    return true;
  };
</script>
</body></html>`;

  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000)); // Wait for PDF.js to load

  const results = [];
  for (const pageNum of pages) {
    try {
      await page.evaluate((num) => window.renderPage(num), pageNum);
      await new Promise(r => setTimeout(r, 500));
      const filename = `${prefix}-page-${String(pageNum).padStart(2, '0')}.png`;
      const filepath = join(OUTPUT_DIR, filename);
      await page.screenshot({ path: filepath, type: 'png' });
      results.push(filepath);
      console.log(`  ✓ ${filename}`);
    } catch (e) {
      console.log(`  ✗ ${prefix} page ${pageNum}: ${e.message}`);
    }
  }

  await page.close();
  return results;
}

async function screenshotSlides(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });
  await page.goto(`file://${PRESENTATION_PATH}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForFunction(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000));

  // Hide nav
  await page.evaluate(() => {
    const nav = document.querySelector('.nav');
    if (nav) nav.style.display = 'none';
    const counter = document.querySelector('.slide-counter');
    if (counter) counter.style.display = 'none';
  });

  const results = [];
  for (let i = 1; i <= SLIDE_COUNT; i++) {
    await page.evaluate((slideNum) => {
      document.querySelectorAll('.slide').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
      });
      const target = document.getElementById(`slide-${slideNum}`);
      if (target) {
        target.classList.add('active');
        target.style.display = 'flex';
      }
    }, i);
    await new Promise(r => setTimeout(r, 500));
    const filename = `presentation-slide-${String(i).padStart(2, '0')}.png`;
    const filepath = join(OUTPUT_DIR, filename);
    await page.screenshot({ path: filepath, type: 'png' });
    results.push(filepath);
    console.log(`  ✓ ${filename}`);
  }

  await page.close();
  return results;
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });

  // 1. Screenshot presentation slides
  console.log('📊 Screenshotting presentation slides...');
  const presentationFiles = await screenshotSlides(browser);

  // 2. Render Theunis PDF pages
  console.log('\n📄 Rendering Theunis slides...');
  const theunisFiles = await renderPDFPages(browser, THEUNIS_PDF, THEUNIS_PAGES, 'theunis');

  // 3. Render takeaways PDF pages
  console.log('\n📄 Rendering takeaway slides...');
  const takeawayFiles = await renderPDFPages(browser, TAKEAWAYS_PDF, TAKEAWAYS_PAGES, 'takeaways');

  await browser.close();

  // Assemble GIF — story flow:
  // 1. Presentation intro slides (1-4): title, housekeeping, agenda, hosts
  // 2. What is Paperclip slides (pres 6-7)
  // 3. Theunis deep-dive slides
  // 4. Takeaway highlights
  // 5. Presentation closing (pres 8-9)
  const allFrames = [
    ...presentationFiles.slice(0, 4),    // Title, housekeeping, agenda, hosts
    ...presentationFiles.slice(4, 7),    // Polls, What is Paperclip, Why Paperclip
    ...theunisFiles,                      // Theunis deep dive
    ...presentationFiles.slice(7),        // Demos, Thank you
  ];

  console.log(`\n🎬 Assembling GIF with ${allFrames.length} frames...`);

  // 20% slower than the fast version — base ~120ms per frame, title/end ~240ms
  const encoder = new GIFEncoder(WIDTH, HEIGHT, 'neuquant', true);
  encoder.setRepeat(0);
  encoder.setQuality(10);
  encoder.start();

  for (let i = 0; i < allFrames.length; i++) {
    const filepath = allFrames[i];
    const png = await loadPNG(filepath);
    // First and last frames slightly longer
    const isBookend = i === 0 || i === allFrames.length - 1;
    const delay = isBookend ? 300 : 150;
    encoder.setDelay(delay);
    encoder.addFrame(png.data);
  }

  encoder.finish();
  const buffer = encoder.out.getData();
  const outputPath = join(OUTPUT_DIR, 'paperclip-linkedin-full.gif');
  writeFileSync(outputPath, buffer);

  const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
  const totalMs = 300 * 2 + 150 * (allFrames.length - 2);
  console.log(`\n✅ Full GIF created: ${outputPath}`);
  console.log(`   Frames: ${allFrames.length}`);
  console.log(`   Size: ${sizeMB} MB`);
  console.log(`   Duration: ~${(totalMs / 1000).toFixed(1)}s per loop`);
}

main().catch(console.error);
