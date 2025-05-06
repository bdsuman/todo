<template>
    <nav class="p-4 bg-gray-800 text-white flex justify-between items-center">
        <div>
            <router-link
                to="/login"
                v-if="!authStore.isAuthenticated"
                class="mr-4"
                >Login</router-link
            >
            <router-link
                to="/register"
                v-if="!authStore.isAuthenticated"
                class="mr-4"
                >Register</router-link
            >
            <router-link v-if="authStore.isAuthenticated" to="/" class="mr-4"
                >Tasks</router-link
            >
            <button
                v-if="authStore.isAuthenticated"
                @click="logout"
                class="text-red-500 hover:text-red-600 cursor-pointer"
            >
                Logout
            </button>
        </div>
    </nav>
    <router-view></router-view>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
const router = useRouter();

const authStore = useAuthStore();

const logout = () => {
    authStore.logout();
    router.push("/login");
};
</script>
