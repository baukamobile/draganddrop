import axios from "axios";
const API_BPM_PROCESS = import.meta.env.VITE_API_PROCESS;
const API_BPM_ATTACHMENT = import.meta.env.VITE_API_ATTACHMENT;
const API_BPM_TASK =import.meta.env.VITE_API_BPM_TASK
const API_BPM_COMMENT = import.meta.env.VITE_API_BPM_COMMENT
const API_BPM_NOTIFICATION =import.meta.env.VITE_API_NOTIFICATION
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
export const getProcess = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_PROCESS}`)
    console.log('Процессы: ', response.data)
    return response.data
};

export const getAttachment = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_ATTACHMENT}`)
    return response.data
};
export const getBpmTask = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_TASK}`)
    console.log('Бизнес процесс задачи: ', response.data)
    return response.data
};
export const getBpmComment = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_COMMENT}`)
    return response.data
};
export const getBpmNotification = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_NOTIFICATION}`)
    return response.data
};

export const getBpmProcessElement = async()=>{
    const response = await axios.get(`${VITE_API_BPMN_PROCESS_ELEMENT}`)
    return response.data
}