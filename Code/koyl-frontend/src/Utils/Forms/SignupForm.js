import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signupUser } from "../../Store/Service/signupService";
import { AiOutlineGoogle } from "react-icons/ai";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleService } from "../../Store/Service/GoggleService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { ExistingUser } from "../../Store/Service/ExistingUser";
import PasswordChecklist from "react-password-checklist";

const SignupSchema = Yup.object().shape({
  location: Yup.string().required("Required"),
  doctor: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  confirmpassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must match"
  ),
});

export default function SignupForm() {
  const navigate = useNavigate();
  const [shouldValidate, setShouldValidate] = useState(true);

  const onSignup = (values) => {
    const { confirmpassword, ...data } = values;
    navigate("/complete-profile", { state: { userdata: data } });
  };

  const GoggleSingup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setShouldValidate(false);
      const userInfo = await GoogleService(tokenResponse.access_token);
      const { given_name: firstName, family_name: lastName, email } = userInfo;
      const userExists = await ExistingUser(email);
      const userObject = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };
      if (userExists.data.success) {
        toast.error("email already exists.");
        navigate("/");
      } else {
        onSignup(userObject);
      }
    },
  });
  const handleGoogleSingupClick = () => {
    setShouldValidate(false);
    GoggleSingup();
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          location: "",
          doctor: "",
          email: "",
          password: "",
          confirmpassword: "",
        }}
        onSubmit={(values, { resetForm }) => {
          const { confirmpassword, ...data } = values;
          onSignup(data);
          resetForm();
        }}
        validationSchema={shouldValidate ? SignupSchema : null}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <div className="mb-4">
              <label className="form-label">Location</label>
              <Field
                type="text"
                name="location"
                className="form-input"
                placeholder="Enter your location"
              />

              <ErrorMessage name="location" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className="form-label">Your Doctor</label>
              <Field
                type="text"
                name="doctor"
                className="form-input"
                placeholder="Enter your Doctor name"
              />
              <ErrorMessage name="doctor" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className="form-label">Email</label>
              <Field
                type="email"
                name="email"
                id="email"
                className="form-input"
                autoComplete="new-email"
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <Field
                type="password"
                name="password"
                className="form-input"
                autoComplete="new-password"
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>
            <div className="mb-6">
              <label className="form-label">Re-enter Password</label>
              <div className="relative">
                <Field
                  type="password"
                  name="confirmpassword"
                  className="form-input"
                  placeholder="Re-Enter your password"
                />
              </div>
              <ErrorMessage name="confirmpassword" component="div" className="text-red-500" />
            </div>
            {values.password ? (
              <PasswordChecklist
                rules={[
                  "minLength",
                  "specialChar",
                  "number",
                  "capital",
                  "match",
                ]}
                minLength={8}
                value={values.password}
                valueAgain={values.confirmpassword}
              />
            ) : null}
            <div>
              <button className="btn-theme w-full mb-4 mt-4">Create Account</button>
              <button
                onClick={handleGoogleSingupClick}
                className="btn-border w-full flex items-center justify-center"
              >
                <AiOutlineGoogle className="mr-2 w-[18px] h-[18px]" /> Create
                Account with Google
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
