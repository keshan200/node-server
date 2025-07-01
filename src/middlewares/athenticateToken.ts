import { NextFunction ,Request,Response} from "express";
import { APIError } from "../errors/APIerror";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import e from "cors";



export const authenticateToken = (req:Request,res:Response,next:NextFunction) => {
       
    try{
       
        const authHeader = req.headers["authorization"]
        const token =  authHeader && authHeader.split(" ")[1]
        
        if(!token){
            throw new APIError(401,"cant Accesse token!!")
        }

        jwt.verify(
            
            token,
            process.env.ACCESS_SCRETE_TOKEN!,

            (error,decoded) => {

               if(error){
                       
                if(error instanceof TokenExpiredError){
                     throw new APIError(401,"Accesse token expired!")
                }else if (error instanceof JsonWebTokenError){
                     throw new APIError(401,"invalid Token!!")
                }else{
                     throw new APIError(401,"cant verifying token")
                }
               }


               if(!decoded || typeof decoded == "string"){
                 throw new APIError(401,"Payload Error")
               }
               
               next()

         } 

        )

    }catch(error:any){
          next(error)
    }



}