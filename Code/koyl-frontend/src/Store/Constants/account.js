const USER_SIGN_UP = "user/sign-up";
const USER_LOGIN = "user/login";
const USER_LOGOUT = "user/logout";
const EXISTS_USER = "user/email";
const USER_UPDATE = "user/edit";
const FIND_USERBY_NAME = "account/user";
const FETCH_PATIENTS = "user/patients";
const FETCH_PATEINT_DETAILS = "user/patientdetails/";
const DELETE_PATIENT = "user/deletepatient/";
const MSG_SENDING = "account/send-sms";
const CHAT_DATA = "user/chat-completions";
const DATA_CATEGORIZATION = "user/categorize-data"
const GROCERY_LIST = "user/grocery-list"
const SAVED_RECOMMENDATIONS = "account/save-recommendation";
const SAVE_SHARE_RECOMMENDATIONS = "account/save-share-recommendation";
const SAVED_MULTIPLE_RECOMMENDATIONS = "account/save-multiple-recommendation";
const SHARED_MULTIPLE_RECOMMENDATIONS = "account/share-multiple-recommendation"
const FETCH_RECOMMENDATIONS = "account/fetch-recommendations";
const DELETE_RECOMMENDATIONS = "account/delete-recommendations/";
const FIND_RECOMMENDATIONS_PHONE = "user/find-recommendationsPhone/";
const FIND_RECOMMENDATIONS_USERID="account/find-recommendationsUser/"
const UPDATE_RECOMMENDATIONS="user/update-recommendations/"
const UPDATE_PARTICIPATION = "user/update-participation"
const SAVE_EPIC_PATIENT_DETAILS = "openepic/save-patient"
const CREATE_PATIENT_USER_ACCOUNT= "openepic/create-patient"
const SEND_FORGOT_PASSWORD_LINK = 'user/send-forgot-password-link'
const FORGOT_PASSWORD = "user/forgot-password"
const REGISTERATION_SENDING = "account/send-registeration-sms"
const FETCH_EPIC_PATIENT_DETAILS = "openepic/get-patient-record-from-db"
const EPIC_CREATE_CLINICAL_NOTES = "openepic/doc-ref-create-clinical-notes"


export default {
  USER_SIGN_UP,
  USER_LOGIN,
  USER_LOGOUT,
  EXISTS_USER,
  USER_UPDATE,
  FIND_USERBY_NAME,
  FETCH_PATIENTS,
  FETCH_PATEINT_DETAILS,
  DELETE_PATIENT,
  MSG_SENDING,
  CHAT_DATA,
  SAVED_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS,
  DELETE_RECOMMENDATIONS,
  FIND_RECOMMENDATIONS_PHONE,
  FIND_RECOMMENDATIONS_USERID,
  UPDATE_RECOMMENDATIONS,
  SAVE_SHARE_RECOMMENDATIONS,
  UPDATE_PARTICIPATION,
  SAVE_EPIC_PATIENT_DETAILS,
  SEND_FORGOT_PASSWORD_LINK,
  FORGOT_PASSWORD,
  DATA_CATEGORIZATION,
  GROCERY_LIST,
  CREATE_PATIENT_USER_ACCOUNT,
  REGISTERATION_SENDING,
  FETCH_EPIC_PATIENT_DETAILS,
  EPIC_CREATE_CLINICAL_NOTES,
  SAVED_MULTIPLE_RECOMMENDATIONS,
  SHARED_MULTIPLE_RECOMMENDATIONS
};
