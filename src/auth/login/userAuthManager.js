import { ref, onMounted,reactive } from "vue";


// import { getTask, getStatusTask, updateTaskStatus, addColumn,addTask } from "@/api/tasks";
import {getUsers} from "@/api/users";
import axios from "axios";
// import { reactive } from "vue";
// const API_REGISTER = "http://127.0.0.1:8000/users/register";
const API_LOGIN = "http://127.0.0.1:8000/users/api/login";
const API_REGISTER = "http://127.0.0.1:8000/users/api/register"
const API_POSTIION = "http://127.0.0.1:8000/users/positions"
const API_DEPARTMENT = "http://127.0.0.1:8000/users/department"
// const API_LOGOUT = "http://127.0.0.1:8000/users/logout";
// const API_URL_USERS = "http://127.0.0.1:8000/users/users";


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
    const selectedPosition = ref(null);  // Одна выбранная должность
    const selectedDepartment = ref(null);

    const login = async () =>{
        if (!email.value || !password.value){ //если ползователь не вводил данные
            errorMessage.value='Email и пароль обязательны!'
            return;
        }
        isLoading.value = true; // флаг загрузки Блокируем кнопку, чтобы юзер не спамил клики
        errorMessage.value = ''; //очистка ошибки перед новым запросом
        try{
            const response = await axios.post(`${API_LOGIN}/`,{//импортируем путь к логин 
                email: email.value,
                password: password.value
            });
            const token = response.data.token;
            localStorage.setItem('authToken',token);//Сохраняем токен
            console.log('token', localStorage);
            // axios.defaults.headers.common['Authorization']='Bearer $token';
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true; //Success
        }catch(error){
            errorMessage.value = error.response?.data?.message || "Ошибка авторизации";
        }finally{
            isLoading.value = false; 
        }
    };
    //register logic
    const register = async () =>{
        if(!email.value || !first_name.value 
            || !last_name.value || !password.value || !phone_number.value || !selectedPosition.value || !selectedDepartment.value){
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
                department: selectedDepartment.value
            });
            return true;
        }catch(error){
            errorMessage.value = error.response?.data?.message || "Ошибка при регистрации";
            return false;
        }finally{
            isLoading.value = false;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
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

onMounted(async () => { //Код внутри выполняется, когда компонент уже вставлен в DOM.
    try {
        const [positionData, departmentData] = await Promise.allSettled([ //Мы используем Promise.allSettled() вместо Promise.all().
            //Разница: Promise.allSettled() не прерывает выполнение при ошибке, а возвращает массив с объектами-результатами каждого запроса.
            getPosition(),
            getDepartment(),
            // console.log('list position: ',getPosition()),
        ]);

        // if (taskData.status === "fulfilled") tasks.value = taskData.value;
        if (positionData.status === "fulfilled") position.value = positionData.value;
        if (departmentData.status === "fulfilled") department.value = departmentData.value;
        
        console.log("Данные загружены:", { position: positionData.value,department: departmentData.value});

    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
});
return {email,
    first_name,
    last_name,
    phone_number,
    password,
    isLoading,
    position,
    department,
    register,
    login,
    logout,
    errorMessage,
    selectedPosition,
    selectedDepartment,
    getDepartment,
    getPosition,
};}

