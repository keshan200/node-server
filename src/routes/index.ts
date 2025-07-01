import { Router } from "express";
import customerRouter from "./customer.routes";
import userRouter from "./user.route";


const rootRouter =  Router()
rootRouter.use("/customers",customerRouter)
rootRouter.use("/auth",userRouter)

export default rootRouter;