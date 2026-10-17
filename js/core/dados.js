/* =============================================================
   JOVI Smart Filter: camada de dados
   Espelha as entidades modeladas na Sprint 1:
   PARAMETRO_AJUSTE · AMBIENTE · CONFIGURACAO_AMBIENTE · PRESET_USUARIO
   ============================================================= */

/* ---------- PARAMETRO_AJUSTE -------------------------------- */
/* Cada parâmetro declara escala e unidade. Sem isso o valor
   "+25" da Sprint 1 não era implementável.                     */
const PARAMETROS = [
  { id: 'exposicao', nome: 'Exposição',   unidade: 'EV',  min: -2,   max: 2,   passo: 0.1, casas: 1, ajuda: 'Quanta luz entra na captura.' },
  { id: 'brilho',    nome: 'Brilho',      unidade: 'pts', min: -100, max: 100, passo: 1,   casas: 0, ajuda: 'Clareia ou escurece a imagem inteira.' },
  { id: 'contraste', nome: 'Contraste',   unidade: 'pts', min: -100, max: 100, passo: 1,   casas: 0, ajuda: 'Distância entre as partes claras e escuras.' },
  { id: 'saturacao', nome: 'Saturação',   unidade: 'pts', min: -100, max: 100, passo: 1,   casas: 0, ajuda: 'Intensidade das cores.' },
  { id: 'calor',     nome: 'Temperatura', unidade: 'pts', min: -100, max: 100, passo: 1,   casas: 0, ajuda: 'Puxa a cena para o azul (fria) ou para o âmbar (quente).' },
  { id: 'sombras',   nome: 'Sombras',     unidade: 'pts', min: -100, max: 100, passo: 1,   casas: 0, ajuda: 'Abre ou fecha o detalhe nas áreas escuras.' },
  { id: 'realces',   nome: 'Realces',     unidade: 'pts', min: -100, max: 100, passo: 1,   casas: 0, ajuda: 'Segura ou libera o detalhe nas áreas muito claras.' }
];

const PARAM_POR_ID = Object.fromEntries(PARAMETROS.map(p => [p.id, p]));

/* ---------- AMBIENTE + CONFIGURACAO_AMBIENTE ----------------- */
/* valores  = valor_ideal por parâmetro
   pesos    = peso_importancia (0..1): o quanto aquele parâmetro
              é crítico para o ambiente. Usado na ordenação do
              painel de ajuste e no aviso de desvio.
   leitura  = assinatura de sensores usada pelo motor de sugestão. */
const AMBIENTES = [
  {
    id: 'praia', nome: 'Praia e mar', categoria: 'Ao ar livre',
    resumo: 'Areia clara, água e céu aberto',
    explicacao: 'Areia e água refletem muita luz. A câmera baixa a exposição para o céu não estourar e reforça o azul e o turquesa.',
    valores: { contraste: 20, brilho: -10, saturacao: 25, exposicao: -0.3, calor: -10, sombras: 5, realces: -15 },
    pesos:   { exposicao: 1, saturacao: .9, contraste: .7, realces: .6, brilho: .5, calor: .4, sombras: .2 },
    leitura: { lux: 14000, kelvin: 6400, verde: .06, ceu: .45, saturacao: .5 }
  },
  {
    id: 'montanha', nome: 'Montanha e trilha', categoria: 'Ao ar livre',
    resumo: 'Vegetação, rocha e distância',
    explicacao: 'A neblina de distância lava o contraste. A câmera devolve definição e abre as sombras das encostas.',
    valores: { contraste: 30, brilho: 0, saturacao: 10, exposicao: 0, calor: -5, sombras: 15, realces: -10 },
    pesos:   { contraste: 1, sombras: .8, saturacao: .5, realces: .5, exposicao: .3, brilho: .3, calor: .2 },
    leitura: { lux: 9000, kelvin: 5800, verde: .34, ceu: .3, saturacao: .42 }
  },
  {
    id: 'pordosol', nome: 'Pôr do sol', categoria: 'Ao ar livre',
    resumo: 'Luz baixa, laranja e rosa',
    explicacao: 'A hora dourada já traz a cor. A câmera segura os realces perto do sol e escurece um pouco para as nuvens ganharem desenho.',
    valores: { contraste: 15, brilho: -20, saturacao: 15, exposicao: -0.2, calor: 20, sombras: 0, realces: -30 },
    pesos:   { realces: 1, calor: .9, brilho: .7, contraste: .5, saturacao: .5, exposicao: .4, sombras: .2 },
    leitura: { lux: 2200, kelvin: 3200, verde: .08, ceu: .22, saturacao: .6 }
  },
  {
    id: 'nublado', nome: 'Dia nublado', categoria: 'Ao ar livre',
    resumo: 'Céu cinza, luz difusa e chapada',
    explicacao: 'Sem sol direto a cena fica plana. A câmera recupera contraste e tira o excesso de cor que o cinza produz.',
    valores: { contraste: 35, brilho: 5, saturacao: -10, exposicao: 0, calor: 10, sombras: 10, realces: -5 },
    pesos:   { contraste: 1, saturacao: .7, calor: .6, brilho: .5, sombras: .4, realces: .2, exposicao: .2 },
    leitura: { lux: 3500, kelvin: 7200, verde: .14, ceu: .34, saturacao: .18 }
  },
  {
    id: 'parque', nome: 'Parque e jardim', categoria: 'Ao ar livre',
    resumo: 'Folhas, flores e luz filtrada',
    explicacao: 'Verde ocupa quase tudo. A câmera reforça a cor com cuidado para a folhagem não virar um bloco só.',
    valores: { contraste: 10, brilho: 5, saturacao: 15, exposicao: 0, calor: 0, sombras: 10, realces: -5 },
    pesos:   { saturacao: 1, sombras: .7, contraste: .6, brilho: .4, calor: .3, realces: .3, exposicao: .2 },
    leitura: { lux: 7000, kelvin: 5400, verde: .52, ceu: .12, saturacao: .45 }
  },
  {
    id: 'restaurante', nome: 'Restaurante e café', categoria: 'Ambiente fechado',
    resumo: 'Luz quente e pontual',
    explicacao: 'Lâmpadas amarelas e muita sombra. A câmera preserva o clima quente e abre o que ficou escuro na mesa.',
    valores: { contraste: 10, brilho: 0, saturacao: 5, exposicao: 0.2, calor: 15, sombras: 20, realces: -10 },
    pesos:   { sombras: 1, calor: .9, exposicao: .6, contraste: .4, brilho: .3, saturacao: .3, realces: .3 },
    leitura: { lux: 160, kelvin: 2700, verde: .05, ceu: 0, saturacao: .3 }
  },
  {
    id: 'museu', nome: 'Museu e galeria', categoria: 'Ambiente fechado',
    resumo: 'Luz controlada, cor fiel',
    explicacao: 'Aqui a cor precisa ser fiel à obra, então a câmera quase não interfere, apenas evita estourar o branco da parede.',
    valores: { contraste: 5, brilho: 0, saturacao: 0, exposicao: -0.1, calor: 0, sombras: 5, realces: -5 },
    pesos:   { saturacao: 1, exposicao: .8, contraste: .5, calor: .5, realces: .3, brilho: .2, sombras: .2 },
    leitura: { lux: 220, kelvin: 4000, verde: .08, ceu: 0, saturacao: .24 }
  },
  {
    id: 'shopping', nome: 'Shopping e loja', categoria: 'Ambiente fechado',
    resumo: 'Fluorescente frio e esverdeado',
    explicacao: 'A luz fluorescente deixa a pele esverdeada. A câmera esquenta a cena para o tom de pele voltar ao normal.',
    valores: { contraste: 10, brilho: 0, saturacao: 10, exposicao: 0, calor: 20, sombras: 15, realces: -5 },
    pesos:   { calor: 1, sombras: .7, saturacao: .6, contraste: .4, brilho: .2, exposicao: .2, realces: .2 },
    leitura: { lux: 600, kelvin: 5000, verde: .16, ceu: 0, saturacao: .28 }
  },
  {
    id: 'cinema', nome: 'Cinema', categoria: 'Ambiente fechado',
    resumo: 'Sala escura, foco na tela',
    explicacao: 'Quase toda a luz vem da tela. A câmera mantém o preto realmente preto e impede que a projeção estoure.',
    valores: { contraste: 35, brilho: -15, saturacao: -5, exposicao: -0.4, calor: -5, sombras: -10, realces: -25 },
    pesos:   { realces: 1, contraste: .9, exposicao: .8, brilho: .6, sombras: .5, saturacao: .3, calor: .2 },
    leitura: { lux: 20, kelvin: 4600, verde: .04, ceu: 0, saturacao: .2 }
  },
  {
    id: 'academia', nome: 'Academia', categoria: 'Ambiente fechado',
    resumo: 'Luz dura e superfícies escuras',
    explicacao: 'Equipamento preto engole a luz. A câmera abre as sombras e esquenta o tom para a pele não ficar acinzentada.',
    valores: { contraste: 25, brilho: 5, saturacao: 5, exposicao: 0.1, calor: 15, sombras: 20, realces: -10 },
    pesos:   { sombras: 1, contraste: .8, calor: .7, brilho: .4, exposicao: .3, saturacao: .3, realces: .2 },
    leitura: { lux: 340, kelvin: 3600, verde: .06, ceu: 0, saturacao: .26 }
  },
  {
    id: 'cidade', nome: 'Cidade à noite', categoria: 'Noite',
    resumo: 'Letreiros, faróis e asfalto',
    explicacao: 'Pontos de luz muito fortes num fundo escuro. A câmera segura os letreiros e clareia o resto da rua.',
    valores: { contraste: 25, brilho: 0, saturacao: 10, exposicao: 0, calor: -5, sombras: 10, realces: -20 },
    pesos:   { realces: 1, contraste: .8, sombras: .7, saturacao: .5, exposicao: .4, calor: .3, brilho: .2 },
    leitura: { lux: 30, kelvin: 4200, verde: .04, ceu: 0, saturacao: .34, pontosLuz: .12 }
  },
  {
    id: 'estrelado', nome: 'Céu estrelado', categoria: 'Noite',
    resumo: 'Campo aberto, sem luz artificial',
    explicacao: 'Praticamente não há luz. A câmera fica mais tempo exposta e puxa tudo que existe nas sombras.',
    valores: { contraste: 10, brilho: -15, saturacao: 0, exposicao: 0.5, calor: -10, sombras: 30, realces: 0 },
    pesos:   { sombras: 1, exposicao: 1, brilho: .6, contraste: .4, calor: .3, saturacao: .2, realces: .1 },
    leitura: { lux: 2, kelvin: 3800, verde: .02, ceu: .05, saturacao: .12 }
  },
  {
    id: 'comida', nome: 'Prato e comida', categoria: 'Social' ,
    resumo: 'Close na mesa',
    explicacao: 'Comida vende pela cor. A câmera clareia o prato e satura o suficiente para o alimento parecer fresco.',
    valores: { contraste: 15, brilho: 10, saturacao: 20, exposicao: 0.1, calor: 10, sombras: 15, realces: -10 },
    pesos:   { saturacao: 1, brilho: .8, sombras: .6, calor: .5, contraste: .4, exposicao: .3, realces: .2 },
    leitura: { lux: 420, kelvin: 3400, verde: .12, ceu: 0, saturacao: .55 }
  },
  {
    id: 'retrato', nome: 'Retrato e selfie', categoria: 'Social',
    resumo: 'Rosto em primeiro plano',
    explicacao: 'Pele é o assunto. A câmera aplica quase nada de contraste para não marcar textura e esquenta levemente o tom.',
    valores: { contraste: 5, brilho: 5, saturacao: 5, exposicao: 0.1, calor: 10, sombras: 10, realces: -10 },
    pesos:   { calor: 1, contraste: .9, sombras: .6, brilho: .4, saturacao: .4, exposicao: .3, realces: .3 },
    leitura: { lux: 900, kelvin: 4800, verde: .1, ceu: .08, saturacao: .3 }
  }
];

const AMB_POR_ID = Object.fromEntries(AMBIENTES.map(a => [a.id, a]));
const CATEGORIAS = ['Ao ar livre', 'Ambiente fechado', 'Noite', 'Social'];

/* ---------- Estilos ------------------------------------------ */
/* Segunda camada, opcional: modula o preset do ambiente.        */
const ESTILOS = [
  { id: 'natural',   nome: 'Natural',   delta: {} },
  { id: 'vibrante',  nome: 'Vibrante',  delta: { saturacao: 15, contraste: 8 } },
  { id: 'suave',     nome: 'Suave',     delta: { contraste: -12, sombras: 10, saturacao: -5 } },
  { id: 'dramatico', nome: 'Dramático', delta: { contraste: 22, sombras: -18, realces: -12 } },
  { id: 'vintage',   nome: 'Vintage',   delta: { saturacao: -18, calor: 18, contraste: -6, sombras: 14 } },
  { id: 'pb',        nome: 'Preto e branco', delta: { saturacao: -100, contraste: 12 } }
];

const ESTILO_POR_ID = Object.fromEntries(ESTILOS.map(e => [e.id, e]));

/* ---------- Cenas de demonstração ---------------------------- */
/* Usadas quando não há permissão de câmera. Cada cena carrega a
   leitura de sensores que o aparelho teria naquele momento, de
   modo que o motor de sugestão roda exatamente igual.           */
const CENAS = [
  { id: 'cena-praia',   nome: 'Orla ao meio-dia', hora: 12, leitura: { lux: 15200, kelvin: 6500, verde: .05, ceu: .47, saturacao: .52 } },
  { id: 'cena-por',     nome: 'Fim de tarde',     hora: 18, leitura: { lux: 1900,  kelvin: 3100, verde: .09, ceu: .24, saturacao: .61 } },
  { id: 'cena-parque',  nome: 'Parque',           hora: 10, leitura: { lux: 7400,  kelvin: 5500, verde: .55, ceu: .13, saturacao: .47 } },
  { id: 'cena-cafe',    nome: 'Café',             hora: 20, leitura: { lux: 150,   kelvin: 2650, verde: .05, ceu: 0,   saturacao: .31 } },
  { id: 'cena-cidade',  nome: 'Rua à noite',      hora: 22, leitura: { lux: 26,    kelvin: 4300, verde: .03, ceu: 0,   saturacao: .36, pontosLuz: .14 } }
];

const CENA_POR_ID = Object.fromEntries(CENAS.map(c => [c.id, c]));
