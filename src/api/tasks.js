import axios from "axios";
const API_URL_TASK = import.meta.env.VITE_API_URL;
const API_URL_PROJECTS = import.meta.env.VITE_API_URL_PROJECTS;
const API_URL = import.meta.env.VITE_API_BASE_URL;  
axios.interceptors.request.use(config => {
    // Добавляем интерцептор для всех запросов Axios
    const token = localStorage.getItem('access_token'); // Получаем токен из локального хранилища
    if(token){  // Если токен есть, добавляем его в заголовки запроса
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    //Если всё нормально — config просто передается дальше в axios
    return config; 
    // Если произошла ошибка при обработке запроса, отклоняем промис
},error => Promise.reject(error)); 
//Promise.reject(error), что передает ошибку дальше по цепочке .catch()



export const getDataApi = async (first_url, second_url) => {
    try{
    const response = await axios.get(`${API_URL}${first_url}${second_url}`); 
    return response.data;
    }catch(error){
        console.log('Проблема загрузки данных: ',error);
        throw error;
    }
};
export const getTask = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_URL_TASK}/`)
    // alert('Задачи загружены')
    return response.data
};
export const getProjects = async()=>{  //Получаем проектов
    const response = await axios.get(`${API_URL_PROJECTS}/`);
    return response.data;
}
const API_URL_STATUS = import.meta.env.VITE_API_URL_STATUS;

export const getStatusTask = async()=>{         //Получаем статус
    const response = await axios.get(`${API_URL_STATUS}/`) 
    console.log('status:', response.data)
    return response.data
};

export async function updateTaskStatus(taskId, statusId) {  //Обновление статусов
    const response = await axios.patch(`${API_URL_TASK}/${taskId}/`, { status: statusId }); // 👈 Меняем `statusesId` на `status`
    return response.data;
}
export async function addTask(taskData) {           //Добавляем Задачи
    const response = await axios.post(`${API_URL_TASK}/`,taskData);
    return response.data;
}


export async function addColumn(newStatus){             //Добавляем Колонку статусов
    const response = await axios.post(`${API_URL_STATUS}/`,newStatus);
    return response.data;
    // await axios.get(`${API_URL_USERS}/`)
}
