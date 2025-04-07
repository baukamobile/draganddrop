<script setup>
import { onMounted, onUnmounted } from 'vue';
// import { useRouter } from 'vue-router';
import {
    handleScroll,
    isDark,
    scrolling,
    toggleDarkMode,
    sidebarState,
} from '@/composables'
import Button from '@/components/Button.vue'
import Logo from '@/components/Logo.vue'
import Dropdown from '@/components/Dropdown.vue'
import DropdownLink from '@/components/DropdownLink.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth_user_store'
import { computed } from 'vue'
import { UserAuthManager } from '@/auth/login/userAuthManager';
const {
  email, password, first_name, last_name,
  selectedPosition, selectedDepartment,selectedCompany,
  phone_number, isLoading, position, department,company,
  login, logout, register, errorMessage, handleLoginClick
} = UserAuthManager();
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// const logout = () => {
//   authStore.logout()
// }
onMounted(() => {
    console.log(user.value)
    document.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    console.log(user.value,'Это должно показать объект пользователя или null')
    document.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <nav
        aria-label="secondary"
        :class="[
            'sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 transition-transform duration-500 dark:bg-dark-eval-1',
            {
                '-translate-y-full': scrolling.down,
                'translate-y-0': scrolling.up,
            },
        ]"
    >
        <div class="flex items-center gap-2">
            <nav class="navbar navbar-light bg-light">
  <!-- <form class="form-inline">
    <input class="form-control" type="search" icon="tabler--search" placeholder="Искать" aria-label="Search">
    
<button class="btn btn-outline-success" type="submit">Search</button> -->
  <!-- </form>  -->
</nav>
            <Button
                class="p-2 md:hidden"
                variant="secondary"
                @click="toggleDarkMode"
                v-slot="{ iconSizeClasses }"
                srText="Toggle dark mode"
            >
                <span
                    aria-hidden="true"
                    v-show="!isDark"
                    :class="['iconify tabler--moon', iconSizeClasses]"
                ></span>

                <span
                    aria-hidden="true"
                    v-show="isDark"
                    :class="['iconify tabler--sun', iconSizeClasses]"
                ></span>
            </Button>
        </div>
        

        <div class="flex items-center gap-2">
            
            <Button
                variant="secondary"
                @click="toggleDarkMode()"
                v-slot="{ iconSizeClasses }"
                class="hidden p-2 md:inline-flex"
                srText="Toggle dark mode"
            >
                <span
                    aria-hidden="true"
                    v-show="!isDark"
                    :class="['iconify tabler--moon', iconSizeClasses]"
                ></span>

                <span
                    aria-hidden="true"
                    v-show="isDark"
                    :class="['iconify tabler--sun', iconSizeClasses]"
                ></span>
            </Button>

            <!-- Dropdwon -->
            <Dropdown align="right" width="48">
                <template #trigger>
                    
                    <button
                        class="flex rounded-md border-2 border-transparent text-sm transition focus:outline-none focus:ring focus:ring-purple-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark-eval-1"
                    >
                        <div style="display: inline; color: white;"><img
                            class="h-8 w-8 rounded-md object-cover"
                            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                        />
                        
                        <!-- <p style="color: white;">Username</p> -->
                        <p style="color: white;">{{ user?.first_name || 'Гость' }}</p>
                    </div>
                    </button>
                </template>
                <template #content>
                    <!-- <DropdownLink :to="{ name: 'signup' }">Log Out</DropdownLink>
                    <DropdownLink :to="{ name: 'login' }">Log In</DropdownLink> -->
                    <DropdownLink :to="{ name: 'profile' }">Профиль</DropdownLink>
                    <DropdownLink @click="logout">Выйти</DropdownLink>
                      <!-- <DropdownLink :to="{ name: 'profile' }">Профиль</DropdownLink>  -->
                     <!-- <DropdownLink @click="logout">Выйти</DropdownLink>  -->
                </template>
            </Dropdown>
        </div>
    </nav>

    <!-- Mobile bottom bar -->
    <div
        :class="[
            'fixed inset-x-0 z-10 bottom-0 flex items-center justify-between bg-white px-4 py-4 transition-transform duration-500 dark:bg-dark-eval-1 sm:px-6 md:hidden',
            {
                'translate-y-full': scrolling.down,
                'translate-y-0': scrolling.up,
            },
        ]"
    >
        <Button
            icon="tabler--search"
            iconOnly
            variant="secondary"
            srText="Search"
        />

        <router-link :to="{ name: 'Dashboard' }">
            <Logo aria-hidden="true" class="h-10 w-10" />
            <span class="sr-only">Dashboard</span>
        </router-link>

        <Button
            icon="tabler--menu"
            variant="secondary"
            @click="sidebarState.isOpen = !sidebarState.isOpen"
            class="md:hidden"
            srText="toggle menu"
        />
    </div>
</template>
