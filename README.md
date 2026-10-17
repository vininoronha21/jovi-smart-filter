# JOVI Smart Filter — Challenge JOVI

Front-end da câmera que troca o vocabulário técnico dos filtros pelo ambiente real do usuário.

**Turma 1TDSOE**

| Integrante | RM |
|---|---|
| Guilherme Aparecido Bulhoes Cirilo | RM569679 |
| Mateus Gonçalves Melo | RM573966 |
| Geovanna Luna Mendes Ramos | RM571210 |
| Vinicius Noronha Forte | RM569076 |

---

## Como executar

Abra `index.html` no navegador. Não há servidor, instalação ou dependência online: o
Tailwind já está compilado em `css/tailwind.css`, o GSAP está em `js/vendor/` e as cenas de
demonstração são desenhadas em SVG dentro do próprio JavaScript. Só as fontes (Sora e Inter) vêm
do Google Fonts; sem internet, o navegador usa as fontes do sistema.

Um detalhe do navegador: o acesso à câmera (`getUserMedia`) só é liberado em `https` ou em
`localhost`. Abrindo o arquivo direto do disco, o botão **Usar minha câmera** não funciona e o
protótipo segue com as cenas de demonstração, que carregam leituras de sensor equivalentes.
Para testar com a câmera de verdade, sirva a pasta em localhost:

```
python -m http.server 8000      # depois abra http://localhost:8000
```

## Páginas

| Arquivo | O que é |
|---|---|
| `index.html` | A solução: abertura com demonstração ao vivo, desafio, jornada, ambientes, recibo, comparador e detecção |
| `app.html` | O protótipo da câmera |
| `slides.html` | A apresentação (12 slides, 1920×1080) |
| `docs/slides.pdf` | A apresentação exportada, com links para o site e para a câmera |
| `docs/slides-dinamico.mp4` | Vídeo de 42 s da apresentação com todas as transições |

As três páginas ficam na raiz de propósito: abrem com duplo clique e os links do PDF apontam para elas.

## Apresentação

`slides.html` tem dois modos:

- **Direto** (padrão, para apresentar): cada slide aparece completo, só com um fade curto.
- **Dinâmico** (`slides.html?modo=dinamico`): transições, itens que entram um por clique, íris de
  câmera, números que contam e comparador com varredura automática.

Teclas: `→` / Espaço / clique avançam, `←` volta, `O` abre a visão geral, `F` liga a tela cheia.
Para gerar o PDF e o vídeo, veja [Comandos](#comandos).

## Tecnologias

HTML5, CSS3, JavaScript (ES6+), Tailwind CSS e GSAP 3.13 (com ScrollTrigger e SplitText).
Nenhum framework e nenhum build para rodar. O GSAP fica em `js/vendor/`, com versão fixa, para o
projeto continuar abrindo offline. Todas as animações respeitam a preferência de movimento
reduzido do sistema.

O Tailwind foi compilado localmente para o pacote não depender de CDN. Para recompilar depois
de alterar classes no HTML ou no JS:

```
npm install
npm run css
```

## Estrutura

```
index.html  app.html  slides.html    as três páginas (raiz)
css/
  base.css          tokens, reset, tipografia, ícones e cabeçalho (todas as páginas)
  camera.css        aparelho Jovi, palco, folha, ficha, sliders, galeria, recibo
  site.css          componentes do index.html
  slides.css        a apresentação
  tailwind.css      utilitários compilados (gerado)
js/
  core/             dados.js, motor.js, cenas.js — modelo, motor e cenas, compartilhados
  site/             hero.js, site.js, efeitos.js — o index.html
  app/              app.js, app-fx.js — a câmera
  slides/           slides.js — a apresentação
  vendor/           GSAP, ScrollTrigger e SplitText (3.13.0)
assets/img/
  equipe/           retratos da equipe
  ambientes/        cenas de demonstração, sem e com filtro
  telas/            capturas do protótipo e imagens do aparelho Jovi
docs/               slides.pdf, slides-dinamico.mp4 e referencias/
tools/              exportar-pdf.cjs, gravar-video.cjs, montar-video.swift
build/input.css     entrada do Tailwind
tailwind.config.js  configuração do Tailwind
```

### Como o código se organiza

- `js/core/` não conhece nenhuma página: `dados.js` (entidades) → `motor.js` (presets e detecção) →
  `cenas.js` (SVG). As três páginas reaproveitam esse núcleo.
- Cada página carrega só o que usa: o `app.html` não recebe `css/site.css`, e só o `index.html` e
  o `app.html` carregam o GSAP e os efeitos próprios.
- O CSS vai em camadas, da mais geral para a mais específica: `base.css` → `camera.css` → `site.css`.

## Comandos

```
npm run serve      servidor local em http://localhost:8000 (necessário para usar a câmera)
npm run css        recompila o Tailwind
npm run pdf        exporta docs/slides.pdf
npm run video      grava e monta docs/slides-dinamico.mp4 (macOS)
```

`pdf` e `video` usam o Google Chrome instalado e o `playwright-core` (`npm install`). Os links do PDF
saem com o caminho absoluto desta pasta no seu computador.

## O que dá para testar

- **Um toque troca o ambiente.** A folha abre sobre o visor, o efeito acontece no toque e ela se
  fecha sozinha. Não existe botão de confirmar.
- **A detecção sugere, não impõe.** O cartão traz o grau de certeza e o motivo em uma frase. Ignorar
  é gratuito: ele some sozinho. Recusar faz aquele ambiente parar de aparecer.
- **O recibo.** Depois de cada mudança, a câmera diz o que fez, em números e em português.
- **Ajuste fino.** Sete parâmetros com faixa e unidade declaradas, ordenados pelo peso que têm
  naquele ambiente.
- **Salvar como meu padrão.** Cria uma camada de preferência sobre o preset de fábrica, por ambiente.
- **Comparador.** Arraste o divisor para ver a mesma cena com e sem filtro.
- **Galeria.** Cada captura guarda o ambiente, os valores aplicados e se veio de uma sugestão aceita.
- **Leitura dos sensores.** Painel com as grandezas que alimentam a detecção e o ranking dos três
  ambientes mais prováveis.

## Decisões de projeto

- Trocar de ambiente leva um toque, sem tela de confirmação.
- Os sete parâmetros têm faixa e unidade; a exposição é em EV.
- `peso_importancia` ordena o painel de ajuste e marca o que é crítico em cada ambiente.
- A preferência do usuário é uma tabela de sobrescrita por ambiente, fácil de consultar e de reverter.
- Os ícones são um conjunto SVG, no lugar de emoji, que muda de plataforma para plataforma.
- A taxonomia tem 14 ambientes em quatro categorias, iguais em todas as páginas.
- A detecção é um motor de regras sobre os sensores existentes, e explica cada sugestão em uma frase.

## Modelo de dados

As entidades modeladas aparecem no código com o mesmo nome: `PARAMETRO_AJUSTE`, `AMBIENTE`,
`CONFIGURACAO_AMBIENTE` (valor ideal e peso de importância), `PRESET_USUARIO` e `FOTO` com seu
metadado de captura.
