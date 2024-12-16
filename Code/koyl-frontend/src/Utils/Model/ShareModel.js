import { useEffect } from "react";
import { BsSend, BsPlus, BsPerson, BsTelephone, BsXLg } from "react-icons/bs";
import { Modal } from "flowbite-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";

export default function ShareModel(props) {
  const {
    openModal,
    setOpenModal,
    setPatient,
    handleChange,
    getInputValue,
    selectedUser,
    handleClearSelection,
    searched,
    getData,
    showList,
    handleSelectUser,
    phoneNumber,
    handleShare,
    setPhoneNumber,
    setInputValue,
    Loading,
    setShowList,
    setSelectedUser,
    patientDetails
  } = props;

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };
  const handleModalClose = () => {
    setInputValue("");
    setPhoneNumber("");
    setOpenModal(false);
    setShowList(true);
    setSelectedUser({});
  };

  const isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0;
  };
  useEffect(() => {
    if (openModal && !isEmptyObject(patientDetails)) {
      handleSelectUser(patientDetails);
    }
  }, [openModal, patientDetails]);
  return (
    <>
      <Modal show={openModal} onClose={handleModalClose}>
        <Modal.Header className="modal-header p-4">
          Share nutritional recommendation
        </Modal.Header>
        <Modal.Body className="modal-body p-4">
          <form>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="form-label text-text-secondary">
                  Find a patient
                </label>
              </div>
              <div className="relative">
                <input
                  className="form-input pl-8"
                  placeholder="Enter name..."
                  onChange={(e) => handleChange(e.target.value)}
                  value={getInputValue}
                ></input>
                <BsPerson className="absolute top-4 left-3 text-primary" />
                {selectedUser?.firstName && (
                  <div className="absolute top-3 left-8">
                    <span className="bg-primary text-white rounded p-2 text-base me-3">
                      {selectedUser?.firstName}{" "}
                      <BsXLg
                        className="text-white ml-3 inline"
                        onClick={handleClearSelection}
                      />
                    </span>
                  </div>
                )}
              </div>

              {searched && getData.length === 0 ? (
                <div className="border-[1px] border-outline px-4 py-3 mt-3 text-center text-gray-500">
                  No data found
                </div>
              ) : (
                <>
                  {getInputValue !== "" && showList && getData?.length > 0 ? (
                    <div className="border-[1px] border-outline px-4 py-3 mt-3">
                      <ul>
                        {getData.map((value, index) => {
                          return (
                            <li
                              key={index}
                              onClick={() => handleSelectUser(value)}
                              className="leading-6 mb-1 grid grid-cols-1 gap-4"
                            >
                              <span className="whitespace-normal break-words">
                                {" "}
                                {`${value?.firstName} ${value.lastName ? value.lastName : ''}`}
                                {value.phone && ` (${value.phone})`}
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      <a
                        onClick={() => setPatient(true)}
                        className="text-primary text-sm flex items-center cursor-pointer"
                      >
                        <BsPlus className="inline w-5 h-5 mr-1" /> Add new
                        patient
                      </a>
                    </div>
                  ) : null}
                </>
              )}
            </div>
            <div className="m-[18px] text-center">
              <span>or</span>
            </div>
            <div>
              <label className="form-label text-body-color">
                Text recommendation
              </label>
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
                Share <BsSend className="ml-2 inline-block" />
              </>
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
