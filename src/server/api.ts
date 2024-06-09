import { TasksController } from "../shared/TasksController.js";
import { Task } from "../shared/Task.js";
import { remultExpress } from "remult/remult-express";
import { createPostgresDataProvider } from "remult/postgres";


// const DATABASE_URL = "postgres://postgres:postgres@host:5432/database"
const DATABASE_URL = process.env["DATABASE_URL"];

export const api = remultExpress({
    entities: [Task],
    admin: true,
    controllers: [TasksController], //register our controllers
    getUser: req => req.session!["user"],
    dataProvider: DATABASE_URL
    ? createPostgresDataProvider({ connectionString: DATABASE_URL })
    : undefined
});

/**
 * This is how we register the Task entity
 * By setting admin to true, we can access the Admin UI that remult offers
 * which allows us to perform CRUD opertions, view their relations via a Diagram,
 * and ensures secure management with the same validations and authorizations as the app.
 * 
 * -- Taken from remult.dev
 * CRUD Operations: Directly create, update, and delete tasks through the Admin UI.
 * Entity Diagram: Visualize relationships between entities for better data structure understanding.
 * Security: Operations are secure, adhering to application-defined rules.
 * 
 * once an authentication flow is established, integrating it
 * with Remult in the backend is as simple as providing
 * Remult with a getUser function that extracts a 
 * UserInfo object from a Request
 * 
 * Now the application supports signing in and out with all 
 * access restricted to signed in users only
 */