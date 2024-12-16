import axios from "axios";
import account from "../Constants/account";
import { API_END_POINT } from "../../Constants";

const signupUser = async (data) => {
  return axios
    .post(`${API_END_POINT}${account.USER_SIGN_UP}`, data)
    .then((res) => res)
    .catch((err) => err);
};

export { signupUser};
