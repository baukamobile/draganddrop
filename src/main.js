import { createApp } from 'vue'
import router from '@/router'
import App from '@/App.vue'
import Toast from 'vue-toastification'
import '@/assets/css/main.css'
import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd';



const app = createApp(App)
app.use(router);
// app.use(Antd);
app.use(Toast, {
    hideProgressBar: true,
    closeOnClick: false,
    closeButton: false,
    icon: false,
    timeout: false,
    transition: 'Vue-Toastification__fade',
});
app.mount('#app')
