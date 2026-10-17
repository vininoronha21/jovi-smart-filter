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
  tl.from('.titulo-abertura span', { yPercent: 45, opacity: 0, duration: 0.9, stagger: 0.1 })
    .from('.abertura-sub, .abertura-texto, .acoes, .fatos', { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.55')
    .fromTo('.demo .aparelho',
      { clipPath: 'circle(0% at 50% 50%)' },
      { clipPath: 'circle(75% at 50% 50%)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath' }, 0.15)
    .from('.demo-chips, .demo-leitura', { y: 12, opacity: 0, duration: 0.5, stagger: 0.06 }, '-=0.4');

  /* os três números da abertura contam até o valor final */
  const originais = [];
  document.querySelectorAll('.fatos dd').forEach(dd => {
    const alvo = Number(dd.textContent);
    const marcador = { v: 0 };
    originais.push([dd, dd.textContent]);
    dd.textContent = '0';
    tl.to(marcador, { v: alvo, duration: 1.1, ease: 'power2.out', snap: { v: 1 }, onUpdate: () => { dd.textContent = marcador.v; } }, 0.9);
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
          yPercent: 105, duration: 0.9, ease: 'power4.out', stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        })
      });
    });
  }

  /* ---------- blocos que entram na rolagem ---------- */
  const itens = gsap.utils.toArray('.lista-num li, .resultado, .tabela-moldura, .recibo-imagem, .sinais > div, .ambiente');
  gsap.set(itens, { y: 28, opacity: 0 });
  ScrollTrigger.batch(itens, {
    start: 'top 88%', once: true,
    onEnter: els => {
      gsap.to(els, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity' });

      /* cada foto de ambiente chega sem filtro e ganha o filtro, como no deck */
      els.filter(el => el.matches('.ambiente')).forEach(el => {
        const botao = el.querySelector('.ambiente-foto');
        const filtro = botao.querySelector('.foto-filtro');
        const rotulo = botao.querySelector('.ambiente-foto-rotulo');
        if (botao.getAttribute('aria-pressed') !== 'true') return;
        rotulo.textContent = 'sem filtro';
        gsap.fromTo(filtro, { opacity: 0 }, {
          opacity: 1, duration: 1.2, delay: 0.5, ease: 'power1.inOut', clearProps: 'opacity',
          onComplete: () => { if (botao.getAttribute('aria-pressed') === 'true') rotulo.textContent = 'com filtro'; }
        });
      });
    }
  });

  /* ---------- paralaxe leve dos celulares (só em telas largas) ---------- */
  if (conditions.largo) {
    gsap.utils.toArray('.figura-celular, .comparador').forEach(el => {
      gsap.fromTo(el, { y: 36 }, {
        y: -36, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  return () => originais.forEach(([dd, texto]) => { dd.textContent = texto; });
});
})();
