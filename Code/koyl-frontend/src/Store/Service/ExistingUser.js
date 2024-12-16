import axios from "axios";
import account from "../Constants/account";
import { API_END_POINT } from "../../Constants";

const ExistingUser = async (email) => {
  return axios
    .get(`${API_END_POINT}${account.EXISTS_USER}/${email}`)
    .then((res) => res)
    .catch((err) => err);
};

export { ExistingUser };
