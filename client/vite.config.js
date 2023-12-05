import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3001,
        proxy: {
            "/api/auth": {
              target: "http://localhost:5000/",
              changeOrigin: true,
            },
            "/api/user": {
                target: "http://localhost:5000/",
                changeOrigin: true,
            },
            "/api/post": {
                target: "http://localhost:5000/",
                changeOrigin: true,
            },
            "/api/like": {
                target: "http://localhost:5000/",
                changeOrigin: true,
            },
            "/api/comment": {
                target: "http://localhost:5000/",
                changeOrigin: true,
            },
            "/api/friend": {
                target: "http://localhost:5000/",
                changeOrigin: true,
            },
            "/api/upload": {
                target: "http://localhost:5000/",
                changeOrigin: true,
            },
            "/api/delete": {
                target: "http://localhost:5000/",
                changeOrigin: true,
            },
            "/api/notification": {
                target: "http://localhost:5000/",
                changeOrigin: true,
            },
            "/api/postSaved": {
                target: "http://localhost:5000/",
                changeOrigin: true,
            },
            "/api/admin": {
                target: "http://localhost:5000/",
                changeOrigin: true,
            }
            // "/socket.io/": {
            //     target: "http://localhost:5000",
            //     changeOrigin: true,
            // }
        }
    }
})
