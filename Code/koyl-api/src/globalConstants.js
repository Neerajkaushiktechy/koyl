import CryptoJS from "crypto-js";

export const USER_REMINDER_MSG = (
  userName,
  recommendationDate,
  baseURL,
  recommendationId
) => {
  return `Hi ${userName}!\nYour Doctor sent you some dietary recommendations on ${new Date(
    recommendationDate
  ).toLocaleDateString()}\nWe were curious about your dietary progress.\nClick the link below to check it out.\n ${baseURL}/feedback/${recommendationId}`;
};

export const REGISTERED_USER_DIET_MESSAGE = (firstName, URL) => {
  return `Hi ${firstName}!\n\nYour doctor sent you nutritional\n\nrecommendations to supplement\n\nyour health and wellness. Click the link below to view it.\n\n${URL}`;
};

export const UNREGISTRED_USER_DIET_MESSAGE = (phoneNumber, URL) => {
  const encryptedId = CryptoJS.AES.encrypt(
    phoneNumber,
    process.env.SECRET
  ).toString();
  const id = encodeURIComponent(encryptedId);
  return `Your Doctor sent you nutritional\n\nrecommendations to supplement\n\nyour health and wellness. Click the link below to view it.\n\n${URL}/recommendations?id=${id}`;
};

export const USER_REGISTERATION_MESSAGE = ()=>{
  return `Hi!\nPlease take the time to create a KOYL account with us prior to your visit.\nClick the link below.\n${process.env.BASE_URL}/sign-up`
}

export const FORGOT_PASSWORD_MESSAGE = (link) => {
  return `Hi,

We received a request to reset the password for your account.

To reset your password, please click the link below:
${link}

If you did not request a password reset, please ignore this email. The link will expire in 30 minutes.

Thank you,
Koyl Team`;
};

export const ChatGPTRecommendationMessage = (chatData,Allergies) => {
  return `Recommendation food with food catogory includes foodnames and includes food Synopsis for disease ${chatData} in json format,food catogory will not disease or symptoms it will always catogory for foods,Provide food recommendations suitable for all types of  given diseases or symptoms also give less food recommendations for diseases or symptoms, treat must contain disease or symptoms not undifined also provide given disease  is disease or symptoms. The given person for whom the diet is being recommended for is Allergic to the following - ${Allergies}. Keep in mind that the food category and all foods recommended should be the ones that the person can eat without sufffering from any allergic reactions.
         ,start recommendaton with Foods:{[food catogory]:[foodNames],[FoodSynopsis],[TreatFor: **EXACTLY AS FOLLOWS:** ${chatData}],[StudiesLink],[Allergies:[${Allergies}]]} Make sure that each category contains a valid list of food names, a description (FoodSynopsis), and a TreatFor value. If any of these fields are missing or undefined, please provide a default value such as "Not available",also please provide link studies behind your recommendations. with two or more recommendation title,StudiesLink it should title and url. Make absolutely sure that the links provided are accessibe thorugh the URL, the links should not be of those articles which are invalid or are no longer available on the website. Only those links which can be opened and read shuold be coming. This is extremey important, the studies link provided should always be accesible and available on the site they are coming from. TreatFor value should only disease or symptoms name exclude all words before and after if it is not name of disease or symptoms. Only include studies or articles where the URL is currently working and accessible.`;
};


export const ChatGPTDataCategorizationMessage = (searchData) => {
  return `Categorize the following inputs into three categories: "Symptom","Disease" and "Allergies". Only categorize the inputs provided and do not add any additional information. Return the data in JSON format with three arrays: "Symptom","Disease" and "Allergies". Here are the inputs: ${searchData}. Correct spelling mistakes if any.`;
};

export const ChatGPTGroceryChecklistMessage = (getSingleData) => {
  return `Please provide a detailed food recommendation in JSON format for the following disease(s): ${getSingleData?.disease?.split(
    ","
  )} and symptom(s): ${
    getSingleData.symptoms
  }. The response should include a comprehensive list of foods categorized by their type, starting with "Foods: { [FoodCategory]: [foodNames] }".

Please ensure the following guidelines are strictly followed:
1. The list must include multiple food categories with specific food names that help manage both the provided diseases and symptoms.
2. Absolutely avoid any food categories or food names that could trigger allergic reactions caused by the following allergies: ${getSingleData?.allergies}. (Be extremely cautious to exclude any foods that could conflict with these allergies.). For example if proteins is listed in the allergies section no diet even remotely related to protein should be recommended. The same should be followed for all the other listed allergies.
3. Exclude any foods or categories that are known to worsen or be contraindicated for the listed diseases or symptoms.
4. Include all food categories specified in ${getSingleData?.recommendations}, ensuring the inclusion of respective food names from ${getSingleData?.food}. Do not include any foods that are linked to the allergies: ${getSingleData?.allergies}.
5. Provide additional food options within the allowed categories to cover a broader range of beneficial foods.
6. If there are any additional food categories that are beneficial for the provided diseases and symptoms, include them as long as they do not negatively impact the diseases, symptoms, or allergies: ${getSingleData?.allergies}..`;
};

export const CREATE_PATIENT_USER_ACCOUNT = (userData) => {
  return `Dear ${userData.firstName} ${userData.lastName}!

Your account has been successfully created. Here are your login details:

Email: ${userData.email}
Password: 12345

Please log in to your dashboard using the link below and change your password immediately for security purposes:

Koyl AppLink: https://dashboard.koyl.io/


Thank you,
Koyl Team`;
};

export const DOCTOR_CREDENTIALS = (userData, doctorEmail) => {
  return `Dear ${userData.name}!

Your account has been successfully created. Here are your login details:

Email: ${doctorEmail}
Password: 12345

Please log in to your dashboard using the link below and change your password immediately for security purposes:

Koyl AppLink: https://dashboard.koyl.io/

Thank you,
Koyl Team`;
}



