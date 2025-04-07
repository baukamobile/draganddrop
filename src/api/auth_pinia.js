import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const login = async (email, password) => {
  const authStore = useAuthStore()
  
  const response = await axios.post('/users/api/login/', { email, password })  
  const token = response.data.jwt  

  authStore.setToken(token)  // Сохраняем токен
  
  // Теперь запрашиваем данные пользователя
  const userResponse = await axios.get('/users/api/me/', {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  authStore.setUser(userResponse.data)  // Сохраняем пользователя

  return userResponse.data
}
