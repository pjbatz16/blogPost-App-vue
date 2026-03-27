import './assets/main.css'

import { createApp } from 'vue'
import { createPinia} from 'pinia'

import App from './App.vue'
import router from "./router"

import 'bootswatch/dist/solar/bootstrap.min.css' 
import 'bootstrap/dist/js/bootstrap.bundle.min.js' 
import 'notyf/notyf.min.css' 

// createApp(App).mount('#app')
const app = createApp(App);

app.use(createPinia())
app.use(router);

// App.vue to mount in <div id="app"></div> of index.html
app.mount("#app");
