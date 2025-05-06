import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Tasks from '../pages/Tasks.vue';

const routes = [
    { path: '/', name: 'Tasks', component: Tasks },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Adjust to your actual auth mechanism

    if (!isAuthenticated && to.path !== '/login' && to.path !== '/register') {
        // Not logged in, redirect to login
        return next('/login');
    }

    if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
        // Logged in, redirect to home
        return next('/');
    }

    return next(); // Proceed normally
});

export default router;
