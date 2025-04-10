export default [
    {
        path: '/',
        component: () => import('@/layouts/DashboardLayout.vue'),
        children: [
            {           //Главная страница Доска 
                path: '/',
                name: 'Dashboard',
                component: () => import('@/views/pages/Projects/Project.vue'),
                // meta: { layout: 'default' }
            },
            {            //Отображает проекты
                path: '/dashboard/:projectId',
                name: 'ProjectTasks',
                component: () => import('@/components/dashboard/Index.vue'),
                // meta: { layout: 'default' }
            },
            {            //Отображение процессов
                path: '/Processes/:processId',
                name: 'Processtasks',
                component: () => import('@/views/pages/business_process/business_process.vue'),
                // meta: { layout: 'default' }
            },
            {            // Чаты
                path: '/pages/chat',
                name: 'Chat',
                component: ()=> import('@/views/pages/chat/Chat.vue'),
                // meta: { layout: 'default' }
            },
            {            //Календарь
                path: '/pages/calendar',
                name: 'calendar',
                component: ()=> import('@/views/pages/calendar/calendar.vue'),
                // meta: { layout: 'default' }
            },
            {                //Отделы
                path: '/pages/department',
                name: 'department',
                component: ()=> import('@/views/pages/department/department.vue'),
                // meta: { layout: 'default' }
            },
            {                // Новости
                path: '/pages/news',
                name: 'news',
                component: ()=> import('@/views/pages/news/news.vue'),
                // meta: { layout: 'default' }
            },
            {                // Бизнес процесс
                path: '/pages/business_process',
                name: 'business_process',
                component: ()=> import('@/views/pages/business_process/business_process.vue'),
                // meta: { layout: 'default' }
            },
            {               //Отчеты
                path: '/pages/reports',
                name: 'reports',
                component: ()=> import('@/views/pages/reports/reports.vue'),
                // meta: { layout: 'default' }
            },
            {                 // Старница Процессов 
                path: '/pages/business_process/Processes',
                name: 'processes',
                component: ()=> import('@/views/pages/business_process/Processes/Process.vue'),
                // meta: { layout: 'default' }
            },
            {               // Старница Мои задачи, отображается задачи где указан пользователь
                path: '/pages/my_tasks',
                name: 'my_tasks',
                component: ()=> import('@/views/pages/my_tasks/My_Tasks.vue'),
                // meta: { layout: 'default' }
            },
            {               //login/register
                path: '/login',
                name: 'newsignup',
                component: () => import('@/auth/login/signup.vue'),
                // meta: { layout: 'auth' }  // Используем AuthenticationLayout
            },
            {               //logout
                path: '/login',
                name: 'logout',
                component: () => import('@/auth/login/signup.vue'),
                // meta: { layout: 'auth' }  // Используем AuthenticationLayout
            },
            {               //profile
                path: '/login',
                name: 'profile',
                component: () => import('@/views/pages/profile/Profile.vue'),
                // meta: { layout: 'auth' }  // Используем AuthenticationLayout
            },

        ],
    },
    // {
    //     path: '/auth',
    //     name: 'Auth',
    //     component: () => import('@/layouts/AuthenticationLayout.vue'),
    //     children: [
    //         // {
    //         //     path: '/auth/login',
    //         //     name: 'Login',
    //         //     component: () => import('@/views/auth/Login.vue'),
    //         // },
    //         // {
    //         //     path: '/auth/register',
    //         //     name: 'Register',
    //         //     component: () => import('@/views/auth/Register.vue'),
    //         // },
    //         // {
    //         //     path: '/auth/forgot-password',
    //         //     name: 'ForgotPassword',
    //         //     component: () => import('@/views/auth/ForgotPassword.vue'),
    //         // },
    //         // {
    //         //     path: '/auth/reset-password',
    //         //     name: 'ResetPassword',
    //         //     component: () => import('@/views/auth/ResetPassword.vue'),
    //         // },
    //         // {
    //         //     path: '/auth/confirm-password',
    //         //     name: 'ConfirmPassword',
    //         //     component: () => import('@/views/auth/ConfirmPassword.vue'),
    //         // },
    //         // {
    //         //     path: '/auth/verify-email',
    //         //     name: 'VerifyEmail',
    //         //     component: () => import('@/views/auth/VerifyEmail.vue'),
    //         // },
    //     ],
    // },
]
