# JOVI Smart Filter

**Uma câmera que simplifica a escolha de filtros ao adaptar a imagem ao ambiente.**

[**Acessar o projeto publicado**](https://jovi-smart-filter.vercel.app) · [Abrir a câmera](https://jovi-smart-filter.vercel.app/app.html)

## 🎯 Problema

Câmeras de smartphones oferecem muitos filtros, mas escolher o efeito adequado nem sempre é simples. Nomes técnicos, excesso de opções e ajustes pouco intuitivos tornam a experiência mais demorada e podem gerar resultados artificiais.

## 💡 Solução

O JOVI Smart Filter substitui a busca por filtros por uma escolha mais natural: **o usuário seleciona o ambiente em que está**. A câmera aplica uma configuração preparada para aquela situação e explica, em linguagem simples, o que foi alterado.

O protótipo reúne **14 ambientes**, organizados em quatro categorias, e **7 parâmetros de imagem** configuráveis.

## 🖥️ Demonstração

A aplicação está publicada na Vercel: [jovi-smart-filter.vercel.app](https://jovi-smart-filter.vercel.app).

As capturas abaixo usam largura limitada para manter a leitura confortável, principalmente em telas menores.

### 📱 Interface da câmera

<p align="center">
  <img src="https://jovi-smart-filter.vercel.app/assets/img/telas/palco-folha.png" alt="Seletor de ambientes da câmera" width="240">
</p>

O usuário escolhe o ambiente em uma interface organizada por categorias, sem precisar conhecer termos técnicos de fotografia.

### 🧠 Detecção e sugestão inteligente

<p align="center">
  <img src="https://jovi-smart-filter.vercel.app/assets/img/telas/palco-sugestao.png" alt="Sugestão automática de ambiente" width="240">
</p>

O sistema analisa sinais do ambiente e recomenda uma opção com justificativa. A sugestão pode ser aceita ou ignorada.

### 🎨 Filtros aplicados por ambiente

<p align="center">
  <img src="https://jovi-smart-filter.vercel.app/assets/img/telas/palco-praia.png" alt="Preset Praia e mar aplicado na câmera" width="240">
</p>

Cada ambiente possui uma configuração própria de imagem, ajustada para aquela condição.

### 🔍 Comparação antes e depois

<p align="center">
  <img src="https://jovi-smart-filter.vercel.app/assets/img/telas/palco-comparador.png" alt="Comparador entre imagem original e imagem com filtro" width="240">
</p>

O comparador permite visualizar a diferença entre a imagem original e o resultado com o filtro.

### 🧾 Transparência dos ajustes

<p align="center">
  <img src="https://jovi-smart-filter.vercel.app/assets/img/telas/recibo-praia.png" alt="Recibo com os ajustes aplicados ao preset Praia e mar" width="240">
</p>

Após aplicar o preset, a câmera apresenta um recibo com os parâmetros modificados e seus respectivos valores.

### 💡 O problema que queremos resolver

<p align="center">
  <img src="https://jovi-smart-filter.vercel.app/assets/img/telas/desafio-celular.png" alt="Exemplo do excesso de opções de filtros na câmera" width="240">
</p>

A proposta é reduzir a indecisão causada pelo excesso de filtros e tornar a escolha mais simples: selecionar o ambiente em vez de procurar o efeito ideal entre várias opções.

## ⚙️ Funcionalidades

- **14 ambientes:** presets organizados em quatro categorias, com configurações específicas para cada situação.
- **Detecção automática:** recomenda ambientes com base em luminosidade, temperatura de cor, composição da imagem e horário.
- **Aplicação em um toque:** selecionou o ambiente, o filtro é aplicado imediatamente, sem etapa extra de confirmação.
- **Ajustes manuais:** controle de exposição, brilho, contraste, saturação, temperatura, sombras e realces, com escalas e unidades definidas.
- **Preferências pessoais:** permite salvar uma configuração própria como padrão para cada ambiente.
- **Recibo de alterações:** informa quais parâmetros foram modificados e seus respectivos valores.
- **Comparador visual:** permite comparar a imagem original com a imagem tratada.
- **Galeria de capturas:** mantém as imagens e seus metadados, incluindo ambiente e configurações aplicadas.

## 🔎 Como funciona a detecção

O motor utiliza regras e pontuações para comparar as leituras disponíveis com as características esperadas de cada ambiente. Entre os sinais considerados estão:

| Sinal | Uso |
|---|---|
| Luz ambiente | Diferencia condições externas, internas e noturnas. |
| Temperatura de cor | Ajuda a identificar iluminação quente, fria ou natural. |
| Composição do quadro | Usa características visuais, como presença de céu e áreas verdes. |
| Horário | Atua como critério complementar para refinar a sugestão. |

A detecção é explicável: a interface apresenta o motivo da recomendação e mantém a decisão final com o usuário.

> **Nota sobre a câmera:** o acesso ao dispositivo depende da permissão do navegador e de um contexto seguro (HTTPS ou localhost). Quando a câmera não está disponível, o protótipo utiliza cenas e leituras simuladas para demonstrar o mesmo fluxo de detecção e aplicação dos filtros.

## 🔨 Stack

- **Frontend:** HTML5, CSS3 e JavaScript (ES6+).
- **Estilização:** Tailwind CSS.
- **Animações:** GSAP 3.13, ScrollTrigger e SplitText.
- **Publicação:** Vercel.

O projeto não utiliza framework frontend nem exige etapa de build para execução. O CSS do Tailwind já está compilado e as bibliotecas GSAP são mantidas localmente.

## 📂 Estrutura do projeto

```text
.
├── index.html          # Página da solução
├── app.html            # Protótipo interativo da câmera
├── slides.html         # Apresentação do projeto
├── assets/             # Imagens, cenas e capturas da interface
├── css/                # Estilos da aplicação
├── js/
│   ├── core/           # Dados, motor de detecção e cenas
│   ├── app/            # Comportamento do protótipo
│   ├── site/           # Scripts da página principal
│   ├── slides/         # Lógica da apresentação
│   └── vendor/         # Bibliotecas GSAP
└── docs/               # Materiais complementares
```

## 🎓 Contexto e Premiação
Projeto acadêmico desenvolvido para o Challenge JOVI — FIAP. Apresentado no evento anual NEXT da FIAP que reúne estudantes de todas as modalidades e cursos. O projeto conquistou o 3º lugar entre as melhores soluções, subindo ao pódio. A marca e o produto são utilizados exclusivamente para fins educacionais.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

