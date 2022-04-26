import { createApp } from 'vue';
import { Quasar,Notify,  LoadingBar} from 'quasar';
import router from './router';
import store from './store/index.js'
import './permission'
import ElementPlus from 'element-plus'
import './assets/css/popcss.css'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

import App from './App.vue';

const myApp = createApp(App)
myApp.use(router);
myApp.use(store);
myApp.use(Quasar, {
  plugins: {Notify,  LoadingBar}, // import Quasar plugins and add here
  config: {
    loadingBar: {
      color: 'light-blue-12',
      size: '15px',
      position: 'bottom'
    }
  }
})
myApp.use(ElementPlus, { zIndex: 9999 })


myApp.mount('#app')



