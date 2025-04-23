import { createApp } from 'vue'
import router from '@/router'
import App from '@/App.vue'
import Toast from 'vue-toastification'
import '@/assets/css/main.css'
import Antd from 'ant-design-vue';
import { AntDesignOutlined } from "@ant-design/icons-vue";
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import '@/views/pages/reports/css/palette.css';
import 'element-plus/dist/index.css'  // Import Element Plus styles
// import axios from "axios";
// // Функция для получения CSRF-токена из куков
// //Без этой функции console выдает 403 запрещает 
// function getCsrfToken() {
//     return document.cookie
//         .split('; ')
//         .find(row => row.startsWith('csrftoken='))
//         ?.split('=')[1];
// }

// // Добавляем CSRF-токен во все POST/PUT/PATCH/DELETE-запросы  dsfsdf
// axios.defaults.headers.common['X-CSRFToken'] = getCsrfToken();

// // Если используешь сессии, включи withCredentials
// axios.defaults.withCredentials = true;
const app = createApp(App)
app.use(createPinia()) // Подключаем Pinia
app.use(router);
app.use(ElementPlus)
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
