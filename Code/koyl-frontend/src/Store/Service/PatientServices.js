import axios from "axios";
import { API_END_POINT } from "../../Constants";
import account from "../Constants/account";

const getPatientDetails = async (id) => {
  return axios
    .get(`${API_END_POINT}${account.FETCH_PATEINT_DETAILS}${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("Error:", err);
      return err;
    });
};

export { getPatientDetails };

const DeletePatient = async (id) => {
  return axios
    .put(`${API_END_POINT}${account.DELETE_PATIENT}${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("Error:", err);
      return err;
    });
};

export { DeletePatient };

const getPatients = async (
  searchQuery = "",
  page = 1,
  limit = 10,
  sort = "asc"
) => {
  return axios
    .get(`${API_END_POINT}${account.FETCH_PATIENTS}`, {
      params: {
        Search: searchQuery,
        Page: page,
        Limit: limit,
        Sort: sort,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("Error:", err);
      return err;
    });
};

export { getPatients };

const updateUserInfo = async (data, id) => {
  return axios
    .put(`${API_END_POINT}${account.USER_UPDATE}/${id}`, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error("Error:", err);
      return err;
    });
};

export { updateUserInfo };

const updateUserParticipation = async (id,participate)=>{
  return axios
   .put(`${API_END_POINT}${account.UPDATE_PARTICIPATION}/${id}`, {participate})
   .then((res)=>{
     return res;
   })
   .catch((err)=>{
     console.error("Error:", err);
     return err;
   });
}

export { updateUserParticipation };

const saveEpicPatientDeatils = async (patientObject) => {
  return axios
    .post(`${API_END_POINT}${account.SAVE_EPIC_PATIENT_DETAILS}`, patientObject)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("Error:", err);
      return err;
    });
};

export { saveEpicPatientDeatils };
const createPatientUserAccount = async (patientDetails) => {
  return axios
    .post(`${API_END_POINT}${account.CREATE_PATIENT_USER_ACCOUNT}`, patientDetails)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("Error:", err);
      return err;
    });
};

export { createPatientUserAccount};

const SendForgotPasswordLink = async (email)=>{
  return axios
   .post(`${API_END_POINT}${account.SEND_FORGOT_PASSWORD_LINK}`, {email})
   .then((res)=>{
     return res;
   })
   .catch((err)=>{
     console.error("Error:", err);
     return err;
   });
}

export { SendForgotPasswordLink };

const changePassword = async(id, newPassword,token)=>{
  return axios
  .post(`${API_END_POINT}${account.FORGOT_PASSWORD}`, {id,newPassword,token})
  .then((res)=>{
    return res;
  })
  .catch((err)=>{
    console.error("Error:", err);
    return err;
  });
}

export { changePassword };

const getEpicPatientRecord = async(epicPatientId) => {
  return axios
   .get(`${API_END_POINT}${account.FETCH_EPIC_PATIENT_DETAILS}/${epicPatientId}`)
   .then((res)=>{
     return res;
   })
   .catch((err)=>{
     console.error("Error:", err);
     return err;
   });
}

export { getEpicPatientRecord };

const epicCreateClinicalNotes = async(clinicalNoteObj, epicaccesstoken) => {
  return axios
   .post(`${API_END_POINT}${account.EPIC_CREATE_CLINICAL_NOTES}`, clinicalNoteObj,
    {
      headers: {
        'epicaccesstoken': epicaccesstoken
      }
    }
   )
   .then((res)=>{
     return res;
   })
   .catch((err)=>{
     console.error("Error:", err);
     return err;
   });
}

export { epicCreateClinicalNotes };

