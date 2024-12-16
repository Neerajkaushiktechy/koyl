import account from "../Constants/account";
import { API_END_POINT } from "../../Constants";
import axios from "axios";

const TwillioService = async (UserName,recipient) => {

  const data = {
    name: UserName,
    to: recipient,
  };

  return axios
    .post(`${API_END_POINT}${account.MSG_SENDING}`,data)
    .then((res) => res)
    .catch((err) => err);
};

const SendRegisterationLink = async (phoneNumber) => {

  const data = {
    to: phoneNumber,
  };

  return axios
    .post(`${API_END_POINT}${account.REGISTERATION_SENDING}`,data)
    .then((res) => res)
    .catch((err) => err);
};

export { TwillioService, SendRegisterationLink };