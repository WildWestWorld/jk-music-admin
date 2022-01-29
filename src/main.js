import { createApp } from 'vue';
import { Quasar} from 'quasar';
import router from './router';
import store from './store/index.js'
import './permission'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

import App from './App.vue';

const myApp = createApp(App)
myApp.use(router);
myApp.use(store);
myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here

})


myApp.mount('#app')



