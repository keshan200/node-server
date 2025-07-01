import express from "express";
import { connectDB } from "./db/mongo";
import dotenv from "dotenv"
import rootRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors"


dotenv.config()

const app  = express()



const corsOption = {
    origin:process.env.CLIENT_ORIGIN,
    credential :true,
    methods : "GET,PUT,POST,DELETE",
    allowHeaders :["Content-Type","Autherization"]
}


const PORT = process.env.PORT

app.use(cors(corsOption))
app.use(express.json())
app.use("/api",rootRouter)
app.use(errorHandler)


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server runnig on http://localhost:${PORT}`)
    })
})

