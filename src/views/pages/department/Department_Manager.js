import {ref,reactive,onMounted} from "vue";
import { getUsers } from "@/api/users";

export function DepartmentManager (){
    const department = ref([]);
    

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
     
    };
}
