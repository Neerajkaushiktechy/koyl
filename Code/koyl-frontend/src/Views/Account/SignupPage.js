import { Link } from 'react-router-dom'
import SignupForm from '../../Utils/Forms/SignupForm'
import logo from '../../assets/images/logo-koyl.svg'

export default function SignupPage() {
  return (
    <>
      <div className="bg-secondary min-h-screen flex items-center justify-center p-8">
     <div className="w-[360px]">
       <div className="text-center mb-8">
          <img src={logo} className="mx-auto mb-1"></img>
          <h1 className="text-[32px] text-white mb-3 font-bigola">Let’s create an account</h1>
       </div>     
          <SignupForm />

          <p className="text-label text-base font-normal mt-8 text-center">Already have an account? <Link to="/" className="text-primary border-b-[1px] border-primary  ">Login</Link></p>
        </div>
      </div></>
  )
}