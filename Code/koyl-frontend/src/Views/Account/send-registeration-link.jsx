import React from 'react'
import { SendRegisterationLink } from "../../Store/Service/TwillioService.js";
import { Modal } from "flowbite-react";
import PhoneInput from "react-phone-input-2";
import SpinnerComponent from "../../Components/Account/SpinnerComponent.js";
import { toast } from "react-toastify";
import {BsSend } from "react-icons/bs";
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';

const SendCreateAccountLink = () => {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [Loading, setLoading] = useState(false);

    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value);
      };
    
      const SendLink = async (phoneNumber) => {
        const number = `+${phoneNumber}`;
        setLoading(true);
        let response = await SendRegisterationLink(number);
        if (response?.data?.success) {
          toast.success("Registeration link sent successfully");
          setLoading(false);
          setOpenModal(false);
          setPhoneNumber("");
          navigate(-1)
        } else if(!response?.data?.success) {
          toast.error("Failed to send registeration link");
          setLoading(false);
          setOpenModal(false);
          setPhoneNumber("");
          navigate(-1)
        }
        else{
          setLoading(false);
        setOpenModal(false);
        setPhoneNumber("");
        navigate(-1)
        }
        
      };

      const onClose = ()=>{
        setOpenModal(false);
        navigate(-1)
      }
  return (
    <div>
      <Modal show={openModal} onClose={() => onClose()}>
        <Modal.Header className="modal-header p-4">
          Send Registeration Link
        </Modal.Header>
        <Modal.Body className="modal-body p-4">
          <div>
            <label className="form-label text-body-color">
              Text recommendation
            </label>
            <div className="relative">
              <PhoneInput
                placeholder="Enter phone number..."
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                containerClass="form-input custom-form-input"
                international
                country={"us"}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end p-3">
          <button
            onClick={() => {
              if (!Loading) SendLink(phoneNumber);
            }}
            className="btn-share"
            disabled={Loading}
          >
            {Loading ? (
              <SpinnerComponent />
            ) : (
              <>
                Send <BsSend className="ml-2 inline-block" />
              </>
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default SendCreateAccountLink
