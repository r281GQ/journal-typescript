import { Request, Response } from "express";

export interface ApiContext {
  req: Request;
  res: Response;
}
