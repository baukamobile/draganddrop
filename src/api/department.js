import axios from "axios";


const API_URL = "http://127.0.0.1:8000/tasks/tasks";


export const getTask = async()=>{
    const response = await axios.get(`${API_URL}/`)
    return response.data
};

const API_URL_STATUS = "http://127.0.0.1:8000/tasks/status";

export const getStatusTask = async()=>{
    const response = await axios.get(`${API_URL_STATUS}/`) 
    return response.data
};
// export async function updateTaskStatus(id, statusId) {
//     const response = await axios.patch(`${API_URL_STATUS}/${id}/`, { status: statusId });
// }
// export const up

export async function updateTaskStatus(taskId, statusId) {
    const response = await axios.patch(`${API_URL}/${taskId}/`, { status: statusId }); // 👈 Меняем `statusesId` на `status`
    return response.data;
}