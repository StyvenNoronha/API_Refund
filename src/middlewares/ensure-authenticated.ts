import { verify } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";

interface TokenPayLoad {
  role: string;
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    //verifica se recebeu o token
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new AppError("JWT token not Found", 401);
    }

    //separa o token em dois e pega so o token
    const [, token] = authHeader.split(" ");
    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayLoad;

    request.user = {
      id: user_id,
      role,
    };

    return next();
  } catch (error) {
    console.log(error);
    throw new AppError("invalid JWT token", 401);
  }
}
