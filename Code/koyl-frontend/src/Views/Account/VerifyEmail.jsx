import logo from "../../assets/images/logo-koyl.svg";
import { Link } from "react-router-dom";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { ExistingUser } from "../../Store/Service/ExistingUser";
import { toast } from "react-toastify";
import { SendForgotPasswordLink} from "../../Store/Service/PatientServices";
import * as Yup from "yup";

const resetSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter valid email")
      .required("Please enter you email"),
  });

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (values) => {
    setIsLoading(true);
    const email= values.email
    const existingUser= await ExistingUser(email)

    if(existingUser.data.success){
        const sendLink = async(email)=>{
            await SendForgotPasswordLink(email)
            toast.success("A link has been sent to your email")
        }
        sendLink(email)
        setIsLoading(false)
    }
    else if(!existingUser.data.success){
        toast.error("Email not found")
        setIsLoading(false)
    }
    else{
        toast.error("Server Error")
        setIsLoading(false)
    }
    setIsLoading(false)
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
            initialValues={{ email: "" }}
            onSubmit={async (values) => {
              onSubmit(values);
            }}
            validationSchema={resetSchema}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label className="form-label">Email</label>
                  <Field
                    type="text"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" />
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn-theme w-full mb-4"
                    disabled={isSubmitting || isLoading} // Disable button
                  >
                    {isLoading ? <SpinnerComponent /> : "Verify Email"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <p className="text-label text-base font-normal mt-8 text-center">
            Don’t have an account?{" "}
            <Link
              to="/sign-up"
              className="text-primary border-b-[1px] border-primary  "
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
