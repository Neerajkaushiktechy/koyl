import { Router } from "express";
import account  from './routes/account'
import user from "./routes/user";
import openepic from "./routes/openepic";
// import { isAuthenticated } from "./middleware/auth";
import Auth from "./middleware/auth";

export default () => {
  const apiRouter = Router();

  apiRouter.get("/", async (req, res) => {
    try {
      const status = {
        Status: "Running",
      };
      res.status(200).json(status);
    } catch (error) {
      // res.status(200).json({
      //   status: 'active',
      //   dbAvailable: false,
      //   dbError: error.message,
      // });
    }
  });

  apiRouter.use("/user", user());
  apiRouter.use("/openepic",  openepic());
  apiRouter.use("/account", Auth.isAutheticated, account());

  return apiRouter;
};
