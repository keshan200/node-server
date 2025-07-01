import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { NextFunction ,Request,Response} from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel";
import { APIError } from "../errors/APIerror";
import type { JwtPayload } from "jsonwebtoken";
import { json } from "stream/consumers";


const create_access_token = (userID:string) =>{

        return jwt.sign(
            {userID},
            process.env.ACCESS_SCRETE_TOKEN!, //(! - aniwareyen token eka yawann ona)
            {expiresIn:'10m'}
        )

} 


const create_refresh_token = (userID:string) =>{

        return jwt.sign(
            {userID},
            process.env.REFRESH_SCRETE_TOKEN!, //(! - aniwareyen token eka yawann ona)
            {expiresIn:'3d'}
        )

} 




export const signup = async (req:Request,res:Response,next:NextFunction)=>{
   
    try{

         const {email,password,name} = req.body

         const hashedPass =  bcrypt.hash(password,10)

         const user = new UserModel({
            email,name,
            password:hashedPass
         })


         const userWithoutPass = {
            _id : user._id,
            name:user.name,
            email :user.email
         }

        await user.save()
        res.status(201).json(userWithoutPass)
         
    }catch(error:any){
       next(error)
    }
}





export const login  =  async (req:Request,res:Response,next:NextFunction)=>{

   try{
      
      const {email,password} = req.body
      const user = await UserModel.findOne({email})


      if(!user){
        throw new APIError (404,"user not found")
      }

     const isMatch =  bcrypt.compare(password,user.password)

     const accessToken = create_access_token(user._id.toString())
     const refreshToken =  create_refresh_token(user._id.toString()) 
 
     const isProd = process.env.NODE_ENV === "production" 

     res.cookie("refreshToken",refreshToken,{
          
           httpOnly:true,
           secure:isProd,
           maxAge : 3 * 24 * 60 * 60 * 1000,
           path : "/api/auth/refresh-token"

     }) 


     const userWithoutPass = {
        id : user._id,
        name:user.name,
        email:user.email,
        accessToken
     }
     
     res.status(200).json(userWithoutPass)

   }catch(err:any){
    next(err)
   }

}







export const refreshToken = async (req:Request,res:Response,next:NextFunction)=>{
   
    try{

      const token =  req.cookies?.refreshToken


              
     if(!token){
        throw new APIError(401,"refresh token missing")
     }

        jwt.verify( 
            token,
            process.env.REFRESH_SCRETE_TOKEN!,

           async  (error: Error | null, decoded: string | JwtPayload | undefined)=>{
              
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
           
               const userID = (decoded as JwtPayload).userID as String;
               const user = await UserModel.findById(userID)

               if(!user){
                throw new APIError(404,"user not Founf=d")
               }

               const newAccsessToken = create_access_token(user._id.toString())
               res.status(200).json({accessToken: newAccsessToken})

             next()
           }
            )
     
    }catch(error:any){
        next(error)

    }
}