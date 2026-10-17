/* =============================================================
   JOVI Smart Filter: interações da página da solução
   O texto dos ambientes vem de dados.js (o mesmo do protótipo);
   a foto alterna sem/com filtro no toque, o comparador arrasta e
   a linha da jornada enche com a rolagem (GSAP + ScrollTrigger).
   ============================================================= */
(() => {
'use strict';

/* mesmo formato e mesmo critério do recibo do app (resumoCurto) */
function formatar(p, v) {
  const sinal = v > 0 ? '+' : v < 0 ? '−' : '';
  return `${sinal}${Math.abs(v).toFixed(p.casas).replace('.', ',')}${p.unidade === 'EV' ? ' EV' : ''}`;
}

document.querySelectorAll('.ambiente[data-amb]').forEach(el => {
  const amb = AMB_POR_ID[el.dataset.amb];
  el.querySelector('.ambiente-resumo').textContent = amb.resumo;
  el.querySelector('.ambiente-explicacao').textContent = amb.explicacao;
  el.querySelector('.ambiente-valores').innerHTML = PARAMETROS
    .filter(p => Math.abs(amb.valores[p.id] || 0) > 0.001)
    .sort((a, b) => Math.abs(amb.valores[b.id]) - Math.abs(amb.valores[a.id]))
    .slice(0, 4)
    .map(p => `<span>${p.nome} ${formatar(p, amb.valores[p.id])}</span>`)
    .join('');

  const foto = el.querySelector('.ambiente-foto');
  const rotulo = foto.querySelector('.ambiente-foto-rotulo');
  foto.addEventListener('click', () => {
    const comFiltro = foto.getAttribute('aria-pressed') !== 'true';
    foto.setAttribute('aria-pressed', String(comFiltro));
    rotulo.textContent = comFiltro ? 'com filtro' : 'sem filtro';
    foto.setAttribute('aria-label', `Mostrar ${amb.nome} ${comFiltro ? 'sem' : 'com'} filtro`);
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(rotulo, { scale: 0.82 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
    }
  });
});

document.querySelectorAll('.comparador').forEach(comp => {
  const controle = comp.querySelector('input[type="range"]');
  const mover = () => comp.style.setProperty('--pos', `${controle.value}%`);
  controle.addEventListener('input', mover);
  mover();
});

/* jornada: a linha enche conforme a rolagem e cada passo acende ao ser alcançado */
const jornada = document.querySelector('.jornada');
if (jornada && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  const passos = [...jornada.querySelectorAll('li')];
  const mm = gsap.matchMedia();

  /* "qualquer" garante que o handler rode também quando as outras duas são falsas (celular) */
  mm.add({ qualquer: '(min-width: 0px)', horizontal: '(min-width: 1024px)', reduzir: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
    if (conditions.reduzir) return;               // CSS padrão: linha cheia e passos acesos
    jornada.classList.add('animada');

    let limites = [];
    const medir = () => {
      const comprimento = conditions.horizontal ? jornada.offsetWidth : jornada.offsetHeight - 16;
      limites = passos.map(li => conditions.horizontal
        ? (li.offsetLeft + 22) / comprimento
        : (li.offsetTop + 14) / comprimento);
    };
    medir();

    gsap.fromTo(jornada, { '--progresso': 0 }, {
      '--progresso': 1, ease: 'none',
      scrollTrigger: { trigger: jornada, start: 'top 75%', end: 'bottom 55%', scrub: 0.6, onRefresh: medir },
      onUpdate() {
        const p = this.progress();
        passos.forEach((li, i) => li.classList.toggle('aceso', p >= limites[i]));
      }
    });

    return () => {
      jornada.classList.remove('animada');
      passos.forEach(li => li.classList.remove('aceso'));
    };
  });
}
})();
