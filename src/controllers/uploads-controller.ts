import { Request, Response } from "express";
import z, { ZodError } from "zod";
import { DiskStorage } from "@/providers/disk-storage";
import uploadConfig from "@/configs/uploadConfig";
import { AppError } from "@/utils/AppError";
class UploadsController {
  async create(request: Request, response: Response) {
    const diskStorage = new DiskStorage()

    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, "Arquivo é obrigatório"),
          mimetype: z
            .string()
            .refine(
              (type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
              "Formato de arquivo inválido. Apenas JPEG, PNG e PDF são permitidos."
            ),
          size: z
            .number()
            .positive()
            .refine(
              (size) => size <= uploadConfig.MAX_FILE_SIZE,
              "Arquivo excede o tamanho máximo de 5MB."
            ),
        })
        .passthrough() 

      const file = fileSchema.parse(request.file)
      const filename = await diskStorage.saveFile(file.filename)

      response.status(201).json({ filename })
    } catch (error) {
      if (error instanceof ZodError) {
        if (request.file) {
          await diskStorage.deleteFile(request.file.filename, "tmp")
        }

        throw new AppError(error.issues[0].message)
      }

      throw error
    }
  }
}

export { UploadsController }