import express, { Router} from "express";
import type { UserInfo } from 'remult';

const validUsers: UserInfo[] = [
    {
        id: "1",
        name: "Luz",
        roles: ["admin"]
    },
    {
        id: "2",
        name: "Wil", 
    }
];

export const auth = Router();

auth.use(express.json())

auth.post("/api/signin", (req,res) => {
    // const user = validUsers.find(user => user.name === req.body.username);
    // if(user){
        req.session!["user"] = req.body.username
        // res.json(user)
})

auth.post("/api/signout", (req, res) => {
    req.session!["user"] = null;
    res.json("Signed out.")
})

auth.get("/api/currentUser", (req,res) => res.json(req.session!["user"]))

/**
 * the simple "/signin" endpoint accepts a request body
 * with a username property, looks it up in a 
 * predefined dictionary of valid users and if found,
 * sets the user's information to the user property of the
 * requests session
 * 
 * the "/signout" endpoint clears the user value from the current session
 * 
 * the "/currentUser" endpoint extracts the value of the current user from the session and 
 * returns it in the API response
 */