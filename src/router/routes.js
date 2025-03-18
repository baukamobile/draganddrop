export default [
    {
        path: '/',
        component: () => import('@/layouts/DashboardLayout.vue'),
        children: [
            {
                path: '/',
                name: 'Dashboard',
                component: () => import('@/views/pages/Projects/Project.vue'),
            },
            {
                path: '/dashboard/:projectId',
                name: 'ProjectTasks',
                component: () => import('@/components/dashboard/Index.vue'),
            },
            {
                path: '/pages/chat',
                name: 'Chat',
                component: ()=> import('@/views/pages/chat/Chat.vue')
            },
            {
                path: '/pages/calendar',
                name: 'calendar',
                component: ()=> import('@/views/pages/calendar/calendar.vue')
            },
            {
                path: '/pages/department',
                name: 'department',
                component: ()=> import('@/views/pages/department/department.vue')
            },
            {
                path: '/pages/news',
                name: 'news',
                component: ()=> import('@/views/pages/news/news.vue')
            },
            {
                path: '/pages/business_process',
                name: 'business_process',
                component: ()=> import('@/views/pages/business_process/business_process.vue')
            },
            {
                path: '/pages/reports',
                name: 'reports',
                component: ()=> import('@/views/pages/reports/reports.vue')
            },
            {
                path: '/pages/business_process',
                name: 'business_process',
                component: ()=> import('@/views/pages/business_process/business_process.vue')
            },
            // {
            //     path: '/login',
            //     name: 'login',
            //     component: ()=> import('@/auth/login/LoginPage.vue')
            // },
            // {
            //     path: '/auth',
            //     name: 'signup',
            //     component: ()=> import('@/auth/login/RegisterPage.vue')
            // },
            {
                path: '/login',
                name: 'newsignup',
                component: () => import('@/auth/login/signup.vue')
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
