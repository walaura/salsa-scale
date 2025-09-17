import { TOP_SECRET_PATH } from "./env.ts";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      isSignedIn: boolean;
    }
    interface Response {
      setSignInCookie: () => void;
      setSignOutCookie: () => void;
    }
  }
}

export const signinMiddleware =
  (): express.RequestHandler => (req, res, next) => {
    req.isSignedIn = req.cookies?.[TOP_SECRET_PATH] === TOP_SECRET_PATH;
    res.setSignInCookie = () => {
      res.cookie(TOP_SECRET_PATH, TOP_SECRET_PATH, {
        maxAge: Number.MAX_SAFE_INTEGER / 2,
      });
    };
    res.setSignOutCookie = () => {
      res.cookie(TOP_SECRET_PATH, "", {
        maxAge: 0,
      });
    };

    next();
  };
