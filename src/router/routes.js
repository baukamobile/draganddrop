export default [
    {
        path: '/',
        component: () => import('@/layouts/DashboardLayout.vue'),
        children: [
            {
                path: '/',
                name: 'Dashboard',
                component: () => import('@/views/pages/Projects/Project.vue'),
                meta: { layout: 'default' }
            },
            {
                path: '/dashboard/:projectId',
                name: 'ProjectTasks',
                component: () => import('@/components/dashboard/Index.vue'),
                meta: { layout: 'default' }
            },
            {
                path: '/pages/chat',
                name: 'Chat',
                component: ()=> import('@/views/pages/chat/Chat.vue'),
                meta: { layout: 'default' }
            },
            {
                path: '/pages/calendar',
                name: 'calendar',
                component: ()=> import('@/views/pages/calendar/calendar.vue'),
                meta: { layout: 'default' }
            },
            {
                path: '/pages/department',
                name: 'department',
                component: ()=> import('@/views/pages/department/department.vue'),
                meta: { layout: 'default' }
            },
            {
                path: '/pages/news',
                name: 'news',
                component: ()=> import('@/views/pages/news/news.vue'),
                meta: { layout: 'default' }
            },
            {
                path: '/pages/business_process',
                name: 'business_process',
                component: ()=> import('@/views/pages/business_process/business_process.vue'),
                meta: { layout: 'default' }
            },
            {
                path: '/pages/reports',
                name: 'reports',
                component: ()=> import('@/views/pages/reports/reports.vue'),
                meta: { layout: 'default' }
            },
            {
                path: '/pages/business_process',
                name: 'business_process',
                component: ()=> import('@/views/pages/business_process/business_process.vue'),
                meta: { layout: 'default' }
            },
            {
                path: '/pages/my_tasks',
                name: 'my_tasks',
                component: ()=> import('@/views/pages/my_tasks/My_Tasks.vue'),
                meta: { layout: 'default' }
            },
            {
                path: '/login',
                name: 'newsignup',
                component: () => import('@/auth/login/signup.vue'),
                meta: { layout: 'auth' }  // Используем AuthenticationLayout
            },
            {
                path: '/login',
                name: 'profile',
                component: () => import('@/auth/login/signup.vue'),
                meta: { layout: 'auth' }  // Используем AuthenticationLayout
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
