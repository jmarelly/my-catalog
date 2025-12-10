import { Request } from "express";
import { TUserWithoutPassword } from "../users/user.types";

export interface AuthRequest extends Request {
  user?: TUserWithoutPassword;
}
