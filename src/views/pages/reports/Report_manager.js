import {ref,reactive,onMounted} from "vue";
import { getTask } from "@/api/tasks";

export function ProjectsManager (){
    const projects = ref([]);
    

    onMounted(async () => {
        try {
            const projectsData = await getTask();
            if (projectsData) {
                projects.value = projectsData;
                console.log('Данные закгружены: ', projects.value);
            }
        } catch (e) {
            console.log('Error по загрузке данных: ', e);
        }
    });

    return {
        projects,
     
    };
}
