<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Данные пользователя
const userData = ref({
  email: 'user@example.com',
  first_name: 'Иван',
  last_name: 'Петров',
  phone_number: '+7 (999) 123-45-67',
  position: 'Менеджер проектов',
  department: 'Разработка ПО',
  company: 'GuideJet TI',
  avatar: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D'
});

// Копия данных для редактирования
const editData = ref({...userData.value});

// Состояние редактирования
const isEditing = ref(false);

// Функция обновления профиля
const updateProfile = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Обновление данных пользователя
    userData.value = {...editData.value};
    
    successMessage.value = 'Профиль успешно обновлен';
    isEditing.value = false;
    
    // Скрыть сообщение об успехе через 3 секунды
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = 'Ошибка при обновлении профиля';
    console.error('Update profile error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Отмена редактирования
const cancelEdit = () => {
  editData.value = {...userData.value};
  isEditing.value = false;
};

// Включение режима редактирования
const startEditing = () => {
  isEditing.value = true;
};

// Выход из аккаунта
const logout = () => {
  // Логика выхода
  router.push({ name: 'Login' });
};
</script>

<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <h1>Личный профиль</h1>
        <div class="profile-actions">
          <button v-if="!isEditing" class="edit-button" @click="startEditing">Редактировать</button>
          <button v-if="!isEditing" class="logout-button" @click="logout">Выйти</button>
        </div>
      </div>
      
      <!-- Сообщения -->
      <p v-if="errorMessage" class="errormes">{{ errorMessage }}</p>
      <p v-if="successMessage" class="successmes">{{ successMessage }}</p>
      
      <div class="profile-content">
        <!-- Аватар пользователя -->
        <div class="avatar-container">
          <img :src="userData.avatar" alt="Аватар пользователя" class="avatar" />
          <div class="user-name">{{ userData.first_name }} {{ userData.last_name }}</div>
          <div class="user-position">{{ userData.position }}</div>
        </div>
        
        <!-- Информация о пользователе -->
        <div class="user-info">
          <form @submit.prevent="updateProfile">
            <!-- Режим просмотра -->
            <div v-if="!isEditing" class="info-section">
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{ userData.email }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Имя:</div>
                <div class="info-value">{{ userData.first_name }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Фамилия:</div>
                <div class="info-value">{{ userData.last_name }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Телефон:</div>
                <div class="info-value">{{ userData.phone_number }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Должность:</div>
                <div class="info-value">{{ userData.position }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Отдел:</div>
                <div class="info-value">{{ userData.department }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Организация:</div>
                <div class="info-value">{{ userData.company }}</div>
              </div>
            </div>
            
            <!-- Режим редактирования -->
            <div v-else class="edit-section">
              <div class="form-group">
                <label>Email:</label>
                <input type="email" v-model="editData.email" />
              </div>
              <div class="form-group">
                <label>Имя:</label>
                <input type="text" v-model="editData.first_name" />
              </div>
              <div class="form-group">
                <label>Фамилия:</label>
                <input type="text" v-model="editData.last_name" />
              </div>
              <div class="form-group">
                <label>Телефон:</label>
                <input type="text" v-model="editData.phone_number" inputmode="numeric" />
              </div>
              <div class="form-group">
                <label>Должность:</label>
                <input type="text" v-model="editData.position" />
              </div>
              <div class="form-group">
                <label>Отдел:</label>
                <input type="text" v-model="editData.department" />
              </div>
              <div class="form-group">
                <label>Организация:</label>
                <input type="text" v-model="editData.company" />
              </div>
              
              <div class="form-buttons">
                <button type="submit" class="save-button" :disabled="isLoading">
                  {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
                <button type="button" class="cancel-button" @click="cancelEdit">Отмена</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #b6b6cb;
}

.profile-card {
  width: 100%;
  max-width: 800px;
  background-color: rgb(141, 166, 206);
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(161, 158, 158, 0.1);
  padding: 30px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.profile-header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.profile-actions {
  display: flex;
  gap: 10px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

@media (min-width: 768px) {
  .profile-content {
    flex-direction: row;
  }
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
  border: 5px solid #f5f7fb;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #000000;
}

.user-position {
  font-size: 14px;
  color: #000000;
}

.user-info {
  flex: 1;
}

.info-section, .edit-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.info-label {
  width: 120px;
  font-weight: bold;
  color: #555;
}

.info-value {
  flex: 1;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
  color: #000000;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #000000;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.edit-button {
  background-color: #4a90e2;
  color: white;
}

.logout-button {
  background-color: #f5f5f5;
  color: #333;
}

.save-button {
  background-color: #4CAF50;
  color: white;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
}

button:hover {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.errormes {
  background-color: #ffecec;
  color: #f44336;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.successmes {
  background-color: #e7f7e7;
  color: #4CAF50;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}
</style>