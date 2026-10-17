/* =============================================================
   JOVI Smart Filter: efeitos leves da câmera (GSAP)
   Só entrada discreta e um escalonado nos valores da ficha.
   Não toca em app.js: observa o DOM que ele já escreve.
   ============================================================= */
(() => {
'use strict';
if (typeof gsap === 'undefined') return;

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('.aparelho', { y: 18, opacity: 0, duration: 0.7, ease: 'power2.out', clearProps: 'transform,opacity' });
  gsap.from('.ficha, .painel', {
    y: 12, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.07, delay: 0.1, clearProps: 'transform,opacity'
  });

  /* a cada troca de ambiente os valores da ficha chegam em sequência curta */
  const lista = document.getElementById('fichaValores');
  if (!lista) return;
  const observador = new MutationObserver(() => {
    gsap.from(lista.children, { y: 6, opacity: 0, duration: 0.35, stagger: 0.03, ease: 'power1.out', overwrite: true, clearProps: 'transform,opacity' });
  });
  observador.observe(lista, { childList: true });
  return () => observador.disconnect();
});
})();
