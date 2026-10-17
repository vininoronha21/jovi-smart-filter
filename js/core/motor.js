/* =============================================================
   JOVI Smart Filter — motor
   1. Presets    : ambiente + estilo + preferência do usuário
   2. Renderização: parâmetros -> filtros CSS e camadas de mistura
   3. Sugestão   : leitura de sensores -> ambiente provável
   4. Persistência: PRESET_USUARIO e FOTO em localStorage
   ============================================================= */

const Motor = (() => {

  const CHAVE_PRESET = 'jovi.presets.usuario';
  const CHAVE_FOTOS  = 'jovi.fotos';
  const CHAVE_USO    = 'jovi.uso';

  /* ---------- armazenamento local --------------------------- */
  function ler(chave, padrao) {
    try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; }
    catch { return padrao; }
  }
  function gravar(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* cota cheia */ }
  }

  /* ---------- PRESET_USUARIO -------------------------------- */
  /* Sobrescreve CONFIGURACAO_AMBIENTE por ambiente. Substitui o
     blob "preferencia_estilo json" do modelo original.         */
  const presetsUsuario = ler(CHAVE_PRESET, {});

  function salvarPreferencia(idAmbiente, valores, idEstilo) {
    presetsUsuario[idAmbiente] = { valores: { ...valores }, estilo: idEstilo, em: Date.now() };
    gravar(CHAVE_PRESET, presetsUsuario);
  }
  function apagarPreferencia(idAmbiente) {
    delete presetsUsuario[idAmbiente];
    gravar(CHAVE_PRESET, presetsUsuario);
  }
  function temPreferencia(idAmbiente) {
    return Boolean(presetsUsuario[idAmbiente]);
  }

  /* ---------- resolução do preset --------------------------- */
  function base() {
    return Object.fromEntries(PARAMETROS.map(p => [p.id, 0]));
  }

  function limitar(id, v) {
    const p = PARAM_POR_ID[id];
    return Math.min(p.max, Math.max(p.min, v));
  }

  /* ambiente (ou preferência salva) + delta do estilo */
  function resolver(idAmbiente, idEstilo) {
    const amb = AMB_POR_ID[idAmbiente];
    const pref = presetsUsuario[idAmbiente];
    const valores = { ...base(), ...(amb ? amb.valores : {}) };
    if (pref) Object.assign(valores, pref.valores);

    const estilo = ESTILO_POR_ID[idEstilo];
    if (estilo) {
      for (const [k, d] of Object.entries(estilo.delta)) {
        valores[k] = limitar(k, (valores[k] ?? 0) + d);
      }
    }
    for (const k of Object.keys(valores)) valores[k] = limitar(k, valores[k]);
    return valores;
  }

  /* ---------- parâmetros -> apresentação -------------------- */
  /* O que cada parâmetro vira na tela:
     exposicao/brilho -> brightness   contraste -> contrast
     saturacao        -> saturate
     calor            -> camada de mistura soft-light âmbar/azul
     sombras          -> camada "lighten" cinza (levanta o preto)
     realces          -> camada "darken"  cinza (segura o branco)  */
  function paraCSS(v) {
    const exposicao = Math.pow(2, (v.exposicao || 0) * 0.55);
    const brilho    = 1 + (v.brilho || 0) / 100 * 0.45;
    const contraste = 1 + (v.contraste || 0) / 100 * 0.6;
    const saturacao = Math.max(0, 1 + (v.saturacao || 0) / 100 * 0.9);
    return `brightness(${(exposicao * brilho).toFixed(3)}) contrast(${contraste.toFixed(3)}) saturate(${saturacao.toFixed(3)})`;
  }

  function camadaTemperatura(v) {
    const c = v.calor || 0;
    if (!c) return { opacity: 0, background: 'transparent' };
    const cor = c > 0 ? '255,171,92' : '86,158,255';
    return { opacity: Math.min(0.55, Math.abs(c) / 100 * 0.55), background: `rgb(${cor})` };
  }

  function camadaSombras(v) {
    const s = v.sombras || 0;
    if (s <= 0) return { opacity: 0, background: 'transparent' };
    const nivel = Math.round(s / 100 * 90);          // 0..90 de 255
    return { opacity: 1, background: `rgb(${nivel},${nivel},${nivel + 4})` };
  }

  function camadaRealces(v) {
    const r = v.realces || 0;
    if (r >= 0) return { opacity: 0, background: 'transparent' };
    const nivel = 255 - Math.round(Math.abs(r) / 100 * 70);
    return { opacity: 1, background: `rgb(${nivel},${nivel - 2},${nivel - 6})` };
  }

  /* ---------- motor de sugestão ----------------------------- */
  /* Compara a leitura atual com a assinatura de cada ambiente.
     Regras explícitas, sem caixa-preta: cada critério pesa e o
     resultado sempre pode ser explicado ao usuário.            */
  const PESOS_LEITURA = { lux: .38, kelvin: .22, verde: .16, ceu: .16, saturacao: .08 };

  function proximidadeLux(a, b) {
    const la = Math.log10(Math.max(a, 1) + 1);
    const lb = Math.log10(Math.max(b, 1) + 1);
    return Math.max(0, 1 - Math.abs(la - lb) / 2.2);
  }
  function proximidadeKelvin(a, b) {
    return Math.max(0, 1 - Math.abs(a - b) / 3200);
  }
  function proximidadeLinear(a, b, escala) {
    return Math.max(0, 1 - Math.abs(a - b) / escala);
  }

  function bonusHora(amb, hora) {
    if (hora == null) return 0;
    if (amb.id === 'pordosol') return (hora >= 16.5 && hora <= 19.5) ? .12 : -.10;
    if (amb.id === 'cidade' || amb.id === 'estrelado') return (hora >= 19 || hora <= 5) ? .08 : -.08;
    if (amb.id === 'praia' || amb.id === 'parque' || amb.id === 'montanha') {
      return (hora >= 7 && hora <= 17) ? .05 : -.06;
    }
    return 0;
  }

  function pontuar(amb, leitura) {
    const a = amb.leitura;
    let s = 0;
    s += PESOS_LEITURA.lux       * proximidadeLux(leitura.lux, a.lux);
    s += PESOS_LEITURA.kelvin    * proximidadeKelvin(leitura.kelvin, a.kelvin);
    s += PESOS_LEITURA.verde     * proximidadeLinear(leitura.verde, a.verde, .55);
    s += PESOS_LEITURA.ceu       * proximidadeLinear(leitura.ceu, a.ceu, .5);
    s += PESOS_LEITURA.saturacao * proximidadeLinear(leitura.saturacao, a.saturacao, .5);
    s += bonusHora(amb, leitura.hora);
    if (a.pontosLuz != null && leitura.pontosLuz != null) {
      s += .08 * proximidadeLinear(leitura.pontosLuz, a.pontosLuz, .2);
    }
    return Math.max(0, s);
  }

  function sugerir(leitura) {
    const ranking = AMBIENTES
      .map(amb => ({ amb, pontos: pontuar(amb, leitura) }))
      .sort((x, y) => y.pontos - x.pontos);

    const primeiro = ranking[0], segundo = ranking[1];
    /* A confiança é dominada pela MARGEM sobre o segundo colocado,
       não pela pontuação absoluta: duas assinaturas quase empatadas
       devem produzir um número baixo, e não uma certeza falsa.      */
    const margem = primeiro.pontos > 0
      ? (primeiro.pontos - segundo.pontos) / primeiro.pontos
      : 0;
    const bruta = 0.18 + margem * 2.0 + (primeiro.pontos - 0.85) * 0.55;
    const confianca = Math.round(Math.min(0.96, Math.max(0.12, bruta)) * 100);

    return { ambiente: primeiro.amb, confianca, ranking: ranking.slice(0, 3), leitura };
  }

  /* Motivo da sugestão, em linguagem de usuário. */
  function explicarLeitura(leitura) {
    const partes = [];
    if (leitura.lux < 60)         partes.push('pouquíssima luz');
    else if (leitura.lux < 800)   partes.push('luz de ambiente fechado');
    else if (leitura.lux < 5000)  partes.push('luz externa fraca');
    else                          partes.push('luz externa forte');

    if (leitura.kelvin < 3400)      partes.push('iluminação quente');
    else if (leitura.kelvin > 6000) partes.push('iluminação fria');

    if (leitura.verde > .35) partes.push('muito verde no enquadramento');
    if (leitura.ceu > .3)    partes.push('céu ocupando o topo');
    if (leitura.pontosLuz > .08) partes.push('pontos de luz isolados');
    return partes.join(', ');
  }

  /* ---------- leitura a partir de um frame real ------------- */
  /* Amostra o vídeo num canvas pequeno e deriva as mesmas
     grandezas que os sensores entregariam.                     */
  function lerFrame(video, canvas) {
    const L = 48;
    canvas.width = L; canvas.height = L;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, L, L);
    let dados;
    try { dados = ctx.getImageData(0, 0, L, L).data; } catch { return null; }

    let somaR = 0, somaG = 0, somaB = 0, somaLum = 0, somaSat = 0;
    let verdes = 0, ceu = 0, topo = 0, claros = 0;
    const total = L * L;

    for (let i = 0; i < total; i++) {
      const r = dados[i * 4], g = dados[i * 4 + 1], b = dados[i * 4 + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      somaR += r; somaG += g; somaB += b; somaLum += lum;
      somaSat += max === 0 ? 0 : (max - min) / max;
      if (g > r * 1.08 && g > b * 1.12) verdes++;
      if (lum > 215) claros++;
      const linha = Math.floor(i / L);
      if (linha < L / 3) {
        topo++;
        if (b > r * 1.12 && b > g * 1.02 && lum > 70) ceu++;
      }
    }

    const mediaLum = somaLum / total;
    const razao = (somaR + 1) / (somaB + 1);
    return {
      lux: Math.round(Math.pow(10, (mediaLum / 255) * 4.3)),   // aproximação log
      kelvin: Math.round(Math.min(9000, Math.max(2200, 6500 / Math.pow(razao, 1.35)))),
      verde: verdes / total,
      ceu: topo ? ceu / topo : 0,
      saturacao: somaSat / total,
      pontosLuz: claros / total,
      hora: new Date().getHours() + new Date().getMinutes() / 60,
      origem: 'câmera'
    };
  }

  /* ---------- FOTO + METADADO_IA_CAPTURA -------------------- */
  function registrarUso(idAmbiente) {
    const uso = ler(CHAVE_USO, {});
    uso[idAmbiente] = (uso[idAmbiente] || 0) + 1;
    gravar(CHAVE_USO, uso);
  }
  function maisUsados(qtd = 3) {
    const uso = ler(CHAVE_USO, {});
    return Object.entries(uso)
      .sort((a, b) => b[1] - a[1])
      .slice(0, qtd)
      .map(([id]) => AMB_POR_ID[id])
      .filter(Boolean);
  }

  function listarFotos() { return ler(CHAVE_FOTOS, []); }

  function salvarFoto(foto) {
    const fotos = listarFotos();
    fotos.unshift(foto);
    while (fotos.length > 12) fotos.pop();     // cota do localStorage
    gravar(CHAVE_FOTOS, fotos);
    return fotos;
  }
  function apagarFotos() { gravar(CHAVE_FOTOS, []); }

  return {
    resolver, base, limitar, paraCSS,
    camadaTemperatura, camadaSombras, camadaRealces,
    sugerir, explicarLeitura, lerFrame,
    salvarPreferencia, apagarPreferencia, temPreferencia,
    registrarUso, maisUsados,
    listarFotos, salvarFoto, apagarFotos
  };
})();
