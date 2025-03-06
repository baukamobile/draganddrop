import { ref, onMounted } from "vue";


// import { getTask, getStatusTask, updateTaskStatus, addColumn,addTask } from "@/api/tasks";
import {getUsers} from "@/api/users";
import axios from "axios";
import { reactive } from "vue";
// const API_REGISTER = "http://127.0.0.1:8000/users/register";
const API_LOGIN = "http://127.0.0.1:8000/users/api/login";
// const API_LOGOUT = "http://127.0.0.1:8000/users/logout";
// const API_URL_USERS = "http://127.0.0.1:8000/users/users";


export function UserAuthManager(){
    const email = ref(''); //email ползователя
    const password = ref('');//пароль ползователя
    const isLoading = ref(false);//кнопка логин
    const errorMessage = ref('');//ошибки
    const login = async () =>{
        if (!email.value || !password.value){ //если ползователь не вводил данные
            errorMessage.value='Email и пароль обязательны!'
            return;
        }
        isLoading.value = true;
        errorMessage.value = '';
        try{
            const response = await axios.post(`${API_LOGIN}/`,{//импортируем путь к логин 
                email: email.value,
                password: password.value
            });
            const token = response.data.token;
            localStorage.setItem('authToken',token);//Сохраняем токен
            axios.defaults.headers.common['Authorization']='Bearer $token';
            return true; //Success
        }catch(error){
            errorMessage.value = error.response?.data?.message || "Ошибка авторизации";
        }finally{
            isLoading.value = false;
        }
    };   
    const logout = () => {
        localStorage.removeItem('authtoken');
        delete axios.defaults.headers.common['Authorization'];
    };
    return {email,password,isLoading,login,logout,errorMessage};
}
