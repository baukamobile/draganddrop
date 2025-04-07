import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // Состояние пользователя
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('authToken') || null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  // Логин
  const login = async (email, password) => {
    if (!email || !password) {
      errorMessage.value = 'Email и пароль обязательны!'
      return false
    }
    isLoading.value = true
    errorMessage.value = ''
    
    try {
      const response = await axios.post('/users/api/login/', { email, password })
      token.value = response.data.token
      localStorage.setItem('authToken', token.value)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      // Загружаем данные пользователя
      const userResponse = await axios.get('/users/api/me/', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      
      user.value = userResponse.data
      localStorage.setItem('user', JSON.stringify(userResponse.data))

      return true
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Ошибка авторизации'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Регистрация
  const register = async (formData) => {
    isLoading.value = true
    errorMessage.value = ''
    
    try {
      const response = await axios.post('/users/api/register/', formData)
      return true
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Ошибка при регистрации'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Выход
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    window.location.reload()
  }

  return {
    user,
    token,
    isLoading,
    errorMessage,
    login,
    register,
    logout
  }
})
