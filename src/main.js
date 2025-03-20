import { createApp } from 'vue'
import router from '@/router'
import App from '@/App.vue'
import Toast from 'vue-toastification'
import '@/assets/css/main.css'
import Antd from 'ant-design-vue';
import { AntDesignOutlined } from "@ant-design/icons-vue";
import { createPinia } from 'pinia';
// import axios from "axios";
// // Функция для получения CSRF-токена из куков
// function getCsrfToken() {
//     return document.cookie
//         .split('; ')
//         .find(row => row.startsWith('csrftoken='))
//         ?.split('=')[1];
// }

// // Добавляем CSRF-токен во все POST/PUT/PATCH/DELETE-запросы
// axios.defaults.headers.common['X-CSRFToken'] = getCsrfToken();

// // Если используешь сессии, включи withCredentials
// axios.defaults.withCredentials = true;
const app = createApp(App)
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(Antd);
app.component("AntDesignOutlined", AntDesignOutlined);
app.use(Toast, {
    hideProgressBar: true,
    closeOnClick: false,
    closeButton: false,
    icon: false,
    timeout: false,
    transition: 'Vue-Toastification__fade',
});
app.mount('#app')
