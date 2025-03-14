import { Category } from "@prisma/client";
import { Request, Response } from "express";
import { optional, z } from "zod";
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
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { name, page, perPage } = querySchema.parse(request.query);

    //calcular os valores de skip(proxima pagina)
    const skip = (page - 1) * perPage;
    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
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

    //obter o total de registros para calcular o número de páginas
    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
    });

    const totalPage = Math.ceil(totalRecords / perPage);
    response.json({
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPage: totalPage > 0 ? totalPage : 1,
      },
    });
  }
}
