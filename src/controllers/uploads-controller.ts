import { Request, Response } from "express";
import z from "zod";

import uploadConfig from "@/configs/uploadConfig";

export class UploadsController {
  async create(request: Request, response: Response) {
    try {
      const fileSchema = z.object({
        filename: z.string().min(1, "arquivo é obrigatório"),
        mimetype: z
          .string()
          .refine(
            (type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
            "formato de arquivo invalido"
          ),
          size: z.number().positive().refine((size)=> size <=  uploadConfig.MAX_FILE_SIZE,"Arquivo muito grande")
      }).passthrough()
      const {file} = fileSchema.parse(request.file)
      response.json({message:"ok"})
    } catch (error) {
      throw error;
    }
  }
}
