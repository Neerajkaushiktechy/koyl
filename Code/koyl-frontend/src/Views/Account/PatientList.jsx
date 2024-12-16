import React, { useState, useEffect } from "react";
import { BsSearch, BsPlus, BsTrash3 } from "react-icons/bs";
import { Pagination } from "flowbite-react";
import { getPatients } from "../../Store/Service/PatientServices";
import { DeletePatient } from "../../Store/Service/PatientServices";
import { toast } from "react-toastify";
import PageLoader from "../../Components/Account/PageLoader";
import AddPatientModel from "../../Utils/Model/AddPatientModel";
import { ExistingUser } from "../../Store/Service/ExistingUser";
import { signupUser } from "../../Store/Service/signupService";
import { useNavigate } from "react-router-dom";
import PatientDetails from "./PatientDetails";
import { Modal } from "flowbite-react";
import SpinnerComponent from "../../Components/Account/SpinnerComponent.js";

function PatientList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPatients, setTotalPatients] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("asc");
  const [pageLoading, SetpageLoading] = useState(false);
  const [addPatient, setPatient] = useState(false);
  const [isLoading, SetisLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [remove, setRemove] = useState("");
  const [Deleteloading, setDeleteLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const navigate = useNavigate();
  const fetchPatients = async (
    query = "",
    page = 1,
    limit = 10,
    sort = "asc"
  ) => {
    SetpageLoading(true);
    const response = await getPatients(query, page, limit, sort);
    if (response.success) {
      setPatients(response.data);
      setTotalPatients(response.total);
      SetpageLoading(false);
    } else {
      console.error("Failed to fetch patients");
      SetpageLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(searchQuery, currentPage, recordsPerPage, sortOrder);
  }, [searchQuery, currentPage, recordsPerPage, sortOrder]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const onPageChange = (page) => setCurrentPage(page);

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(e.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleSubmitFromParent = async (values) => {
    if (values && values.email) {
      SetisLoading(true);
      const { email } = values;
      try {
        const userExists = await ExistingUser(email);
        if (userExists.data.success) {
          toast.error("Email already Exists");
        } else if (!userExists.data.success) {
          signupUser(values);
          toast.success("Patient Added successfully");
          setPatient(false);
        } else {
          toast.error("Server error");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
      SetisLoading(false);
    }
  };

  const HandleRemove = (e) => {
    setRemove(e.target.value);
  };
  const DeleteUser = async (id = "") => {
    if (remove === "DELETE") {
      setDeleteLoading(true);
      const response = await DeletePatient(id);
      if (response.success) {
        toast.success("Patient deleted successfully");
        setPatients(patients.filter((patient) => patient._id !== id));
      } else {
        toast.error("Error deleting patient");
      }
      setDeleteLoading(false);
      setOpenModal(false)
      setRemove("")
    }
  };
  return (
    <div className="w-full md:w-[calc(100%-268px)] h-[calc(100vh-57px)] overflow-y-auto">
      <div className="bg-quinary-l4 px-[30px] lg:px-[50px] xl:px-[100px] py-[20px] lg:py-[50px] border-b-[1px] border-quinary">
        <h1 className="main-title">Patients</h1>
      </div>
      <div className="px-[30px] lg:px-[60px] xl:px-[100px] py-[30px] sm:py-[48px]">
        <div className="block md:flex justify-center md:justify-between mb-3">
          <div className="relative">
            <input
              className="form-input pl-10 w-full md:w-64 xl:w-[390px] mb-3 md:mb-0"
              placeholder="Search for patient"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <BsSearch className="absolute top-[10px] left-3 text-primary" />
          </div>
          
          <div className="flex items-center">
          <span
              className="text-primary text-sm mt-2 hover:cursor-pointer mr-4 mb-2"
              onClick={() => setPatient(true)}
            >
              <BsPlus className="inline w-5 h-5 mr-1" /> Add new patient
            </span>
            <label className="form-label text-body-color mb-0 mr-4">
              Sort by:
            </label>
            <select
              className="form-input w-36 border-secondary text-secondary"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        {pageLoading ? (
          <PageLoader />
        ) : (
          <div className="custom-table overflow-x-auto mb-3">
            <table className="w-full">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td>{patient.firstName}</td>
                    <td>{patient.lastName}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.email}</td>
                    <td>
                      <span
                        className="text-primary  hover:underline border-r-[1px] border-divider pr-2 mr-2 hover:cursor-pointer"
                        onClick={() => {
                          navigate("/doctor/dashboard", {
                            state: { userId: patient._id },
                          });
                        }}
                      >
                        Send Recommendation
                      </span>
                      <a
                        href="#"
                        className="text-text-red hover:underline"
                        onClick={() => {
                          setOpenModal(true);
                          setSelectedPatient(patient);
                        }}
                      >
                        Remove
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div>
          <div className="block xl:flex items-center justify-center xl:justify-between overflow-x-auto">
            <div className="flex items-center justify-center mb-3 xl:mb-0">
              <span className="text-body-color mr-2">
                Total {totalPatients} items
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalPatients / recordsPerPage)}
                onPageChange={onPageChange}
                className="custom-pagination"
              />
            </div>
            <div className="flex items-center justify-center">
              <select
                className="form-input w-32 border-outline text-input rounded-[4px] mr-3"
                value={recordsPerPage}
                onChange={handleRecordsPerPageChange}
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <div className="flex items-center">
                <label className="form-label text-body-color mb-0 mr-1">
                  Go to
                </label>
                <input
                  type="number"
                  className="form-input w-[65px]"
                  value={currentPage}
                  onChange={(e) => onPageChange(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddPatientModel
        setPatient={setPatient}
        handleSubmitFromParent={handleSubmitFromParent}
        addPatient={addPatient}
        Loading={isLoading}
      />
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="modal-header p-4">Delete Account</Modal.Header>
        <Modal.Body className="modal-body p-4">
          <p className="text-text-secondary mb-[18px]">
            Are you sure you want to delete {selectedPatient?.firstName}{" "}
            {selectedPatient?.lastName} account? This action cannot be undone.
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
            onClick={() => DeleteUser(selectedPatient?._id)}
          >
            {Deleteloading ? (
              <SpinnerComponent />
            ) : (
              <div>
                Delete Account <BsTrash3 className="ml-2 inline-block" />
              </div>
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PatientList;
