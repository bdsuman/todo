import './bootstrap';
import "./axios";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import '../css/app.css'; // if you're using Tailwind or other styles

createApp(App).use(router).use(createPinia()).mount('#app');
