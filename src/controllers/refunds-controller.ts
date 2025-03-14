import { Category } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

export class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
      category: z.enum([
        Category.food,
        Category.others,
        Category.services,
        Category.transport,
        Category.accommodation,
      ]),
      amount: z.number().positive({ message: "O valor precisa ser positivo" }),
      filename: z.string().min(10),
    });

    const { name, category, amount, filename } = bodySchema.parse(request.body);
    response.json({ message: "ok" });
  }
}
