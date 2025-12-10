import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserService from "../users/user.service";
import { AppError } from "../../utils/appError";
import { config } from "../../config";
import { logger } from "../../utils/logger";
import { AuthRequest } from "./auth.types";

const COOKIE_MAX_AGE = config.jwt.expiresInSeconds * 1000;

export default class AuthController {
  constructor(private userService: UserService) {}

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      logger.warn({ username }, "Login failed - user not found");
      throw new AppError("Invalid username or password", 401);
    }

    const isValidPassword = await this.userService.verifyPassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      logger.warn({ username }, "Login failed - invalid password");
      throw new AppError("Invalid username or password", 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresInSeconds }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
    });

    logger.info({ userId: user.id, username: user.username }, "User logged in");

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: "lax",
    });

    logger.info("User logged out");

    return res.status(200).json({ message: "Logged out successfully" });
  };

  me = async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    return res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  };
}
