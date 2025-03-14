import {ref,reactive,onMounted} from "vue";
import { getUsers } from "@/api/users";

export function DepartmentManager (){
    const department = ref([]);
    const DepartmentObject = reactive({
        first_name: "",
        last_name: "",
        position_name: "",
        image: "",
        department_name: "",
        telegram_id: "",
        phone_number: null, 
    });

    onMounted(async () => {
        try {
            const departmentData = await getUsers();
            if (departmentData) {
                department.value = departmentData;
                console.log('Данные закгружены: ', department.value);
            }
        } catch (e) {
            console.log('Error по загрузке данных: ', e);
        }
    });

    return {
        department,
        DepartmentObject,
    };
}
