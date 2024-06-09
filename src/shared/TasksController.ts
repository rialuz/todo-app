import { Allow, BackendMethod, remult } from "remult"
import { Task } from "./Task.js"

export class TasksController {
  @BackendMethod({ allowed: Allow.authenticated })
  static async setAllCompleted(completed: boolean) {
    const taskRepo = remult.repo(Task) //initialize repo

    for (const task of await taskRepo.find()) { //get all from repo and update completed field
      await taskRepo.save({ ...task, completed })
    }
  }
}

/**
 * This class will be used to expose an API endpoint for setAllCompleted requests
 * and run the same logic on ther server instead o the client
 * to improve performance
 * The @BackendMethod annotation allows Remult to expose
 * the method as an API endpoint
 * 
 * The server implementation interacts directly with the database
 * 
 * 
 */