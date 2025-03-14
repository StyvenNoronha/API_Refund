import  express  from "express";
import cors from "cors"
import { errorHandling } from "./middlewares/error-handling";
import { AppError } from "./utils/AppError";

const app = express()
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.use(errorHandling)
export {app}