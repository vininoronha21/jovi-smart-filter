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
| `slides.pdf` | A apresentação exportada, com links para o site e para a câmera |
| `slides-dinamico.mp4` | Vídeo de 42 s da apresentação com todas as transições |

## Apresentação

`slides.html` tem dois modos:

- **Direto** (padrão, para apresentar): cada slide aparece completo, só com um fade curto.
- **Dinâmico** (`slides.html?modo=dinamico`): transições, itens que entram um por clique, íris de
  câmera, números que contam e comparador com varredura automática.

Teclas: `→` / Espaço / clique avançam, `←` volta, `O` abre a visão geral, `F` liga a tela cheia.
Para gerar o PDF, imprima a página no Chrome em tamanho 1920×1080 com fundos ligados.

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
index.html            a solução, com demonstração ao vivo no topo
app.html              o protótipo da câmera
slides.html           a apresentação
css/style.css         CSS autoral: tokens, palco da câmera, folha, sliders, recibo e site
css/slides.css        CSS da apresentação
css/tailwind.css      utilitários compilados
js/dados.js           entidades do modelo de dados
js/motor.js           presets, tradução para filtros e motor de detecção
js/cenas.js           cenas de demonstração em SVG
js/app.js             controlador da interface da câmera
js/app-fx.js          efeitos leves da câmera (GSAP)
js/hero.js            demonstração ao vivo da abertura do site
js/site.js            interações do site: ambientes, comparador e jornada
js/efeitos.js         efeitos do site (GSAP, ScrollTrigger, SplitText)
js/slides.js          motor da apresentação
js/vendor/            GSAP, ScrollTrigger e SplitText (3.13.0)
assets/slides/        retratos da equipe e capturas do protótipo
tailwind.config.js    configuração do Tailwind
build/input.css       entrada do compilador
```

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
