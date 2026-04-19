import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/real-estate/', // แก้ไขชื่อ repo ตรงนี้ให้ตรงกับชื่อบน GitHub
  plugins: [react()],
})
