import axios from 'axios';

// Включаем передачу куков с запросами
axios.defaults.withCredentials = true;

// Автоматически добавляем CSRF-токен в каждый запрос
axios.interceptors.request.use((config) => {
    const csrftoken = document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

    if (csrftoken) {
        config.headers['X-CSRFToken'] = csrftoken;
    }

    return config;
});

export default axios;
