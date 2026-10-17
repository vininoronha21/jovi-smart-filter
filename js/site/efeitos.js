/* =============================================================
   JOVI Smart Filter — efeitos da página da solução (GSAP)
   Abertura em timeline, números que contam, títulos revelados por
   linha, blocos que entram na rolagem, paralaxe leve nos celulares
   e barra de progresso. Tudo dentro de gsap.matchMedia(): com
   movimento reduzido nada é animado e o conteúdo fica como está.
   ============================================================= */
(() => {
'use strict';
if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

const temSplit = typeof SplitText !== 'undefined';
gsap.registerPlugin(ScrollTrigger, ...(temSplit ? [SplitText] : []));

const mm = gsap.matchMedia();

mm.add({ ok: '(prefers-reduced-motion: no-preference)', largo: '(min-width: 768px)' }, ({ conditions }) => {
  if (!conditions.ok) return;

  /* ---------- abertura ---------- */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.titulo-abertura span', { yPercent: 60, opacity: 0, scale: 0.92, duration: 1, stagger: 0.12, ease: 'back.out(1.4)' })
    .from('.abertura-sub', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
    .from('.abertura-texto', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .from('.acoes', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '-=0.4')
    .from('.fatos', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .fromTo('.demo .aparelho',
      { clipPath: 'circle(0% at 50% 50%)', scale: 0.9 },
      { clipPath: 'circle(75% at 50% 50%)', scale: 1, duration: 1.2, ease: 'power3.inOut', clearProps: 'clipPath,scale' }, 0.2)
    .from('.demo-chips', { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
    .from('.demo-leitura', { y: 12, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');

  /* os três números da abertura contam até o valor final */
  const originais = [];
  document.querySelectorAll('.fatos dd').forEach(dd => {
    const alvo = Number(dd.textContent);
    const marcador = { v: 0 };
    originais.push([dd, dd.textContent]);
    dd.textContent = '0';
    tl.to(marcador, { v: alvo, duration: 1.4, ease: 'power2.out', snap: { v: 1 }, onUpdate: () => { dd.textContent = marcador.v; } }, 0.9);
  });

  /* ---------- barra de progresso da página ---------- */
  gsap.to('.progresso-pagina span', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.2 }
  });

  /* ---------- títulos: uma linha por vez, de dentro de uma máscara ---------- */
  if (temSplit) {
    gsap.utils.toArray('.titulo-bloco').forEach(el => {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'linha', autoSplit: true,
        onSplit: self => gsap.from(self.lines, {
          yPercent: 110, opacity: 0, rotateX: -15, duration: 1, ease: 'power4.out', stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        })
      });
    });
  }

  /* ---------- texto-bloco: fade + slide suave ---------- */
  gsap.utils.toArray('.texto-bloco').forEach(el => {
    gsap.from(el, {
      y: 20, opacity: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  /* ---------- blocos que entram na rolagem ---------- */
  const itens = gsap.utils.toArray('.lista-num li, .resultado, .tabela-moldura, .recibo-imagem, .sinais > div, .ambiente, .arquivos div');
  gsap.set(itens, { y: 32, opacity: 0 });
  ScrollTrigger.batch(itens, {
    start: 'top 88%', once: true,
    onEnter: els => {
      gsap.to(els, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity' });

      /* cada foto de ambiente chega sem filtro e ganha o filtro, como no deck */
      els.filter(el => el.matches('.ambiente')).forEach(el => {
        const botao = el.querySelector('.ambiente-foto');
        const filtro = botao.querySelector('.foto-filtro');
        const rotulo = botao.querySelector('.ambiente-foto-rotulo');
        if (botao.getAttribute('aria-pressed') !== 'true') return;
        rotulo.textContent = 'sem filtro';
        gsap.fromTo(filtro, { opacity: 0 }, {
          opacity: 1, duration: 1.4, delay: 0.6, ease: 'power1.inOut', clearProps: 'opacity',
          onComplete: () => { if (botao.getAttribute('aria-pressed') === 'true') rotulo.textContent = 'com filtro'; }
        });
      });
    }
  });

  /* ---------- botões CTA: hover scale sutil ---------- */
  gsap.utils.toArray('.botao-primario').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.25, ease: 'power2.out' }));
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.inOut' }));
  });

  /* ---------- sinais: hover highlight interativo ---------- */
  gsap.utils.toArray('.sinais > div').forEach(div => {
    const dt = div.querySelector('dt');
    div.addEventListener('mouseenter', () => gsap.to(dt, { color: '#B48CFF', x: 4, duration: 0.3, ease: 'power2.out' }));
    div.addEventListener('mouseleave', () => gsap.to(dt, { color: '', x: 0, duration: 0.3, ease: 'power2.inOut' }));
  });

  /* ---------- chamada final: entrada com escala ---------- */
  gsap.from('.chamada .titulo-bloco', {
    scale: 0.92, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.chamada', start: 'top 80%', once: true }
  });
  gsap.from('.chamada .texto-bloco', {
    y: 20, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.chamada', start: 'top 80%', once: true }
  });
  gsap.from('.chamada .acoes', {
    y: 20, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power2.out',
    scrollTrigger: { trigger: '.chamada', start: 'top 80%', once: true }
  });

  /* ---------- paralaxe leve dos celulares (só em telas largas) ---------- */
  if (conditions.largo) {
    gsap.utils.toArray('.figura-celular, .comparador').forEach(el => {
      gsap.fromTo(el, { y: 40 }, {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------- paralaxe suave no mobile (sutil, sem exagero) ---------- */
  if (!conditions.largo) {
    gsap.utils.toArray('.ambiente-foto').forEach(el => {
      gsap.fromTo(el, { y: 12 }, {
        y: -12, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  return () => originais.forEach(([dd, texto]) => { dd.textContent = texto; });
});
})();
