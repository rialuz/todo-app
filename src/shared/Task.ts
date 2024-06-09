import { Entity, Fields, Validators, Allow } from "remult";

@Entity("tasks", {
    allowApiCrud: Allow.authenticated
})
export class Task {
    @Fields.cuid()
    id = ""

    @Fields.string<Task>({
        validate: (task) => {
            if(!task.title) throw "Title is required."
            if(task.title.length < 3) throw "Title is too short."
            
        }
    })
    title = ""

    @Fields.boolean()
    completed = false

    @Fields.createdAt()
    createdAt?: Date
}

/**
 * Notes: 
 * With Remult, I can use my ts models to generate db schemas. 
 * This entity class will be used asa modle class for client and server
 * 
 * set allowApiCrud to true to allow all CRUD for this entity
 * 
 * 
 * Validation can be placed within the entity class and Remult will
 * run the validation logic on both the frontend and relevant API requests
 * 
 * Ex: Since we indicated the title field is required, if we try to add
 * a new empty title, we will get an error popup on the frontend.
 * If we try to create a new empty title from the server, an http error
 * is returned with the validation error text included in the response body
 */