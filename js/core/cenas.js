/* =============================================================
   JOVI Smart Filter: cenas de demonstração
   Desenhadas em SVG para o projeto continuar 100% offline:
   nenhuma imagem externa, nenhum link fora da pasta entregue.
   ============================================================= */

const DESENHOS = {

  'cena-praia': (s) => `
  <svg viewBox="0 0 300 640" preserveAspectRatio="xMidYMid slice" class="cena" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${s}ceu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1F5FAE"/><stop offset=".55" stop-color="#5D9FD8"/><stop offset="1" stop-color="#AFD4EC"/>
      </linearGradient>
      <linearGradient id="${s}mar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1D7FA6"/><stop offset="1" stop-color="#4FBFC4"/>
      </linearGradient>
      <linearGradient id="${s}areia" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E6CFA4"/><stop offset="1" stop-color="#C2A175"/>
      </linearGradient>
      <radialGradient id="${s}sol"><stop offset="0" stop-color="#FFF6D0"/><stop offset=".5" stop-color="#FFE08A" stop-opacity=".85"/><stop offset="1" stop-color="#FFD76B" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="300" height="400" fill="url(#${s}ceu)"/>
    <circle cx="225" cy="112" r="62" fill="url(#${s}sol)"/>
    <circle cx="225" cy="112" r="20" fill="#FFF3C4"/>
    <ellipse cx="70" cy="150" rx="46" ry="14" fill="#fff" opacity=".5"/>
    <ellipse cx="96" cy="142" rx="30" ry="11" fill="#fff" opacity=".45"/>
    <rect y="370" width="300" height="130" fill="url(#${s}mar)"/>
    <path d="M0 398c40 8 70-6 110 2s80 10 190-4v-30H0Z" fill="#2E96BE" opacity=".6"/>
    <path d="M0 470c50 10 90-8 150 2s110 12 150-2v34H0Z" fill="#EAF6F7" opacity=".7"/>
    <rect y="492" width="300" height="148" fill="url(#${s}areia)"/>
    <ellipse cx="150" cy="500" rx="180" ry="16" fill="#F0DFBC" opacity=".55"/>
    <g fill="#14402E">
      <path d="M62 520V430" stroke="#5B4326" stroke-width="7" fill="none"/>
      <path d="M62 432c-26-16-44-10-52 4 16-2 30 0 40 8Zm0 0c26-16 46-12 54 2-18-2-32 0-42 8Zm0-4c-6-24 4-40 20-46-8 16-10 30-8 42Z"/>
      <path d="M232 540V462" stroke="#5B4326" stroke-width="6" fill="none"/>
      <path d="M232 464c-22-13-38-9-44 3 14-2 25 0 34 7Zm0 0c22-13 39-10 46 2-16-2-27 0-36 7Z"/>
    </g>
  </svg>`,

  'cena-por': (s) => `
  <svg viewBox="0 0 300 640" preserveAspectRatio="xMidYMid slice" class="cena" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${s}ceu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#241548"/><stop offset=".32" stop-color="#7A3C72"/>
        <stop offset=".62" stop-color="#DE6A45"/><stop offset=".84" stop-color="#FFB25C"/><stop offset="1" stop-color="#FFD9A0"/>
      </linearGradient>
      <linearGradient id="${s}mar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8D4A3C"/><stop offset="1" stop-color="#2A1B33"/>
      </linearGradient>
      <radialGradient id="${s}sol"><stop offset="0" stop-color="#FFF2C6"/><stop offset=".45" stop-color="#FFB25C" stop-opacity=".8"/><stop offset="1" stop-color="#FF8A3C" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="300" height="430" fill="url(#${s}ceu)"/>
    <circle cx="150" cy="410" r="110" fill="url(#${s}sol)"/>
    <circle cx="150" cy="412" r="34" fill="#FFEFC0"/>
    <g fill="#F2A165" opacity=".45">
      <ellipse cx="70" cy="196" rx="62" ry="10"/><ellipse cx="220" cy="238" rx="74" ry="11"/>
      <ellipse cx="130" cy="150" rx="50" ry="8"/>
    </g>
    <rect y="426" width="300" height="214" fill="url(#${s}mar)"/>
    <g fill="#FFC98A" opacity=".55">
      <rect x="136" y="438" width="28" height="4" rx="2"/><rect x="128" y="456" width="44" height="4" rx="2"/>
      <rect x="138" y="478" width="24" height="3" rx="1.5"/><rect x="120" y="502" width="60" height="4" rx="2"/>
      <rect x="132" y="534" width="36" height="3" rx="1.5"/>
    </g>
    <g fill="#140C1E">
      <path d="M44 640V452" stroke="#140C1E" stroke-width="8" fill="none"/>
      <path d="M44 454c-30-18-52-11-60 5 19-3 35 0 46 9Zm0 0c30-18 53-13 62 3-21-3-37 0-48 9Zm0-6c-7-28 5-46 23-53-9 18-11 34-9 48Z"/>
      <path d="M0 640c60-26 110-18 150-6 50 14 100 16 150-4v10H0Z"/>
    </g>
  </svg>`,

  'cena-parque': (s) => `
  <svg viewBox="0 0 300 640" preserveAspectRatio="xMidYMid slice" class="cena" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${s}ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CB9DD"/><stop offset="1" stop-color="#D7E8F2"/></linearGradient>
      <linearGradient id="${s}grama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E8A3A"/><stop offset="1" stop-color="#2C5C25"/></linearGradient>
    </defs>
    <rect width="300" height="320" fill="url(#${s}ceu)"/>
    <rect y="300" width="300" height="340" fill="url(#${s}grama)"/>
    <path d="M110 640c10-120 30-200 46-340h18c-14 140-28 220-34 340Z" fill="#B9A783" opacity=".8"/>
    <g>
      <path d="M66 380V300" stroke="#5A4026" stroke-width="10" fill="none"/>
      <circle cx="66" cy="272" r="54" fill="#3C7A33"/><circle cx="34" cy="292" r="34" fill="#4C8C3C"/><circle cx="96" cy="294" r="36" fill="#326B2C"/>
      <path d="M228 356V292" stroke="#5A4026" stroke-width="8" fill="none"/>
      <circle cx="228" cy="266" r="44" fill="#48853A"/><circle cx="256" cy="286" r="28" fill="#376F2F"/><circle cx="202" cy="288" r="26" fill="#57993F"/>
      <path d="M152 330v-44" stroke="#5A4026" stroke-width="5" fill="none"/>
      <circle cx="152" cy="268" r="26" fill="#5AA045"/>
    </g>
    <g fill="#E8C34C" opacity=".9">
      <circle cx="40" cy="520" r="5"/><circle cx="84" cy="566" r="4"/><circle cx="236" cy="540" r="5"/><circle cx="268" cy="596" r="4"/>
    </g>
    <g fill="#D96C8A" opacity=".85"><circle cx="58" cy="590" r="5"/><circle cx="212" cy="612" r="4"/></g>
    <rect y="620" width="300" height="20" fill="#24501F"/>
  </svg>`,

  'cena-cafe': (s) => `
  <svg viewBox="0 0 300 640" preserveAspectRatio="xMidYMid slice" class="cena" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${s}par" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B1B14"/><stop offset="1" stop-color="#160E0A"/></linearGradient>
      <linearGradient id="${s}mesa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6B4428"/><stop offset="1" stop-color="#3A2417"/></linearGradient>
      <radialGradient id="${s}lamp"><stop offset="0" stop-color="#FFD79A"/><stop offset="1" stop-color="#FFB25C" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="300" height="640" fill="url(#${s}par)"/>
    <circle cx="70" cy="120" r="76" fill="url(#${s}lamp)" opacity=".8"/>
    <circle cx="232" cy="186" r="60" fill="url(#${s}lamp)" opacity=".55"/>
    <g stroke="#7A5330" stroke-width="2" fill="none"><path d="M70 0v46M232 0v58"/></g>
    <ellipse cx="70" cy="56" rx="22" ry="14" fill="#FFCE8C"/><ellipse cx="232" cy="68" rx="17" ry="11" fill="#FFC079"/>
    <rect y="404" width="300" height="236" fill="url(#${s}mesa)"/>
    <ellipse cx="150" cy="406" rx="190" ry="20" fill="#835331" opacity=".7"/>
    <g>
      <ellipse cx="134" cy="470" rx="46" ry="14" fill="#1A100B" opacity=".5"/>
      <path d="M108 430h52l-6 40a20 20 0 0 1-40 0Z" fill="#EFE6DA"/>
      <ellipse cx="134" cy="430" rx="26" ry="8" fill="#7B4A2A"/>
      <path d="M160 440c16 0 16 22 0 24" stroke="#EFE6DA" stroke-width="5" fill="none"/>
    </g>
    <g><rect x="196" y="440" width="44" height="60" rx="4" fill="#C8B79C"/><rect x="202" y="452" width="32" height="4" rx="2" fill="#8A7A62"/><rect x="202" y="464" width="24" height="4" rx="2" fill="#8A7A62"/></g>
    <g fill="#FFCE8C" opacity=".25"><circle cx="40" cy="250" r="14"/><circle cx="268" cy="300" r="10"/><circle cx="96" cy="196" r="8"/></g>
  </svg>`,

  'cena-cidade': (s) => `
  <svg viewBox="0 0 300 640" preserveAspectRatio="xMidYMid slice" class="cena" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${s}noite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080B1C"/><stop offset="1" stop-color="#1B2244"/></linearGradient>
      <linearGradient id="${s}rua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1B26"/><stop offset="1" stop-color="#0C0D14"/></linearGradient>
      <radialGradient id="${s}halo"><stop offset="0" stop-color="#FFD9A0"/><stop offset="1" stop-color="#FFB25C" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="300" height="640" fill="url(#${s}noite)"/>
    <g fill="#10142C">
      <rect x="-4" y="150" width="70" height="330"/><rect x="72" y="90" width="58" height="390"/>
      <rect x="136" y="180" width="46" height="300"/><rect x="188" y="120" width="64" height="360"/>
      <rect x="258" y="210" width="48" height="270"/>
    </g>
    <g fill="#FFD48A">
      <rect x="6" y="176" width="10" height="12"/><rect x="28" y="200" width="10" height="12"/><rect x="6" y="238" width="10" height="12"/>
      <rect x="46" y="176" width="10" height="12"/><rect x="82" y="118" width="12" height="14"/><rect x="106" y="150" width="12" height="14"/>
      <rect x="82" y="196" width="12" height="14"/><rect x="106" y="242" width="12" height="14"/><rect x="82" y="290" width="12" height="14"/>
      <rect x="146" y="210" width="10" height="12"/><rect x="164" y="252" width="10" height="12"/><rect x="146" y="306" width="10" height="12"/>
      <rect x="200" y="150" width="12" height="14"/><rect x="226" y="184" width="12" height="14"/><rect x="200" y="232" width="12" height="14"/>
      <rect x="226" y="286" width="12" height="14"/><rect x="268" y="240" width="10" height="12"/><rect x="288" y="284" width="10" height="12"/>
    </g>
    <rect x="188" y="330" width="64" height="46" rx="4" fill="#3D1F6B"/>
    <rect x="196" y="342" width="48" height="8" rx="4" fill="#C6A4FF"/><rect x="196" y="356" width="30" height="8" rx="4" fill="#8B6BFF"/>
    <rect y="470" width="300" height="170" fill="url(#${s}rua)"/>
    <g fill="#FFE9C4" opacity=".9"><rect x="142" y="490" width="14" height="30" rx="3"/><rect x="142" y="540" width="14" height="30" rx="3"/><rect x="142" y="590" width="14" height="30" rx="3"/></g>
    <circle cx="44" cy="452" r="46" fill="url(#${s}halo)" opacity=".7"/>
    <g stroke="#2A2F4E" stroke-width="5" fill="none"><path d="M44 470V400"/><path d="M44 400h26"/></g>
    <circle cx="74" cy="402" r="7" fill="#FFE9C4"/>
    <circle cx="252" cy="486" r="38" fill="url(#${s}halo)" opacity=".5"/>
    <g fill="#FF7A6B"><rect x="238" y="498" width="26" height="8" rx="4"/></g>
  </svg>`
};

/* Devolve o SVG de uma cena. O sufixo evita ids duplicados quando
   a mesma cena é clonada no comparador antes/depois.            */
function desenharCena(idCena, sufixo = 'a') {
  const fabrica = DESENHOS[idCena] || DESENHOS['cena-praia'];
  return fabrica(idCena.replace(/[^a-z]/g, '') + sufixo);
}
