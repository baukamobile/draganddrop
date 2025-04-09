import axios from 'axios';

// Включаем передачу куков с запросами
axios.defaults.withCredentials = true;
const API_LOGIN = import.meta.env.VITE_API_LOGIN;
// Автоматически добавляем CSRF-токен в каждый запрос
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token'); //Получаем токен из локальный хранилщ
    //
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
},error => Promise.reject(error));
axios.interceptors.response.use(response => response, async error => {
    if (error.response?.status === 401){
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken){
            try {
                const response = await axios.post(`${API_LOGIN}`,{refresh: refreshToken});
                localStorage.setItem('access_token', response.data.access);
                error.config.headers['Authorization'] = `Bearer ${response.data.access}`;
                return axios(error.config);
            }catch(refreshError){
                console.error('Refresh не работает: ',refreshError);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
    }
    return Promise.reject(error);
})
   