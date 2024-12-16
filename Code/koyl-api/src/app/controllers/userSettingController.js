import user from "../models/userModel";
import recommendationModel from "../models/recommendationModel";
import SharedrecommendationModel from "../models/SharedRecommendationsModel";
import {createToken, linkToken} from "../helper/authHelper";
const jwt = require("jsonwebtoken");
import nodemailer from "nodemailer";
import { FORGOT_PASSWORD_MESSAGE } from "../../globalConstants";

module.exports = {
  //Sinup for patient
  createUserAccount: async (req, res) => {
    const { email } = req.body;
    const userExits = await user.findOne({ email });
    if (userExits) {
      return res
        .status(200)
        .send({ massage: "user Already exits", sucess: false });
    }

    try {
      const signup = await user.create(req.body);
      res.status(201).json({
        massage: "Registration Sucessfull",
        data: { id: signup._id, ...req.body },
        sucess: true,
      });
    } catch (Error) {
      console.log(Error);
      res
        .status(500)
        .send({ massage: "Internal server Error ", sucess: false });
    }
  },

  //update patient details
  UpdateUserAccount: async (req, res) => {
    try {
      const updatedData = {
        ...req.body,
        updateDate: new Date(),
      };
      const editpatient = await user.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );
      res.status(200).json({
        massage: "Patient Edit Sucessfull",
        sucess: true,
        editpatient,
      });
      return editpatient;
    } catch (Error) {
      console.log(Error);
      res
        .status(500)
        .send({ massage: "Internal server Error ", sucess: false });
    }
  },

  //update user participation
  UpdateUserParticipation: async (req, res) => {
    try {
      const { participate } = req.body;
      const { id } = req.params;
      let participationStatus = participate.participate
        ? "Participated"
        : "Didn't Participate";

      const updatedUser = await SharedrecommendationModel.findByIdAndUpdate(
        id,
        { $set: { participation: participationStatus } },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      res.status(200).json({
        message: "Participation updated successfully",
        success: true,
        updatedUser,
      });
    } catch (Error) {
      console.log(Error);
      res
        .status(500)
        .send({ message: "Internal server error", success: false });
    }
  },

  //Login
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const User = await user.findOne({ email });

      if (!User) {
        res.status(400).json({ massage: "invalid credentials", sucess: false });
      }
      const isMatched = await User.comparePassword(password);
      if (!isMatched) {
        res.status(400).json({ massage: "invalid credentials", sucess: false });
      }

      const token = createToken({
        id: User._id,
        role: User.role,
        firstName: User.firstName,
        lastName: User.lastName,
        email: User.email,
        userId: User._id,
      });

      return res.status(200).json({
        message: "Login Successfully",
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  //Logout
  userLogout: async (req, res) => {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return { message: "Logged out successfully" };
  },

  //Profile
  UserProfile: async (req, res) => {
    try {
      const Profile = await user.findById(req.user.id).select("-password");
      if (!Profile) {
        return res
          .status(404)
          .json({ message: "User profile not found", success: false });
      }
      res
        .status(200)
        .json({ message: "Profile found", success: true, Profile });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  //existing user
  UserExisting: async (req, res) => {
    const { email } = req.params;
    try {
      const exitUser = await user.findOne({ email });

      if (!exitUser) {
        res.status(200).json({ message: "User not found", success: false });
      }

      const token = createToken({
        id: exitUser._id,
        role: exitUser.role,
        firstName: exitUser.firstName,
        userId: exitUser._id,
        email: exitUser.email,
      });

      return res.status(200).json({
        message: "Login Successfully",
        success: true,
        token,
      });
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  // Fetch all patients
  getPatients: async (req, res) => {
    try {
      const { Search, Page = 1, Limit = 10, Sort = "asc" } = req.query;

      let query = { role: 0, IsDeleted: false };

      if (Search) {
        query = {
          ...query,
          $or: [
            { firstName: { $regex: Search, $options: "i" } },
            { lastName: { $regex: Search, $options: "i" } },
            { email: { $regex: Search, $options: "i" } },
          ],
        };
      }

      const sortOption = Sort === "asc" ? { firstName: 1 } : { firstName: -1 };

      const totalPatients = await user.countDocuments(query);
      const patients = await user
        .find(query)
        .collation({ locale: "en", strength: 2 })
        .sort(sortOption)
        .skip((Page - 1) * Limit)
        .limit(Number(Limit));

      res
        .status(200)
        .json({ success: true, data: patients, total: totalPatients });
    } catch (error) {
      console.error("Error fetching patients:", error);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  //User find by name

  UserFindName: async (req, res) => {
    const { name } = req.params;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Invalid input" });
    }

    try {
      const users = await user.find(
        { $or: [{ firstName: { $regex: name, $options: "i" } }] },
        "-password"
      );

      return res.status(200).json({ success: true, users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  },

  //get individual patient details
  getPatientDetails: async (req, res) => {
    try {
      const { id } = req.params;

      const details = await user.findById(id);
      const userRecommendations = await SharedrecommendationModel.find({
        userId: id,
      });
      if (!details) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }
      res.status(200).json({
        success: true,
        message: "Patient found",
        data: details,
        userRecommendations: userRecommendations,
      });
    } catch (error) {
      console.error("Error fetching patient details:", error);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  //Delete Patient
  DeletePatient: async (req, res) => {
    try {
      const { id } = req.params;
      await user.findByIdAndUpdate(
        id,
        { $set: { IsDeleted: true } },
        { new: true }
      );
      res.status(200).json({ success: true, message: "Patient Deleted" });
    } catch (error) {
      console.error("Error deleting patient:", error);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  Recommendation: async (req, res) => {
    try {
      const {
        disease,
        symptoms,
        allergies,
        recommendations,
        food,
        synopsis,
        phone,
        userId,
        StudiesLink,
      } = req.body;
      const newDisease = new recommendationModel({
        disease,
        symptoms,
        allergies,
        recommendations,
        food,
        synopsis,
        phone,
        userId,
        StudiesLink,
      });
      await newDisease.save();
      res.status(201).json(newDisease);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  SaveMultipleRecommendation: async (req, res) => {
    try {
      const payLoadData = req.body.payLoadData;
      const recommendations = await recommendationModel.insertMany(payLoadData);
    res.status(201).json({data:recommendations, message: "Recommendations saved successfully", success: true });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  ShareMultipleRecommendation: async (req, res) => {
    try {
      const payLoadData = req.body.payLoadData;
      const recommendations = await SharedrecommendationModel.insertMany(payLoadData);
    res.status(201).json({ message: "Recommendations shared successfully", success: true });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  SharedRecommendation: async (req, res) => {
    try {
      const {
        disease,
        symptoms,
        allergies,
        recommendations,
        food,
        synopsis,
        phone,
        userId,
        StudiesLink,
      } = req.body;
      const newDisease = new SharedrecommendationModel({
        disease,
        symptoms,
        allergies,
        recommendations,
        food,
        synopsis,
        phone,
        userId,
        StudiesLink,
      });
      await newDisease.save();
      res.status(201).json(newDisease);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  FetchRecommendation: async (req, res) => {
    try {
      const {id} = req.query
      console.log("ID",id)
      let recommendations;
      if (id && id !== "null" && id !== "") {
        recommendations = await recommendationModel.find({ userId: id });
      } else {
        recommendations = await recommendationModel.find();
      }
      res.status(200).json(recommendations);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  DeleteRecommendation: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedRecommendation = await recommendationModel.findByIdAndDelete(
        id
      );
      if (!deletedRecommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      res.status(200).json({ message: "Recommendation deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  FetchRecommendationByPhone: async (req, res) => {
    const { phone } = req.params;

    try {
      const recommendation = await SharedrecommendationModel.find({
        phone: phone,
      });

      if (!recommendation) {
        return res
          .status(404)
          .json({ message: "Recommendation not found", success: false });
      }

      res.status(200).json({
        massage: "Recommendation found",
        success: true,
        recommendation,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  FetchRecommendationByUserId: async (req, res) => {
    const { userId } = req.params;
    try {
      const recommendation = await SharedrecommendationModel.find({
        userId: userId,
      });

      if (!recommendation) {
        return res
          .status(404)
          .json({ message: "Recommendation not found", success: false });
      }

      res.status(200).json({
        massage: "Recommendation found",
        success: true,
        recommendation,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  UpdateRecommendationById: async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedRecommendation =
        await SharedrecommendationModel.findByIdAndUpdate(id, updateData, {
          new: true,
        });

      if (!updatedRecommendation) {
        return res
          .status(404)
          .json({ message: "Recommendation not found", success: false });
      }

      res.status(200).json({
        message: "Recommendation updated successfully",
        success: true,
        recommendation: updatedRecommendation,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  SendForgotPasswordLink: async (req, res) => {
    const { email } = req.body;
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    } else if (existingUser) {
      const id = existingUser._id
      try {
        const token = linkToken(email,id)
        const link = `${process.env.BASE_URL}/reset-password/${existingUser._id}/${token}`;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.SENDER_EMAIL_ID,
            pass: process.env.SENDER_EMAIL_APP_PASSWORD,
          },
        });

        const mailOptions = {
          from: {
            name: "Koyl.io",
            address: process.env.SENDER_EMAIL_ID,
          }, // sender address
          to: email, // list of receivers
          subject: "Reset Password", // Subject line
          text: FORGOT_PASSWORD_MESSAGE(link), // plain text body
        };
        
        const sendMail = (transporter, mailOptions)=>{
          transporter.sendMail(mailOptions,(error, info) => {
            if (error) {
              console.error("Error sending email:", error);
            } else {
              console.log("Email sent:", info.response);
            }
          });
        }
        sendMail(transporter,mailOptions)

        return res.status(200).json({
          message: "Password reset link sent",
          success: true,
        });
      } catch (error) {
        console.error("Error generating link:", error);
        return res
          .status(500)
          .json({ message: "Error generating reset link", success: false });
      }
    }
  },

  ForgotPassword: async (req, res) => {
    const { id, newPassword, token } = req.body;
    const secret = process.env.JWT_SECRET_KEY;
    try {
      const verify = jwt.verify(token, secret);
      const Patient = await user.findById(id);
      Patient.password = newPassword;
      Patient.markModified("password");
      await Patient.save();
      res.status(200).json({ success: true, message: "Password Updated" });
    } catch (error) {
      if (error.name === "JsonWebTokenError" || error instanceof SyntaxError || error.name === "TokenExpiredError") {
        res.status(401).json({
          success: false,
          message:
            "Invalid or expired password reset link. Please request a new link.",
        });
      } else {
        console.error("Error updating password:", error);
        res
          .status(500)
          .json({ message: "Internal server error", success: false });
      }
    }
  },
};
