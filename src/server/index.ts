import express from 'express';
import { api } from './api.js';
import session from 'cookie-session'
import { auth } from './auth.js';
import helmet from "helmet"
import compression from "compression"

const app = express();
app.use(
    session({
        secret: process.env["SESSION_SECRET"] || "my secret"
    })
);

app.use(helmet())
app.use(compression())
app.use(auth);
app.use(api)
const frontendFiles = process.cwd() + "/dist";
app.use(express.static(frontendFiles));
app.get("/*", (_, res) => {
  res.sendFile(frontendFiles + "/index.html");
});

app.listen(process.env["PORT"] || 8080, () => console.log('Started Server on Port 8080'));

/**
 * the cookie-session middleware stores session data, digitally signed using the value of the secret property
 * in an httpOnly cookie sent by the browser to all subsequent API requests
 */