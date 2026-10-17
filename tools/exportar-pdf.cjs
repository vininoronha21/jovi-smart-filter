// Exporta a apresentação (12 páginas, 1920×1080) para docs/slides.pdf.
// Uso: node tools/exportar-pdf.cjs [url-base]
//   sem argumento: os links do PDF (câmera e site) apontam para os arquivos desta pasta
//   com url-base (ex.: https://jovi-smart-filter.vercel.app): os links apontam para o site publicado
// Precisa do Google Chrome instalado e de `npm install` (playwright-core).
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright-core');

const raiz = path.resolve(__dirname, '..');
const base = process.argv[2] ? process.argv[2].replace(/\/?$/, '/') : null;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const p = await ctx.newPage();
  await p.emulateMedia({ media: 'print' });
  await p.goto(pathToFileURL(path.join(raiz, 'slides.html')).href);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1500);
  if (base) {   // a página é lida do disco, só os destinos dos links mudam
    await p.evaluate(base => document.querySelectorAll('a[href]').forEach(a => {
      const h = a.getAttribute('href');
      if (!h.startsWith('#')) a.setAttribute('href', new URL(h, base).href);
    }), base);
  }
  const destino = path.join(raiz, 'docs/slides.pdf');
  await p.pdf({ path: destino, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  console.log('PDF gerado em', path.relative(raiz, destino));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
