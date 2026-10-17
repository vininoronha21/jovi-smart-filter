// Grava o modo dinâmico da apresentação em quadros JPEG (screencast via CDP).
// Uso: node tools/gravar-video.cjs [pasta-de-saida]   (padrão: tools/.tmp/quadros)
// Precisa do Google Chrome instalado e de `npm install` (playwright-core).
// Depois: swift tools/montar-video.swift tools/.tmp/quadros docs/slides-dinamico.mp4 45
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright-core');

const raiz = path.resolve(__dirname, '..');
const saida = path.resolve(process.argv[2] || path.join(raiz, 'tools/.tmp/quadros'));
const BASE = pathToFileURL(path.join(raiz, 'slides.html')).href + '?modo=dinamico';
const URL = BASE + '#1';

/* esconde a dica de teclado do canto, só durante a gravação */
const esconderDica = `
addEventListener('DOMContentLoaded', () => {
  const st = document.createElement('style'); st.textContent = '.deck-ajuda{display:none!important}'; document.head.appendChild(st);
});`;

(async () => {
  fs.mkdirSync(saida, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await ctx.addInitScript(esconderDica);
  const p = await ctx.newPage();
  await p.goto(BASE + '#12');   // aquece fontes e imagens no cache
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  await p.goto('data:text/html,<body style="margin:0;background:rgb(5,5,7)"></body>');

  const cdp = await ctx.newCDPSession(p);
  const quadros = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const nome = `q${String(quadros.length).padStart(5, '0')}.jpg`;
    fs.writeFileSync(path.join(saida, nome), Buffer.from(data, 'base64'));
    quadros.push({ nome, t: metadata.timestamp });
    try { await cdp.send('Page.screencastFrameAck', { sessionId }); } catch {}
  });

  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
  await p.waitForTimeout(700);
  await p.goto(URL);
  await p.evaluate(() => document.fonts.ready);

  const espera = ms => p.waitForTimeout(ms);
  const tecla = async (k = 'ArrowRight', ms = 0) => { await p.keyboard.press(k); if (ms) await espera(ms); };
  const centro = sel => p.evaluate(s => { const r = document.querySelector('.slide.ativo ' + s).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height }; }, sel);

  // roteiro de ~42 s (limite do vídeo: 45 s)
  // 01 capa + paralaxe (3,2 s)
  await espera(1700);
  await p.mouse.move(1500, 520, { steps: 18 });
  await p.mouse.move(1250, 760, { steps: 18 }); await espera(500);
  // 02 equipe (2 s)
  await tecla('ArrowRight', 2000);
  // 03 desafio: 5 passos (4 s)
  await tecla('ArrowRight', 1000);
  for (let i = 0; i < 5; i++) await tecla('ArrowRight', 600);
  // 04 solução + objetivo (3,3 s)
  await tecla('ArrowRight', 1900);
  await tecla('ArrowRight', 1400);
  // 05 jornada: 4 passos (3,6 s)
  await tecla('ArrowRight', 1000);
  for (let i = 0; i < 4; i++) await tecla('ArrowRight', 650);
  // 06 ambientes: revelação do filtro e contadores (3,8 s)
  await tecla('ArrowRight', 3800);
  // 07 por quê (2 s)
  await tecla('ArrowRight', 2000);
  // 08 demonstração: sugere → toque/aplica → recibo (4,6 s)
  await tecla('ArrowRight', 1700);
  await tecla('ArrowRight', 1300);
  await tecla('ArrowRight', 1600);
  // 09 interface: varredura automática do comparador (4,2 s)
  await tecla('ArrowRight', 4200);
  // 10 o que vem por aí: virada dos status (3,2 s)
  await tecla('ArrowRight', 1300);
  await tecla('ArrowRight', 1900);
  // 11 visão (2,6 s)
  await tecla('ArrowRight', 2600);
  // 12 obrigado + paralaxe (2,6 s)
  await tecla('ArrowRight', 1200);
  await p.mouse.move(1450, 420, { steps: 18 }); await espera(900);
  // visão geral para fechar (2 s)
  await tecla('o', 2000);

  await cdp.send('Page.stopScreencast');
  await espera(300);
  fs.writeFileSync(path.join(saida, 'quadros.json'), JSON.stringify(quadros));
  console.log('quadros:', quadros.length, 'duração:', (quadros.at(-1).t - quadros[0].t).toFixed(1), 's');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
