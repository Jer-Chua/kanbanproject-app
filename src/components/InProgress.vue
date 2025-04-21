<template>
  <div class="mb-4">
    <div class="flex justify-between items-center">
      <span class="text-lg">{{ column.name }}</span>
      <div class="flex space-x-2">
        <button @click="editTask" class="text-sm text-blue-600 hover:text-blue-800 transition">Edit</button>
        <button @click="confirmDelete" class="text-sm text-red-600 hover:text-red-800 transition">Delete</button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg p-6 shadow-lg w-80">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Delete Task</h2>
        <p class="text-gray-600 mb-6">Are you sure you want to delete "{{ column.name }}"?</p>
        <div class="flex justify-end space-x-4">
          <button @click="showModal = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
          <button @click="deleteConfirmed" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    column: Object,
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    editTask() {
      const newName = prompt("Enter new task name:", this.column.name);
      if (newName && newName.trim() !== "" && newName !== this.column.name) {
        this.$emit("editTask", { ...this.column, name: newName });
      }
    },
    confirmDelete() {
      this.showModal = true;
    },
    deleteConfirmed() {
      this.$emit("deleteTask", this.column);
      this.showModal = false;
    },
  },
};
</script>
