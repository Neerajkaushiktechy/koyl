import React, { useState } from "react";
import logo from "../../assets/images/logo-koyl.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signupUser } from "../../Store/Service/signupService";
import { toast } from "react-toastify";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CompleteProfileSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
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

function CompleteProfile() {
  const location = useLocation();
  const userinfo = location.state.userdata;

  const navigate = useNavigate();

  const [isLoading, SetisLoading] = useState(false);
  const onSignup = async (values) => {
    SetisLoading(true);
    try {
      const formattedPhone = values.phone.startsWith('+') ? values.phone : `+${values.phone}`
      const CompleteData = { ...values, phone: formattedPhone, ...userinfo };
      const response = await signupUser(CompleteData);
      if (response.data.sucess) {
        toast.success("Registration successful!");
        navigate("/");
      } else if(response.status===200) {
        toast.error("User already exists");
        navigate("/");
      }
      else{
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    SetisLoading(false);
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-8">
      <div className="w-[360px] mx-auto">
        <div className="mb-8 text-center">
          <img src={logo} alt="" className="mx-auto mb-1"></img>
          <h1 className="text-[32px] text-text-secondary mb-3 font-bigola">
            One Last Step...
          </h1>
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            firstName: userinfo.firstName || "",
            lastName: userinfo.lastName || "",
            age: "",
            weight: "",
            race: "",
            allergies: "",
            symptoms: "",
            gender: "",
            phone: "",
          }}
          onSubmit={(values, { resetForm }) => {
            onSignup(values);
            resetForm();
          }}
          validationSchema={CompleteProfileSchema}
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
                <label className="form-label text-body-color">Last Name</label>
                <Field
                  type="text"
                  name="lastName"
                  className="form-input"
                  placeholder="Last Name"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-500"/>
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
              <div>
                <button className="btn-theme w-full" type="submit">
                  {isLoading ? <SpinnerComponent /> : "Complete Profile"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CompleteProfile;
