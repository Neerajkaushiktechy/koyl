import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { BsSend } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import {  Modal } from "flowbite-react";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function AddPatientModel(props) {
  const initialValues = {
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
    
    
  };

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
  });

  return (
    <>
      <Modal show={props.addPatient} onClose={() => props.setPatient(false)}>
        <Modal.Header className="modal-header p-4">
          Add a patient
        </Modal.Header>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            props?.handleSubmitFromParent(values);
          }}
        >
          {({ isSubmitting,setFieldValue, values }) => (
            <Form>
              <Modal.Body className="modal-body p-4 h-96 overflow-y-auto">
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

              <ErrorMessage name="location" component="div" className="text-red-500"/>
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
                  <ErrorMessage name="age" component="div" className="text-red-500"/>
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
                  <ErrorMessage name="weight" component="div" className="text-red-500"/>
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
                <ErrorMessage name="race" component="div" className="text-red-500"/>
              </div>
              <div className="mb-4">
                <label className="form-label text-body-color">Gender</label>
                <Field component="select" name="gender" className="form-input">
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
              </Modal.Body>
              <Modal.Footer className="justify-between items-center p-3">
                <span className="text-primary text-base">
                  <a onClick={() => props.setPatient(false)}>
                    <IoArrowBackOutline className="inline-block mr-1" />{" "}
                    <span>Go back</span>
                  </a>
                </span>
                <button
                  type="sumbit"
                  onClick={() => props.handleSubmitFromParent()}
                  className="btn-modal-footer bg-primary"
                >
                  {props.Loading ? <SpinnerComponent /> : <div>Add patient <BsSend className="ml-2 inline-block" /></div>}
                </button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
