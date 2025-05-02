import { ref, onMounted,reactive } from "vue";


// import { getTask, getStatusTask, updateTaskStatus, addColumn,addTask } from "@/api/tasks";
import {getUsers} from "@/api/users";
import axios from "axios";
// import { useAuthStore } from '@/stores/auth'
// import { reactive } from "vue";
// const API_REGISTER = "http://127.0.0.1:8000/users/register";
const API_LOGIN = import.meta.env.VITE_API_LOGIN;
const API_LOGOUT = import.meta.env.VITE_API_LOGOUT;
const API_REGISTER = import.meta.env.VITE_API_REGISTER;
const API_POSTIION = import.meta.env.VITE_API_POSITION;
const API_DEPARTMENT = import.meta.env.VITE_API_DEPARTMENT;
const API_COMPANY = import.meta.env.VITE_API_COMPANY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_LOGOUT = "http://127.0.0.1:8000/users/logout";
// const API_URL_USERS = "http://127.0.0.1:8000/users/users";

// const authStore = useAuthStore()
export function UserAuthManager(){
    const email = ref(''); //email ползователя
    const password = ref('');//пароль ползователя
    const isLoading = ref(false);//кнопка логин
    const errorMessage = ref('');//ошибки
    const first_name = ref('');//name
    const last_name = ref(''); 
    const phone_number = ref('');
    const position = ref([]); //должность
    const department = ref([]);//отдел сотрудника
    const company = ref([]);
    const selectedPosition = ref(null);  // Одна выбранная должность
    const selectedDepartment = ref(null);
    const selectedCompany = ref(null);
    const image = ref(null);
// //Сохраняем токен после авторизации
// const extract_login_token = async (email, password)=>{
//     const response = await axios.post(`${API_BASE_URL}/users/api/login/`,{ 
//       //<-- надо менять url из .env
//       email,password
//     });
//     localStorage.setItem('access_token', response.data.access);
//     localStorage.setItem('refresh_token', response.data.refresh);
//     return response.data;
//   };
    const login = async () => {
        if (!email.value || !password.value) {  
            errorMessage.value = 'Email и пароль обязательны!';
            return;
        }
        isLoading.value = true;
        errorMessage.value = '';
        try {
            const response = await axios.post(`${API_LOGIN}`, {
                email: email.value,
                password: password.value
            });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            // console.log('Ответ сервера:', response.data);
            // const token = response.data.jwt;
            console.log('Access Token Ответ сервера:', JSON.stringify(response.data.access, null, 2));
            const token = response.data.jwt || response.data.access || response.data.token; 
            if(!token){
                console.error('Токен не получен!');
                return;
            }

            localStorage.setItem('authToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
            console.log('Токен сохранён:', token);
            console.log('Отправляем запрос с заголовками:', {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            });
            // Теперь загружаем пользователя
            const userResponse = await axios.get(`${API_BASE_URL}/users/api/me/`, {

                // headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log('Полученные данные пользователя:', userResponse.data);
    
            localStorage.setItem('user', JSON.stringify(userResponse.data));
            console.log('Token jwt',token)
            console.log('Отправляем запрос с заголовком:', {
                Authorization: `Bearer ${token}`
            });
            return true; 
        } catch (error) {
            errorMessage.value = error.response?.data?.message || "Ошибка авторизации";
        } finally {
            isLoading.value = false;
        }
    };    
    //register logic
    const register = async () =>{
        if(!email.value || !first_name.value 
            || !last_name.value || !password.value || !phone_number.value || !selectedPosition.value || !selectedDepartment.value || !selectedCompany.value){
            errorMessage.value="Пожалуйста заполните все поля";
            return false;
        }
        
        
        isLoading.value = true;
        errorMessage.value = '';
        try{
            const response = await axios.post(`${API_REGISTER}/`,{
                email: email.value,
                first_name: first_name.value,
                last_name: last_name.value,
                password: password.value,
                phone_number: phone_number.value,
                position: selectedPosition.value,
                department: selectedDepartment.value,
                company: selectedCompany.value
            });
            return true;
        }catch(error){
            errorMessage.value = error.response?.data?.message || "Ошибка при регистрации";
            return false;
        }finally{
            isLoading.value = false;
        }
    };

    const logout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            if (refresh) {
              console.log('Получение refresh token: ', refresh);
              await axios.post(`${API_LOGOUT}`, { refresh });
            }
          }catch (error){
            console.log('Ошибка с logout: ', error);
        }

        // localStorage.removeItem('authToken');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
        delete axios.defaults.headers.common['Authorization'];
        window.location.reload(); // Перезагрузим страницу, чтобы сбросить состояние
    };
    //Получаем список должностей
const getPosition = async () => {
    try {
        const response = await axios.get(`${API_POSTIION}/`);
        console.log('Загрука список должностей', response.data)
        // positions.value = response.data;
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении проекта:`, error);
        return null;
    }
};
 const getDepartment = async () => {
    try {
        const response = await axios.get(`${API_DEPARTMENT}/`);
        console.log('Загрука список отделов')
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении проекта:`, error);
        return null;
    }
};
const getCompany = async()=>{
    try{
        const response = await axios.get(`${API_COMPANY}/`);
        return response.data;
    }catch(e){
        console.log('Ошибка загрузки данные о компании');
        return e;
    }
}
const handleLoginClick = async () => {
    const success = await handleLogin();
    if (success) {
        router.push({ name: 'profile' }); // Переход на Dashboard после логина
    } else {
        errorMessage.value = "Ошибка входа. Проверьте данные.";
    }
};




onMounted(async () => { //Код внутри выполняется, когда компонент уже вставлен в DOM.
//     const userDataFromStorage = localStorage.getItem('user');
//     if (userDataFromStorage) {
//         try {
//           const parsedUserData = JSON.parse(userDataFromStorage);
            
//       // Обновляем данные профиля данными из API
//       userData.value = {
//         email: parsedUserData.email || userData.value.email,
//         first_name: parsedUserData.first_name || userData.value.first_name,
//         last_name: parsedUserData.last_name || userData.value.last_name,
//         phone_number: parsedUserData.phone_number || userData.value.phone_number,
//         position: parsedUserData.position || userData.value.position,
//         department: parsedUserData.department || userData.value.department,
//         company: parsedUserData.company || userData.value.company,
//         image: parsedUserData.image || userData.value.image
//       };
      
//       // Обновляем также данные для редактирования
//       editData.value = {...userData.value};
//     } catch (e) {
//       console.error('Ошибка при разборе данных пользователя:', e);
//     }
//   }

    try {
        const [positionData, departmentData,companyData] = await Promise.allSettled([ //Мы используем Promise.allSettled() вместо Promise.all().
            //Разница: Promise.allSettled() не прерывает выполнение при ошибке, а возвращает массив с объектами-результатами каждого запроса.
            getPosition(),
            getDepartment(),
            getCompany(),
            // console.log('list position: ',getPosition()),
        ]);

        // if (taskData.status === "fulfilled") tasks.value = taskData.value;
        if (positionData.status === "fulfilled") position.value = positionData.value;
        if (departmentData.status === "fulfilled") department.value = departmentData.value;
        if (companyData.status == "fulfilled") company.value=companyData.value;
        
        console.log("Данные загружены:", { position: positionData.value,department: departmentData.value,company: companyData.value});

    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
});
return {email,
    first_name,
    last_name,
    phone_number,
    image,
    password,
    isLoading,
    position,
    company,
    department,
    handleLoginClick,
    register,
    login,
    logout,
    errorMessage,
    selectedPosition,
    selectedDepartment,
    selectedCompany,
    getDepartment,
    getCompany,
    getPosition,
};}

