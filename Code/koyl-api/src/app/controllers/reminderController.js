import SharedRecommendationModel from "../models/SharedRecommendationsModel.js";
import userModel from "../models/userModel.js"
import twilio from "twilio";
import {USER_REMINDER_MSG} from "../../globalConstants.js";

module.exports = {
    // Remind User
    userReminder: async () => {
        try {
            const baseURLUser = process.env.BASE_URL;
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const day = currentDate.getDate();
            
            const startDate = new Date(year, month, day);   
            const endDate = new Date(year, month, day + 1);
            
            const recommendations = await SharedRecommendationModel.find({
                createdAt: { $gte: startDate, $lt: endDate },
                userId: { $exists: true, $ne: null }
              });
              for (const recommendation of recommendations) {
                const user = await userModel.findById(recommendation.userId).exec(); 
                const accountSid = process.env.TWILIO_ACCOUNT_SID;
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                const client = twilio(accountSid, authToken);
                const messageBody = USER_REMINDER_MSG(user.firstName, recommendation.createdAt, baseURLUser, recommendation._id);
                const message = await client.messages.create({
                    body: messageBody,
                    from: process.env.SENDER_PHONE_NUMBER, 
                    to: recommendation.phone
                  });
              }
            
            
        } catch (error) {
            console.error("Error fetching recommendations: ", error);
            throw error;
        }
    }
};