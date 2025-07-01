import { NextFunction ,Request,Response} from "express";
import mongoose from "mongoose";
import { APIError } from "../errors/APIerror";


export const errorHandler = (
     error:any,
     req:Request,
     res:Response,
     next:NextFunction
) => {

     if(error instanceof mongoose.Error){
        res.status(400).json({message:"not found"})
     }

     if(error instanceof APIError){
         res.status(Number(error.status)).json({message:"not found"})
     }

      res.status(500).json({message:"Internal Server Error"})

}