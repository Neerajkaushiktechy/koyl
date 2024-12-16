import React from 'react'
import image from '../../assets/images/thanks-for-info.png'
import { useNavigate } from 'react-router-dom'

function ThanksForInfo() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-[360px]">
      <h1 className="text-[32px] font-bigola mb-8">Thanks for the info!</h1>
      <img className="mb-6 mx-auto" src={image}></img>
      <p className="mb-4 text-3xl">
        <strong>"</strong>
        <span className="italic font-extralight">Let food be thy medicine and medicine be thy food.</span>
        <strong>"</strong>
        </p>
        <span className="font-bold text-xl mb-6 block">-Hippocrates</span>
      <div>
        <button className="w-full btn-share mb-6 py-2 text-base" onClick={()=>{navigate('/')}}>Back to Home</button>
      </div>
    </div>
    </div>
  )
}

export default ThanksForInfo