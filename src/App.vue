<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { remult } from 'remult';
import { Task } from './shared/Task';
import { TasksController } from './shared/TasksController'

const taskRepo = remult.repo(Task);
const tasks = ref<Task[]>([]);
onMounted(() => 
  onUnmounted(
    taskRepo
    .liveQuery({
      limit:20,
      orderBy: {createdAt: "asc"}
    })
    .subscribe(info => (tasks.value = info.applyChanges(tasks.value)))
  )
)

/**
 * repo.liveQuery  is a realtime updated live query subscription for both
 * initial data fetching and subsequent state changes
 */

const newTaskTitle = ref("");
const addTask = async () => {
  try {
    const newTask = await taskRepo.insert({title: newTaskTitle.value})
    // tasks.value.push(newTask);
    newTaskTitle.value = ""
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
  <div>
    <h1>Tasks</h1>

    <main>
      <form
      v-if="taskRepo.metadata.apiInsertAllowed()"
       @submit.prevent="addTask()">
        <input v-model="newTaskTitle" placeholder="What needs to be done today?" />
        <button>Add New Task</button>
      </form>

      <div v-for="task in tasks">
        <input type="checkbox" v-model="task.completed" @change="saveTask(task)"/>
        <input v-model="task.title" />
        <button @click="saveTask(task)">Save Task</button>
        <button
        v-if="taskRepo.metadata.apiDeleteAllowed(task)"
        @click="deleteTask(task)">Delete Task</button>
        <!-- <p>{{ task.title }}</p> -->
      </div>
      <div>
  <button @click="setAllCompleted(true)">Set All as Completed</button>
  <button @click="setAllCompleted(false)">Set All as Uncompleted</button>
</div>
    </main>
  </div>
</template>

<style scoped>

</style>
