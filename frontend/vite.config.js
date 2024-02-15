import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server :{
    proxy :{
      '/api' :"https://real-time-chat-app-t6sb.onrender.com/"
    },
  },
  plugins: [react()],
})
