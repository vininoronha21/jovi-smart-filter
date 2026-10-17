// Exporta a apresentação (12 páginas, 1920×1080) para docs/slides.pdf.
// Uso: node tools/exportar-pdf.cjs
// Precisa do Google Chrome instalado e de `npm install` (playwright-core).
// Os links do PDF (câmera e site) apontam para os arquivos desta pasta, em caminho absoluto.
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright-core');

const raiz = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const p = await ctx.newPage();
  await p.emulateMedia({ media: 'print' });
  await p.goto(pathToFileURL(path.join(raiz, 'slides.html')).href);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1500);
  const destino = path.join(raiz, 'docs/slides.pdf');
  await p.pdf({ path: destino, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  console.log('PDF gerado em', path.relative(raiz, destino));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
