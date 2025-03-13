import { ref, reactive, onMounted } from "vue";
import axios from "axios";

const API_URL_NEWS = import.meta.env.VITE_API_URL_NEWS;

export const getNews = async () => { //Получаем данные через API
    try {
        const response = await axios.get(`${API_URL_NEWS}/`);
        console.log('Загрузка новостей');
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении новостей:`, error);
        return null;
    }
};


export function NewsManager() { 
    const news = ref([]);
    const NewsObject = reactive({
        title: "",
        content: "",
        created_by: "",
        created_at: "",
        picture: "",
        documents: "",
        tags: ""
    });

    onMounted(async () => { 
        try {
            const newsData = await getNews();
            
            
            if (newsData) {
                news.value = newsData;
                console.log("Новости загружены:", news.value);
            }

        } catch (error) {
            console.error('Ошибка загрузки news', error);
        }
    });

    return {
        news,
        
        NewsObject,
    };
}
