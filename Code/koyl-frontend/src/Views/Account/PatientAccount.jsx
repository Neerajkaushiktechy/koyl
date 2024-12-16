import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  updateUserInfo,
  getPatientDetails,
} from "../../Store/Service/PatientServices";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import AuthService from "../../service/AuthService";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PageLoader from "../../Components/Account/PageLoader";
import * as Yup from "yup";

const PatientAccountSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
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
  phone: Yup.string().required("Phone number is required"),
  symptoms: Yup.string().required("Required"),
});

function PatientAccount() {
  const [pageLoading, SetpageLoading] = useState(false);
  const userData = AuthService.GetLoggedInUserData();

  const { userId } = userData;

  const [patientDetails, setPatientDetails] = useState({
    firstName: "",
    lastName: "",
    age: "",
    race: "",
    weight: "",
    allergies: "",
    symptoms: "",
    phone: "",
    doctor: "",
  });

  const fetchPatientDetails = async (userId = "") => {
    SetpageLoading(true);
    const response = await getPatientDetails(userId);
    if (response.success) {
      setPatientDetails(response.data);
      SetpageLoading(false);
    } else {
      console.error("Failed to fetch patients");
      SetpageLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails(userId);
  }, [userId]);

  const [isLoading, setisLoading] = useState(false);
  const onUpdate = async (values) => {
    setisLoading(true);
    try {
      const formattedPhone = values.phone.startsWith("+")
        ? values.phone
        : `+${values.phone}`;
      const UpdatedUserData = { ...values, phone: formattedPhone };
      const response = await updateUserInfo(UpdatedUserData, userId);
      if (response.data.sucess) {
        toast.success("Updated Succesfully");
      } else {
        toast.error("Update Failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    setisLoading(false);
  };

  return (
    <>
      <div className="w-[calc(100%-268px)]">
        <div className="bg-quaternary-l3 xl:px-[100px] lg:px-[50px] md:px-[30px] py-[50px] border-b-[1px] border-quarternary">
          <h1 className="main-title">My Account</h1>
        </div>
        {pageLoading ? (
          <PageLoader />
        ) : (
          <div className="xl:px-[100px] lg:px-[50px] md:px-[30px] py-[48px] max-w-[900px] mx-auto">
            <Formik
              initialValues={{
                firstName: patientDetails.firstName,
                lastName: patientDetails.lastName,
                doctor: patientDetails.doctor,
                phone: patientDetails.phone,
                age: patientDetails.age,
                weight: patientDetails.weight,
                race: patientDetails.race,
                allergies: patientDetails.allergies,
                symptoms: patientDetails.symptoms,
                gender: patientDetails.gender
              }}
              onSubmit={(values) => {
                onUpdate(values);
              }}
              validationSchema={PatientAccountSchema}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  <div className="mb-4">
                    <label className="form-label text-body-color">
                      First Name <span></span>
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      className="form-input"
                      placeholder="First Name"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-500"/>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-body-color">
                      Last Name
                    </label>
                    <Field
                      type="text"
                      name="lastName"
                      className="form-input"
                      placeholder="Last Name"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-500"/>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-body-color">
                      Your Doctor
                    </label>
                    <Field
                      type="text"
                      name="doctor"
                      className="form-input"
                      placeholder="Enter your Doctor name"
                    />
                    <ErrorMessage name="doctor" component="div" className="text-red-500"/>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-body-color">Phone</label>
                    <PhoneInput
                      country={"us"}
                      value={values.phone}
                      onChange={(phone) => setFieldValue("phone", phone)}
                      containerClass="form-input custom-form-input"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="form-label text-body-color">Age</label>
                      <Field
                        type="number"
                        name="age"
                        className="form-input"
                        placeholder="Age"
                      />
                      <ErrorMessage name="age" component="div" className="text-red-500"/>
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-body-color">
                        Weight
                      </label>
                      <Field
                        type="number"
                        name="weight"
                        className="form-input"
                        placeholder="Weight"
                      />
                      <ErrorMessage name="weight" component="div" className="text-red-500"/>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-body-color">Race</label>
                    <Field
                      component="select"
                      name="race"
                      className="form-input"
                    >
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
                    <ErrorMessage name="race" component="div" className="text-red-500"/>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-body-color">Gender</label>
                    <Field
                      component="select"
                      name="gender"
                      className="form-input"
                    >
                      <option value="">Select an option</option>
                      <option>Male</option>
                      <option>Female</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="text-red-500"/>
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
                    <ErrorMessage name="allergies" component="div" className="text-red-500"/>
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
                <ErrorMessage name="symptoms" component="div" className="text-red-500"/>
              </div>
                  <div>
                    <button className="btn-theme w-full">
                      {isLoading ? <SpinnerComponent /> : "Update Profile"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </>
  );
}

export default PatientAccount;
