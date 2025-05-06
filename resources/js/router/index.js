import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Tasks from "@/pages/Tasks.vue";

const routes = [
    { path: "/", name: "Tasks", component: Tasks },
    { path: "/login", name: "Login", component: Login },
    { path: "/register", name: "Register", component: Register },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem("token");

    if (!isAuthenticated && to.path !== "/login" && to.path !== "/register") {
        return next("/login");
    }

    if (isAuthenticated && (to.path === "/login" || to.path === "/register")) {
        return next("/");
    }

    return next(); 
});

export default router;
