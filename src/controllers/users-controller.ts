import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import {z} from "zod"


export class UsersController{
    async create(request: Request, response:Response){
        const bodySchema = z.object({
            name: z.string().trim().min(2,{message:"Nome é obrigatório"}),
            email: z.string().trim().email({message:"E-mail inválido"}).toLowerCase(),
            password: z.string().min(6,{message:"a senha deve ter no mínimo 6 dígitos"}),
            role:z.enum([UserRole.employee, UserRole.manager]).default(UserRole.employee)
        })

        const {name, email, password, role} = bodySchema.parse(request.body)
        response.json({name, email, password, role})
    }
}