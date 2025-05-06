<template>
  <div class="max-w-3xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6">Your Tasks</h2>

    <form @submit.prevent="createTask" class="mb-6 flex gap-4">
      <input
        v-model="newTask.title"
        placeholder="Task Title"
        class="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        v-model="newTask.body"
        placeholder="Task Description"
        class="w-full p-2 border border-gray-300 rounded-md"
      />
      <button
        type="submit"
        class="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
      >
        Add Task
      </button>
    </form>

    <ul class="space-y-4">
      <li
        v-for="task in authStore.tasks"
        :key="task.id"
        class="p-4 border border-gray-300 rounded-md flex items-center justify-between"
      >
        <div>
          <input
            type="checkbox"
            v-model="task.is_completed"
            @change="updateTask(task)"
            class="mr-4"
          />
          <span :class="{'line-through text-gray-400': task.is_completed}">{{ task.title }}</span>
          <p :class="{'line-through text-gray-400': task.is_completed}">{{ task.body }}</p>
        </div>
        <button
          @click="deleteTask(task.id)"
          class="ml-4 text-red-500 hover:text-red-600"
        >
          Delete
        </button>
      </li>
    </ul>

    <p v-if="authStore.error" class="text-red-500 mt-4">{{ authStore.error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const newTask = ref({ title: '', body: '' });

const createTask = () => {
  authStore.createTask(newTask.value);
  newTask.value = { title: '', body: '' };
};

const updateTask = (task) => {
  authStore.updateTask(task);
};

const deleteTask = (id) => {
  authStore.deleteTask(id);
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchTasks();
  }
});
</script>
