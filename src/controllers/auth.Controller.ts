
import { NextFunction, Request, Response } from "express"
import { UserModel } from "../models/userModel";
import { APIError } from "../errors/APIerror";
import bcrypt from "bcrypt"
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken'

const create_Access_Token = ( userId:string ) => {
    return jwt.sign(
        {userId},
        process.env.ACCESS_SCRETE_TOKEN!,
        {expiresIn:'1m'}
    )
}


const create_Refresh_Token = ( userId:string ) => {
    return jwt.sign(
        {userId},
        process.env.REFRESH_SCRETE_TOKEN!,
        {expiresIn:'7d'}
    )
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {email,name,password} = req.body
        const hashPassword = await bcrypt.hash(password,10)
    const user = new UserModel({
    email,
    name,
    password:hashPassword
    })
    await user.save()

const userWithoutPassword = {
    _id:user.id,
    name:user.name,
    email:user.email
}

    if (!user) {
    throw new APIError(500, "user unsuccesfull login")
    }

    res.status(201).json({
    message: "User succesfully login",
    data: userWithoutPassword
    })

} catch (error) {
    next(error)
}
}

export const GetAllUser = async (req: Request, res: Response, next: NextFunction) => {
try {
    const users = await UserModel.find().select("-password")
    res.status(201).json(users)}
    catch(error){
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
try{ 
    const{email,password} = req.body
    const user = await UserModel.findOne({email})

    if(!user){
        throw new APIError(404,"user not found")
    }
    const isMatch =  bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new APIError(404,"Invalid credential")
    }

    const accessToken = create_Access_Token(user._id.toString())
    const refreshToken = create_Refresh_Token(user._id.toString())

    const isProd = process.env.NODE_ENV === "production"
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:isProd,
        maxAge:7*24*60*60*1000,//7days,
        path:"/api/auth/refresh-token"
    })


    const userWithoutPassword = {
    _id:user.id,
    name:user.name,
    email:user.email,
    accessToken
    }

    res.status(200).json(userWithoutPassword)

}catch(err:any){
    console.log(err)
    next(err)
}
}

export const refreshToken = async(req: Request,res:Response,next:NextFunction) => {
    try{
        const token = req.cookies?.refreshToken
        if(!token){
            throw new APIError(401,"Refresh Token Missing")
        }

        jwt.verify(
            token,
            process.env.REFRESH_SCRETE_TOKEN!,
            async(err : Error | null , decoded : string | JwtPayload | undefined) => {

                if(err){
                    if(err instanceof TokenExpiredError){
                        throw new APIError(401,"refresh token expired")
                    }else if(err instanceof JsonWebTokenError){
                        throw new APIError(401,"invalid refresh token")
                    }else{
                        throw new APIError(401," refresh token error")
                    }
                }
                if(!decoded || typeof decoded === "string"){
                    throw new APIError(401,"refresh token payload error")
                }
                const userId = decoded.userId as String
                const user = await UserModel.findById(userId)
                if(!user){
                    throw new APIError(401,"User Not Found")
                }
                const newAccessToken = create_Access_Token(user._id.toString())
                res.status(200).json({accessToken:newAccessToken})
            }
        )
     }catch(err){
      console.log(err)
  next(err)
    }
}

export const logout = (req: Request,res:Response,next:NextFunction) => {
try{

    const isProd = process.env.NODE_ENV === "production"
    res.cookie("refreshToken","",
        {
            httpOnly:true,
            secure:isProd,
            expires: new Date(0),
            path:"api/auth/refresh-token",
        }
    )
    res.status(200).json({massage:"logOut Succesfully"})

}catch(err){
   
    next(err)
}
}
