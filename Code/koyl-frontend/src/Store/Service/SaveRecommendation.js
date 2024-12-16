import axios from "axios";
import account from "../Constants/account";
import { API_END_POINT } from "../../Constants";

const SaveRecommendation = async (data) => {
  return axios
    .post(`${API_END_POINT}${account.SAVED_RECOMMENDATIONS}`, data)
    .then((res) => res)
    .catch((err) => err);
};

export { SaveRecommendation };

const saveMultipleReccomendations = async (payLoadData)=>{
  return axios
    .post(`${API_END_POINT}${account.SAVED_MULTIPLE_RECOMMENDATIONS}`, {payLoadData})
    .then((res) => res)
    .catch((err) => err);
}
export { saveMultipleReccomendations };

const shareMultipleReccomendations = async (payLoadData)=>{
  return axios
    .post(`${API_END_POINT}${account.SHARED_MULTIPLE_RECOMMENDATIONS}`, {payLoadData})
    .then((res) => res)
    .catch((err) => err);
}
export { shareMultipleReccomendations };

const SaveShareRecommendation = async (data) => {
  return axios
    .post(`${API_END_POINT}${account.SAVE_SHARE_RECOMMENDATIONS}`, data)
    .then((res) => res)
    .catch((err) => err);
};

export { SaveShareRecommendation };

const DeleteRecommendation = async (id) => {
  return axios
    .delete(`${API_END_POINT}${account.DELETE_RECOMMENDATIONS}${id}`)
    .then((res) => res)
    .catch((err) => err);
};

export { DeleteRecommendation };

const FIND_RECOMMENDATIONS_PHONE = async (phone) => {
  return axios
    .get(`${API_END_POINT}${account.FIND_RECOMMENDATIONS_PHONE}${phone}`)
    .then((res) => res)
    .catch((err) => err);
};

export { FIND_RECOMMENDATIONS_PHONE };

const FindRecommendationUserId = async (id) => {
  return axios
    .get(`${API_END_POINT}${account.FIND_RECOMMENDATIONS_USERID}${id}`)
    .then((res) => res)
    .catch((err) => err);
};

export { FindRecommendationUserId };

const UpdateRecommendation = async (id,data) => {
  return axios
    .put(`${API_END_POINT}${account.UPDATE_RECOMMENDATIONS}${id}`,data)
    .then((res) => res)
    .catch((err) => err);
};

export { UpdateRecommendation };

const FetchRecommendation = async (id) => {

  return axios
    .get(`${API_END_POINT}${account.FETCH_RECOMMENDATIONS}?id=${id}`)
    .then((res) => res)
    .catch((err) => err);
};

export { FetchRecommendation};
