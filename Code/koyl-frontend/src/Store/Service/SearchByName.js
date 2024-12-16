import axios from "axios";
import account from "../Constants/account";
import { API_END_POINT } from "../../Constants";


const SearchByName = async (firstname) => {
  return axios
    .get(`${API_END_POINT}${account.FIND_USERBY_NAME}/${firstname}`)
    .then((res) => res)
    .catch((err) => err);
};

export { SearchByName };
