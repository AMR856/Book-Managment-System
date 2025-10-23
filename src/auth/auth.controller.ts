import { Request, Response, NextFunction } from "express";

export const googleAuthteticateCallback = (req: Request, res: Response) => {
  res.status(200).redirect('/');
};

export const logOutSesssion = (req: Request, res: Response) => {
  req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/");
      });
    });
};
