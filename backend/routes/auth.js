import express from "express"
const router = express.Router();

//import controller
import {login,signup} from "../controller/Auth.js"

//routes

router.post("/login",login);

router.post("/signup",signup)

export default router;