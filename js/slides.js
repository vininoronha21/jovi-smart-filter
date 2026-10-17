/* =============================================================
   JOVI Smart Filter — motor da apresentação
   Palco fixo de 1920×1080 escalado ao viewport.
   → / Espaço / PageDown / clique: próximo passo ou slide
   ← / PageUp: volta · Home/End · O: visão geral · F: tela cheia
   Dois modos: o padrão é direto (cada slide completo, só um fade);
   ?modo=dinamico liga transições, builds por clique e efeitos.
   Builds: elementos com data-passo="n" aparecem um por clique;
   o slide recebe as classes p1…pn para estados encadeados.
   ============================================================= */
(() => {
'use strict';

const LARGURA = 1920, ALTURA = 1080;
const corpo = document.body;
const slides = [...document.querySelectorAll('.slide')];
const barra = document.querySelector('.deck-progresso span');
const dinamico = new URLSearchParams(location.search).get('modo') === 'dinamico';
const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const estatico = reduzido || !dinamico;      // sem contadores, varredura nem paralaxe
corpo.classList.add(dinamico ? 'modo-dinamico' : 'modo-direto');

let atual = -1;
let passo = 0;
let ficha = 0;          // invalida temporizadores de um slide que já saiu
let visaoGeral = false;

/* ---------- escala e visão geral ---------------------------- */
function escalar() {
  if (visaoGeral) {
    const cols = 4, linhas = Math.ceil(slides.length / cols), folga = 28;
    const e = Math.min((innerWidth - folga * (cols + 1)) / cols / LARGURA,
                       (innerHeight - folga * (linhas + 1)) / linhas / ALTURA);
    const larg = LARGURA * e, alt = ALTURA * e;
    const x0 = (innerWidth - (cols * larg + (cols - 1) * folga)) / 2;
    const y0 = (innerHeight - (linhas * alt + (linhas - 1) * folga)) / 2;
    slides.forEach((s, i) => {
      const x = x0 + (i % cols) * (larg + folga), y = y0 + Math.floor(i / cols) * (alt + folga);
      s.style.transform = `translate(${x}px, ${y}px) scale(${e})`;
    });
    return;
  }
  const e = Math.min(innerWidth / LARGURA, innerHeight / ALTURA);
  const x = (innerWidth - LARGURA * e) / 2, y = (innerHeight - ALTURA * e) / 2;
  slides.forEach(s => { s.style.transform = `translate(${x}px, ${y}px) scale(${e})`; });
}

function alternarVisaoGeral(ligar = !visaoGeral) {
  visaoGeral = ligar;
  corpo.classList.toggle('visao-geral', ligar);
  escalar();
}

/* ---------- passos (builds) --------------------------------- */
const passosDoSlide = s => Number(s.dataset.passos) ||
  Math.max(0, ...[...s.querySelectorAll('[data-passo]')].map(el => Number(el.dataset.passo)));
/* passos navegáveis: no modo direto o slide já entra no estado final */
const totalPassos = s => dinamico ? passosDoSlide(s) : 0;

function aplicarPasso(s, n) {
  s.querySelectorAll('[data-passo]').forEach(el => el.classList.toggle('visivel', Number(el.dataset.passo) <= n));
  for (let k = 1; k <= passosDoSlide(s); k++) s.classList.toggle(`p${k}`, k <= n);

  const jornada = s.querySelector('.jornada');
  if (jornada) {
    const itens = jornada.querySelectorAll('li');
    const alvo = itens[n - 1];
    const fim = alvo ? alvo.offsetLeft + 31 : 0;
    jornada.style.setProperty('--progresso', `${fim / jornada.offsetWidth * 100}%`);
  }
  atualizarProgresso();
}

function atualizarProgresso() {
  if (!barra) return;
  const max = totalPassos(slides[atual]);
  const fracao = max ? passo / (max + 1) : 0;
  barra.style.width = `${Math.min(1, (atual + fracao) / (slides.length - 1)) * 100}%`;
}

/* ---------- navegação --------------------------------------- */
function ir(indice, { passoFinal = false, inicial = false } = {}) {
  indice = Math.max(0, Math.min(slides.length - 1, indice));
  if (indice === atual) return;

  const frente = indice > atual;
  const anterior = slides[atual];
  const novo = slides[indice];
  const minha = ++ficha;

  slides.forEach(s => s.classList.remove('entrando', 'saindo', 'para-tras', 'iris'));
  if (anterior) {
    anterior.classList.remove('ativo');
    anterior.setAttribute('aria-hidden', 'true');
    if (!reduzido && !inicial) anterior.classList.add('saindo', ...(dinamico && !frente ? ['para-tras'] : []));
  }
  novo.classList.add('ativo');
  novo.setAttribute('aria-hidden', 'false');
  if (!reduzido) {
    novo.classList.add('entrando');
    if (dinamico && !frente) novo.classList.add('para-tras');
    if (dinamico && frente && novo.dataset.transicao === 'iris') novo.classList.add('iris');
  }
  setTimeout(() => {
    if (minha !== ficha) return;
    slides.forEach(s => s.classList.remove('entrando', 'saindo', 'para-tras', 'iris'));
  }, 1000);

  atual = indice;
  passo = passoFinal ? totalPassos(novo) : 0;
  aplicarPasso(novo, dinamico ? passo : passosDoSlide(novo));
  aoEntrar(novo, minha);
  history.replaceState(null, '', `#${atual + 1}`);
}

function avancar() {
  const s = slides[atual];
  if (passo < totalPassos(s)) { passo++; aplicarPasso(s, passo); }
  else ir(atual + 1);
}

function voltar() {
  const s = slides[atual];
  if (passo > 0) { passo--; aplicarPasso(s, passo); }
  else if (atual > 0) ir(atual - 1, { passoFinal: true });
}

function lerHash() {
  const n = parseInt(location.hash.slice(1), 10);
  return Number.isFinite(n) ? n - 1 : 0;
}

/* ---------- efeitos ao entrar num slide --------------------- */
function formatarNumero(v, casas, comSinal, sufixo) {
  const sinal = v < 0 ? '−' : (comSinal && v > 0 ? '+' : '');
  return `${sinal}${Math.abs(v).toFixed(casas).replace('.', ',')}${sufixo}`;
}

function contar(el, minha) {
  const alvo = parseFloat(el.dataset.contar);
  const casas = Number(el.dataset.casas || 0);
  const comSinal = 'sinal' in el.dataset;
  const sufixo = el.dataset.sufixo || '';
  if (estatico) { el.textContent = formatarNumero(alvo, casas, comSinal, sufixo); return; }
  const inicio = performance.now(), duracao = 1100, atraso = Number(el.dataset.atraso || 400);
  el.textContent = formatarNumero(0, casas, false, sufixo);
  const quadro = agora => {
    if (minha !== ficha) { el.textContent = formatarNumero(alvo, casas, comSinal, sufixo); return; }
    const k = Math.max(0, Math.min(1, (agora - inicio - atraso) / duracao));
    const v = alvo * (1 - Math.pow(1 - k, 3));
    el.textContent = formatarNumero(k === 1 ? alvo : v, casas, comSinal && k > 0, sufixo);
    if (k < 1) requestAnimationFrame(quadro);
  };
  requestAnimationFrame(quadro);
}

function varrerComparador(comp, minha) {
  if (estatico || comp.dataset.mexido) return;
  const controle = comp.querySelector('input');
  const roteiro = [[0, 50], [900, 50], [1700, 84], [2700, 16], [3500, 50]];
  const inicio = performance.now();
  const quadro = agora => {
    if (minha !== ficha || comp.dataset.mexido) return;
    const t = agora - inicio;
    const i = roteiro.findIndex(([ms]) => ms > t);
    if (i === -1) { definirPosicao(comp, 50); controle.value = 50; return; }
    const [t0, v0] = roteiro[i - 1], [t1, v1] = roteiro[i];
    const k = (t - t0) / (t1 - t0), suave = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const v = v0 + (v1 - v0) * suave;
    definirPosicao(comp, v); controle.value = v;
    requestAnimationFrame(quadro);
  };
  requestAnimationFrame(quadro);
}

function definirPosicao(comp, v) { comp.style.setProperty('--pos', `${v}%`); }

function aoEntrar(s, minha) {
  s.querySelectorAll('[data-contar]').forEach(el => contar(el, minha));

  const colunas = s.querySelectorAll('.amb-coluna');
  colunas.forEach((c, i) => {
    c.classList.remove('revelado');
    if (estatico) { c.classList.add('revelado'); return; }
    setTimeout(() => { if (minha === ficha) c.classList.add('revelado'); }, 1100 + i * 350);
  });

  s.querySelectorAll('.comparador').forEach(c => varrerComparador(c, minha));
}

/* ---------- comparador arrastável --------------------------- */
document.querySelectorAll('.comparador').forEach(comp => {
  const controle = comp.querySelector('input');
  controle.addEventListener('input', () => { comp.dataset.mexido = '1'; definirPosicao(comp, controle.value); });
});

/* ---------- slide de ambientes: texto de dados.js ----------- */
/* mesmo formato e mesmo critério do recibo do app (resumoCurto) */
document.querySelectorAll('[data-amb]').forEach(col => {
  const amb = AMB_POR_ID[col.dataset.amb];
  col.querySelector('.amb-resumo').textContent = amb.resumo;
  col.querySelector('.amb-explicacao').textContent = amb.explicacao;
  col.querySelector('.amb-valores').innerHTML = PARAMETROS
    .filter(p => Math.abs(amb.valores[p.id] || 0) > 0.001)
    .sort((a, b) => Math.abs(amb.valores[b.id]) - Math.abs(amb.valores[a.id]))
    .slice(0, 4)
    .map((p, i) => {
      const v = amb.valores[p.id], sufixo = p.unidade === 'EV' ? ' EV' : '';
      return `<span>${p.nome} <span class="num" data-contar="${v}" data-casas="${p.casas}" data-sinal data-sufixo="${sufixo}" data-atraso="${1300 + i * 120}">${formatarNumero(v, p.casas, true, sufixo)}</span></span>`;
    }).join('');
});

/* ---------- entradas: teclado, clique, toque ---------------- */
addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.target.matches('input')) return;            // setas pertencem ao comparador
  const k = e.key;
  if (k === 'o' || k === 'O') { e.preventDefault(); alternarVisaoGeral(); return; }
  if (k === 'Escape' && visaoGeral) { alternarVisaoGeral(false); return; }
  if (k === 'f' || k === 'F') {
    e.preventDefault();
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
    return;
  }
  if (visaoGeral) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); avancar(); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); voltar(); }
  else if (k === 'Home') { e.preventDefault(); ir(0); }
  else if (k === 'End') { e.preventDefault(); ir(slides.length - 1, { passoFinal: true }); }
});

const interativo = el => el.closest('a, button, input, label, .amb-foto');
let toqueX = null, arrastou = false;

addEventListener('pointerdown', e => { toqueX = interativo(e.target) ? null : e.clientX; arrastou = false; });
addEventListener('pointerup', e => {
  if (toqueX === null || visaoGeral) return;
  const dx = e.clientX - toqueX;
  if (Math.abs(dx) > 60) { arrastou = true; dx < 0 ? avancar() : voltar(); }
  toqueX = null;
});
addEventListener('click', e => {
  if (visaoGeral) {
    const s = e.target.closest('.slide');
    if (s) { alternarVisaoGeral(false); ir(slides.indexOf(s)); }
    return;
  }
  if (arrastou || interativo(e.target) || e.button !== 0) return;
  avancar();
});

/* paralaxe leve dos celulares na capa e no encerramento */
if (!estatico) {
  addEventListener('pointermove', e => {
    if (visaoGeral) return;
    const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
    slides[atual].querySelectorAll('[data-paralaxe]').forEach(el => {
      const f = Number(el.dataset.paralaxe);
      el.style.setProperty('--px', `${-nx * f}px`);
      el.style.setProperty('--py', `${-ny * f}px`);
    });
  });
}

addEventListener('resize', escalar);
addEventListener('hashchange', () => ir(lerHash()));

escalar();
ir(lerHash(), { inicial: true });
})();
