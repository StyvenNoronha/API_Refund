import {z} from"zod"
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
export class SessionsController{
    async create(request: Request, response: Response){
        //verifica se esta no formato de email  e senha
        const bodySchema = z.object({
            email: z.string().email({message:"E-mail inválido"}),
            password:z.string()
        })
        const {email,password} = bodySchema.parse(request.body)

        //verifica no banco de dados se tem esse email se nao tiver manda um erro 
        const user = await prisma.user.findFirst({where:{email}})
        if(!user){
            throw new AppError("email ou senha inválido", 401)
        }

        //verifica se a senha e igual a senha que esta no banco de dados
        const passwordMatched = await compare(password, user.password)
        if(!passwordMatched){
            throw new AppError("email ou senha inválido", 401)
        }
        //criado a verificação 
        const {secret, expiresIn} = authConfig.jwt
        const token = sign({role:user.role}, secret,{
            subject: user.id,
            expiresIn
        })


        //passar para o usuário sem aparecer a senha
        const {password:_, ...userWithoutPassword} = user


        response.json({token, userWithoutPassword})
    }
}