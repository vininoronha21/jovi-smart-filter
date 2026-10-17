/** Configuração do Tailwind CSS — JOVI Smart Filter (direção visual "Visor", a mesma do deck) */
module.exports = {
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        tinta: { 900: '#0B0B0F', 800: '#15151C', 700: '#1E1E28', 600: '#2C2C3A' },
        neve:  { 100: '#F5F5F7', 300: '#C9C9D3', 400: '#A6A6B3', 500: '#8A8A98' },
        violeta: '#9250F2',
        azul: '#4BA3FF',
        ambar: '#FFB25C',
        verde: '#3DDC97'
      },
      fontWeight: { 400: '400', 500: '500', 600: '600', 700: '700', 800: '800' },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
