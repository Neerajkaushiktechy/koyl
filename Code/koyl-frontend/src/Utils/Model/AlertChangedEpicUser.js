import { useEffect } from "react";
import { BsSend, BsPlus, BsPerson, BsTelephone, BsXLg } from "react-icons/bs";
import { Modal } from "flowbite-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";

export default function AlertChangedEpicUser(props) {
  const {openModal, epicUserChangedMessage, handleModalClose, title} = props;
  return (
    <>
      <Modal show={props.openModal} onClose={() => handleModalClose({
                showAlert:true,
                alertMessage:"This is non registred Epic Patient"
              })}>
        <Modal.Header className="modal-header p-4">
          {props.title}
        </Modal.Header>
        <Modal.Body className="modal-body p-4">
            <div class="p-4 md:p-5 space-y-4">
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    {epicUserChangedMessage}
                </p>
            </div>
        </Modal.Body>
        <Modal.Footer className="justify-end p-3">
          <button
            onClick={() => handleModalClose({
                showAlert:true,
                alertMessage:"This is non registred Epic Patient"
              })}
            className="btn-share"
            // disabled={Loading}
          >
            OK
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
