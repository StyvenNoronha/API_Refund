import { Category } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
const CategoriaEnum = z.enum([
  "food",
  "others",
  "services",
  "transport",
  "accommodation",
]);
export class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
      category: CategoriaEnum,
      amount: z.number().positive({ message: "O valor precisa ser positivo" }),
      fileName: z.string(),
    });

    const { name, category, amount, fileName } = bodySchema.parse(request.body);

    if (!request.user?.id) {
      throw new AppError("Usuário não autorizado", 401);
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        amount,
        category,
        fileName,
        userId: request.user.id,
      },
    });
    response.status(201).json({ refund });
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(""),
    });

    const { name } = querySchema.parse(request.query);
    const refunds = await prisma.refunds.findMany({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
    response.json({ refunds });
  }
}
