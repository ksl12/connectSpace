import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default ({ mode }) => {
    // Load .env environment variables
    const env = loadEnv(mode, process.cwd())
    return defineConfig({
        plugins: [react()],
        server: {
            port: 3001,
            proxy: {
                "/api/auth": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                },
                "/api/user": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                },
                "/api/post": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                },
                "/api/like": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                },
                "/api/comment": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                },
                "/api/friend": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                },
                "/api/image": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                },
                "/api/delete": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                },
                "/api/notification": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                },
                "/api/postSaved": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                },
                "/api/admin": {
                    target: env.VITE_SERVER_URL,
                    changeOrigin: true,
                }
            }
        }
    })
}
// export default defineConfig({
//     plugins: [react()],
//     server: {
//         port: 3001,
//         proxy: {
//             "/api/auth": {
//               target: env.VITE_SERVER_URL,
//               changeOrigin: true,
//             },
//             "/api/user": {
//                 target: env.VITE_SERVER_URL,
//                 changeOrigin: true,
//             },
//             "/api/post": {
//                 target: env.VITE_SERVER_URL,
//                 changeOrigin: true,
//             },
//             "/api/like": {
//                 target: env.VITE_SERVER_URL,
//                 changeOrigin: true,
//             },
//             "/api/comment": {
//                 target: env.VITE_SERVER_URL,
//                 changeOrigin: true,
//             },
//             "/api/friend": {
//                 target: env.VITE_SERVER_URL,
//                 changeOrigin: true,
//             },
//             "/api/upload": {
//                 target: env.VITE_SERVER_URL,
//                 changeOrigin: true,
//             },
//             "/api/delete": {
//                 target: env.VITE_SERVER_URL,
//                 changeOrigin: true,
//             },
//             "/api/notification": {
//                 target: env.VITE_SERVER_URL,
//                 changeOrigin: true,
//             },
//             "/api/postSaved": {
//                 target: env.VITE_SERVER_URL,
//                 changeOrigin: true,
//             },
//             "/api/admin": {
//                 target: env.VITE_SERVER_URL,
//                 changeOrigin: true,
//             }
//         }
//     }
// })
