import axios from "axios";
import account from "../Constants/account";
import { API_END_POINT } from "../../Constants";

const ChatgptService = async (chatData,Allergies) => {
  return axios
    .post(`${API_END_POINT}${account.CHAT_DATA}`, { chatData: chatData, Allergies:Allergies })
    .then((res) => res)
    .catch((err) => err);
};
const DataCategorization = async (searchData) => {
  return axios
    .post(`${API_END_POINT}${account.DATA_CATEGORIZATION}`, { searchData: searchData })
    .then((res) => res)
    .catch((err) => err);
};

const FetchGroceryChecklist = async (getSingleData) =>{
  return axios
   .post(`${API_END_POINT}${account.GROCERY_LIST}`, { getSingleData: getSingleData })
   .then((res) => res)
   .catch((err) => err);
}
export { ChatgptService, DataCategorization,FetchGroceryChecklist };
