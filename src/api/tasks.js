import axios from "axios";
// import { A } from "dist/assets/index-CaVEL3aJ";


const API_URL = "http://127.0.0.1:8000/tasks/tasks";
const API_URL_USERS = "http://127.0.0.1:8000/users/users/";
// const API_URL_POSITION = "http://127.0.0.1:8000/users/positions/";

export const getTask = async()=>{
    const response = await axios.get(`${API_URL}/`)
    return response.data
};

const API_URL_STATUS = "http://127.0.0.1:8000/tasks/status";

export const getStatusTask = async()=>{
    const response = await axios.get(`${API_URL_STATUS}/`) 
    return response.data
};

export async function updateTaskStatus(taskId, statusId) {
    const response = await axios.patch(`${API_URL}/${taskId}/`, { status: statusId }); // 👈 Меняем `statusesId` на `status`
    return response.data;
}

export async function addTask(taskID){
    const response = await axios.post(`${API_URL}/`);
    return response.data
}

export async function addColumn(newStatus){
    const response = await axios.post(`${API_URL_STATUS}/`,newStatus);
    return response.data;
    // await axios.get(`${API_URL_USERS}/`)
}
export const getUsers = async()=>{
    const response = await axios.get(`${API_URL_USERS}`); 
    return response.data;
}
// export const getPostion = async()=>{
//     const response = await axios.get(`${API_URL_POSITION}`);
//     return response.data;
// }