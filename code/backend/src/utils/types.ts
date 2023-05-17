import { Request } from "express";

export interface authenticatedRequest extends Request {
  userData?: any;
  callbackUrl?: string;
}
