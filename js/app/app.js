/* =============================================================
   JOVI Smart Filter: controlador da interface
   ============================================================= */
(() => {
'use strict';

/* ---------- ícones (substituem os emoji da Sprint 1) -------- */
const ICONES = {
  praia:       '<circle cx="17.5" cy="6.5" r="2.8"/><path d="M2 16c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0"/><path d="M3 20c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0"/><path d="M3.5 12.5C5.5 9 8.5 7.4 12 7"/>',
  montanha:    '<path d="M2.5 19l6-10.5L12.5 15l2-3.2L21.5 19z"/><path d="M8.5 8.5L10.8 12"/>',
  pordosol:    '<circle cx="12" cy="13.2" r="3.8"/><path d="M12 4.2v2M5 7.4l1.4 1.4M19 7.4l-1.4 1.4M2.5 17.5h19M5.5 21h13"/>',
  nublado:     '<path d="M7.2 16.2a3.9 3.9 0 0 1 .5-7.8 5.4 5.4 0 0 1 10.1 1.3 3.4 3.4 0 0 1-.4 6.5z"/><path d="M8.5 19l-.9 2.2M12.5 19l-.9 2.2M16.5 19l-.9 2.2"/>',
  parque:      '<path d="M12 21v-6.4"/><path d="M12 14.6a4.9 4.9 0 0 0 4.4-7.1A3.9 3.9 0 0 0 9 5.3a4.4 4.4 0 0 0 3 9.3z"/><path d="M8.5 21h7"/>',
  restaurante: '<path d="M5 3v6.5a2.8 2.8 0 0 0 5.6 0V3M7.8 9.5V21"/><path d="M17.4 3c-1.6 2-2.2 4.2-2.2 7.2h4.4C19.6 7.2 19 5 17.4 3zM17.4 10.2V21"/>',
  museu:       '<path d="M3 9.2l9-5 9 5"/><path d="M5.6 9.6v8.6M10 9.6v8.6M14 9.6v8.6M18.4 9.6v8.6"/><path d="M3 20.8h18"/>',
  shopping:    '<path d="M5.4 8h13.2l-1 12H6.4z"/><path d="M9 8V6.2a3 3 0 0 1 6 0V8"/>',
  cinema:      '<rect x="3" y="9" width="18" height="11" rx="2.2"/><path d="M3.6 9.1l1.7-4.3 16.1 2.6L21 9.1"/><path d="M9.4 5.5L7.9 8.6M14.3 6.3l-1.5 3.1"/>',
  academia:    '<path d="M4 9.2v5.6M7 6.8v10.4M17 6.8v10.4M20 9.2v5.6M7 12h10"/>',
  cidade:      '<path d="M3 21V8.6l5.4-3.4V21"/><path d="M8.4 21v-9.4l6 2.8V21"/><path d="M14.4 21v-5.6L21 13.2V21"/><path d="M5.6 11.6h.01M5.6 15.4h.01M11.2 16h.01"/>',
  estrelado:   '<path d="M10.5 3l1.3 3.3L15 7.6l-3.2 1.3L10.5 12 9.2 8.9 6 7.6l3.2-1.3z"/><path d="M18 13l.7 1.7 1.8.7-1.8.7L18 18l-.7-1.9-1.8-.7 1.8-.7z"/><path d="M6 15.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/>',
  comida:      '<path d="M3.2 12.4h17.6a8.8 8.8 0 0 1-17.6 0z"/><path d="M2 21h20"/><path d="M8.4 8.6c0-1.8 1-1.8 1-3.4M12 8.6c0-1.8 1-1.8 1-3.4M15.6 8.6c0-1.8 1-1.8 1-3.4"/>',
  retrato:     '<circle cx="12" cy="8.6" r="3.9"/><path d="M5 20.4a7 7 0 0 1 14 0"/>',
  vazio:       '<circle cx="12" cy="12" r="8.4"/><path d="M12 8.4v4.2M12 15.8h.01"/>'
};
const svgIcone = (id, classe = 'icone') =>
  `<svg viewBox="0 0 24 24" class="${classe}" aria-hidden="true">${ICONES[id] || ICONES.vazio}</svg>`;

/* ---------- atalhos ----------------------------------------- */
const $ = (sel) => document.querySelector(sel);
const el = {
  palco: $('#palco'), midia: $('#palcoMidia'), cena: $('#palcoCena'), video: $('#video'),
  original: $('#palcoOriginal'), divisor: $('#divisor'), grade: $('#gradeTercos'),
  camadaTemp: $('#camadaTemp'), camadaSombras: $('#camadaSombras'), camadaRealces: $('#camadaRealces'),
  relogio: $('#relogio'),
  btnAuto: $('#btnAuto'), btnGrade: $('#btnGrade'), btnComparar: $('#btnComparar'),
  sugestao: $('#sugestao'), sugestaoIcone: $('#sugestaoIcone'), sugestaoNome: $('#sugestaoNome'),
  sugestaoMotivo: $('#sugestaoMotivo'), btnAceitar: $('#btnAceitarSugestao'), btnRecusar: $('#btnRecusarSugestao'),
  btnAbrirSeletor: $('#btnAbrirSeletor'), chipIcone: $('#chipIcone'), chipNome: $('#chipNome'),
  folha: $('#folha'), folhaFundo: $('#folhaFundo'), folhaLista: $('#folhaLista'),
  btnFecharFolha: $('#btnFecharFolha'), busca: $('#buscaAmbiente'),
  btnCapturar: $('#btnCapturar'), btnGaleria: $('#btnGaleria'),
  miniaturaImg: $('#miniaturaImg'), miniaturaVazia: $('#miniaturaVazia'),
  fichaTitulo: $('#fichaTitulo'), fichaExplicacao: $('#fichaExplicacao'),
  fichaValores: $('#fichaValores'), fichaSelo: $('#fichaSelo'),
  estilos: $('#estilos'), sliders: $('#sliders'),
  btnSalvar: $('#btnSalvarPreferencia'), btnRedefinir: $('#btnRedefinir'),
  btnAjuste: $('#btnAjuste'), ajusteCorpo: $('#ajusteCorpo'),
  btnSensores: $('#btnSensores'), sensoresCorpo: $('#sensoresCorpo'),
  sensores: $('#sensores'), ranking: $('#ranking'),
  galeria: $('#galeria'), galeriaVazia: $('#galeriaVazia'), btnLimpar: $('#btnLimparGaleria'),
  recibo: $('#recibo'), reciboTitulo: $('#reciboTitulo'), reciboValores: $('#reciboValores'),
  visor: $('#visor'), visorImg: $('#visorImg'), visorLegenda: $('#visorLegenda'), btnFecharVisor: $('#btnFecharVisor'),
  canvasAnalise: $('#canvasAnalise'), canvasCaptura: $('#canvasCaptura'),
  selCena: $('#selCena'), btnCamera: $('#btnCamera'), avisoFonte: $('#avisoFonte'),
  btnAbrir: $('#btnAbrirSeletor')
};

/* ---------- estado ------------------------------------------ */
const estado = {
  ambiente: null,
  estilo: 'natural',
  valores: Motor.base(),
  auto: true,
  fonte: 'cena',
  cena: 'cena-praia',
  comparando: false,
  ultimaLeitura: null,
  sugestaoAtual: null,
  recusadas: new Set(),
  veioDaSugestao: false,
  fluxo: null
};

/* ---------- formatação -------------------------------------- */
function formatar(idParam, valor) {
  const p = PARAM_POR_ID[idParam];
  const n = Number(valor);
  const texto = n.toFixed(p.casas).replace('.', ',');
  return (n > 0 ? '+' : n < 0 ? '−' : '') + texto.replace('-', '');
}
function resumoCurto(valores) {
  return PARAMETROS
    .filter(p => Math.abs(valores[p.id] || 0) > 0.001)
    .sort((a, b) => Math.abs(valores[b.id]) - Math.abs(valores[a.id]))
    .slice(0, 4)
    .map(p => `${p.nome} ${formatar(p.id, valores[p.id])}${p.unidade === 'EV' ? ' EV' : ''}`)
    .join('  ·  ');
}

/* ---------- aplicação visual -------------------------------- */
function aplicarVisual() {
  el.midia.style.filter = Motor.paraCSS(estado.valores);
  const t = Motor.camadaTemperatura(estado.valores);
  const s = Motor.camadaSombras(estado.valores);
  const r = Motor.camadaRealces(estado.valores);
  Object.assign(el.camadaTemp.style,    { opacity: t.opacity, background: t.background });
  Object.assign(el.camadaSombras.style, { opacity: s.opacity, background: s.background });
  Object.assign(el.camadaRealces.style, { opacity: r.opacity, background: r.background });
}

/* ---------- ficha ------------------------------------------- */
function desenharFicha() {
  const amb = estado.ambiente ? AMB_POR_ID[estado.ambiente] : null;

  if (!amb) {
    el.fichaTitulo.textContent = 'Escolha um ambiente para começar';
    el.fichaExplicacao.textContent = 'A câmera abre sem nenhum ajuste. Toque em “Ambiente” no aparelho ao lado, ou deixe a detecção automática sugerir.';
    el.fichaValores.innerHTML = '';
    el.fichaSelo.hidden = true;
    el.btnSalvar.disabled = true;
    el.btnRedefinir.disabled = true;
    return;
  }

  el.fichaTitulo.textContent = amb.nome;
  el.fichaExplicacao.textContent = amb.explicacao;
  el.fichaSelo.hidden = !Motor.temPreferencia(amb.id);
  el.btnSalvar.disabled = false;
  el.btnRedefinir.disabled = false;

  const ordenados = PARAMETROS
    .slice()
    .sort((a, b) => (amb.pesos[b.id] || 0) - (amb.pesos[a.id] || 0))
    .filter(p => Math.abs(estado.valores[p.id] || 0) > 0.001);

  el.fichaValores.innerHTML = ordenados.map(p => {
    const v = estado.valores[p.id];
    const sinal = v > 0 ? 'mais' : v < 0 ? 'menos' : 'zero';
    const critico = (amb.pesos[p.id] || 0) >= 0.8;
    return `<li data-critico="${critico}">
      <span class="rotulo">${p.nome}</span>
      <span class="valor mono" data-sinal="${sinal}">${formatar(p.id, v)}<span class="unidade">${p.unidade}</span></span>
    </li>`;
  }).join('') || '<li><span class="rotulo">Sem ajuste</span><span class="valor">-</span></li>';
}

/* ---------- sliders ----------------------------------------- */
function desenharSliders() {
  const amb = estado.ambiente ? AMB_POR_ID[estado.ambiente] : null;
  const ordem = PARAMETROS.slice().sort((a, b) =>
    ((amb?.pesos[b.id]) || 0) - ((amb?.pesos[a.id]) || 0));

  el.sliders.innerHTML = ordem.map(p => {
    const peso = amb ? amb.pesos[p.id] || 0 : 0;
    const critico = peso >= 0.8;
    return `<div class="linha-slider">
      <label class="nome" for="sl-${p.id}">${p.nome}${critico ? '<span class="peso">crítico aqui</span>' : ''}</label>
      <output class="leitura mono" id="out-${p.id}">${formatar(p.id, estado.valores[p.id])} ${p.unidade}</output>
      <span class="ajuda">${p.ajuda} Escala de ${formatar(p.id, p.min)} a ${formatar(p.id, p.max)} ${p.unidade}.</span>
      <input type="range" id="sl-${p.id}" data-param="${p.id}"
             min="${p.min}" max="${p.max}" step="${p.passo}" value="${estado.valores[p.id]}"
             aria-describedby="out-${p.id}">
    </div>`;
  }).join('');

  el.sliders.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('input', () => {
      const id = input.dataset.param;
      estado.valores[id] = parseFloat(input.value);
      document.getElementById('out-' + id).textContent =
        `${formatar(id, estado.valores[id])} ${PARAM_POR_ID[id].unidade}`;
      aplicarVisual();
      desenharFicha();
    });
  });
}

function atualizarSliders() {
  PARAMETROS.forEach(p => {
    const input = document.getElementById('sl-' + p.id);
    const out = document.getElementById('out-' + p.id);
    if (input) input.value = estado.valores[p.id];
    if (out) out.textContent = `${formatar(p.id, estado.valores[p.id])} ${p.unidade}`;
  });
}

/* ---------- estilos ----------------------------------------- */
function desenharEstilos() {
  el.estilos.innerHTML = ESTILOS.map(e =>
    `<button type="button" class="chip-estilo" data-estilo="${e.id}" aria-pressed="${e.id === estado.estilo}">${e.nome}</button>`
  ).join('');
  el.estilos.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      estado.estilo = b.dataset.estilo;
      if (estado.ambiente) definirAmbiente(estado.ambiente, { origem: 'estilo' });
      else desenharEstilos();
    });
  });
}

/* ---------- recibo ------------------------------------------ */
let temporizadorRecibo;
function mostrarRecibo(titulo, valores) {
  el.reciboTitulo.textContent = titulo;
  el.reciboValores.textContent = resumoCurto(valores);
  el.recibo.hidden = false;
  clearTimeout(temporizadorRecibo);
  temporizadorRecibo = setTimeout(() => { el.recibo.hidden = true; }, 5000);
}

/* ---------- selecionar ambiente ----------------------------- */
function definirAmbiente(id, opcoes = {}) {
  const amb = AMB_POR_ID[id];
  if (!amb) return;
  estado.ambiente = id;
  estado.valores = Motor.resolver(id, estado.estilo);
  estado.veioDaSugestao = opcoes.origem === 'sugestao';

  el.chipNome.textContent = amb.nome;
  el.chipIcone.innerHTML = svgIcone(id);

  aplicarVisual();
  desenharFicha();
  desenharSliders();
  desenharEstilos();
  atualizarCartoesFolha();

  if (opcoes.origem !== 'estilo') Motor.registrarUso(id);

  const sufixo = opcoes.origem === 'sugestao' ? ' aplicado pela detecção' : ' aplicado';
  mostrarRecibo(amb.nome + sufixo, estado.valores);
}

/* ---------- folha de seleção -------------------------------- */
function cartaoAmbiente(amb) {
  const ativo = estado.ambiente === amb.id;
  return `<button type="button" class="cartao-ambiente" data-amb="${amb.id}" aria-pressed="${ativo}" title="${amb.resumo}">
      ${svgIcone(amb.id)}
      <span class="cartao-ambiente-nome">${amb.nome}</span>
      ${Motor.temPreferencia(amb.id) ? '<span class="marca-pref" title="Você salvou um padrão aqui"></span>' : ''}
    </button>`;
}

function desenharFolha(termo = '') {
  const filtro = termo.trim().toLowerCase();
  const casa = a => !filtro || (a.nome + ' ' + a.resumo + ' ' + a.categoria).toLowerCase().includes(filtro);

  let html = '';
  const frequentes = Motor.maisUsados(3).filter(casa);
  if (!filtro && frequentes.length) {
    html += `<div class="folha-grupo"><p class="folha-grupo-titulo">Você usa mais</p>
      <div class="folha-grade">${frequentes.map(cartaoAmbiente).join('')}</div></div>`;
  }

  CATEGORIAS.forEach(cat => {
    const lista = AMBIENTES.filter(a => a.categoria === cat && casa(a));
    if (!lista.length) return;
    html += `<div class="folha-grupo"><p class="folha-grupo-titulo">${cat}</p>
      <div class="folha-grade">${lista.map(cartaoAmbiente).join('')}</div></div>`;
  });

  if (!html) html = '<p class="py-6 text-center text-[12.5px] text-neve-400">Nenhum ambiente com esse nome. Tente “noite”, “praia” ou “interno”.</p>';
  el.folhaLista.innerHTML = html;

  el.folhaLista.querySelectorAll('.cartao-ambiente').forEach(b => {
    b.addEventListener('click', () => {
      definirAmbiente(b.dataset.amb);
      esconderSugestao();
      setTimeout(fecharFolha, 420);        // deixa ver o efeito antes de fechar
    });
  });
}

function atualizarCartoesFolha() {
  el.folhaLista.querySelectorAll('.cartao-ambiente').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.amb === estado.ambiente));
  });
}

function abrirFolha() {
  el.folha.hidden = false;
  el.folhaFundo.hidden = false;
  el.btnAbrir.setAttribute('aria-expanded', 'true');
  desenharFolha(el.busca.value);
  el.busca.focus({ preventScroll: true });
}
function fecharFolha() {
  el.folha.hidden = true;
  el.folhaFundo.hidden = true;
  el.btnAbrir.setAttribute('aria-expanded', 'false');
}

/* ---------- sugestão ---------------------------------------- */
function mostrarSugestao(resultado) {
  estado.sugestaoAtual = resultado;
  el.sugestaoNome.textContent = resultado.ambiente.nome;
  el.sugestao.querySelector('.sugestao-titulo').firstChild.textContent =
    resultado.confianca >= 70 ? 'Parece ' : 'Pode ser ';
  el.sugestaoIcone.innerHTML = svgIcone(resultado.ambiente.id, '');
  el.sugestaoMotivo.textContent =
    `${resultado.confianca}% de certeza: ${Motor.explicarLeitura(resultado.leitura)}`;
  el.sugestao.hidden = false;
  clearTimeout(estado.fluxo);
  estado.fluxo = setTimeout(esconderSugestao, 9000);   // some sozinha, não bloqueia
}
function esconderSugestao() {
  el.sugestao.hidden = true;
  clearTimeout(estado.fluxo);
}

function desenharSensores(leitura, ranking) {
  const linhas = [
    ['Luz ambiente', Math.round(leitura.lux).toLocaleString('pt-BR') + ' lux'],
    ['Temperatura de cor', Math.round(leitura.kelvin).toLocaleString('pt-BR') + ' K'],
    ['Verde no quadro', Math.round(leitura.verde * 100) + '%'],
    ['Céu no topo', Math.round(leitura.ceu * 100) + '%'],
    ['Saturação medida', Math.round(leitura.saturacao * 100) + '%'],
    ['Horário', (leitura.hora != null ? String(Math.floor(leitura.hora)).padStart(2, '0') + 'h' : '-')]
  ];
  el.sensores.innerHTML = linhas.map(([t, v]) =>
    `<div><dt>${t}</dt><dd class="mono">${v}</dd></div>`).join('');

  const topo = ranking[0].pontos || 1;
  el.ranking.innerHTML = ranking.map(r => {
    const pct = Math.round(r.pontos / topo * 100);
    return `<li><span class="w-28 shrink-0">${r.amb.nome}</span>
      <span class="barra"><i style="width:${pct}%"></i></span>
      <span class="pct mono">${pct}%</span></li>`;
  }).join('');
}

function medir() {
  let leitura;
  if (estado.fonte === 'camera' && el.video.readyState >= 2) {
    leitura = Motor.lerFrame(el.video, el.canvasAnalise);
  }
  if (!leitura) {
    const cena = CENA_POR_ID[estado.cena];
    leitura = { ...cena.leitura, hora: cena.hora, pontosLuz: cena.leitura.pontosLuz ?? 0.02, origem: 'cena simulada' };
  }
  estado.ultimaLeitura = leitura;

  const resultado = Motor.sugerir(leitura);
  desenharSensores(leitura, resultado.ranking);

  const deveSugerir = estado.auto
    && resultado.confianca >= 40
    && resultado.ambiente.id !== estado.ambiente
    && !estado.recusadas.has(resultado.ambiente.id);

  if (deveSugerir) {
    if (el.sugestao.hidden || estado.sugestaoAtual?.ambiente.id !== resultado.ambiente.id) {
      mostrarSugestao(resultado);
    }
  } else if (resultado.ambiente.id === estado.ambiente) {
    esconderSugestao();
  }
}

/* ---------- fonte da imagem --------------------------------- */
function trocarCena(id) {
  estado.cena = id;
  estado.fonte = 'cena';
  estado.recusadas.clear();
  el.video.hidden = true;
  el.video.classList.add('hidden');
  el.cena.hidden = false;
  el.cena.innerHTML = desenharCena(id, 'a');
  if (estado.comparando) montarOriginal();
  medir();
}

async function usarCamera() {
  try {
    const fluxo = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1080 } }, audio: false
    });
    el.video.srcObject = fluxo;
    el.video.classList.remove('hidden');
    el.video.hidden = false;
    el.cena.hidden = true;
    estado.fonte = 'camera';
    estado.recusadas.clear();
    el.btnCamera.textContent = 'Câmera ligada';
    el.btnCamera.disabled = true;
    el.avisoFonte.textContent = 'Lendo o sensor da sua câmera em tempo real. A detecção usa luz, temperatura de cor e composição do quadro.';
    if (estado.comparando) montarOriginal();
  } catch {
    el.avisoFonte.textContent = 'A câmera não foi liberada. O protótipo segue com as cenas de demonstração, que trazem leituras de sensor equivalentes.';
  }
}

/* ---------- comparador -------------------------------------- */
function montarOriginal() {
  el.original.innerHTML = '';
  if (estado.fonte === 'camera' && el.video.srcObject) {
    const v = document.createElement('video');
    v.playsInline = true; v.autoplay = true; v.muted = true;
    v.className = 'palco-video';
    v.srcObject = el.video.srcObject;
    v.play().catch(() => {});
    el.original.appendChild(v);
  } else {
    el.original.innerHTML = desenharCena(estado.cena, 'b');
  }
}
function posicionarDivisor(pct) {
  const p = Math.min(96, Math.max(4, pct));
  el.original.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
  el.divisor.style.setProperty('--pos', p + '%');
}
function alternarComparador() {
  estado.comparando = !estado.comparando;
  el.btnComparar.setAttribute('aria-pressed', String(estado.comparando));
  el.original.hidden = !estado.comparando;
  el.divisor.hidden = !estado.comparando;
  if (estado.comparando) { montarOriginal(); posicionarDivisor(50); }
}

let arrastando = false;
el.divisor.addEventListener('pointerdown', (e) => {
  arrastando = true; el.divisor.setPointerCapture(e.pointerId);
  posicionarDivisor((e.offsetX / el.divisor.clientWidth) * 100);
});
el.divisor.addEventListener('pointermove', (e) => {
  if (!arrastando) return;
  const r = el.divisor.getBoundingClientRect();
  posicionarDivisor(((e.clientX - r.left) / r.width) * 100);
});
el.divisor.addEventListener('pointerup', () => { arrastando = false; });

/* ---------- captura ----------------------------------------- */
function svgParaImagem(markup, largura, altura) {
  return new Promise((resolve, reject) => {
    const comTamanho = markup.replace('<svg ', `<svg width="${largura}" height="${altura}" `);
    const url = URL.createObjectURL(new Blob([comTamanho], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = () => { resolve(img); URL.revokeObjectURL(url); };
    img.onerror = () => { reject(); URL.revokeObjectURL(url); };
    img.src = url;
  });
}

function pintarCamada(ctx, camada, modo, L, A) {
  if (!camada.opacity) return;
  ctx.globalCompositeOperation = modo;
  ctx.globalAlpha = camada.opacity;
  ctx.fillStyle = camada.background;
  ctx.fillRect(0, 0, L, A);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

async function capturar() {
  const L = 360, A = 780;
  const canvas = el.canvasCaptura;
  canvas.width = L; canvas.height = A;
  const ctx = canvas.getContext('2d');

  const brilho = document.createElement('div');
  brilho.className = 'flash';
  el.palco.appendChild(brilho);
  setTimeout(() => brilho.remove(), 320);

  let fonte = null;
  if (estado.fonte === 'camera' && el.video.readyState >= 2) fonte = el.video;
  else { try { fonte = await svgParaImagem(desenharCena(estado.cena, 'c'), L, A); } catch { fonte = null; } }

  ctx.fillStyle = '#05060C';
  ctx.fillRect(0, 0, L, A);

  if (fonte) {
    const lf = fonte.videoWidth || fonte.width;
    const af = fonte.videoHeight || fonte.height;
    const escala = Math.max(L / lf, A / af);
    const dl = lf * escala, da = af * escala;
    if ('filter' in ctx) ctx.filter = Motor.paraCSS(estado.valores);
    ctx.drawImage(fonte, (L - dl) / 2, (A - da) / 2, dl, da);
    ctx.filter = 'none';
  }

  pintarCamada(ctx, Motor.camadaTemperatura(estado.valores), 'soft-light', L, A);
  pintarCamada(ctx, Motor.camadaSombras(estado.valores), 'lighten', L, A);
  pintarCamada(ctx, Motor.camadaRealces(estado.valores), 'darken', L, A);

  let dados = '';
  try { dados = canvas.toDataURL('image/jpeg', 0.72); } catch { dados = ''; }

  const amb = estado.ambiente ? AMB_POR_ID[estado.ambiente] : null;
  const foto = {
    id: Date.now(),
    imagem: dados,
    ambiente: amb ? amb.nome : 'Sem ambiente',
    ambienteId: estado.ambiente,
    estilo: ESTILO_POR_ID[estado.estilo].nome,
    valores: { ...estado.valores },
    detectadoIA: estado.veioDaSugestao,
    quando: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
  Motor.salvarFoto(foto);
  desenharGaleria();
  mostrarRecibo('Foto salva na galeria', estado.valores);
}

/* ---------- galeria ----------------------------------------- */
function desenharGaleria() {
  const fotos = Motor.listarFotos();
  el.galeriaVazia.hidden = fotos.length > 0;
  el.galeria.innerHTML = fotos.map(f => `
    <button type="button" data-foto="${f.id}">
      ${f.imagem ? `<img src="${f.imagem}" alt="Foto em ${f.ambiente}">` : ''}
      ${f.detectadoIA ? '<span class="etiqueta-ia">auto</span>' : ''}
      <figcaption>${f.ambiente}<br>${f.quando}</figcaption>
    </button>`).join('');

  el.galeria.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => abrirVisor(Number(b.dataset.foto)));
  });

  if (fotos.length && fotos[0].imagem) {
    el.miniaturaImg.src = fotos[0].imagem;
    el.miniaturaImg.hidden = false;
    el.miniaturaVazia.hidden = true;
  } else {
    el.miniaturaImg.hidden = true;
    el.miniaturaVazia.hidden = false;
  }
}

function abrirVisor(id) {
  const foto = Motor.listarFotos().find(f => f.id === id);
  if (!foto) return;
  el.visorImg.src = foto.imagem || '';
  el.visorLegenda.innerHTML =
    `<strong>${foto.ambiente}</strong> · estilo ${foto.estilo} · ${foto.quando}<br>
     <span class="mono">${resumoCurto(foto.valores)}</span><br>
     ${foto.detectadoIA ? 'Ambiente sugerido pela detecção e aceito por você.' : 'Ambiente escolhido manualmente.'}`;
  el.visor.hidden = false;
  el.btnFecharVisor.focus();
}

/* ---------- eventos ----------------------------------------- */
el.btnAbrir.addEventListener('click', () => el.folha.hidden ? abrirFolha() : fecharFolha());
el.btnFecharFolha.addEventListener('click', fecharFolha);
el.folhaFundo.addEventListener('click', fecharFolha);
el.busca.addEventListener('input', () => desenharFolha(el.busca.value));

el.btnAuto.addEventListener('click', () => {
  estado.auto = !estado.auto;
  el.btnAuto.setAttribute('aria-pressed', String(estado.auto));
  el.btnAuto.lastChild.textContent = estado.auto ? 'Detecção automática' : 'Detecção desligada';
  if (!estado.auto) esconderSugestao(); else medir();
});

el.btnGrade.addEventListener('click', () => {
  const ligada = el.grade.classList.toggle('visivel');
  el.btnGrade.setAttribute('aria-pressed', String(ligada));
});

el.btnComparar.addEventListener('click', alternarComparador);
el.btnCapturar.addEventListener('click', capturar);
el.btnGaleria.addEventListener('click', () => {
  document.getElementById('secaoGaleria').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

el.btnAceitar.addEventListener('click', () => {
  if (estado.sugestaoAtual) definirAmbiente(estado.sugestaoAtual.ambiente.id, { origem: 'sugestao' });
  esconderSugestao();
});
el.btnRecusar.addEventListener('click', () => {
  if (estado.sugestaoAtual) estado.recusadas.add(estado.sugestaoAtual.ambiente.id);
  esconderSugestao();
});

el.btnSalvar.addEventListener('click', () => {
  if (!estado.ambiente) return;
  Motor.salvarPreferencia(estado.ambiente, estado.valores, estado.estilo);
  desenharFicha();
  desenharFolha(el.busca.value);
  mostrarRecibo('Salvo como seu padrão para ' + AMB_POR_ID[estado.ambiente].nome, estado.valores);
});

el.btnRedefinir.addEventListener('click', () => {
  if (!estado.ambiente) return;
  Motor.apagarPreferencia(estado.ambiente);
  estado.estilo = 'natural';
  definirAmbiente(estado.ambiente, { origem: 'reset' });
});

[[el.btnAjuste, el.ajusteCorpo], [el.btnSensores, el.sensoresCorpo]].forEach(([botao, corpo]) => {
  botao.addEventListener('click', () => {
    const aberto = botao.getAttribute('aria-expanded') === 'true';
    botao.setAttribute('aria-expanded', String(!aberto));
    corpo.hidden = aberto;
  });
});

el.btnLimpar.addEventListener('click', () => { Motor.apagarFotos(); desenharGaleria(); });
el.btnFecharVisor.addEventListener('click', () => { el.visor.hidden = true; });
el.visor.addEventListener('click', (e) => { if (e.target === el.visor) el.visor.hidden = true; });

el.btnCamera.addEventListener('click', usarCamera);
el.selCena.addEventListener('change', () => trocarCena(el.selCena.value));

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!el.visor.hidden) el.visor.hidden = true;
  else if (!el.folha.hidden) fecharFolha();
  else if (!el.sugestao.hidden) esconderSugestao();
});

/* ---------- partida ----------------------------------------- */
function relogio() {
  el.relogio.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function iniciar() {
  el.selCena.innerHTML = CENAS.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
  el.selCena.value = estado.cena;
  el.chipIcone.innerHTML = svgIcone('vazio');

  trocarCena(estado.cena);
  desenharEstilos();
  desenharSliders();
  desenharFicha();
  desenharGaleria();
  desenharFolha();
  aplicarVisual();

  relogio();
  setInterval(relogio, 30000);
  setInterval(medir, 2600);
}

iniciar();
})();
