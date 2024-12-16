import logo from "../../assets/images/logo-koyl.svg";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import PasswordChecklist from "react-password-checklist";
import { useParams,useNavigate } from "react-router-dom";
import { changePassword } from "../../Store/Service/PatientServices";
import { toast } from "react-toastify";


const resetSchema = Yup.object().shape({
    password: Yup.string().required("Required"),
    confirmpassword: Yup.string().oneOf(
      [Yup.ref("password")],
      "Passwords must match")
  });

export default function UpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams()
  const navigate = useNavigate()
  const id = params.id
  const token = params.token
  const onSubmit = async (values) => {
    setIsLoading(true);
    const newPassword = values.password
    const response = await changePassword(id, newPassword,token);
    if(response.data && response.data.success){
      toast.success('Your password has been updated successfully');
      setIsLoading(false)
      navigate("/")
    }
    else if(response.data && !response.data.success){
      toast.error('Failed to update password');
      setIsLoading(false)

    }
    else if (response.response && response.response.status === 401) {
      toast.error('Invalid or expired link'); // display a specific error message for 401 status code
      setIsLoading(false)
      navigate("/")
    }
    else{
      toast.error('An Error occurred. Please try again');
      setIsLoading(false)
      navigate("/")
    }
  };
  return (
    <>
      <div className="bg-secondary min-h-screen flex items-center justify-center p-8">
        <div className="w-[360px]">
          <div className="text-center mb-8">
            <img src={logo} className="mx-auto mb-1"></img>
            <h1 className="text-[32px] text-white mb-3 font-bigola">
              Log in to your account
            </h1>
            <p className="text-base text-white leading-6">
              Welcome back! Please enter your details.
            </p>
          </div>
          <Formik
            initialValues={{           password: "",
                confirmpassword: ""}}
            onSubmit={async (values) => {
              onSubmit(values);
            }}
            validationSchema={resetSchema}
          >
            {({ isSubmitting,values }) => (
              <Form>
                <div className="mb-4">
              <label className="form-label">Password</label>
              <Field
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your New-Password"
              />
              <ErrorMessage name="password" component="div" />
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
              <ErrorMessage name="confirmpassword" component="div" />
            </div>
            {values.password ? (
        <PasswordChecklist
          rules={["minLength", "specialChar", "number", "capital", "match"]}
          minLength={8}
          value={values.password}
          valueAgain={values.confirmpassword}
        />
      ) : null}
                      <div>
                  <button
                    type="submit"
                    className="btn-theme w-full mb-4 mt-4"
                    disabled={isSubmitting || isLoading} // Disable button
                  >
                    {isLoading ? <SpinnerComponent /> : "Reset Password"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
