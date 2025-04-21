<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-blue-700">My Boards</h2>
        <button @click="showCreateModal = true"
          class="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition">
          + Add Board
        </button>
      </div>

      <div v-if="loading">Loading boards...</div>
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Board
            v-for="board in boards"
            :key="board.id"
            :board="board"
            @edit="openEditModal"
            @delete="confirmDeleteBoard"
          />
        </div>
        <div v-if="boards.length === 0" class="mt-4 text-gray-600">No boards found.</div>
      </div>
    </div>

    <!-- Create Board Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4 text-blue-700">Create New Board</h3>
        <input
          type="text"
          v-model="newBoardName"
          placeholder="Board name"
          class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="flex justify-end gap-2">
          <button @click="showCreateModal = false" class="px-4 py-2 rounded-md border">Cancel</button>
          <button @click="createBoard"
            class="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition">
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editBoardTarget" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4 text-blue-700">Edit Board</h3>
        <input
          type="text"
          v-model="editBoardTarget.name"
          class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="flex justify-end gap-2">
          <button @click="editBoardTarget = null" class="px-4 py-2 rounded-md border">Cancel</button>
          <button @click="editBoardName"
            class="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition">
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteBoardTarget" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 shadow-lg w-full max-w-md text-center">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          Are you sure you want to delete "<span class="text-red-600">{{ deleteBoardTarget.name }}</span>"?
        </h3>
        <div class="flex justify-center gap-4">
          <button @click="deleteBoardTarget = null" class="px-4 py-2 rounded-md border">Cancel</button>
          <button @click="deleteBoard"
            class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import {
  getFirestore, collection, getDocs, addDoc,
  serverTimestamp, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import Board from "../components/Board.vue";
import BoardModel from "../models/Board.js";

export default {
  name: "BoardList",
  components: { Board },
  data() {
    return {
      boards: [],
      loading: true,
      newBoardName: "",
      showCreateModal: false,
      editBoardTarget: null,
      deleteBoardTarget: null
    };
  },
  async created() {
    await this.fetchBoards();
  },
  methods: {
    async fetchBoards() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated.");

        const db = getFirestore();
        const boardsRef = collection(db, "users", user.uid, "boards");
        const querySnapshot = await getDocs(boardsRef);

        this.boards = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return new BoardModel(doc.id, data.name, data.createdAt?.toDate?.() || new Date());
        });
      } catch (error) {
        console.error("Error fetching boards:", error);
      } finally {
        this.loading = false;
      }
    },
    async createBoard() {
      if (!this.newBoardName.trim()) return;
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const db = getFirestore();
        const boardsRef = collection(db, "users", user.uid, "boards");

        const docRef = await addDoc(boardsRef, {
          name: this.newBoardName.trim(),
          createdAt: serverTimestamp()
        });

        this.boards.push(new BoardModel(docRef.id, this.newBoardName.trim(), new Date()));
        this.newBoardName = "";
        this.showCreateModal = false;
      } catch (error) {
        console.error("Error creating board:", error);
      }
    },
    openEditModal(board) {
      this.editBoardTarget = { ...board };
    },
    async editBoardName() {
      try {
        const db = getFirestore();
        const boardRef = doc(db, "users", getAuth().currentUser.uid, "boards", this.editBoardTarget.id);
        await updateDoc(boardRef, { name: this.editBoardTarget.name });

        const index = this.boards.findIndex(b => b.id === this.editBoardTarget.id);
        if (index !== -1) this.boards[index].name = this.editBoardTarget.name;

        this.editBoardTarget = null;
      } catch (err) {
        console.error("Failed to update board:", err);
      }
    },
    confirmDeleteBoard(board) {
      this.deleteBoardTarget = board;
    },
    async deleteBoard() {
      try {
        const db = getFirestore();
        const boardRef = doc(db, "users", getAuth().currentUser.uid, "boards", this.deleteBoardTarget.id);
        await deleteDoc(boardRef);

        this.boards = this.boards.filter(b => b.id !== this.deleteBoardTarget.id);
        this.deleteBoardTarget = null;
      } catch (err) {
        console.error("Failed to delete board:", err);
      }
    }
  }
};
</script>
