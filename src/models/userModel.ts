import mongoose from "mongoose"

type User ={

   name:string,
   email:string,
   password:string

}


const userSchema = new mongoose.Schema<User>({


    name:{
        type:String
    },

    email:{
        type:String
    },

    password:{
        type:String
    }
})


export const UserModel = mongoose.model<User>("User",userSchema)




//jwt installation

//npm i jsonwebtoken cookie-parser
//npm i --save-dev @types/jsonwebtoken @types/cookie-parser


//generate a screte keys
//using crypto from node - node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

//bcypt install
//npm install --save-dev @types/bcrypt
