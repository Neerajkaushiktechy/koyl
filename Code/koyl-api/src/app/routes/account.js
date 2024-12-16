import { Router } from "express";
import userSettingController from "../controllers/userSettingController";
import TwilloController from "../controllers/TwilloController";
import chatgptControlller from "../controllers/chatgptControlller";
import Auth from "../middleware/auth";

export default () => {
  const AccountRouter = Router();

  AccountRouter.get("/Profile", Auth.isAutheticated, async (req, res) => {
    try {
      const data = await userSettingController.UserProfile(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  AccountRouter.put("/edit/:id", Auth.isAutheticated, async (req, res) => {
    try {
      const data = await userSettingController.UpdateUserAccount(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });
  AccountRouter.get("/user/:name", Auth.isAutheticated, async (req, res) => {
    try {
      const data = await userSettingController.UserFindName(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  AccountRouter.post("/send-sms", Auth.isAutheticated, async (req, res) => {
    try {
      const data = await TwilloController.UserMsgService(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  AccountRouter.post("/send-registeration-sms", Auth.isAutheticated, async (req, res) => {
    try {
      const data = await TwilloController.UserRegisterationMessage(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });
  

  AccountRouter.post(
    "/save-recommendation",
    Auth.isAutheticated,
    async (req, res) => {
      try {
        const data = await userSettingController.Recommendation(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );

  AccountRouter.post(
    "/save-share-recommendation",
    Auth.isAutheticated,
    async (req, res) => {
      try {
        const data = await userSettingController.SharedRecommendation(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );

  AccountRouter.post(
    "/save-multiple-recommendation",
    Auth.isAutheticated,
    async (req, res) => {
      try {
        const data = await userSettingController.SaveMultipleRecommendation(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );

  AccountRouter.post(
    "/share-multiple-recommendation",
    Auth.isAutheticated,
    async (req, res) => {
      try {
        const data = await userSettingController.ShareMultipleRecommendation(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );


  AccountRouter.get(
    "/fetch-recommendations",
    Auth.isAutheticated,
    async (req, res) => {
      try {
        const data = await userSettingController.FetchRecommendation(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );

  //Delete recommnedation
  AccountRouter.delete(
    "/delete-recommendations/:id",
    Auth.isAutheticated,
    async (req, res) => {
      try {
        const data = await userSettingController.DeleteRecommendation(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );

  AccountRouter.get(
    "/find-recommendationsUser/:userId",
    Auth.isAutheticated,
    async (req, res) => {
      try {
        const data = await userSettingController.FetchRecommendationByUserId(
          req,
          res
        );
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );

  AccountRouter.get("/patients", Auth.isAutheticated, async (req, res) => {
    try {
      const data = await userSettingController.getPatients(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

 

  return AccountRouter;
};
