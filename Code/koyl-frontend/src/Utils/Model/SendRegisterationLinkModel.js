import { useEffect } from "react";
import { BsSend, BsPlus, BsPerson, BsTelephone, BsXLg } from "react-icons/bs";
import { Modal } from "flowbite-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";

export default function ShareModel(props) {
  return (
    <>
      <Modal show={openModal} onClose={handleModalClose}>
        <Modal.Header className="modal-header p-4">
          Send Registeration Link
        </Modal.Header>
        <Modal.Body className="modal-body p-4">
          <form>
            <div>
              <div className="relative">
                <PhoneInput
                  className="form-input pl-8"
                  placeholder="Enter phone number..."
                  value={phoneNumber}
                  onChange={(e)=>handlePhoneNumberChange(e)}
                  international
                  defaultCountry="US"
                />
                <BsTelephone className="absolute border-0 top-4 left-3 text-primary" />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="justify-end p-3">
          <button
            onClick={() => {
              if (!Loading) handleShare();
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
    </>
  );
}
