import {z} from"zod"
import { Request, Response } from "express";
export class SessionsController{
    async create(request: Request, response: Response){
        const bodySchema = z.object({
            email: z.string().email({message:"E-mail inválido"}),
            password:z.string()
        })
        const {email,password} = bodySchema.parse(request.body)
        response.json({email, password})
    }
}