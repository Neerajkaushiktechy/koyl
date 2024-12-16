import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { BsEyeSlash } from "react-icons/bs";
import { AiOutlineGoogle } from "react-icons/ai";
import * as Yup from "yup";
import { LoginUser, CheckUser } from "../../Store/Service/loginService";
import AuthService from "../../service/AuthService";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { GoogleService } from "../../Store/Service/GoggleService";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";
import { signupUser } from "../../Store/Service/signupService";
import PageLoader from "../../Components/Account/PageLoader";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter valid email")
    .required("Please enter you email"),
  password: Yup.string().required("Please enter your password"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const [shouldValidate, setShouldValidate] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, SetpageLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      SetpageLoading(true);
      setShouldValidate(false);

      const userInfo = await GoogleService(tokenResponse.access_token);

      try {
        const checkUserResult = await CheckUser(userInfo.email);

        if (checkUserResult.data.success) {
          AuthService.LoggedInUserSession(checkUserResult.data.token);
          const userData = AuthService.GetLoggedInUserData();
          toast.success("Login Successfully");
          if (userData.role === 0) {
            navigate("patient/account", {});
          } else if (userData.role === 1) {
            navigate("doctor/patients");
          }
        } else if (!checkUserResult.data.success) {
          let user = {
            firstName: userInfo.given_name,
            email: userInfo.email,
          };

          // signupUser
          const uservalue = await signupUser(user);

          const checkUserResult = await CheckUser(uservalue.data.data.email);

          if (checkUserResult.data.success) {
            AuthService.LoggedInUserSession(checkUserResult.data.token);
            const userData = AuthService.GetLoggedInUserData();

            toast.success("Login Successfully");
            if (userData.role === 0) {
              navigate("patient/account", {});
            } else if (userData.role === 1) {
              navigate("doctor/patients");
            }
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } catch (error) {
        toast.error("Login failed. Please try again.");
      } finally {
        SetpageLoading(false);
      }
    },
  });

  const handleGoogleLoginClick = () => {
    login();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values) => {
    setIsLoading(true); // Start loading
    await LoginUser(values).then((res) => {
      if (res.status === 200) {
        AuthService.LoggedInUserSession(res.data.token);
        const userData = AuthService.GetLoggedInUserData();

        toast.success("Login Successfully");
        if (userData.role === 0) {
          navigate("patient/recommendations", {});
        } else if (userData.role === 1) {
          navigate("doctor/patients");
        }
      } else {
        if (res.status === 400) {
          toast.error("Invalid Credentials");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
      setIsLoading(false); // End loading
    });
  };

  return pageLoading ? (
    <PageLoader />
  ) : (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          onSubmit(values);
        }}
        validationSchema={shouldValidate ? LoginSchema : null}
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
              <ErrorMessage name="email" component="div" className="text-red-500"/>
            </div>
            <div className="mb-6">
              <label className="form-label">Password</label>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="password"
                />
                <ErrorMessage name="password" component="div" className="text-red-500"/>
                <BsEyeSlash
                  onClick={togglePasswordVisibility}
                  className="absolute top-[10px] right-3 text-icon"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn-theme w-full mb-4"
                disabled={isSubmitting || isLoading} // Disable button
              >
                {isLoading ? <SpinnerComponent /> : "Sign in"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <button
        onClick={handleGoogleLoginClick}
        className="btn-border w-full flex items-center justify-center"
      >
        <AiOutlineGoogle className="mr-2 w-[18px] h-[18px]" /> Sign in with
        Google
      </button>
    </>
  );
}
