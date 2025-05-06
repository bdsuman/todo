// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        tasks: [],
        isAuthenticated: !!localStorage.getItem('token'),
        error: null
    }),
    actions: {
        async login(form) {
            try {
                await axios.get('/sanctum/csrf-cookie');
                const res = await axios.post('/api/login', form);
                this.user = res.data.user;
                this.token = res.data.token;
                this.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('token', res.data.token);
            } catch (err) {
                this.error = 'Invalid credentials';
            }
        },
        async logout() {
            try {
                await axios.post('/api/logout');
                this.user = null;
                this.token = null;
                this.isAuthenticated = false;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } catch (err) {
                this.error = 'Logout failed';
            }
        },
        async register(form) {
            try {
                await axios.get('/sanctum/csrf-cookie');
                await axios.post('/api/register', form);
                this.error = null; // Reset error after successful registration
            } catch (err) {
                this.error = 'Registration failed';
            }
        },
        async fetchTasks() {
            if (this.isAuthenticated) {
                try {
                    const res = await axios.get('/api/tasks');
                    this.tasks = res.data;
                } catch (err) {
                    this.error = 'Failed to load tasks';
                }
            }
        },
        async createTask(newTask) {
            try {
                const res = await axios.post('/api/tasks', newTask);
                this.tasks.unshift(res.data);
            } catch (err) {
                this.error = 'Task creation failed';
            }
        },
        async updateTask(task) {
            try {
                await axios.put(`/api/tasks/${task.id}`, task);
            } catch (err) {
                this.error = 'Failed to update task';
            }
        },
        async deleteTask(id) {
            try {
                await axios.delete(`/api/tasks/${id}`);
                this.tasks = this.tasks.filter(task => task.id !== id);
            } catch (err) {
                this.error = 'Task deletion failed';
            }
        }
    }
});
