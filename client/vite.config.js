import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3001,
        proxy: {
            "/api/auth": {
              target: import.meta.env.VITE_SERVER_URL,
              changeOrigin: true,
            },
            "/api/user": {
                target: import.meta.env.VITE_SERVER_URL,
                changeOrigin: true,
            },
            "/api/post": {
                target: import.meta.env.VITE_SERVER_URL,
                changeOrigin: true,
            },
            "/api/like": {
                target: import.meta.env.VITE_SERVER_URL,
                changeOrigin: true,
            },
            "/api/comment": {
                target: import.meta.env.VITE_SERVER_URL,
                changeOrigin: true,
            },
            "/api/friend": {
                target: import.meta.env.VITE_SERVER_URL,
                changeOrigin: true,
            },
            "/api/upload": {
                target: import.meta.env.VITE_SERVER_URL,
                changeOrigin: true,
            },
            "/api/delete": {
                target: import.meta.env.VITE_SERVER_URL,
                changeOrigin: true,
            },
            "/api/notification": {
                target: import.meta.env.VITE_SERVER_URL,
                changeOrigin: true,
            },
            "/api/postSaved": {
                target: import.meta.env.VITE_SERVER_URL,
                changeOrigin: true,
            },
            "/api/admin": {
                target: import.meta.env.VITE_SERVER_URL,
                changeOrigin: true,
            }
        }
    }
})
