import axios from "axios";
// import { A } from "dist/assets/index-CaVEL3aJ";


const API_URL_TASK = "http://127.0.0.1:8000/tasks/tasks";
// const API_URL_USERS = "http://127.0.0.1:8000/users/users/";
const API_URL_PROJECTS = "http://127.0.0.1:8000/tasks/projects/";
const API_URL = "http://127.0.0.1:8000/";  
export const getDataApi = async (first_url, second_url) => {
    const response = await axios.get(`${API_URL}${first_url}/${second_url}`); 
    return response.data;
};
export const getTask = async()=>{
    const response = await axios.get(`${API_URL_TASK}/`)
    return response.data
};

const API_URL_STATUS = "http://127.0.0.1:8000/tasks/status";

export const getStatusTask = async()=>{
    const response = await axios.get(`${API_URL_STATUS}/`) 
    return response.data
};

export async function updateTaskStatus(taskId, statusId) {
    const response = await axios.patch(`${API_URL_TASK}/${taskId}/`, { status: statusId }); // 👈 Меняем `statusesId` на `status`
    return response.data;
}
export async function addTask(taskData) {
    // try {
    //     const response = await axios.post(`${API_URL_TASK}/`, taskData, {
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     });
    //     return response.data;
    // } catch (error) {
    //     console.error("Ошибка при отправке задачи:", error.response ? error.response.data : error.message);
    // }
    const response = await axios.post(`${API_URL_TASK}/`,taskData);
    return response.data;
}



export async function addColumn(newStatus){
    const response = await axios.post(`${API_URL_STATUS}/`,newStatus);
    return response.data;
    // await axios.get(`${API_URL_USERS}/`)
}
