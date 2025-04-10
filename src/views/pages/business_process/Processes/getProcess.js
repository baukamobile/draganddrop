import {ref,reactive,onMounted} from "vue";
import { getProcess } from "@/api/bpm_data";

export function ProcessManager (){
    const processes = ref([]);
    

    onMounted(async () => {
        try {
            const processData = await getProcess();
            if (processData) {
                processes.value = processData;
                console.log('Данные закгружены: ', processes.value);
            }
        } catch (e) {
            console.log('Error по загрузке данных: ', e);
        }
    });

    return {
        processes,
     
    };
}