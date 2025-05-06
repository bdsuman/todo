<template>
    <div
        class="max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-lg"
    >
        <h2 class="text-2xl font-bold mb-6">Your Tasks</h2>
        <form @submit.prevent="createTask" class="mb-6 flex gap-4">
            <input
                v-model="newTask.title"
                placeholder="Task Title"
                class="w-full p-2 border border-gray-300 rounded-md"
                required
            />
            <input
                v-model="newTask.body"
                placeholder="Task Description"
                class="w-full p-2 border border-gray-300 rounded-md"
                required
            />
            <button
                type="submit"
                class="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
            >
                Add Task
            </button>
        </form>
        <hr class="border-gray-300 my-4" />
        <p v-if="authStore.success" class="text-green-500 mt-4">
            {{ authStore.success }}
        </p>

        <ul class="space-y-4">
            <li
                v-for="task in authStore.tasks"
                :key="task.id"
                class="p-4 border border-gray-300 rounded-md flex flex-col gap-2"
            >
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-2">
                        <input
                            type="checkbox"
                            v-model="task.is_completed"
                            @change="updateTask(task)"
                        />
                        <template v-if="editingTaskId === task.id">
                            <input
                                v-model="editTask.title"
                                class="w-full p-1 border border-gray-300 rounded"
                            />
                        </template>
                        <template v-else>
                            <span
                                :class="{
                                    'line-through text-gray-400':
                                        task.is_completed,
                                }"
                                >{{ task.title }}</span
                            >
                        </template>
                    </div>
                    <div class="flex items-center gap-2">
                        <button
                            v-if="editingTaskId !== task.id"
                            @click="startEdit(task)"
                            class="text-blue-500 hover:text-blue-600 cursor-pointer"
                        >
                            Edit
                        </button>
                        <template v-else>
                            <button
                                @click="saveEdit(task)"
                                class="text-green-500 hover:text-green-600 cursor-pointer"
                            >
                                Save
                            </button>
                            <button
                                @click="cancelEdit"
                                class="text-gray-500 hover:text-gray-600 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </template>
                        <button
                            @click="deleteTask(task.id)"
                            class="text-red-500 hover:text-red-600 cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <div>
                    <template v-if="editingTaskId === task.id">
                        <textarea
                            v-model="editTask.body"
                            class="w-full mt-2 p-1 border border-gray-300 rounded"
                        ></textarea>
                    </template>
                    <template v-else>
                        <p
                            :class="{
                                'line-through text-gray-400': task.is_completed,
                            }"
                        >
                            {{ task.body }}
                        </p>
                    </template>
                </div>
            </li>
        </ul>

        <p v-if="authStore.error" class="text-red-500 mt-4">
            {{ authStore.error }}
        </p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const newTask = ref({ title: "", body: "" });

const editingTaskId = ref(null);
const editTask = ref({ title: "", body: "" });

const createTask = () => {
    authStore.createTask(newTask.value);
    newTask.value = { title: "", body: "" };
};

const updateTask = (task) => {
    authStore.updateTask(task);
};

const deleteTask = (id) => {
    authStore.deleteTask(id);
};

const startEdit = (task) => {
    editingTaskId.value = task.id;
    editTask.value = { title: task.title, body: task.body };
};

const cancelEdit = () => {
    editingTaskId.value = null;
    editTask.value = { title: "", body: "" };
};

const saveEdit = (task) => {
    const updatedTask = { ...task, ...editTask.value };
    authStore.updateTask(updatedTask);
    cancelEdit();
};

onMounted(() => {
    if (authStore.isAuthenticated) {
        authStore.fetchTasks();
    }
});
</script>
