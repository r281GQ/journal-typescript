import { Request, Response } from "express";
import { Payload } from "./Payload";

export interface ApiContext {
  req: Request;
  res: Response;
  payload?: Payload;
}
