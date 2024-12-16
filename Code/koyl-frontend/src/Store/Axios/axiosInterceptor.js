import axios from "axios";
import AuthService from "../../service/AuthService";

export const axiosInstance = () => {
  function handleUnAuthenticateResponse(response) { }

  function errorHandler(error) {
    handleUnAuthenticateResponse(error.response);

    return Promise.reject(error);
  }

  axios.interceptors.request.use(async (config) => {
    const authToken = AuthService?.getAuthtoken()?.token;
    config.headers.Authorization = `Bearer ${authToken ? JSON.parse(AuthService.decrypt(AuthService?.getAuthtoken()?.token)) : ''}`;
    return config;
  }, errorHandler);

  axios.interceptors.response.use((response) => response, errorHandler);

}

