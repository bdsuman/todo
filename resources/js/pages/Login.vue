<template>
    <div
        class="max-w-sm mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-lg"
    >
        <form @submit.prevent="login" class="space-y-4">
            <div>
                <input
                    v-model="form.email"
                    type="email"
                    placeholder="Email"
                    class="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div>
                <input
                    v-model="form.password"
                    type="password"
                    placeholder="Password"
                    class="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <button
                type="submit"
                class="w-full cursor-pointer p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
                Login
            </button>
        </form>
        <p v-if="authStore.error" class="text-red-500 mt-4">
            {{ authStore.error }}
        </p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
const router = useRouter();

const authStore = useAuthStore();
const form = ref({
    email: "",
    password: "",
});

const login = () => {
    authStore.login(form.value);
    router.push("/");
};
</script>
