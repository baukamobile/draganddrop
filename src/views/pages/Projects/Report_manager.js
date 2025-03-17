import {ref,reactive,onMounted} from "vue";
import { getProjects } from "@/api/tasks";

export function ProjectsManager (){
    const projects = ref([]);
    

    onMounted(async () => {
        try {
            const projectsData = await getProjects();
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
