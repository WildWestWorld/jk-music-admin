import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: transformAssetUrls
    }),
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    }),
    ElementPlus()
  ],
  server: {
    port: 3000,//启动端口

    proxy: {                 //设置代理，必须填
      '/api': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
        target: 'https://jk-music-1577517-1309371796.ap-shanghai.run.tcloudbase.com',     //代理的目标地址
        changeOrigin: true,              //是否设置同源，输入是的
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/gm': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
        target: 'http://pd.musicapp.migu.cn',     //代理的目标地址
        changeOrigin: true,              //是否设置同源，输入是的
        rewrite: (path) => path.replace(/^\/gm/, ''),
      },
      '/musicFile': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
        target: 'https://freetyst.nf.migu.cn',     //代理的目标地址
        changeOrigin: true,              //是否设置同源，输入是的
        rewrite: (path) => path.replace(/^\/musicFile/, ''),
      },
      '/test': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
        target: 'http://59.110.45.28/m/api',     //代理的目标地址
        changeOrigin: true,              //是否设置同源，输入是的
        rewrite: (path) => path.replace(/^\/test/, ''),
      },
      '/encodeMusicFile': {              //设置拦截器  拦截器格式   斜杠+拦截器名字，名字可以自己定
        target: 'http://218.205.239.34',     //代理的目标地址
        changeOrigin: true,              //是否设置同源，输入是的
        rewrite: (path) => path.replace(/^\/encodeMusicFile/, ''),
      },
    }
  }
});
