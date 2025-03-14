import { json, Request, Response } from "express";
export class UploadsController {
  async create(request: Request, response: Response) {
    response.json({ message: "ok" });
  }
}
