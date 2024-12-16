import LoginForm from '../../Utils/Forms/LoginForm'
import logo from '../../assets/images/logo-koyl.svg'
import { Link } from 'react-router-dom'


export default function LoginPage() {
  return (
    <>

      <div className="bg-secondary min-h-screen flex items-center justify-center p-8">
        <div className="w-[360px]">
          <div className="text-center mb-8">
            <img src={logo} className="mx-auto mb-1"></img>
            <h1 className="text-[32px] text-white mb-3 font-bigola">Log in to your account</h1>
            <p className="text-base text-white leading-6">Welcome back! Please enter your details.</p>
          </div>
          <LoginForm />
          <p className="text-label text-base font-normal mt-8 text-center">Don’t have an account? <Link to="/sign-up"  className="text-primary border-b-[1px] border-primary  ">Sign up</Link></p>
          <p className="text-label text-base font-normal mt-2 text-center">Forgot Your Password? <Link to="/verify-email"  className="text-primary border-b-[1px] border-primary  ">Click-here</Link></p>
        </div>
      </div></>
  )
}