import { toast } from "react-toastify";
import axios from "axios";
import account from "../Constants/account";
import { API_END_POINT } from "../../Constants";

const LoginUser = async (data) => {
  try {
    const response = await axios.post(
      `${API_END_POINT}${account.USER_LOGIN}`,
      data
    );
    return response;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const CheckUser = async (email) => {
  try {
    const response = await axios.get(
      `${API_END_POINT}${account.EXISTS_USER}/${email}`
    );
    return response;
  } catch (error) {
    console.error("Error checking user:", error);
    throw error;
  }
};

export { LoginUser, CheckUser };
