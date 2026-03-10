import { Request, Response, NextFunction } from "express";
import CustomError from "../../types/customError";
import { registerUser, authenticateUser } from "./auth.service";
import HttpMessages from "../../types/statusMessages";
import { createAccessToken } from "../../utils/createAccessToken";


export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await registerUser(req.body);
    const token = createAccessToken(user);
    res.status(201).json({
      status: HttpMessages.SUCCESS,
      data: {
        user: {
          id: user.id,
          email: user.email,
          avatar: user.avatar,
          provider: user.provider,
          role: user.role,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    const token = createAccessToken(user);

    res.status(200).json({
      status: HttpMessages.SUCCESS,
      data: {
        user: {
          id: user.id,
          email: user.email,
          avatar: user.avatar,
          provider: user.provider,
          role: user.role,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutJwt = (_req: Request, res: Response) => {
  res.status(200).json({
    status: HttpMessages.SUCCESS,
    message: "Logged out",
  });
};

export const getProfile = (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) {
    throw new CustomError("Unauthorized", 401, HttpMessages.FAIL);
  }

  res.status(200).json({
    status: HttpMessages.SUCCESS,
    data: {
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider,
        role: user.role,
      },
    },
  });
};

export const googleAuthteticateCallback = (req: Request, res: Response) => {
  res.status(200).redirect("/");
};

export const logOutSesssion = (req: Request, res: Response) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
};
