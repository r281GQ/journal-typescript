import { Request, Response } from "express";
import { Payload } from "./apiContext/payload";

export interface ApiContext {
  req: Request;
  res: Response;
  payload?: Payload;
}
