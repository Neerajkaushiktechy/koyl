import { Router } from "express";
import userSettingController from "../controllers/userSettingController";
import chatgptControlller from "../controllers/chatgptControlller";

export default () => {
  const userSettingsRouter = Router();

  userSettingsRouter.get("/email/:email", async (req, res) => {
    try {
      const data = await userSettingController.UserExisting(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  userSettingsRouter.post("/login", async (req, res) => {
    try {
      const data = await userSettingController.userLogin(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  userSettingsRouter.get("/logout", async (req, res) => {
    try {
      const data = await userSettingController.userLogout(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });
  userSettingsRouter.post("/sign-up", async (req, res) => {
    try {
      const data = await userSettingController.createUserAccount(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  userSettingsRouter.get("/patients", async (req, res) => {
    try {
      const data = await userSettingController.getPatients(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  userSettingsRouter.get("/patientdetails/:id", async (req, res) => {
    try {
      const data = await userSettingController.getPatientDetails(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  userSettingsRouter.put("/deletepatient/:id", async (req, res) => {
    try {
      const data = await userSettingController.DeletePatient(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  userSettingsRouter.put("/edit/:id", async (req, res) => {
    try {
      const data = await userSettingController.UpdateUserAccount(req, res);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  userSettingsRouter.put("/update-participation/:id", async (req, res) => {
    try {
      const data = await userSettingController.UpdateUserParticipation(
        req,
        res
      );
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  });

  userSettingsRouter.get(
    "/find-recommendationsPhone/:phone",
    async (req, res) => {
      try {
        const data = await userSettingController.FetchRecommendationByPhone(
          req,
          res
        );
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );

  userSettingsRouter.post(
    "/chat-completions",
    async (req, res) => {
      try {
        const data = await chatgptControlller.chatgptService(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );

  userSettingsRouter.post(
    "/categorize-data",
    async (req, res) => {
      try {
        const data = await chatgptControlller.chatgptDataCategorization(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.error("Error occurred during data categorization:", err);
      }
    }
  );

  userSettingsRouter.post(
    "/grocery-list",
    async (req, res) => {
      try {
        const data = await chatgptControlller.chatgptGroceryChecklist(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.error("Error occurred during data categorization:", err);
      }
    }
  );

  userSettingsRouter.put(
    "/update-recommendations/:id",
    async (req, res) => {
      try {
        const data = await userSettingController.UpdateRecommendationById(
          req,
          res
        );
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );



  userSettingsRouter.post(
    "/send-forgot-password-link",
    async (req, res) => {
      try {
        const data = await userSettingController.SendForgotPasswordLink(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  );

  userSettingsRouter.post(
    "/forgot-password",
    async (req, res) => {
      try {
        const data = await userSettingController.ForgotPassword(req, res);
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    }
  )

  return userSettingsRouter;
};
