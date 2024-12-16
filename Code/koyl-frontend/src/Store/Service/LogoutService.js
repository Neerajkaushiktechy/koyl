import axios from "axios";
import account from "../Constants/account";
import { API_END_POINT } from "../../Constants";


const LogoutUser = async () => {
  localStorage.clear();
  return axios
    .get(`${API_END_POINT}${account.USER_LOGOUT}`)
    .then((res) => res)
    .catch((err) => err);
};

export { LogoutUser };
