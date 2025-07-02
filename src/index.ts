import express from "express";
import { connectDB } from "./db/mongo";
import dotenv from "dotenv"
import rootRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors"
import cookieParser from "cookie-parser";


dotenv.config()
const app = express()

const corsOption ={
    origin: process.env.CLIENT_ORIGIN,
    credential: true,
    methods:"GET.HEAD,PATCH,POST,DELETE,PUT",
    allowHeader: ["content-type","Authorization"],
}

app.use(cors(corsOption))

const PORT = process.env.PORT;
app.use(express.json())
app.use(cookieParser())


app.use("/api",rootRouter)
app.use(errorHandler)



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on http://localhost:${PORT}`)
    })
})

