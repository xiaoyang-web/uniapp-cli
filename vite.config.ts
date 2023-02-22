import type { ConfigEnv } from 'vite';
import { loadEnv, defineConfig } from 'vite';
import { resolve } from 'path';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  // 环境变量配置项
  const CONFIG_PATH = resolve(__dirname, 'env');
  const { VITE_REQUEST_BASE_URL } = loadEnv(mode, CONFIG_PATH);
  console.log(VITE_REQUEST_BASE_URL);

  return defineConfig({
    envDir: resolve(__dirname, 'env'),
    plugins: [uni()],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, 'src')
        }
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/global.scss";'
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8080,
      proxy: {
        '/api': {
          target: 'https://xxx.com/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    }
  });
};
