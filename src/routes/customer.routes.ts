import { Router } from "express";
import{saveCustomer, updateCustomer,getCustomer, deleteCustomer} from "../controllers/customer.controller"
import { deleteModel } from "mongoose";


const customerRouter = Router()

customerRouter.post("/save",saveCustomer)
customerRouter.put("/update/:id",updateCustomer)
customerRouter.get("/get", getCustomer)
customerRouter.delete("/delete/:id",deleteCustomer)


export default customerRouter;