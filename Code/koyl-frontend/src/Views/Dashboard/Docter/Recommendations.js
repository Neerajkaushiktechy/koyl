import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { BsSend, BsSave2 } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { SearchByName } from "../../../Store/Service/SearchByName";
import { toast } from "react-toastify";
import { TwillioService } from "../../../Store/Service/TwillioService";
import { ChatgptService } from "../../../Store/Service/ChatgptService";
import { SaveRecommendation } from "../../../Store/Service/SaveRecommendation";
import ShareModel from "../../../Utils/Model/ShareModel";
import { UpdateRecommendation } from "../../../Store/Service/SaveRecommendation";
import { SaveShareRecommendation, saveMultipleReccomendations,shareMultipleReccomendations } from "../../../Store/Service/SaveRecommendation";
import SpinnerComponent from "../../../Components/Account/SpinnerComponent";
import PageLoader from "../../../Components/Account/PageLoader";
import { getPatientDetails, getEpicPatientRecord, epicCreateClinicalNotes } from "../../../Store/Service/PatientServices";
import { ERROR_MESSAGES } from "../../../Store/Constants/errorMessages";

function Recommendations() {
  const [openModal, setOpenModal] = useState(false);
  const [addPatient, setPatient] = useState(false);
  const [getData, setData] = useState([]);
  const [getInputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [searched, setSearched] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showList, setShowList] = useState(true);
  const [chatData, setchatData] = useState({});
  const [selectedFoodIndex, setSelectedFoodIndex] = useState(null);
  const [getViewData, setViewData] = useState([]);
  const [getFullDiet, setFullDiet] = useState([]);
  const [getSaveShareData, setSaveShareData] = useState({});
  const [pageLoading, SetpageLoading] = useState(false);
  const [isLoading, SetisLoading] = useState(false);
  const [SearchedDiseases, setSearchedDiseases] = useState([]);
  const [SearchedSymptoms, setSearchedSymptoms] = useState([]);
  const [SearchedAllergies, setSearchedAllergies] = useState([]);
  const [patientDetails, setPatientDetails] = useState({});
  const [SelectedRecommendations, setSelectedRecommendations] = useState([]);
  const [ShareMultiple, setShareMultiple] = useState(false);
  const [SaveMultipleLoader, setSaveMultipleLoader] = useState(false)
  const [ShareMultipleLoader,setShareMultipleLoader] = useState(false)

  const location = useLocation();
  const navigate = useNavigate();
  const { Symptoms, Diseases, Allergies, id } = location?.state;
  const [saveLoading, setSaveLoading] = useState(
    new Array(getFullDiet.length).fill(false)
  );

  //fetch recommendation data
  useEffect(() => {
    SetpageLoading(true);
    const chat = async () => {
      try {
        const chatData = [...Symptoms, ...Diseases].join(", ");
        const chatgptData = await ChatgptService(chatData, Allergies);
        let data = chatgptData?.data?.response;
        const startIndex = data?.indexOf("{");
        const endIndex = data?.lastIndexOf("}");
        const jsonSegment = data?.substring(startIndex, endIndex + 1);
        try {
          const data = JSON.parse(jsonSegment);
          const Foods = data.Foods;
          const foodsArray = Object.keys(Foods).map((key) => {
            const {
              FoodSynopsis,
              TreatFor,
              Allergies,
              foodNames,
              StudiesLink,
            } = Foods[key];
            return {
              key,
              FoodSynopsis,
              TreatFor,
              foodNames,
              StudiesLink,
              Allergies,
            };
          });
          setFullDiet(foodsArray);
          const foodNamesGrouped = [];
          const foodSynopsisGrouped = [];
          const foodItems = [];
          const StudiesLinkGroup = [];

          // Iterate over each key in the Foods object
          for (const key in Foods) {
            if (Foods.hasOwnProperty(key)) {
              const { foodNames, FoodSynopsis, StudiesLink } = Foods[key];
              // Add foodNames and FoodSynopsis to their respective arrays
              foodNamesGrouped.push(foodNames);
              foodSynopsisGrouped.push(FoodSynopsis);
              StudiesLinkGroup?.push(StudiesLink);
            }
          }

          for (const [category, items] of Object.entries(data?.Foods)) {
            if (category !== "FoodSynopsis") {
              foodItems?.push(items);
            }
          }

          // Prepare the final object
          const foodData = {
            Synopsis: foodSynopsisGrouped,
            FoodNames: foodNamesGrouped,
            Nutrients: foodItems,
            Studies: StudiesLinkGroup,
          };

          setchatData(foodData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } catch (error) {
        console.error("Error in chat function:", error.message);
      } finally {
        SetpageLoading(false);
      }
    };

    chat();
  }, [location.state]);

  const handleChange = (value) => {
    setInputValue(value);
  };

  useEffect(() => {
    fetchData(getInputValue);
  }, [getInputValue]);

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

  // Handle input change for Phone search input
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  // Handle selection of user from search results
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearched(false);
    setData([]);
    setInputValue(user?.firstName);
    setShowList(false);
  };

  // Handle sharing user details

  const documentReferenceCreateClinicalNotes = async (data = "", epicPatientId) => {
    try {
    const epicAccessToken = localStorage.getItem('epicAccessToken');
    const response = await getEpicPatientRecord(epicPatientId);
    if (response?.data?.data?.latestEncounter && response?.data?.data?.latestEncounter.length > 0) {
      const requestBody = {
        "resourceType": "DocumentReference",
        "docStatus": "final",
        "type": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "11488-4",
              "display": "Consultation Note"
            }
          ],
          "text": "Consultation Note"
        },
        "subject": {
          "reference": `Patient/${epicPatientId}`
        },
        "content": [
          {
            "attachment": {
              "contentType": "text/plain",
              "data": `${btoa(data)}`
            }
          }
        ],
        "context": {
          "encounter": [response?.data?.data?.latestEncounter[0]]
        }
      }
     const clicnicalNotesRes= await epicCreateClinicalNotes(requestBody, epicAccessToken); 
      if (clicnicalNotesRes?.status === 200) {
        toast.success(clicnicalNotesRes?.data?.message);
      } else if (
        clicnicalNotesRes?.status !== 200 ||
        clicnicalNotesRes?.name === "AxiosError"
      ) {
        handleError(clicnicalNotesRes?.response?.data);
      }

    } else {
      // Error for display due to patient don't have any encounter value
      throw new Error("Unable to create clinical notes due to patient encounter not available.");

    }
  } catch (error) {
    toast.error(error.message || "Failed to create clinical notes.");
  }

  }

  const handleShare = async () => {
    SetisLoading(true);
    try {
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

      if (SelectedRecommendations.length > 0){
        await sendMultipleRecommendationMessageHandler(recipient);
      }
      else{
        await handleShareSave(selectedFoodIndex, recipient);
      }
      
      let user = await TwillioService(UserName, recipient);
      if (user.status === 200) {
        toast.success(`You send a dietary recommendation`);
        setOpenModal(false);
        setPhoneNumber("");
        setSearched(false);
        setSelectedUser({});
        setInputValue("");
        setShowList(true);
      } else {
        toast.error("Failed to send diet");
      }
    } catch (error) {
      toast.error(`Failed to send diet`);
    } finally {
      SetisLoading(false); // Reset loading state in all cases
    }
  };

  const sendMultipleRecommendationMessageHandler = async (recipient) => {
    const userID = selectedUser?._id || null;
    var clinicalNotes = "";
    setShareMultipleLoader(true)
    if (SelectedRecommendations.length > 0) {
      const selectedRecommendations = getFullDiet
        .filter((item, index) => SelectedRecommendations.includes(index))
        .map((item) => item);
  
      let payLoadData = [];
      if (selectedRecommendations.length > 0) {
        payLoadData = await Promise.all(selectedRecommendations.map(async (item, index) => {
          let diseases = [];
          let symptoms = [];
          
          SeparateDiseaseAndSymptom(item,diseases,symptoms)

          const recommendationObj = {
            recommendations: item.key,
            synopsis: item.FoodSynopsis,
            food: item.foodNames.join(", "),
            disease: diseases.join(", "),
            symptoms: symptoms.join(", "),
            allergies: item.Allergies.join(", "),
            StudiesLink: item.StudiesLink,
            userId: userID,
            phone: recipient,
          }
          const clinicalNotesData = await createClinicalNotesHandler(recommendationObj)
          clinicalNotes = clinicalNotes + "\n"
            + "\n" + (index + 1) + `=========${item?.key || ""} =====` + "\n"
            + clinicalNotesData;
          
          return recommendationObj;
        }));
      }
      const shareMultipleRecommendationsResponse = await shareMultipleReccomendations(payLoadData);
      if(shareMultipleRecommendationsResponse.data.success){
        await saveMulitpleClinicalNotesHandler(clinicalNotes);
        setSelectedRecommendations([]);
        setShareMultipleLoader(false)
      }
      else if(!shareMultipleRecommendationsResponse.data.success){
        setSelectedRecommendations([]);
        setShareMultipleLoader(false)
      }
      else{
        setSelectedRecommendations([]);
        setShareMultipleLoader(false)
      }
    }
  }

  const handleShareSave = async (indexOrData, recipient) => {
    const userID = selectedUser?._id || null;
    const TreatforSymptom = [];
    const TreatforDisease = [];
    const PatientAllergies = [];
    let savedItem = null;

    if (typeof indexOrData === "number") {
      const dietItem = getFullDiet[indexOrData];

      if (dietItem) {
        
        SeparateDiseaseAndSymptom(dietItem,TreatforDisease,TreatforSymptom)
        
        if (Allergies.length > 0) {
          Allergies.map((a) => PatientAllergies.push(a));
        }
        savedItem = {
          recommendations: dietItem.key,
          synopsis: dietItem.FoodSynopsis,
          food: dietItem.foodNames.join(", "),
          disease: TreatforDisease.join(", "),
          symptoms: TreatforSymptom.join(", "),
          allergies: PatientAllergies.join(", "),
          StudiesLink: dietItem.StudiesLink,

          phone: recipient,
          userId: userID,
        };
      }
    } else if (typeof indexOrData === "object" && indexOrData !== null) {
      savedItem = {
        recommendations: indexOrData.recommendations,
        synopsis: indexOrData.synopsis,
        food: indexOrData.food?.split(",").join(", ") || "",
        disease: indexOrData.disease,
        symptoms: indexOrData.symptoms,
        allergies: indexOrData.allergies,
        StudiesLink: indexOrData.StudiesLink,
        phone: recipient,

        userId: userID,
        Id: indexOrData._id,
      };
    }

    if (savedItem) {
      setSaveShareData(savedItem);

      try {
        const saveShareRecommendationsResponse =
          await SaveShareRecommendation(savedItem);
        if (saveShareRecommendationsResponse.status === 201) {
          const epicPatientId = localStorage.getItem('epicPatientId');
          if (epicPatientId && epicPatientId.length > 0) {
            const clinicalNotesData = `
            Disease: ${savedItem?.disease || ""}
            Symptoms: ${savedItem?.symptoms || ""}
            Recommendations: ${savedItem?.recommendations || ""}
            Synopsis: ${savedItem?.synopsis || ""}
            Allergies:${savedItem?.allergies || ""}
            Food: ${savedItem?.food || ""}
          `
            await documentReferenceCreateClinicalNotes(clinicalNotesData, epicPatientId);
          }
        }
      } catch (error) {
        toast.error("Error saving recommendations");
      }
    } else {
      toast.error("No data available to save");
    }
  };

  //clear the selected user from share model
  const handleClearSelection = () => {
    setSelectedUser({});
    setInputValue("");
    setShowList(true);
  };

  const handleSaving = (dataOrIndex, event) => {
    if (typeof dataOrIndex === "number") {
      setSelectedFoodIndex(dataOrIndex);
      setOpenModal(true);
    } else if (typeof dataOrIndex === "object") {
      setSelectedFoodIndex(dataOrIndex);
      setOpenModal(true);
    } else {
      console.error("Invalid data type provided to handleSaving.");
    }
  };

  //Sumbit add to patient Form

  // Effect to set search values from location state
  useEffect(() => {
    if (location?.state) {
      setViewData(location?.state?.data);
      setSearchedSymptoms(location?.state?.Symptoms);
      setSearchedDiseases(location?.state?.Diseases);
      setSearchedAllergies(location?.state?.Allergies);
    }
  }, [location?.state]);

  // Handle navigating back to dashboard
  const handleGoBack = (event) => {
    event.preventDefault();
    navigate("/doctor/dashboard");
  };

  //saved recommendations
  const handleSave = async (index, recipient) => {
    var savedItem = {}

    setSaveLoading((prevLoading) => {
      prevLoading[index] = true;
      return [...prevLoading];
    });
    const userID = selectedUser?._id || null;
    const TreatforSymptom = [];
    const TreatforDisease = [];
    const PatientAllergies = [];

    SeparateDiseaseAndSymptom(getFullDiet[index],TreatforDisease,TreatforSymptom)
    
    if (getFullDiet[index]?.Allergies) {
      Allergies.map((a) => PatientAllergies.push(a));
    }
    if (getFullDiet?.length > 0) {
      savedItem = {
        recommendations: getFullDiet[index].key,
        synopsis: getFullDiet[index].FoodSynopsis,
        food: getFullDiet[index].foodNames.join(" ,"),
        disease:
          Array.isArray(TreatforDisease) && TreatforDisease.length > 0
            ? TreatforDisease.join(", ")
            : undefined,
        symptoms:
          Array.isArray(TreatforSymptom) && TreatforSymptom.length > 0
            ? TreatforSymptom.join(", ")
            : undefined,
        allergies:
          Array.isArray(PatientAllergies) && PatientAllergies.length > 0
            ? PatientAllergies.join(", ")
            : undefined,
        StudiesLink: getFullDiet[index].StudiesLink,
        phone: recipient,
        userId: id,
      };
      setOpenModal(false);
      saveRecommendation(index,savedItem);
    } else if (getViewData !== null && getViewData.recommendations) {
      savedItem = {
        recommendations: getViewData.getViewData,
        synopsis: getViewData.synopsis,
        food: getViewData ? getViewData.food?.split(",")?.join(", ") : "",
        disease: getViewData.disease,
        symptoms: getViewData.symptoms,
        StudiesLink: getViewData.StudiesLink,
        phone: recipient,
        userId: userID,
        Id: getViewData._id,
      };

      setOpenModal(false);
      const updateRecommendation = async (id, data) => {
        try {
          const updateRecommendationsResponse = await UpdateRecommendation(
            id,
            data
          );
        } catch (error) {
          toast.error("Error saving recommendations");
        } finally {
          setSaveLoading((prevLoading) => {
            prevLoading[index] = false;
            return [...prevLoading];
          });
        }
      };

      updateRecommendation(savedItem.Id, savedItem);
    }
    const epicPatientId = localStorage.getItem('epicPatientId');
    if (epicPatientId) {
      const clinicalNotesData = `
      Disease: ${savedItem?.disease || ""}
      Symptoms: ${savedItem?.symptoms || ""}
      Recommendations: ${savedItem?.recommendations || ""}
      Synopsis: ${savedItem?.synopsis || ""}
      Allergies:${savedItem?.allergies || ""}
      Food: ${savedItem?.food || ""}
    `
    
      await documentReferenceCreateClinicalNotes(clinicalNotesData, epicPatientId);
    }

  };

  const saveRecommendation = async (index,data) => {
    try {
      const saveRecommendationsResponse = await SaveRecommendation(data);

      if (saveRecommendationsResponse.status === 201) {
        {
          if (!saveRecommendationsResponse.data.phone)
            toast.success("Recommendations save successfully");
        }
      }
    } catch (error) {
      toast.error("Error saving recommendations");
    } finally {
      setSaveLoading((prevLoading) => {
        prevLoading[index] = false;
        return [...prevLoading];
      });
    }
  };

  const fetchPatientDetails = async (id) => {
    const response = await getPatientDetails(id);
    if (response.success) {
      setPatientDetails(response.data);
    } else {
      console.error("Failed to fetch patients");
    }
  };
  useEffect(() => {
    if (id !== null) {
      fetchPatientDetails(id);
    }
  }, [id]);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  //Error Handling
   const handleError = (error) => {
    if (error) {
      const status = error.status;
      switch (status) {
        case 400:
          toast.error(error.message);
          break;
        case 401:
          toast.error(ERROR_MESSAGES.UNAUTHORIZED);
          break;
        case 403:
          toast.error(ERROR_MESSAGES.FORBIDDEN);
          break;
        case 404:
          toast.error(ERROR_MESSAGES.NOT_FOUND);
          break;
        case 500:
          toast.error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
          break;
        default:
          toast.error(ERROR_MESSAGES.UNEXPECTED_ERROR);
          break;
      }
    }
  };

  const renderTreates = (item) => {
      if (Array.isArray(item.TreatFor)) {
        return (
          <>
            {item?.TreatFor.length > 0 ? item?.TreatFor?.map((term, index) => {
              const normalizedTerm = term.trim().toLowerCase();

              const isDisease = Diseases.map((d) =>
                d.toLowerCase()
              ).includes(normalizedTerm);
              const isSymptom = Symptoms.map((s) =>
                s.toLowerCase()
              ).includes(normalizedTerm);

              const badgeClass = isDisease
                ? "badge bg-quarternary"
                : isSymptom
                  ? "badge"
                  : "badge";

              return (
                <span key={index} className={badgeClass}>
                  {term}
                </span>
              );
            }) : ""}
          </>
        )
      } else if(typeof item?.TreatFor === 'string') {
        return (
          <>
            {item?.TreatFor && item?.TreatFor.length >0 ? item?.TreatFor?.split(
              /,\s*|\s+and\s+/
            )?.map((term, index) => {
              const normalizedTerm = term.trim().toLowerCase();

              const isDisease = Diseases.map((d) =>
                d.toLowerCase()
              ).includes(normalizedTerm);
              const isSymptom = Symptoms.map((s) =>
                s.toLowerCase()
              ).includes(normalizedTerm);

              const badgeClass = isDisease
                ? "badge bg-quarternary"
                : isSymptom
                  ? "badge"
                  : "badge";

              return (
                <span key={index} className={badgeClass}>
                  {term}
                </span>
              );
            }) : ""}
          </>
        )
      } else {
        return <></>
      }
  }

  const handleCheckboxChange = (e, RecommendationIndex) => {
    if (e.target.checked) {
      addRecommendation(RecommendationIndex);
    } else {
      removeRecommendation(RecommendationIndex);
    }
  };

  const addRecommendation = (RecommendationIndex) => {
    setSelectedRecommendations((prevRecommendations) => {
      const newRecommendations = [...prevRecommendations, RecommendationIndex];
      return newRecommendations;
    });
    setShareMultiple(true);
  };

  const removeRecommendation = (RecommendationIndex) => {
    setSelectedRecommendations((prevRecommendations) => {
      const newRecommendations = prevRecommendations.filter((index) => index !== RecommendationIndex);
      return newRecommendations;
    });
  };
 
  useEffect(() => {
    if (SelectedRecommendations.length === 0) {
      setShareMultiple(false);
    } else {
      setShareMultiple(true);
    }
  }, [SelectedRecommendations]);

  const shareMultipleRecommendationHandler = async () => {
    setOpenModal(true)
  };
  

  const saveMultipleRecommendationHandler = async () => {
    setSaveMultipleLoader(true)
    var clinicalNotes = "";
    if (SelectedRecommendations.length > 0) {
      const selectedRecommendations = getFullDiet
        .filter((item, index) => SelectedRecommendations.includes(index))
        .map((item) => item);
  
      let payLoadData = [];
  
      if (selectedRecommendations.length > 0) {
        payLoadData = await Promise.all(selectedRecommendations.map(async (item, index) => {
          let diseases = [];
          let symptoms = [];
  
          SeparateDiseaseAndSymptom(item,diseases,symptoms)

          const recommendationObj = {
            recommendations: item.key,
            synopsis: item.FoodSynopsis,
            food: item.foodNames.join(", "),
            disease: diseases.join(", "),
            symptoms: symptoms.join(", "),
            allergies: item.Allergies.join(", "),
            StudiesLink: item.StudiesLink,
            userId: id,
          }
          const clinicalNotesData = await createClinicalNotesHandler(recommendationObj)
          clinicalNotes = clinicalNotes + "\n"
            + "\n" + (index + 1) + `=========${item?.key || ""} =====` + "\n"
            + clinicalNotesData;
  
          return recommendationObj;
        }));
      }
      const saveMultipleRecommendationsResponse = await saveMultipleReccomendations(payLoadData);
      if(saveMultipleRecommendationsResponse.data.success){
        await saveMulitpleClinicalNotesHandler(clinicalNotes);
        toast.success("Recommendations saved successfully.");
        setSelectedRecommendations([]);
        setSaveMultipleLoader(false)
      }
      else if(!saveMultipleRecommendationsResponse.data.success){
        toast.error("Error saving recommendations");
        setSelectedRecommendations([]);
        setSaveMultipleLoader(false)
      }
      else{
        toast.error("Error saving recommendations");
        setSelectedRecommendations([]);
        setSaveMultipleLoader(false)
      }
    }
  };

  const saveMulitpleClinicalNotesHandler = async (clinicalNotes) => {
    const epicPatientId = localStorage.getItem('epicPatientId');
        if (epicPatientId) {
          await documentReferenceCreateClinicalNotes(clinicalNotes, epicPatientId);
        }
  }

  const createClinicalNotesHandler = async (clinicalNoteObj) => {
    return `
    Disease: ${clinicalNoteObj?.disease || ""}
    Symptoms: ${clinicalNoteObj?.symptoms || ""}
    Recommendations: ${ clinicalNoteObj?.recommendations|| ""}
    Synopsis: ${clinicalNoteObj?.synopsis|| ""}
    Allergies:${clinicalNoteObj?.allergies || ""}
    Food: ${clinicalNoteObj?.food || ""}
  `
  }
  

  const SeparateDiseaseAndSymptom = (dietItem,TreatforDisease, TreatforSymptom)=>{
    if(Array.isArray(dietItem.TreatFor)) {
      dietItem.TreatFor.forEach((item) => {
        const lowerItem = item.trim().toLowerCase();
        if (Diseases.map((d) => d.toLowerCase()).includes(lowerItem)) {
          TreatforDisease.push(lowerItem);
        } else if (Symptoms.map((s) => s.toLowerCase()).includes(lowerItem)) {
          TreatforSymptom.push(lowerItem);
        }
      });
    } else {
      dietItem.TreatFor.split(/,\s*|\s+and\s+/).forEach((item) => {
        const lowerItem = item.trim().toLowerCase();
        if (Diseases.map((d) => d.toLowerCase()).includes(lowerItem)) {
          TreatforDisease.push(lowerItem);
        } else if (
          Symptoms.map((s) => s.toLowerCase()).includes(lowerItem)
        ) {
          TreatforSymptom.push(lowerItem);
        }
      });
    }
  }

  const getFullDietSort = (a, b) => {
    return ((b.TreatFor?.split?.(/,\s*|\s+and\s+/)?.length || 0) -
    (a.TreatFor?.split?.(/,\s*|\s+and\s+/)?.length || 0))
  }
  return (
    <>
      {pageLoading ? (
        <PageLoader />
      ) : (
        <>
          {getFullDiet?.length > 0 &&
            getFullDiet?.sort(getFullDietSort) ? (
            <div className="w-full md:w-[calc(100%-268px)]">
              <div className="bg-quaternary-l3 px-[30px] lg:px-[50px] xl:px-[100px] py-[50px] border-b-[1px] border-quarternary">
                <h1 className="main-title mb-3">Recommendations for:</h1>
                <div className="flex flex-wrap items-center">
                  {SearchedSymptoms?.map((value, index) => {
                    return (
                      <span key={index} className="badge">
                        {value}
                      </span>
                    );
                  })}
                  {SearchedDiseases?.map((value, index) => {
                    return (
                      <span key={index} className="badge bg-quarternary">
                        {value}
                      </span>
                    );
                  })}
                  {SearchedAllergies?.map((value, index) => {
                    return (
                      <span key={index} className="badge bg-pink-400">
                        {value}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="px-[30px] lg:px-[50px] xl:px-[100px] py-[30px] sm:py-[48px]">
                <div
                  onClick={handleGoBack}
                  className="text-secondary text-base mb-6"
                >
                  <IoArrowBackOutline className="inline-block m-2" />{" "}
                  <span>Back to search</span>
                </div>
                <div>
                  {getFullDiet && (
                    <>
                      <h1 className="main-title text-2xl sm:text-[32px] mb-6">
                        Most recommended
                      </h1>

                      <div className="card-border recommended mb-6">
                        <div className="block lg:flex justify-between items-center mb-[18px]">
                          <h2 className="title">{getFullDiet[0]?.key}</h2>
                          <div className="mt-5 lg:mt-[0]">
                            <button
                              className="w-full sm:w-[34%] lg:w-[auto] mb-[18px] sm:mb-0 btn-share"
                              onClick={(event) => handleSaving(0, event)}
                            >
                              Share <BsSend className="ml-2 inline-block" />
                            </button>

                            <button
                              onClick={() => handleSave(0)}
                              className="w-full sm:w-[34%] lg:w-[auto] btn-save ml-0 sm:ml-[10px]"
                            >
                              {saveLoading[0] ? (
                                <SpinnerComponent />
                              ) : (
                                <>
                                  Save <BsSave2 className="ml-2 inline-block" />
                                </>
                              )}
                            </button>
                            <div className="text-center block sm:inline-block sm:text-left">
                            <input
                              type="checkbox"
                              className="custom-checkbox w-8 h-8 ml-0 sm:ml-3 mt-3 sm:mt-0"
                              checked={SelectedRecommendations.includes(0)}
                              onChange={(e) => handleCheckboxChange(e, 0)}
                            />
                            </div>
                          </div>
                        </div>

                        <p className="mb-[18px] text-base">
                          <span className="font-bold">Synopsis:</span>{" "}
                          {getFullDiet[0]?.FoodSynopsis}
                        </p>

                        <p className="mb-[18px] text-base">
                          <span className="font-bold">Consume foods like:</span>{" "}
                          {getFullDiet[0]?.foodNames?.join(", ")}
                        </p>

                        <div className="flex flex-wrap items-center">
                          <span className="font-bold mr-[6px]"> Treats:</span>{" "}
                          {renderTreates(getFullDiet[0])}
                          
                        </div>
                        <div className="flex flex-wrap items-center mt-4">
                          <span className="font-bold mr-[6px]">Allergies:</span>{" "}
                          {getFullDiet[0]?.Allergies?.map((term, index) => (
                            <span key={index} className="badge bg-pink-400">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {getFullDiet && getFullDiet.length > 1 && (
                    <>
                      <h1 className="main-title text-2xl sm:text-[32px] mb-6">
                        Also recommended
                      </h1>
                      {getFullDiet
                        .slice(1, getFullDiet.length)
                        .map((item, index) => (
                          <div className="card-border mb-6" key={index}>
                            <div className="block lg:flex justify-between items-center mb-[18px]">
                              <h2 className="title">{item.key}</h2>
                              <div className="mt-5 lg:mt-[0]">
                                <button
                                  className="w-full sm:w-[34%] lg:w-[auto] mb-[18px] sm:mb-0 btn-share"
                                  onClick={(event) =>
                                    handleSaving(index + 1, event)
                                  }
                                >
                                  Share <BsSend className="ml-2 inline-block" />
                                </button>

                                <button
                                  onClick={() => handleSave(index + 1)}
                                  className="w-full sm:w-[34%] lg:w-[auto] btn-save ml-0 sm:ml-[10px]"
                                >
                                  {saveLoading[index + 1] ? (
                                    <SpinnerComponent />
                                  ) : (
                                    <>
                                      Save{" "}
                                      <BsSave2 className="ml-2 inline-block" />
                                    </>
                                  )}
                                </button>
                                <div className="text-center block sm:inline-block sm:text-left">
                                <input
                                  type="checkbox"
                                  className="custom-checkbox w-8 h-8  ml-0 sm:ml-3 mt-3 sm:mt-0"
                                  checked={SelectedRecommendations.includes(index + 1)}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, index + 1)
                                  }
                                />
                                </div>
                              </div>
                            </div>

                            <p className="mb-[18px] text-base">
                              <span className="font-bold">Synopsis:</span>{" "}
                              {item.FoodSynopsis}
                            </p>

                            <p className="mb-[18px] text-base">
                              <span className="font-bold">
                                Consume foods like:
                              </span>{" "}
                              {item.foodNames?.join(", ")}
                            </p>

                            <div className="flex flex-wrap items-center">
                              <span className="font-bold mr-[6px]">
                                {" "}
                                Treats:
                              </span>{" "}
                              {renderTreates(item)}
                              
                            </div>
                            <div className="flex flex-wrap items-center mt-4">
                              <span className="font-bold mr-[6px]">
                                Allergies:
                              </span>{" "}
                              {item?.Allergies?.map((term, index) => (
                                <span key={index} className="badge bg-pink-400">
                                  {term}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                  {ShareMultiple ? (
                    <>
                    {ShareMultipleLoader?<SpinnerComponent/>:<button
                      className="w-full sm:w-[48%] lg:w-[auto] mb-[18px] sm:mb-0 btn-share"
                      onClick={(event) =>
                        shareMultipleRecommendationHandler(SelectedRecommendations, event)
                      }
                    >
                      Share recommendations
                      <BsSend className="ml-2 inline-block" />
                    </button>}
                    {SaveMultipleLoader?<SpinnerComponent/>:<button
                      className="w-full sm:w-[48%] lg:w-[auto] btn-save ml-0 sm:ml-[10px]"
                      onClick={(event) =>
                        saveMultipleRecommendationHandler(SelectedRecommendations, event)
                      }
                    >
                      Save recommendations
                      <BsSave2 className="ml-2 inline-block" />
                    </button>}
                    </>
                  ) : null}
                  {/* ))} */}
                </div>
              </div>
            </div>
          ) : null}

          <>
            {getViewData !== null && getViewData?.recommendations ? (
              <div className="w-full md:w-[calc(100%-268px)]">
                <div className="px-[30px] lg:px-[50px] xl:px-[100px] py-[30px] sm:py-[48px]">
                  <div
                    onClick={handleBackButtonClick}
                    className="text-secondary text-base mb-6"
                  >
                    <IoArrowBackOutline className="inline-block m-2" />{" "}
                    <span>Back to search</span>
                  </div>
                  <div>
                    <h1 className="main-title text-2xl sm:text-[32px] mb-6">
                      Most recommended
                    </h1>

                    <div className="card-border recommended mb-6">
                      <div className="block lg:flex justify-between items-center mb-[18px]">
                        <h2 className="title">{getViewData.recommendations}</h2>
                        <div className="mt-5 lg:mt-[0]">
                          <button
                            className="w-full sm:w-[48%] lg:w-[auto] mb-[18px] sm:mb-0 btn-share"
                            onClick={(event) => handleSaving(getViewData)}
                          >
                            Share <BsSend className="ml-2 inline-block" />
                          </button>
                        </div>
                      </div>

                      <p className="mb-[18px] text-base">
                        <span className="font-bold">Synopsis:</span>{" "}
                        {getViewData.synopsis}
                      </p>

                      <p className="mb-[18px] text-base">
                        <span className="font-bold">Consume foods like:</span>{" "}
                        {getViewData.food}
                      </p>

                      <div className="flex flex-wrap items-center">
                        <span className="font-bold mr-[6px]">Treats: </span>
                        {getViewData.disease &&
                          getViewData.disease
                            .split(/,\s*|\s+and\s+/)
                            .filter((disease) => disease.trim())
                            .map((disease, index) => (
                              <span
                                key={index}
                                className="badge sm-txt bg-quarternary"
                              >
                                {disease.trim()}
                              </span>
                            ))}

                        {getViewData.symptoms &&
                          getViewData.symptoms
                            .split(/,\s*|\s+and\s+/)
                            .filter((symptom) => symptom.trim())
                            .map((symptom, index) => (
                              <span key={index} className="badge sm-txt">
                                {symptom.trim()}
                              </span>
                            ))}


                      </div>

                      <div className="flex flex-wrap items-center">
                        <span className="font-bold mr-[6px]">Allergies: </span>
                        {getViewData.allergies &&
                          getViewData.allergies
                            .split(/,\s*|\s+and\s+/)
                            .filter((allergy) => allergy.trim())
                            .map((allergy, index) => (
                              <span
                                key={index}
                                className="badge sm-txt bg-pink-400"
                              >
                                {allergy.trim()}
                              </span>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <ShareModel
              openModal={openModal}
              setOpenModal={setOpenModal}
              setPatient={setPatient}
              handleChange={handleChange}
              getInputValue={getInputValue}
              selectedUser={selectedUser}
              handleClearSelection={handleClearSelection}
              searched={searched}
              getData={getData}
              showList={showList}
              handleSelectUser={handleSelectUser}
              phoneNumber={phoneNumber}
              handlePhoneNumberChange={handlePhoneNumberChange}
              handleShare={handleShare}
              setInputValue={setInputValue}
              Loading={isLoading}
              setPhoneNumber={setPhoneNumber}
              setShowList={setShowList}
              setSelectedUser={setSelectedUser}
              patientDetails={patientDetails}
              ShareMultiple={ShareMultiple}
            />
          </>
        </>
      )}
    </>
  );
}

export default Recommendations;
