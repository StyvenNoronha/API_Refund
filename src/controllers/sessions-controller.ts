import { Request, Response } from "express";
export class SessionsController{
    async create(request: Request, response: Response){
        response.json({message:"ok"})
    }
}