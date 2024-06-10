<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { remult } from 'remult';
import { Task } from './shared/Task.js';
import { TasksController } from './shared/TasksController.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


const taskRepo = remult.repo(Task);
const tasks = ref<Task[]>([]);


onMounted(() => 
  onUnmounted(
    taskRepo
    .liveQuery({
      // limit:10,
      orderBy: {createdAt: "asc"}
    })
    .subscribe(info =>{(tasks.value = info.applyChanges(tasks.value));
    })
  )
)

let isInputToggled = ref(false);

const toggleNewTaskInput = () => {  
  isInputToggled.value = !isInputToggled.value
}


/**
 * repo.liveQuery  is a realtime updated live query subscription for both
 * initial data fetching and subsequent state changes
 */

const newTaskTitle = ref("");
const addTask = async () => {
  try {
    await taskRepo.insert({title: newTaskTitle.value})
    newTaskTitle.value = "";
    toggleNewTaskInput();
  } catch (err: any) {
    alert((err as {message: string}).message)
  }
}

const saveTask = async(task:Task) => {
  try {
    await taskRepo.save(task);
  } catch (err:any) {
    alert((err as {message: string}).message)
  }
}

const deleteTask = async (task:Task) => {
  try {
    await taskRepo.delete(task);
    // tasks.value = tasks.value.filter( t => task !== t)
  } catch (err:any) {
    alert((err as {message: string}).message)
  }
}

async function setAllCompleted(completed: boolean) {
  await TasksController.setAllCompleted(completed)
}
/**
 * With Remult backend methods, argument types are compile-time checked.
 */


/**
 * Notes:
 * taskRepo is a Remult Repository object used to fetch and create Task entity objects
 * taskRepo.insert makes a POST request to the server
 * taskRepo.find makes a GET request to the server - can add filter and pagination
 * taskRepo.save makes a PUT request to the server. this updates the task to the server and returns the updated value
 * taskRepo.delete makes a DELETE request to the server.
 */

</script>

<template>
  <div class="app-container">
    <div class="header-container">
      <div style="margin-left: 5px;">
        <h1>To Do List</h1>
      </div>
      

      <button style="margin-right: 5px;" v-if="!isInputToggled" @click="toggleNewTaskInput">Add New Task</button>

      <div class="form-container" v-else>
      <form
      class="addtask-form"
      v-if="taskRepo.metadata.apiInsertAllowed()"
       @submit.prevent="addTask()">
        <input v-model="newTaskTitle" placeholder="What needs to be done today?" />
        <button>Add Task</button>
      </form>        
      </div>

      
    </div>
    
    <main>
    <table class="task-table">
      <tr>
      <th>Completed</th>
      <th>Title</th>
      <th>Update</th>
      <th v-if="taskRepo.metadata.apiDeleteAllowed()">Delete</th>        
      </tr>
      <tr v-for="task in tasks" :key="task.id">
        <th><input style="cursor: pointer;" type="checkbox" v-model="task.completed" @change="saveTask(task)"/></th>
        <th>
        <input type="text" class="title-input" v-model="task.title" />  
        </th>
        <th>
          <font-awesome-icon
          style="cursor: pointer;"
          :icon="['fas', 'pencil']" 
          @click="saveTask(task)" />
        </th>
        <th>        
          <font-awesome-icon
          style="cursor: pointer;"
           :icon="['fas', 'trash']"
            v-if="taskRepo.metadata.apiDeleteAllowed(task)"
            @click="deleteTask(task)" />
      </th>
      </tr>

    </table>      
    </main>
    <div class="setall-checkboxes-container">
      <button @click="setAllCompleted(true)">Set All as Completed</button>
      <button @click="setAllCompleted(false)">Set All as Not Completed</button>
    </div>
    
  </div>
</template>

<style>

table{
  width: -webkit-fill-available;
  caret-color: transparent;
  
}

table, th, td {
  border: 1px solid white;
  border-collapse: collapse;
  margin: 10px 10px;
}

th{
  padding-left: 5px;
  padding-right: 5px;
}

button {
        width: 100px;
        height: 35px;
        border: none;
        border-radius: 10%;
        align-self: center;
        background-color: rgb(248 166 128);
        cursor: pointer;
}
input[type="text"] {
        height: 25px;
        caret-color:auto;
}

.title-input {
  border: none;
  border-bottom: 1px solid black;
  background: none;
  color: white;
  cursor: pointer;
}

.title-input:focus-visible {
  outline: none;
  border-bottom: 1px solid white;
}


.header-container {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  flex-direction: column;
  caret-color: transparent;

  button {
    align-self: flex-end;
  }

    .form-container {
      align-self: flex-end;
      width: -webkit-fill-available;

      .addtask-form {
        display: flex;
        align-items: center;
        gap: 50px;
        margin: 0 10px;

        input {
          width: -webkit-fill-available;
        }

      }
    }
}

.setall-checkboxes-container {
  margin-top: 25px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-around;
      button {
        width: 160px;
        caret-color: transparent;
        cursor: pointer;
      }
}

</style>
