<template>
  <div class="p-4">
    <h2 class="text-3xl font-bold mb-6">Board Detail</h2>

    <div v-if="loading" class="text-center text-gray-500">Loading columns...</div>

    <div v-else class="flex space-x-6">
      <!-- To Do Column -->
      <div class="flex-1 bg-gray-100 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-black">To Do</h3>
          <button @click="addTask('toDo')" class="w-auto p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Add Task
          </button>

        </div>
        <div v-for="column in columns.toDo" :key="column.id" class="bg-white rounded-lg shadow-md mb-4 p-4">
          <ToDo :column="column" @editTask="handleEditTask" @deleteTask="handleDeleteTask" />
          <div class="flex justify-between mt-4">
            <button v-if="column.category !== 'To Do'" @click="moveColumn(column, 'left')"
              class="text-blue-500 hover:text-blue-700">
              ←
            </button>
            <button v-if="column.category !== 'Done'" @click="moveColumn(column, 'right')"
              class="text-blue-500 hover:text-blue-700">
              In Progress >
            </button>
          </div>
        </div>

      </div>

      <!-- In Progress Column -->
      <div class="flex-1 bg-gray-100 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-black">In Progress</h3>
          <button @click="addTask('inProgress')" class="w-auto p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Add Task
          </button>

        </div>
        <div v-for="column in columns.inProgress" :key="column.id" class="bg-white rounded-lg shadow-md mb-4 p-4">
          <InProgress :column="column" @editTask="handleEditTask" @deleteTask="handleDeleteTask" />
          <div class="flex justify-between mt-4">
            <button v-if="column.category !== 'To Do'" @click="moveColumn(column, 'left')"
              class="text-blue-500 hover:text-blue-700">
              < To Do
            </button>
            <button v-if="column.category !== 'Done'" @click="moveColumn(column, 'right')"
              class="text-blue-500 hover:text-blue-700">
              Done >
            </button>
          </div>
        </div>

      </div>

      <!-- Done Column -->
      <div class="flex-1 bg-gray-100 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-black">Done</h3>
          <button @click="addTask('done')" class="w-auto p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Add Task
          </button>

        </div>
        <div v-for="column in columns.done" :key="column.id" class="bg-white rounded-lg shadow-md mb-4 p-4">
          <Done :column="column" @editTask="handleEditTask" @deleteTask="handleDeleteTask" />
          <div class="flex justify-between mt-4">
            <button v-if="column.category !== 'To Do'" @click="moveColumn(column, 'left')"
              class="text-blue-500 hover:text-blue-700">
              < In Progress
            </button>
            <button v-if="column.category !== 'Done'" @click="moveColumn(column, 'right')"
              class="text-blue-500 hover:text-blue-700">
              →
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { collection, doc, updateDoc, addDoc, onSnapshot, deleteDoc} from "firebase/firestore";
import { db, auth } from "../services/firebaseService";
import { onAuthStateChanged } from "firebase/auth";

import ToDo from "../components/ToDo.vue";
import InProgress from "../components/InProgress.vue";
import Done from "../components/Done.vue";


export default {
  name: "BoardDetail",
  components: { ToDo, InProgress, Done },
  setup() {
    const route = useRoute();
    const boardId = ref(route.params.id); // Extract boardId from URL
    const user = ref(null); // To store the currently authenticated user
    const userReady = ref(false); // Flag to indicate when user is authenticated
    const loading = ref(true);
    const columns = ref({ toDo: [], inProgress: [], done: [] });

    // Listen for changes in the user's authentication state
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user.value = currentUser; // Set user data once authenticated
        console.log("Authenticated User ID:", user.value.uid);
        userReady.value = true; // User is authenticated, set userReady to true
      } else {
        console.log("User is not authenticated");
        userReady.value = false;
      }
    });

    // Watch for user readiness and fetch columns once authenticated
    watch(userReady, async (newValue) => {
      if (newValue && boardId.value) {
        await fetchColumns().then(async () => {
          await fetchBoard();
        })
      }
    });

    // Fetch columns and listen for real-time updates based on the boardId
    async function fetchColumns() {
      try {
        const columnsRef = collection(
          db,
          "users",
          user.value.uid, // Use the authenticated user's UID
          "boards",
          boardId.value, // Use the boardId from the route
          "columns"
        );

        // Real-time listener for changes in the columns
        onSnapshot(columnsRef, (snapshot) => {
          const toDo = [];
          const inProgress = [];
          const done = [];

          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const column = { ...data, id: docSnap.id }; // Create column object

            switch (column.category) {
              case "To Do":
                toDo.push(column);
                break;
              case "In Progress":
                inProgress.push(column);
                break;
              case "Done":
                done.push(column);
                break;
              default:
                break;
            }
          });

          // Update columns in real-time
          columns.value = {
            toDo: toDo.sort((a, b) => a.position - b.position),
            inProgress: inProgress.sort((a, b) => a.position - b.position),
            done: done.sort((a, b) => a.position - b.position)
          };
        });


      } catch (err) {
        console.error("Error fetching columns:", err);
      } finally {
        loading.value = false;
      }
    }

    // Handle column move logic
    function moveColumn(column, direction) {
      const currentCategory = column.category;
      let newCategory = currentCategory;
      let newPosition = column.position;
      if (direction === "left" && currentCategory !== "To Do") {
        newCategory = currentCategory === "Done" ? "In Progress" : "To Do";
        newPosition = getNewPosition(newCategory);
      } else if (direction === "right" && currentCategory !== "Done") {
        newCategory = currentCategory === "To Do" ? "In Progress" : "Done";
        newPosition = getNewPosition(newCategory);
      }

      column.category = newCategory;
      column.position = newPosition;

      updateColumnInFirestore(column, newCategory, newPosition);
    }

    function getNewPosition(category) {
      switch (category) {
        case "To Do": return columns.value.toDo.length;
        case "In Progress": return columns.value.inProgress.length;
        case "Done": return columns.value.done.length;
        default: return 0;
      }
    }

    // Update the column in Firestore
    async function updateColumnInFirestore(column, newCategory, newPosition) {
      try {
        const columnRef = doc(db, "users", user.value.uid, "boards", boardId.value, "columns", column.id);
        await updateDoc(columnRef, {
          category: newCategory,
          position: newPosition
        });
        console.log(`Updated column ${column.name} to category ${newCategory} and position ${newPosition}`);
      } catch (err) {
        console.error("Error updating column: ", err);
      }
    }

    // Add a task to the specified category
    async function addTask(category) {
      const taskName = prompt("Enter task name:");
      if (taskName) {
        const columnRef = collection(
          db,
          "users",
          user.value.uid,
          "boards",
          boardId.value,
          "columns"
        );

        await addDoc(columnRef, {
          name: taskName,
          category: category === "toDo" ? "To Do" : category === "inProgress" ? "In Progress" : "Done",
          position: getNewPosition(category),
        });
      }
    }

    async function handleEditTask(updatedColumn) {
  try {
    const columnRef = doc(db, "users", user.value.uid, "boards", boardId.value, "columns", updatedColumn.id);
    await updateDoc(columnRef, {
      name: updatedColumn.name,
    });
    console.log("Task updated:", updatedColumn.name);
  } catch (err) {
    console.error("Error updating task:", err);
  }
}

async function handleDeleteTask(columnToDelete) {
  try {
    const columnRef = doc(db, "users", user.value.uid, "boards", boardId.value, "columns", columnToDelete.id);
    await deleteDoc(columnRef);
    console.log("Task deleted:", columnToDelete.name);
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

   


    return {
      columns,
      loading,
      boardId,
      user,
      moveColumn,
      addTask,
      handleEditTask,
  handleDeleteTask
    };
  }
};
</script>
