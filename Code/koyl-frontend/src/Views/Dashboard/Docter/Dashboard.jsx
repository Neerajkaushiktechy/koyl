import React, { useEffect, useState, useRef } from "react";
import {
  BsTag,
  BsSearch,
} from "react-icons/bs";
import { Link, useLocation} from "react-router-dom";
import {
  DeleteRecommendation,
  FetchRecommendation,
} from "../../../Store/Service/SaveRecommendation";
import { toast } from "react-toastify";
import ShareModel from "../../../Utils/Model/ShareModel";
import { SearchByName } from "../../../Store/Service/SearchByName";
import { TwillioService } from "../../../Store/Service/TwillioService";
import { SaveShareRecommendation } from "../../../Store/Service/SaveRecommendation";
import { DataCategorization } from "../../../Store/Service/ChatgptService";
import SpinnerComponent from "../../../Components/Account/SpinnerComponent";
import PageLoader from "../../../Components/Account/PageLoader";
import { getPatientDetails } from "../../../Store/Service/PatientServices";
import AlertChangedEpicUser from "../../../Utils/Model/AlertChangedEpicUser";
import { LogoutUser } from "../../../Store/Service/LogoutService";

function Dashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [searchValues, setsearchValues] = useState([]);
  const [getTableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [getInputValue, setInputValue] = useState("");
  const [searched, setSearched] = useState(false);
  const [getData, setData] = useState([]);
  const [showList, setShowList] = useState(true);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedFoodIndex, setSelectedFoodIndex] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [addPatient, setPatient] = useState(false);
  const [isLoading, SetisLoading] = useState(false);
  const [Diseases, setDiseases] = useState([]);
  const [Symptoms, setSymptoms] = useState([]);
  const [Allergies, setAllergies] = useState([]);
  const searchDiseasesRef = useRef();
  const [PatientDetailLoading,setPatientDetailLoading] = useState(false)
  const [AllergysearchInput,setAllergysearchInput] = useState([])
  const [patientID, setpatientID] = useState(null)
  const [symptomLoading, SetsymptomLoading] = useState(false);
  const [pageLoading, SetpageLoading] = useState(false);
  const location = useLocation();
  const id = location?.state?.userId || null;
  const [patientDetails, setPatientDetails] = useState({});
  const [epicUserChangedAlert, setEpicUserChangedAlert] = useState({
    title:"",
    showAlert:false,
    alertMessage: ""
  })

  const parseEpicAccessJwtToken = (token) => {
    try {
      const decodedToken =  JSON.parse(atob(token.split(".")[1]));
      const currentEpochTime = Math.floor(new Date().getTime() / 1000);
      const epicAccessTokenTime = decodedToken.exp.toString()
      const epochTimeDiff = epicAccessTokenTime - currentEpochTime;
      if(epochTimeDiff <= 300){
        setEpicUserChangedAlert({
          title: "Epic Session Time Out",
          showAlert:true,
          alertMessage: "Epic Token Has been Expired"
        })
        setTimeout(() => {
          LogoutUser();
          window.location.href = "/";
        }, 3000);
      }
    } catch (error) {
      console.error("Error parsing JWT:", error);
      // return null;
    }
  };
  
  const checkEpicPatient = async (changedEpicPatientId="") => {
    const selectedEpicPatient = localStorage.getItem('epicPatientId')
    const epicAccessToken = localStorage.getItem('epicAccessToken')
    if(epicAccessToken && epicAccessToken.length > 0){
      parseEpicAccessJwtToken(epicAccessToken)
      if(changedEpicPatientId.length > 0 && selectedEpicPatient.length==0){
        localStorage.setItem('epicPatientId', changedEpicPatientId)
      }
      else if(changedEpicPatientId.length > 0 && changedEpicPatientId !== selectedEpicPatient) {
        localStorage.setItem('epicPatientId', changedEpicPatientId)
        setEpicUserChangedAlert({
          title:"Epic Patient Changed Alert",
          showAlert:true,
          alertMessage:"This is the not the same Epic Patient which you previously selected."
        })
        
      }else if(changedEpicPatientId==""){
        localStorage.setItem("epicPatientId", "")
        setEpicUserChangedAlert({
          title:"Epic Patient Changed Alert",
          showAlert:true,
          alertMessage:"This is non registred Epic Patient. Hence clinical notes will not saved."
        })
      }
    }
  }

  const fetchPatientDetails = async (id = "") => {
    setPatientDetailLoading(true)
    const response = await getPatientDetails(id);
    if (response.success) {
      checkEpicPatient(response.data?.epicPatientId)
      setPatientDetails(response.data);
      setPatientDetailLoading(false)
    } else {
      console.error("Failed to fetch patients");
      setPatientDetailLoading(false)
    }
    setPatientDetailLoading(false)
  };
  useEffect(() => {
    if (id !== null) {
      setpatientID(id)
      fetchPatientDetails(id);
    }
  }, [id]);

  const handleModalClose = () => {
    setEpicUserChangedAlert({
      title:"",
      showAlert:false,
      alertMessage: ""
    })
  }

  useEffect(() => {
    const getRecommendation = async (id) => {
      SetpageLoading(true);
      try {
        const response = await FetchRecommendation(id);
        const data = response?.data || [];
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTableData(sortedData);
      } catch (error) {
        console.log(error);
      } finally {
        SetpageLoading(false);
      }
    };

    getRecommendation(id);
  }, []);

  useEffect(() => {
    if (Object.keys(patientDetails).length > 0) {
      setSearchInput(
        `${patientDetails.symptoms || ""}`
      );
    }
  }, [patientDetails]);

  

  useEffect(() => {
    if (Object.keys(patientDetails).length > 0) {
      setAllergysearchInput(
        `${patientDetails.allergies || ""}`
      );
    }
  }, [patientDetails]);

  const handleAllergyInputChange = (event) => {
    setAllergysearchInput(event.target.value);
  };

  const handleInputChange = (event) => {
  setSearchInput(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const getCategorizedData = async (searchValues) => {
    SetsymptomLoading(true);
    try {
      if (!Array.isArray(searchValues)) {
        throw new Error("Invalid search values");
      }

      const searchData = searchValues.join(", ");

      const chatgptData = await DataCategorization(searchData);

      let data = chatgptData?.data?.response;
      const startIndex = data?.indexOf("{");
      const endIndex = data?.lastIndexOf("}");
      const jsonSegment = data?.substring(startIndex, endIndex + 1);
      try {
        const categorizedData = JSON.parse(jsonSegment);
        const symptoms = categorizedData?.Symptom || [];
        const diseases = categorizedData?.Disease || [];
        const allergies = categorizedData?.Allergies || [];
        setDiseases(diseases);
        setSymptoms(symptoms);
        setAllergies(allergies);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } catch (error) {
      console.error("Error in getCategorizedData function:", error.message);
    } finally {
      SetsymptomLoading(false);
    }
  };

  const handleSubmit = (event) => {
    const input = `${searchInput} ${AllergysearchInput}`
    const searchValues = input.split(",").map((value) => value.trim());

    setsearchValues(searchValues);
    getCategorizedData(searchValues);
  };

  const handleDelete = async (id) => {
    try {
      const response = await DeleteRecommendation(id);
      if (response.status === 200) {
        toast.success("recommendation deleted sucessfully");
        setTableData(getTableData.filter((item) => item._id !== id));
      } else {
        toast.error("Error deleting recommendation");
      }
    } catch (error) {
      console.error("Error deleting recommendation:", error);
      toast.error("Error deleting recommendation");
      // Handle error or display error message
    }
  };

  const handleRemcommendationModel = (index) => {
    setOpenModal(true);
    setSelectedFoodIndex(index);
  };

  const handleChange = (value) => {
    setInputValue(value);
  };

  //handle search list for paitent
  const fetchData = async (value) => {
    try {
      if (value === "") {
        setData([]);
        setSearched(false);
        return;
      } else {
        const user = await SearchByName(value);
        if (user.status === 200) {
          const data = user?.data?.users || [];
          setData(data);
          setSearched(data.length === 0);
        } else {
          toast.error("Error fetching data");
          setSearched(false);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData(getInputValue);
  }, [getInputValue]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearched(false);
    setData([]);
    setInputValue(user?.firstName);
    setShowList(false);
  };

  const handleClearSelection = () => {
    setSelectedUser({});
    setInputValue("");
    setShowList(true);
  };

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };

  const handleShare = async () => {
    try {
      SetisLoading(true);

      let recipient;
      let UserName;

      if (phoneNumber && selectedUser?.phone) {
        toast.error("Please select only one recipient option.");
        return;
      } else if (phoneNumber) {
        recipient = phoneNumber;
        UserName = "";
      } else if (selectedUser?.phone) {
        recipient = selectedUser.phone;
        UserName = selectedUser.firstName;
      } else {
        toast.error("No valid recipient found.");
        return;
      }
      await handleShareSave(selectedFoodIndex, recipient);

      let user = await TwillioService(UserName, recipient);
      if (user.status === 200) {
        toast.success(`You send a dietary recommendation  `);
        setOpenModal(false);
        setPhoneNumber("");
        setSearched(false);
        setSelectedUser({});
        setInputValue("");
      } else {
        toast.error("Failed to send diet");
      }
    } catch (error) {
      toast.error(`Failed to send diet`);
    } finally {
      SetisLoading(false);
    }
  };

  const handleShareSave = async (Index, recipient) => {
    const userID = selectedUser?._id || null;

    const savedItem = {
      recommendations: getTableData[Index].recommendations,
      synopsis: getTableData[Index].synopsis,
      food: getTableData[Index]
        ? getTableData[Index].food?.split(",")?.join(", ")
        : "",
      disease: getTableData[Index].disease,
      symptoms: getTableData[Index].symptoms,
      allergies: getTableData[Index].allergies,
      phone: recipient,
      userId: userID,
      Id: getTableData[Index]._id,
    };

    const saveShareRecommendation = async (data) => {
      try {
        const saveShareRecommendationsResponse =
          await SaveShareRecommendation(data);
      } catch (error) {
        toast.error("Error saving recommendations");
      }
    };

    await saveShareRecommendation(savedItem);
  };

  return (
    <>
      <AlertChangedEpicUser openModal={epicUserChangedAlert.alertMessage} handleModalClose={handleModalClose} 
        epicUserChangedMessage = {epicUserChangedAlert.alertMessage} title={epicUserChangedAlert.title}
      />
      <div className="w-full md:w-[calc(100%-268px)] h-[calc(100vh-57px)] overflow-y-auto">
        <div className="bg-primary-l5 px-[30px] lg:px-[50px] xl:px-[100px] py-[50px] border-b-[1px] border-primary flex items-center">
          <div className="w-full">
            {Object.keys(patientDetails).length > 0 && <><div className="border border-quinary mb-10 rounded-lg p-7">
              <div>
                {PatientDetailLoading?<SpinnerComponent/>:<>
                  <div>
                  <span className="main-title mb-5 block text-3xl">Patient Details</span>
                  <ul className="grid grid-cols-2 patient-details db-patient-info">
                    <li>
                      <strong>Name: </strong>
                      {patientDetails.firstName} {patientDetails.lastName}
                    </li>
                    <li>
                      <strong>Email: </strong>
                      {patientDetails.email}
                    </li>
                    <li>
                      <strong>Age: </strong>
                      {patientDetails.age}
                    </li>
                    <li>
                      <strong>Weight: </strong>
                      {patientDetails.weight}
                    </li>
                    <li className="margin-b-0">
                      <strong>Gender: </strong>
                      {patientDetails.gender}
                    </li>
                    <li className="margin-b-0">
                      <strong>Allergies: </strong>
                      {patientDetails.allergies}
                    </li>
                  </ul>
                </div>
                </>}
              </div>
            </div></>}
            <div className="w-full">
              <h1 className="main-title mb-3 text-lg sm:text-xl lg:text-[32px]">
                Search Symptoms and Diseases
              </h1>
              <div className="relative mb-3">
                <input
                  className="form-input pl-10 h-12"
                  onKeyDown={handleKeyDown}
                  placeholder="Search Symptoms"
                  onChange={handleInputChange}
                  value={searchInput}
                  defaultValue={
                    patientDetails && Object.keys(patientDetails).length > 0
                      ? `${patientDetails.symptoms || ""}` : ""
                  }
                  ref={searchDiseasesRef}
                ></input>
                <BsTag className="absolute top-[18px] left-4 text-primary" />
                <BsSearch
                  className="absolute top-[15px] right-4 hover:cursor-pointer"
                  onClick={handleSubmit}
                />
              </div>
              <div className="relative mb-3">
                <input
                  className="form-input pl-10 h-12"
                  placeholder="Search Allergies"
                  onChange={handleAllergyInputChange}
                  value={AllergysearchInput}
                  defaultValue={
                    patientDetails && Object.keys(patientDetails).length > 0
                      ? `${patientDetails.allergies || ""}` : ""
                  }
                ></input>
                <BsTag className="absolute top-[18px] left-4 text-primary" />
              </div>

              <p className="text-neutral-gray mb-4">
                Press enter or add a comma between each symptom or disease
              </p>
              {symptomLoading ? (
                <SpinnerComponent />
              ) : (
                <>
                  {Symptoms.length > 0 ||
                  Diseases.length > 0 ||
                  Allergies.length > 0 ? (
                    <div className="bg-primary-l4 p-5 rounded-md">
                      <div className="flex-wrap flex items-center pb-5 mb-5 border-b-[1px] border-primary-l3">
                        {Symptoms.map((value, index) => (
                          <span key={index} className="badge">
                            {value}
                          </span>
                        ))}
                        {Diseases.map((value, index) => (
                          <span key={index} className="badge bg-quarternary">
                            {value}
                          </span>
                        ))}
                      </div>
                      {searchValues?.length > 0 ? (
                        <Link
                          state={{ Symptoms, Diseases, Allergies, id:patientID }}
                          to="/doctor/doctor-recommendations"
                        >
                          <button className="text-base lg:text-xl bg-primary rounded-md px-4 py-1 lg:py-2 leading-[30px] text-white">
                            Submit Symptoms
                          </button>
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
        {pageLoading ? (
          <PageLoader />
        ) : getTableData?.length > 0 ? (
          <div className="px-[30px] lg:px-[60px] xl:px-[100px] py-[30px] sm:py-[48px]">
            <h1 className="main-title text-base lg:text-[28px] mb-3">
              Saved Recommendations
            </h1>
            <div className="custom-table overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr>
                    <th>Disease</th>
                    <th>Symptoms</th>
                    <th>Recommendations</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getTableData?.length > 0 &&
                    getTableData?.map((item, index) => {
                      return (
                        <tr key={item._id}>
                          <td>{item.disease ? item.disease : "N/A"}</td>
                          <td>{item.symptoms ? item.symptoms : "N/A"}</td>
                          <td>{item.recommendations}</td>
                          <td>
                            <Link
                              to={`/doctor/doctor-recommendations`}
                              state={{ data: getTableData[index], id:patientID }}
                              className="text-primary hover:underline border-r-[1px] border-divider pr-2 mr-2"
                            >
                              View
                            </Link>
                            <a
                              href="#"
                              className="text-success hover:underline border-r-[1px] border-divider pr-2 mr-2"
                              onClick={() => {
                                handleRemcommendationModel(index);
                              }}
                            >
                              Share
                            </a>
                            <a
                              onClick={() => {
                                handleDelete(item._id);
                              }}
                              href="#"
                              className="text-text-red hover:underline"
                            >
                              Remove
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
      <ShareModel
        setOpenModal={setOpenModal}
        openModal={openModal}
        getInputValue={getInputValue}
        handleChange={handleChange}
        getData={getData}
        searched={searched}
        setData={setData}
        showList={showList}
        selectedUser={selectedUser}
        handleSelectUser={handleSelectUser}
        handleShare={handleShare}
        handleClearSelection={handleClearSelection}
        handlePhoneNumberChange={handlePhoneNumberChange}
        phoneNumber={phoneNumber}
        setPatient={setPatient}
        Loading={isLoading}
        setPhoneNumber={setPhoneNumber}
        setInputValue={setInputValue}
        setShowList={setShowList}
        setSelectedUser={setSelectedUser}
        patientDetails={patientDetails}
      />
    </>
  );
}

export default Dashboard;
