/* =============================================================
   JOVI Smart Filter — página de apresentação
   Reaproveita motor.js e cenas.js para o hero não ser uma
   imagem estática: é o mesmo código do protótipo, em miniatura.
   ============================================================= */
(() => {
'use strict';

const midia   = document.getElementById('heroMidia');
const temp    = document.getElementById('heroTemp');
const sombras = document.getElementById('heroSombras');
const realces = document.getElementById('heroRealces');
const chips   = document.getElementById('heroChips');
const leitura = document.getElementById('heroValores');
const tabela  = document.getElementById('tabelaAmbientes');

/* cada demonstração combina um ambiente com a cena que o ilustra */
const DEMOS = [
  { amb: 'praia',    cena: 'cena-praia'  },
  { amb: 'pordosol', cena: 'cena-por'    },
  { amb: 'parque',   cena: 'cena-parque' },
  { amb: 'restaurante', cena: 'cena-cafe' },
  { amb: 'cidade',   cena: 'cena-cidade' }
];

let atual = 0;
/* valores aplicados agora no palco; o GSAP interpola a partir deles */
const aplicados = Object.fromEntries(PARAMETROS.map(p => [p.id, 0]));
const animar = typeof gsap !== 'undefined' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
let transicao = null;

function formatar(id, v) {
  const p = PARAM_POR_ID[id];
  const n = Number(v);
  return (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(p.casas).replace('.', ',');
}

function renderizar(valores) {
  midia.style.filter = Motor.paraCSS(valores);
  const t = Motor.camadaTemperatura(valores);
  const s = Motor.camadaSombras(valores);
  const r = Motor.camadaRealces(valores);
  Object.assign(temp.style,    { opacity: t.opacity, background: t.background });
  Object.assign(sombras.style, { opacity: s.opacity, background: s.background });
  Object.assign(realces.style, { opacity: r.opacity, background: r.background });
}

function mostrar(indice) {
  atual = indice;
  const demo = DEMOS[indice];
  const amb = AMB_POR_ID[demo.amb];
  const preset = Motor.resolver(demo.amb, 'natural');
  const valores = Object.fromEntries(PARAMETROS.map(p => [p.id, preset[p.id] || 0]));

  midia.innerHTML = desenharCena(demo.cena, 'hero');

  /* a câmera "se ajusta": os sete parâmetros vão do preset anterior ao novo */
  if (transicao) transicao.kill();
  if (animar) {
    gsap.fromTo(midia, { opacity: 0.35 }, { opacity: 1, duration: 0.4, ease: 'power1.out' });
    transicao = gsap.to(aplicados, {
      ...valores, duration: 0.9, ease: 'power2.inOut',
      onUpdate: () => renderizar(aplicados)
    });
  } else {
    Object.assign(aplicados, valores);
  }
  renderizar(aplicados);

  leitura.textContent = PARAMETROS
    .filter(p => Math.abs(valores[p.id]) > 0.001)
    .sort((a, b) => (amb.pesos[b.id] || 0) - (amb.pesos[a.id] || 0))
    .slice(0, 4)
    .map(p => `${p.nome} ${formatar(p.id, valores[p.id])}${p.unidade === 'EV' ? ' EV' : ''}`)
    .join('   ·   ');

  chips.querySelectorAll('button').forEach((b, i) =>
    b.setAttribute('aria-pressed', String(i === indice)));
}

chips.innerHTML = DEMOS.map((d, i) =>
  `<button type="button" class="chip-estilo" data-i="${i}" aria-pressed="${i === 0}">${AMB_POR_ID[d.amb].nome}</button>`
).join('');

chips.querySelectorAll('button').forEach(b => {
  b.addEventListener('click', () => mostrar(Number(b.dataset.i)));
});

mostrar(0);

/* tabela de configuração da seção "solução" */
if (tabela) {
  const ordem = ['exposicao', 'brilho', 'contraste', 'saturacao', 'calor', 'sombras', 'realces'];
  tabela.innerHTML = AMBIENTES.slice(0, 8).map(a => `
    <tr>
      <th scope="row" class="!text-neve-100 !normal-case !tracking-normal !text-[13px] !font-500">${a.nome}</th>
      ${ordem.map(id => {
        const v = a.valores[id] || 0;
        return `<td class="${v === 0 ? '!text-neve-500' : ''}">${v === 0 ? '—' : formatar(id, v)}</td>`;
      }).join('')}
    </tr>`).join('');
}
})();
