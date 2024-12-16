import axios from "axios";
import { ChatGPTRecommendationMessage, ChatGPTDataCategorizationMessage,ChatGPTGroceryChecklistMessage } from "../../globalConstants";
module.exports = {
  chatgptService: async (req, res) => {
    try {
      const { chatData, Allergies } = req.body;
      const message = ChatGPTRecommendationMessage(chatData,Allergies)
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

     

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHAT_GPT_API_KEY}`,
      };

      const requestBody = {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.0, // Adjust temperature for consistency
      };

      const { data } = await axios.post(process.env.CHAT_GPT_API_URL, requestBody, { headers });

      res.json({ response: data?.choices[0]?.message?.content });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ error: "Server error" });
    }
  },

  chatgptDataCategorization: async (req, res) => {
    try {
      const { searchData } = req.body;
      const message = ChatGPTDataCategorizationMessage(searchData)
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
     

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHAT_GPT_API_KEY}`,
      };

      const requestBody = {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.0, // Adjust temperature for consistency
      };

      const { data } = await axios.post(process.env.CHAT_GPT_API_URL, requestBody, { headers });
      res.json({ response: data?.choices[0]?.message?.content });
    } catch (error) {
      console.error("Error during data categorization:", error.message);
      return res.status(500).json({ error: "Server error: " + error.message });
    }
  },

  chatgptGroceryChecklist: async (req, res) => {
    try {
      const { getSingleData } = req.body;
      const message = ChatGPTGroceryChecklistMessage(getSingleData)
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
     

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHAT_GPT_API_KEY}`,
      };

      const requestBody = {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.0, // Adjust temperature for consistency
      };

      const { data } = await axios.post(process.env.CHAT_GPT_API_URL, requestBody, { headers });
      res.json({ response: data?.choices[0]?.message?.content });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ error: "Server error: " + error.message });
    }
  },

};
