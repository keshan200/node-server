import { Router } from "express";
import{login, refreshToken, signup} from "../controllers/auth.Controller"
import { deleteModel } from "mongoose";


const userRouter = Router()

userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.post("/refresh-token",refreshToken)

export default userRouter;