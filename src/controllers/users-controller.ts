import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";

export class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
      email: z
        .string()
        .trim()
        .email({ message: "E-mail inválido" })
        .toLowerCase(),
      password: z
        .string()
        .min(6, { message: "a senha deve ter no mínimo 6 dígitos" }),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);
    //verifica se ja ter email cadastrado
    const UserWithSameEmail = await prisma.user.findFirst({ where: { email } });
    if (UserWithSameEmail) {
      throw new AppError(" já existe um usuário cadastrado com esse E-mail");
    }

    //criptografar a senha
    const hashedPassword = await hash(password, 8);

    //salvar no banco de dados
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    response.status(201).json({ message: "Usuário criado com sucesso" });
  }
}
