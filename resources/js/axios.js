import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers = {
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
    "X-Value": true,
};

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const currentRoute = router.currentRoute.value.fullPath;
        const authStore = useAuthStore();

        if (status === 401 && currentRoute !== "/login") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            authStore.user = null;
            authStore.token = null;
            authStore.isAuthenticated = false;
            await router.push("/login");
        }

        if (status === 404) {
            await router.push("/login");
        }

        return Promise.reject(error);
    }
);

export default axios;
