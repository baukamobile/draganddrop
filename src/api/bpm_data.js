import axios from "axios";
const API_BPM_PROCESS = import.meta.env.VITE_API_PROCESS;
const API_BPM_DASHBOARD_WIDGET = import.meta.env.VITE_API_DASHBOARD;
const API_BPM_DASHBOARDS = import.meta.env.API_BPM_DASHBOARDS;
const API_BPM_ATTACHMENT = import.meta.env.VITE_API_ATTACHMENT;
const API_BPM_AUTO_TASK_RULE = import.meta.env.VITE_API_AUTO_TASK_RULE
const API_BPM_PROCESS_TEMPLATE = import.meta.env.VITE_API_PROCESS_TEMPLATE
const API_BPM_PROCESS_STAGE_TEMPLATE =import.meta.env.VITE_API_PROCESS_STAGE_TEMPLATE
const API_BPM_PROCESS_STAGE =import.meta.env.VITE_API_PROCESS_STAGE
const API_BPM_TASK =import.meta.env.VITE_API_BPM_TASK
const API_BPM_TASK_STAGE_HISTORY = import.meta.env.VITE_API_TASK_STAGE_HISTORY
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
export const getDashboardWidget = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_DASHBOARD_WIDGET}`)
    return response.data
};
export const getDashboard = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_DASHBOARDS}`)
    return response.data
};
export const getAttachment = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_ATTACHMENT}`)
    return response.data
};
export const getAutoTaskRole = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_AUTO_TASK_RULE}`)
    return response.data
};
export const getProcessTemplate = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_PROCESS_TEMPLATE}`)
    return response.data
};
export const getProcessStageTemplate = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_PROCESS_STAGE_TEMPLATE}`)
    return response.data
};
export const getProcessState = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_PROCESS_STAGE}`)
    return response.data
};
export const getBpmTask = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_TASK}`)
    return response.data
};
export const getBpmTaskStageHistory = async()=>{   //Получаем задачи
    const response = await axios.get(`${API_BPM_TASK_STAGE_HISTORY}`)
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