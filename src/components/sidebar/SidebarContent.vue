<script setup>
import { useRouter } from 'vue-router'
import PerfrectScrollbar from '@/components/PerfectScrollbar.vue'
import SidebarLink from '@/components/sidebar/SidebarLink.vue'
// import SidebarCollapsible from '@/components/sidebar/SidebarCollapsible.vue'
// import SidebarCollapsibleItem from '@/components/sidebar/SidebarCollapsibleItem.vue'
// import { IconBrandLine } from '@tabler/icons-vue';

const router = useRouter()

const isCurrentRoute = (routeName) => {
    return useRouter().currentRoute.value.name == routeName
}

const isCurrentPath = (path) => {
    return useRouter().currentRoute.value.path.startsWith(path)
}
</script>

<template>
    <PerfrectScrollbar
        tagname="nav"
        aria-label="main"
        class="relative flex max-h-full flex-1 flex-col gap-4 px-3"
    >
        <SidebarLink class="Dashboard-sidebar"
            title="Доска"
            :to="{ name: 'Dashboard' }"
            :active="isCurrentRoute('Dashboard')"
            icon="tabler--layout-dashboard"
        />
        <SidebarLink class="Chat-sidebar"
            title="Чаты"
            :to="{ name: 'Chat' }"
            :active="isCurrentRoute('Chat')"
            icon="tabler--brand-hipchat"
        />
        <SidebarLink class="Calendar-sidebar"
            title="Календарь"
            :to="{ name: 'calendar' }"
            :active="isCurrentRoute('calendar')"
            icon="tabler--calendar-week"
        />
        <SidebarLink class="My_Tasks-sidebar"
            title="Мои Задачи"
            :to="{ name: 'my_tasks' }"
            :active="isCurrentRoute('my_tasks')"
            icon="tabler--clipboard-list"
        />
        <SidebarLink class="Business_process-sidebar"
            title="Бизнес Процессы"
            :to="{ name: 'business_process' }"
            :active="isCurrentRoute('business_process')"
            icon="tabler--progress-check"
        />
        <SidebarLink class="News-sidebar"
            title="Лента Новостей"
        :to="{ name: 'news' }"
            :active="isCurrentRoute('news')"
            icon="tabler--news"
        />
        <SidebarLink class="Reports-sidebar"
            title="Отчеты"
            :to="{ name: 'reports' }"
            :active="isCurrentRoute('reports')"
            icon="tabler--report"
        />
        
        <SidebarLink class="Department-sidebar"
            title="Отдел"
     :to="{ name: 'department' }"
            :active="isCurrentRoute('department')"
            icon="tabler--building"
        />
        
        <!-- <SidebarLink class="Logout-sidebar"
            title="Выйти"
            :to="{ name: 'auth' }"
            :active="isCurrentRoute('logout')"
            icon="tabler--logout"
        /> -->

    </PerfrectScrollbar>
</template>
