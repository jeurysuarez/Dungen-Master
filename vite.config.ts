import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANTE: Reemplaza 'dnd-ai-dm' con el nombre exacto de tu repositorio de GitHub.
  // Por ejemplo, si tu URL es https://github.com/tu-usuario/mi-aventura,
  // debes cambiar la línea a: base: '/mi-aventura/',
  base: '/Dungen-Master/',
  plugins: [react()],
})
