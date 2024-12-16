import twilio from "twilio";
import { REGISTERED_USER_DIET_MESSAGE, UNREGISTRED_USER_DIET_MESSAGE,USER_REGISTERATION_MESSAGE } from "../../globalConstants";


module.exports = {
  UserMsgService: async (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    const {name,to} = req.body;
    let messageBody
    if(name!==""){
      messageBody = REGISTERED_USER_DIET_MESSAGE(name, process.env.BASE_URL)
    }
    else if (name===""){
      messageBody = UNREGISTRED_USER_DIET_MESSAGE(to, process.env.BASE_URL)
    }
    try {
      const message = await client.messages.create({
        body: messageBody,
        from: process.env.SENDER_PHONE_NUMBER,
        to: to,
      });
      res.json({ message: "Message sent!", message });
    } catch (error) {
      return res.status(500).json({ error: "Failed to send message" });
    }
  },

  UserRegisterationMessage: async (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    const {to} = req.body;
    const messageBody = USER_REGISTERATION_MESSAGE();
    try {
      const message = await client.messages.create({
        body: messageBody,
        from: process.env.SENDER_PHONE_NUMBER,
        to: to,
      });
      res.json({ message: "Message sent!", message, success:true });
    } catch (error) {
      return res.status(500).json({ error: "Failed to send message",success:false });
    }
  },
};
