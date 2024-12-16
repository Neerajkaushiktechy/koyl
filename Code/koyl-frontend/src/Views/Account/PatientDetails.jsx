import React from "react";
import Header from "../../Utils/Layout/Header";
import Sidebar from "../../Utils/Layout/Sidebar";
import { IoArrowBackOutline } from "react-icons/io5";
import {
  BsEmojiSmile,
  BsEmojiNeutral,
  BsEmojiFrown,
  BsTrash3,
} from "react-icons/bs";
import { Button, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPatientDetails } from "../../Store/Service/PatientServices";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DeletePatient } from "../../Store/Service/PatientServices";
import SpinnerComponent from "../../Components/Account/SpinnerComponent";
import PageLoader from "../../Components/Account/PageLoader";

function PatientDetails() {
  const [openModal, setOpenModal] = useState(false);
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [pageLoading, SetpageLoading] = useState(false);

  const [patientDetails, setPatientDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    doctor: "",
    created_at: "",
    updateDate: "",
    age: "",
    gender: "",
    race: "",
    weight: "",
    allergies: "",
    IsDeleted: false,
  });
  const [checkInLogs, setCheckInLogs] = useState([]);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [sortOrder, setSortOrder] = useState("descending");

  const fetchPatientDetails = async (id = "") => {
    SetpageLoading(true);
    const response = await getPatientDetails(id);
    if (response.success) {
      setPatientDetails(response.data);
      setCheckInLogs(response.userRecommendations);
      setUserRecommendations(response.userRecommendations);
      SetpageLoading(false)
    } else {
      console.error("Failed to fetch patients");
      SetpageLoading(false)
    }
  };

  useEffect(() => {
    fetchPatientDetails(id);
  }, [id]);

  const [remove, setRemove] = useState("");

  const HandleRemove = (e) => {
    setRemove(e.target.value);
  };

  const DeleteUser = async (id = "") => {
    if (remove === "DELETE") {
      setLoading(true);
      const response = await DeletePatient(id);
      if (response.success) {
        window.location.reload();
      } else {
        toast.error("Error deleting patient");
      }
      setLoading(false);
    }
  };

  const formatParticipation = (participation) => {
    switch (participation) {
      case "Participated":
        return (
          <span className="flex text-emoji-green items-center">
            <BsEmojiSmile className="mr-2" /> Participated
          </span>
        );
      case "Didn't Participate":
        return (
          <span className="flex text-quinary items-center">
            <BsEmojiNeutral className="mr-2" /> Didn’t Participate
          </span>
        );
      case "Didn't check in":
        return (
          <span className="flex text-text-red items-center">
            <BsEmojiFrown className="mr-2" /> Didn’t check-in
          </span>
        );
      default:
        return null;
    }
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    const sortedRecommendations = [...userRecommendations].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === "ascending" ? dateA - dateB : dateB - dateA;
    });
    setUserRecommendations(sortedRecommendations);
  };

  const LastRecommendation =
    userRecommendations.length > 0
      ? userRecommendations[userRecommendations.length - 1]
      : { createdAt: "No Appointments" };

  return (
    <>
      <div className="w-full md:w-[calc(100%-268px)] h-[calc(100vh-57px)] overflow-y-auto">
        <div className="bg-quinary-l4 px-[30px] lg:px-[50px] xl:px-[100px] py-[20px] lg:py-[50px] border-b-[1px] border-quinary">
          <h1 className="main-title">
            {patientDetails.firstName} {patientDetails.lastName}
          </h1>
        </div>
        <div className="px-[30px] lg:px-[60px] xl:px-[100px] py-[48px] md:py-[60px]">
          <div className="text-secondary text-base mb-[30px] lg:mb-[60px]">
            <Link to={`/doctor/patients`}>
              <IoArrowBackOutline className="inline-block m-2" />{" "}
              <span>Back to search</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-[60px]">
            <div>
              <span className="main-title mb-5 block">Patient Details</span>
              <ul className="patient-details">
                <li>
                  <strong>Patient at:</strong> Piedmont Gastroentrology
                </li>
                <li>
                  <strong>Assigned to:</strong> Dr.{patientDetails.doctor}
                </li>
                <li>
                  <strong>Email:</strong> {patientDetails.email}
                </li>
                <li>
                  <strong>Phone:</strong> {patientDetails.phone}
                </li>
                <li>
                  <strong>Last Appointment:</strong>{" "}
                  {typeof LastRecommendation.createdAt === "string" &&
                  !isNaN(Date.parse(LastRecommendation.createdAt))
                    ? new Date(
                        LastRecommendation.createdAt
                      ).toLocaleDateString()
                    : LastRecommendation.createdAt}
                </li>
                <li>
                  <strong>Sign up date:</strong>{" "}
                  {new Date(patientDetails.created_at).toLocaleDateString()}
                </li>
                <li>
                  <strong>Age:</strong> {patientDetails.age}
                </li>
                <li>
                  <strong>Sex:</strong> {patientDetails.gender}
                </li>
                <li>
                  <strong>Race:</strong> {patientDetails.race}
                </li>
                <li>
                  <strong>Weight:</strong> {patientDetails.weight}
                </li>
                <li>
                  <strong>Known Allergies:</strong> {patientDetails.allergies}
                </li>
                <li>
                  <strong>Is Deleted:</strong>{" "}
                  {patientDetails.IsDeleted ? "True" : "False"}
                </li>
              </ul>
            </div>
            <div>
              <span className="main-title mb-5 block">Check-in Log</span>
              <ul className="patient-details check-in">
                {checkInLogs.length > 0 ? (
                  checkInLogs.map((log) => (
                    <li
                      className="block sm:flex items-center justify-between"
                      key={log._id}
                    >
                      <p>
                        <strong>
                          {new Date(log.createdAt).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </strong>
                        : thru{" "}
                        <strong>
                          {new Date(
                            new Date(log.createdAt).setDate(
                              new Date(log.createdAt).getDate() + 7
                            )
                          ).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </strong>
                      </p>
                      {formatParticipation(log.participation)}
                    </li>
                  ))
                ) : (
                  <span className="flex text-text-red items-center ml-4">
                    No Check-in Logs available
                  </span>
                )}
              </ul>
            </div>
          </div>
          <div className="block md:flex justify-center md:justify-between mb-[60px]">
            <span className="main-title">Past Recommendations</span>
            <div className="flex items-center">
              <label className="form-label text-body-color mb-0 mr-4">
                Sort by:
              </label>
              <select
                className="form-input w-36 border-secondary text-secondary"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>
          </div>
          {pageLoading ? (
            <PageLoader/>
        ) : (
          userRecommendations.length > 0 ? (
            userRecommendations.map((recommendation) => (
              <div className="card-border mb-6" key={recommendation._id}>
                <div className="block lg:flex justify-between items-start mb-[18px]">
                  <h2 className="title">{recommendation.recommendations}</h2>
                  <p className="text-neutral-d1 text-sm sm:text-base">
                    Sent by {" "}
                    <span className="text-primary font-bold">
                      Dr.{patientDetails.doctor}{" "}
                    </span>
                    <span className="font-bold">
                      {new Date(recommendation.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </span>{" "}
                    at{" "}
                    <span className="font-bold">
                      {new Date(recommendation.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </p>
                </div>
                <p className="mb-[18px] text-base">
                  <span className="font-bold">Synopsis:</span>{" "}
                  {recommendation.synopsis}
                </p>
                <p className="mb-[18px] text-base">
                  <span className="font-bold">Consume foods like:</span>{" "}
                  {recommendation.food}
                </p>
                <div className="flex flex-wrap items-center">
                  <span className="font-bold mr-[6px]">Treats:</span>
                   {recommendation.disease.length > 0 &&
                    recommendation.disease
                      .split(",")
                      .map((disease, index) => (
                        <span key={index} className="badge sm-txt bg-quarternary">
                          {disease.trim()}
                        </span>
                      ))}
                  {recommendation.symptoms.length > 0 &&
                    recommendation.symptoms
                      .split(",")
                      .map((symptoms, index) => (
                        <span key={index} className="badge sm-txt">
                          {symptoms.trim()}
                        </span>
                      ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-text-red mb-10">
              No past recommendations available
            </p>
          )
        )}
          <a
            className="text-text-red cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            Delete Account
          </a>
        </div>
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="modal-header p-4">Delete Account</Modal.Header>
        <Modal.Body className="modal-body p-4">
          <p className="text-text-secondary mb-[18px]">
            Are you sure you want to delete {patientDetails.firstName}{" "}
            {patientDetails.lastName} account? This action cannot be undone.
          </p>
          <p className="text-text-secondary mb-[18px]">
            Type <strong>DELETE</strong> to permanently remove account
          </p>
          <textarea
            rows="3"
            className="form-input resize-none"
            value={remove}
            onChange={HandleRemove}
          ></textarea>
        </Modal.Body>
        <Modal.Footer className="justify-end p-3">
          <button
            className="btn-modal-footer bg-text-red"
            onClick={() => DeleteUser(id)}
          >
            {loading ? (
              <SpinnerComponent />
            ) : (
              <div>
                Delete Account <BsTrash3 className="ml-2 inline-block" />
              </div>
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PatientDetails;
