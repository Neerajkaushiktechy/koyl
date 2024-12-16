import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BsSend } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import logo from "../../assets/images/logo-koyl-white.svg"
import axios from "axios";
import AuthService from "../../service/AuthService";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../Store/Axios/axiosInterceptor";
import { createPatientUserAccount, saveEpicPatientDeatils } from "../../Store/Service/PatientServices";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PageLoader from "../../Components/Account/PageLoader";

function OpenEpicLaunch(props) {
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required"),
    location: Yup.string().required("Required"),
    doctor: Yup.string().required("Required"),
    age: Yup.number()
    .required("Required")
    .positive("Age must be a positive number"),
    weight: Yup.number()
    .required("Required")
    .positive("Weight must be a positive number"),
    race: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    allergies: Yup.string(),
    symptoms: Yup.string().required("Required"),
    epicNutritionOrder: Yup.string()
  });

  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [initialValues, setInitialValues] = useState({
    epicPatientId:"",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    doctor: "",
    age: "",
    weight: "",
    race: "",
    gender: "",
    allergies: "",
    symptoms: "",
    epicNutritionOrder: ""
  });
  const [patientObj, setPatientObject] = useState({});
  const [loading, setLoading] = useState(false)

  let count = 0;
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const iss = params.get('iss');
    const launch = params.get('launch');

    if (iss && launch) {
      // debugger
      window.location.href = `${process.env.REACT_APP_API_END_POINT}openepic/launch?iss=${iss}&launch=${launch}`;
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const iss = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
    setLoading(true)
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_END_POINT}openepic/callback?code=${code}&iss=${iss}`);
        if (response && response.data.accessToken) {
          //   const patientData = await axios.get(`${process.env.REACT_APP_API_END_POINT}openepic/patient?access_token=${response.data.accessToken}&patient_id=${response.data.patient}&iss=${iss}`);
          setPatientData(response.data);
          setFeachedValuesOnForm(response.data);

        };
        setLoading(false)
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setLoading(false)
      }
    };

    if (code && iss && count === 0) {
      count += 1;
      fetchPatientData();
    }
  }, []);
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
  
    return age;
  };


  const setFeachedValuesOnForm = async(patientData) => {
    const {
      name,
      telecom,
      gender,
      birthDate,
      address,
    } = patientData?.patientDetails;
    const selectedName =  name?.find(nameObj => nameObj.use === 'official');
    const givenNames = selectedName?.given || [];
    const firstName = givenNames?.length > 0 ? givenNames[0] : "";
    const familyName = selectedName?.family || "";

    const homePhone= telecom?.find(entry => entry.system === "phone" && entry.use === "home");

    const doctorName = patientData?.practitionerDetails?.name.find(nameObj => nameObj.use === 'usual');
    const doctorNameText =doctorName?.text || "";

    const addressData = address && address?.length > 0 ? address[0] : {};
    const streetAddress = (addressData?.line && addressData?.line?.length > 0) ? addressData?.line[0] : "";
    const city = addressData?.city || "";
    const state = addressData?.state || "";
    const postalCode = addressData?.postalCode || "";
    const country = addressData?.country || "";

    const age = birthDate ? calculateAge(birthDate) : "";

    const capitalizeFirstLetter = (str) => {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
  };



    let patientObj = {}
    let nutrition = [];
    let allergyList = [];
    let currentProblems = [];
  
    if (patientData.nutritionOrder.total >= 1) {
      patientData.nutritionOrder.entry.forEach(entry => {
        if (entry.resource && entry.resource.oralDiet && entry.resource.oralDiet.instruction) {
          nutrition.push(entry.resource.oralDiet.instruction);
        }
      });
    }
    if (patientData.allergyList.total >= 1) {
      patientData.allergyList.entry.forEach(entry => {
        if (entry.resource.reaction && entry.resource.reaction.length>0) {
          entry.resource.reaction.map(data => allergyList.push(data.description))
        }
      });
    }
    if(patientData.currentProblems.total >= 1){
      patientData.currentProblems.entry.forEach((entry, index) => {
        entry?.resource?.entry?.map(problem => currentProblems.push(problem.item.display))
      })
    }

    if (patientData.patientDetails.id) {
      patientObj['epicPatientId'] = patientData.patient
      patientObj['name'] = patientData.patientDetails.name
      patientObj['telecom'] = patientData.patientDetails.telecom
      patientObj['gender'] = patientData.patientDetails.gender
      patientObj['birthDate'] = patientData.patientDetails.birthDate
      patientObj['address'] = patientData.patientDetails.address
      // obj['maritalStatus'] = patient?.resource?.maritalStatus?.text ? patient?.resource?.maritalStatus?.text : 'Un Married'
      patientObj['contact'] = patientData.patientDetails.contact
      patientObj['medicalHistory'] = patientData.medicalHistory
      
      patientObj['nutritionList'] = nutrition
      patientObj['allergyList'] = allergyList
      patientObj['labResults'] = patientData.labResults
      patientObj['currentProblems'] = patientData.currentProblems
      patientObj['hosPitalProblems'] = patientData.hosPitalProblems
      patientObj['currentTreatmentPlans'] = patientData.currentTreatmentPlans
      patientObj['latestEncounter'] = patientData.latestEncounter
      setPatientObject(patientObj)

      setInitialValues({
        epicPatientId:patientData.patient,
        firstName:firstName,
        lastName: familyName,
        email: "",
        phone: homePhone?homePhone?.value:"",
        location: `${streetAddress}, ${city}, ${state} ${postalCode}, ${country}`, 
        doctor: doctorNameText,
        age: age ,
        weight: "",
        race: "",
        gender: capitalizeFirstLetter(gender),
        allergies:allergyList.join(', '),
        symptoms:currentProblems.join(", "),
        epicNutritionOrder:nutrition.join(', ')
        
        
      })
    }
  }

  const checkSymptomAndDisease = async (values) => {
    try {
      AuthService.LoggedInUserSession(patientData.loginToken);
      localStorage.setItem('epicAccessToken', patientData?.accessToken)
      localStorage.setItem('epicPatientId', patientData?.patient)
      const epicUserResponse = await createPatientUserAccount(values);

      const response = await saveEpicPatientDeatils(patientObj);
      if (response.data) {
        const userData = AuthService.GetLoggedInUserData();
        let medicalhistory = []
        if (patientData.medicalHistory.length > 0) {
          medicalhistory = patientData.medicalHistory.map(hist => hist.text)
        }
        medicalhistory = [...medicalhistory, ...patientObj.allergyList]
        const params = new URLSearchParams();
        params.append('patient', patientData.patient);
        params.append('medicalhistory', medicalhistory.join(', '));
        params.append('nutritionList', values.nutrition);
        params.append('allergyList', values.allergies)
        params.append('currentProblems', values.symptoms) //Here symptopm is equal to current problem
        const queryString = params.toString();
        // navigate(`/doctor/dashboard?${queryString}`);
        navigate("/doctor/dashboard", {
          state: { userId: epicUserResponse.data?._id },
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <>
      <div className="bg-primary flex justify-between items-center px-9 py-2">
        <img src={logo} className="w-28"></img>
        <div className="hidden md:flex items-center">
          <span className="text-white text-base mr-[10px]">
            {/* {userData.firstName} {userData.lastName} */}
          </span>
        </div>
      </div>

      <div className="w-full md:w-full  overflow-y-auto">
        <div className="bg-quinary-l4 px-[30px] lg:px-[50px] xl:px-[100px] py-[20px] lg:py-[50px] border-b-[1px] border-quinary">
          <h1 className="main-title">SMART on FHIR App</h1>
        </div>
        {loading ? (
        <PageLoader />
        ) : (
        <div className="px-[30px] lg:px-[60px] xl:px-[100px] py-[30px] sm:py-[48px]">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <Formik
               enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                  checkSymptomAndDisease(values)
                
                }}
                // onSubmit={handleSubmit}

              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <Form>
                    <div className="mb-4">
                      <Field
                        type="text"
                        name="firstName"
                        className="form-input"
                        placeholder="First Name"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div className="mb-4">
                      <Field
                        type="text"
                        name="lastName"
                        className="form-input"
                        placeholder="Last Name"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div className="mb-4">
                      <Field
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="Email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div className="mb-4">
                      <PhoneInput
                        country={"us"}
                        value={values.phone}
                        onChange={(phone) => setFieldValue("phone", `+${phone}`)}
                        containerClass="form-input custom-form-input"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label>Location</label>
                      <Field
                        type="text"
                        name="location"
                        className="form-input"
                        placeholder="Enter your location"
                      />

                      <ErrorMessage name="location" component="div" />
                    </div>
                    <div className="mb-4">
                      <label>Your Doctor</label>
                      <Field
                        type="text"
                        name="doctor"
                        className="form-input"
                        placeholder="Enter your Doctor name"
                      />
                      <ErrorMessage name="doctor" component="div" className="text-red-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-4">
                        <label className="form-label text-body-color">Age</label>
                        <Field
                          type="number"
                          name="age"
                          className="form-input"
                          placeholder="Age"
                          min="0"
                        />
                        <ErrorMessage name="age" component="div" />
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-body-color">Weight</label>
                        <Field
                          type="number"
                          name="weight"
                          className="form-input"
                          placeholder="Weight"
                          min="0"
                        />
                        <ErrorMessage name="weight" component="div" className="text-red-500" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-body-color">Race</label>
                      <Field component="select" name="race" className="form-input">
                        <option value="">Select an option</option>
                        <option>Chinese</option>
                        <option>Indian (South Asian)</option>
                        <option>Southeast Asian</option>
                        <option>Japanese</option>
                        <option>Arab</option>
                        <option>Slavic</option>
                        <option>European (White/Caucasian)</option>
                        <option>African</option>
                        <option>Hispanic/Latino</option>
                        <option>Bengali </option>
                      </Field>
                      <ErrorMessage name="race" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-body-color">Gender</label>
                      <Field component="select" name="gender" className="form-input">
                        <option value="">Select an option</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-body-color">
                        Please list any known food or drug allergies
                      </label>
                      <Field
                        type="text"
                        name="allergies"
                        className="form-input"
                        placeholder="Allergies"
                      />
                      <ErrorMessage name="allergies" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-body-color">
                        Please list your symptoms or diseases
                      </label>
                      <Field
                        type="text"
                        name="symptoms"
                        className="form-input"
                        placeholder="Symptoms"
                      />
                      <ErrorMessage name="symptoms" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-body-color">
                        Please list your nutrition
                      </label>
                      <Field
                        type="text"
                        name="epicNutritionOrder"
                        className="form-input"
                        placeholder="Nutrition"
                      />
                    <ErrorMessage name="epicNutritionOrder" component="div" className="text-red-500" />
                  </div>
                    <button
                    type="submit"
                    // onClick={() => props.handleSubmitFromParent()}
                      className="btn-modal-footer bg-primary"
                    >
                      {props.Loading ? <SpinnerComponent /> : <div>Add patient <BsSend className="ml-2 inline-block" /></div>}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
         )}

        {/* <div className="px-[30px] lg:px-[60px] xl:px-[100px] py-[30px] sm:py-[48px]">
          <div className="block md:flex justify-center md:justify-between mb-3">
            <p>Loading... {loading.toString()}</p>
            {patientData ? (
              <>
                <pre>{JSON.stringify(patientData, null, 2)}</pre>
               </>
            ) : (
              <p>Loading patient data...</p>
            )}
          </div>
        </div> */}
      </div>
    </>
  );
}



export default OpenEpicLaunch;