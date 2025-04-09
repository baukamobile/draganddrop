// import axios from 'axios'
// import { useAuthStore } from '@/stores/auth'
// const API_LOGOUT = import.meta.env.VITE_API_LOGIN;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// export const login = async (email, password) => {
//   const authStore = useAuthStore()
  
//   const response = await axios.post(`${API_LOGIN}`, { email, password })  
//   const token = response.data.jwt  

//   authStore.setToken(token)  // Сохраняем токен
  
//   // Теперь запрашиваем данные пользователя
//   const userResponse = await axios.get(`${API_BASE_URL}/users/api/me/`, {
//     headers: { Authorization: `Bearer ${token}` }
//   })
  
//   authStore.setUser(userResponse.data)  // Сохраняем пользователя

//   return userResponse.data
// }
