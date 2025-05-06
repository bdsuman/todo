import { defineStore } from "pinia";
import axios from "axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token: localStorage.getItem("token") || null,
        tasks: [],
        isAuthenticated: !!localStorage.getItem("token"),
        error: null,
        success: null,
    }),
    actions: {
        clearMessages() {
            setTimeout(() => {
                this.error = null;
                this.success = null;
            }, 5000);
        },

        async login(form) {
            try {
                await axios.get("/sanctum/csrf-cookie");
                const res = await axios.post("/api/login", form);
                this.user = res.data.user;
                this.token = res.data.token;
                this.isAuthenticated = true;
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.token);
                await router.push("/");
            } catch (err) {
                this.error = "Invalid credentials";
            } finally {
                this.clearMessages();
            }
        },

        async logout() {
            try {
                await axios.post("/api/logout");
                this.user = null;
                this.token = null;
                this.isAuthenticated = false;
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                this.success = "Logged out successfully";
                await router.push("/login");
            } catch (err) {
                this.error = "Logout failed";
            } finally {
                this.clearMessages();
            }
        },

        async register(form) {
            try {
                await axios.get("/sanctum/csrf-cookie");
                await axios.post("/api/register", form);
                this.success = "Registration successful";
                this.error = null;
                await router.push("/login");
            } catch (err) {
                this.error = "Registration failed";
            } finally {
                this.clearMessages();
            }
        },

        async fetchTasks() {
            if (this.isAuthenticated) {
                try {
                    const res = await axios.get("/api/tasks");
                    this.tasks = res.data;
                } catch (err) {
                    this.error = "Failed to load tasks";
                    this.clearMessages();
                }
            }
        },

        async createTask(newTask) {
            try {
                const res = await axios.post("/api/tasks", newTask);
                this.tasks.unshift(res.data);
                this.success = "Task created successfully";
            } catch (err) {
                this.error = "Task creation failed";
            } finally {
                this.clearMessages();
            }
        },

        async updateTask(task) {
            try {
                const response = await axios.put(`/api/tasks/${task.id}`, task);
                const index = this.tasks.findIndex(
                    (t) => String(t.id) === String(task.id)
                );
                if (index !== -1) {
                    this.tasks.splice(index, 1, response.data);
                }
                this.success = "Task updated successfully";
            } catch (err) {
                this.error = "Task update failed";
            } finally {
                this.clearMessages();
            }
        },

        async deleteTask(id) {
            try {
                await axios.delete(`/api/tasks/${id}`);
                this.tasks = this.tasks.filter((task) => task.id !== id);
                this.success = "Task deleted successfully";
            } catch (err) {
                this.error = "Task deletion failed";
            } finally {
                this.clearMessages();
            }
        },
    },
});
