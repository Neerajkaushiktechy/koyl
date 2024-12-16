import React, { useState } from 'react'
import image from '../../assets/images/how-did-it-go.png'
import { useNavigate, useParams } from "react-router-dom";
import {updateUserParticipation} from '../../Store/Service/PatientServices'
import { toast } from "react-toastify";
import SpinnerComponent from '../../Components/Account/SpinnerComponent';

function HowDidItGo() {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id

  const [isLoading,SetisLoading] = useState(false)

  const handleParticipation = async (participate) => {
    SetisLoading(true)
    const response = await updateUserParticipation(id, { participate });
    if (response.status===200) {
      SetisLoading(false)
        toast.success('Your Feedback has been recorded');
        navigate('/Thank-You')
    } else {
      SetisLoading(false)
        toast.error('An error occured while recording your feedback');
    }
    
};

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-[360px]">
      <h1 className="text-[32px] font-bigola mb-8" style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>How did it go?</h1>
      <img className="mb-6 mx-auto" src={image}></img>
      <p className="mb-6">Your doctor provided you with a new dietary regimen and it has been about a week. Were you able to incorporate some of these foods into your diet?</p>
      {isLoading?<SpinnerComponent style={{display: 'block', margin: '30px auto 0 160px'}}/>:
      <div>
        <button className="w-full btn-share mb-6 py-2 text-base" onClick={()=>{handleParticipation(true)}}>Yes</button>
        <button className="w-full btn-save py-2 text-base"onClick={()=>{handleParticipation(false)}}>No</button>
      </div>}
    </div>
    </div>
  )
}

export default HowDidItGo