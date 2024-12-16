import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { Accordion } from "flowbite-react";
import { BsCaretDown } from "react-icons/bs";
import { useLocation, Link } from "react-router-dom";
import logo from "../../../assets/images/logo-koyl-white.svg";
import {
  FIND_RECOMMENDATIONS_PHONE,
  FindRecommendationUserId,
} from "../../../Store/Service/SaveRecommendation";
import AuthService from "../../../service/AuthService";
import { getPatientDetails } from "../../../Store/Service/PatientServices";
import PageLoader from "../../../Components/Account/PageLoader";

function PatientDashboard() {
  const [getID, setId] = useState("");
  const [getRecommendationData, setRecommendationData] = useState({});
  const [getRecommendationUserData, setRecommendationUserData] = useState({});
  const location = useLocation();
  const [getUserId, setUserId] = useState(null);
  const [isLoading, SetisLoading] = useState(false);

  const url = decodeURIComponent(location.search);
  const secret = "ascffe3r3r3432r32cac";
  let indexId = url.indexOf("id=") + "id=".length;

  let encryptedId = url.substring(indexId);

  useEffect(() => {
    if (location?.pathname === "/patient/recommendations") {
      const userData = AuthService.GetLoggedInUserData();
      const { userId } = userData;
      setUserId(userId);
    }
  }, [location]);

  useEffect(() => {
    if (encryptedId) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedId, secret);
        const decryptedId = bytes.toString(CryptoJS.enc.Utf8);

        setId(decryptedId);
      } catch (error) {
        console.error("Error decrypting ID:", error);
      }
    }
  }, [encryptedId]);

  useEffect(() => {
    SetisLoading(true);
    const getData = async () => {
      try {
        if (getUserId) {
          const response = await FindRecommendationUserId(getUserId);

          if (response.data) {
            const sortedRecommendation = response.data.recommendation.sort(
              (a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);

                return dateB - dateA;
              }
            );
            setRecommendationData(sortedRecommendation);
          } else {
            setRecommendationData({});
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setRecommendationData(null);
      } finally {
        SetisLoading(false);
      }
    };

    getData();
  }, [getUserId]);

  useEffect(() => {
    SetisLoading(true);
    const fetchData = async () => {
      try {
        if (getID) {
          const response = await FIND_RECOMMENDATIONS_PHONE(getID);

          if (response.data) {
            const sortedRecommendation = response.data.recommendation.sort(
              (a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);

                return dateB - dateA;
              }
            );
            setRecommendationData(sortedRecommendation);
          } else {
            setRecommendationData({});
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setRecommendationData(null);
      } finally {
        SetisLoading(false);
      }
    };

    fetchData();
  }, [getID]);

  const [patientDetails, setPatientDetails] = useState({
    firstName: "",
    lastName: "",
    age: "",
    race: "",
    weight: "",
    allergies: "",
    doctor: "",
  });

  const fetchPatientDetails = async (getUserId = "") => {
    const response = await getPatientDetails(getUserId);
    if (response.success) {
      setPatientDetails(response.data);
    } else {
      console.error("Failed to fetch patients");
    }
  };

  useEffect(() => {
    if (getUserId) {
      fetchPatientDetails(getUserId);
    }
  }, [getUserId]);

  const StudieshandleClick = (value) => {
    window.open(value?.url, "_blank"); 
  };

  const option1path = getUserId
    ? "/patient/grocerychecklist"
    : "/grocerychecklist";

  const option2path = getUserId ? "/patient/specialoffers" : "/specialoffers";

  return (
    <>
      {isLoading ? (
        <PageLoader/>
      ) : (
        <>
          {getRecommendationData.length > 0 ? (
            <>
              {getID ? (
                <div className="bg-primary flex justify-between items-center px-9 py-2">
                  <img src={logo} className="w-28" alt="Logo" />
                </div>
              ) : null}

              <div className="w-full">
                <div className="bg-quaternary-l3 px-[30px] lg:px-[50px] xl:px-[100px] py-[20px] lg:py-[50px] border-b-[1px] border-quarternary">
                  <h1 className="main-title">My Recommendations</h1>
                </div>

                <div className="px-[30px] lg:px-[50px] xl:px-[100px] py-[30px] sm:py-[48px]">
                  {/* Display the latest recommendation */}
                  {getRecommendationData.length > 0 && (
                    <div>
                      <h1 className="main-title text-2xl sm:text-[32px] mb-6">
                        Latest Recommendation
                      </h1>

                      <div className="card-border mb-6">
                        <div className="block lg:flex justify-between items-start mb-[18px]">
                          <div>
                            <h2 className="title mb-[10px]">
                              {getRecommendationData[0].recommendations}
                            </h2>
                            <p className="text-neutral-d1 text-sm sm:text-base">
                              Sent by{" "}
                              <span className="text-primary font-bold">
                                Dr. Bright{" "}
                              </span>
                              <span className="font-bold">
                                {new Date(
                                  getRecommendationData[0].createdAt
                                ).toLocaleDateString("en-US", {
                                  month: "2-digit",
                                  day: "2-digit",
                                  year: "numeric",
                                })}
                              </span>{" "}
                              at{" "}
                              <span className="font-bold">
                                {new Date(
                                  getRecommendationData[0].createdAt
                                ).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })}
                              </span>
                            </p>
                          </div>
                          <div className="mt-5 lg:mt-[0]">
                            <Link
                              to={option1path}
                              state={getRecommendationData[0]}
                            >
                              <button className="w-full sm:w-[48%] lg:w-[auto] mb-[18px] sm:mb-0 btn-share">
                                Option 1
                              </button>
                            </Link>
                            <Link to={option2path}>
                              <button className="w-full sm:w-[48%] lg:w-[auto] btn-save ml-0 sm:ml-[10px]">
                                Option 2
                              </button>
                            </Link>
                          </div>
                        </div>
                        <p className="mb-[18px] text-base">
                          <span className="font-bold">Synopsis:</span>
                          {` ${getRecommendationData[0].synopsis}`}
                        </p>
                        <p className="mb-[18px] text-base">
                          <span className="font-bold">Consume foods like:</span>
                          {` ${getRecommendationData[0].food}`}
                        </p>
                        <div className="mb-[18px] flex flex-wrap items-center">
                          <span className="font-bold mr-[6px]">Treats:</span>
                          {getRecommendationData[0]?.disease &&
                            getRecommendationData[0].disease
                              .split(",")
                              .filter((disease) => disease.trim()).length > 0 &&
                            getRecommendationData[0].disease
                              .split(",")
                              .map((disease, index) => (
                                <span
                                  key={index}
                                  className="badge sm-txt bg-quarternary"
                                >
                                  {disease.trim()}
                                </span>
                              ))}

                          {getRecommendationData[0]?.symptoms &&
                            getRecommendationData[0].symptoms
                              .split(",")
                              .filter((symptom) => symptom.trim()).length > 0 &&
                            getRecommendationData[0].symptoms
                              .split(",")
                              .map((symptom, index) => (
                                <span key={index} className="badge sm-txt">
                                  {symptom.trim()}
                                </span>
                              ))}
                        </div>
                        <div className="mb-[18px] flex flex-wrap items-center">
                        <span className="font-bold mr-[6px]">Allergies:</span>
                          {getRecommendationData[0]?.allergies &&
                            getRecommendationData[0].allergies
                              .split(",")
                              .filter((allergies) => allergies.trim()).length > 0 &&
                            getRecommendationData[0].allergies
                              .split(",")
                              .map((allergies, index) => (
                                <span
                                  key={index}
                                  className="badge sm-txt bg-pink-400"
                                >
                                  {allergies.trim()}
                                </span>
                              ))}
                        </div>
                        <Accordion
                          collapseAll
                          className="border-0 rounded-none bg-primary-l5"
                        >
                          <Accordion.Panel>
                            <Accordion.Title className="accordian-title block bg-primary-l5 focus:ring-transparent">
                              Read the studies behind your recommendations
                              <BsCaretDown className="custom-arrow" />
                            </Accordion.Title>
                            {getRecommendationData[0].StudiesLink.map(
                              (value) => (
                                <Accordion.Content
                                  className="border-t-0"
                                  key={value.title}
                                >
                                  <ul>
                                    <li
                                      onClick={() => {
                                        StudieshandleClick(value);
                                      }}
                                      className="mb-6"
                                    >
                                      <a className="text-sm text-secondary underline">
                                        {value.title}
                                      </a>
                                    </li>
                                  </ul>
                                </Accordion.Content>
                              )
                            )}
                          </Accordion.Panel>
                        </Accordion>
                      </div>
                    </div>
                  )}

                  {/* Display past recommendations */}
                  {getRecommendationData.length > 1 && (
                    <div>
                     <h1 className="main-title text-2xl sm:text-[32px] mb-6">
                          Past Recommendations
                        </h1>

                      {getRecommendationData.slice(1).map((item, index) => (
                        <div className="card-border mb-6" key={index}>
                          <div className="block lg:flex justify-between items-start mb-[18px]">
                            <div>
                              <h2 className="title mb-[10px]">
                                {item.recommendations}
                              </h2>
                              <p className="text-neutral-d1 text-sm sm:text-base">
                                Sent by{" "}
                                <span className="text-primary font-bold">
                                  Dr. Bright{" "}
                                </span>
                                <span className="font-bold">
                                  {new Date(item.createdAt).toLocaleDateString(
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
                                  {new Date(item.createdAt).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "numeric",
                                      minute: "numeric",
                                      hour12: true,
                                    }
                                  )}
                                </span>
                              </p>
                            </div>
                            <div className="mt-5 lg:mt-[0]">
                              <Link to={option1path} state={item}>
                                <button className="w-full sm:w-[48%] lg:w-[auto] mb-[18px] sm:mb-0 btn-share">
                                  Option 1
                                </button>
                              </Link>
                              <Link to={option2path}>
                                <button className="w-full sm:w-[48%] lg:w-[auto] btn-save ml-0 sm:ml-[10px]">
                                  Option 2
                                </button>
                              </Link>
                            </div>
                          </div>
                          <p className="mb-[18px] text-base">
                            <span className="font-bold">Synopsis:</span>
                            {` ${item.synopsis}`}
                          </p>
                          <p className="mb-[18px] text-base">
                            <span className="font-bold">
                              Consume foods like:
                            </span>
                            {` ${item.food}`}
                          </p>
                          <div className="mb-[18px] flex flex-wrap items-center">
                            <span className="font-bold mr-[6px]">Treats:</span>
                            {item?.disease &&
                              item.disease
                                .split(",")
                                .filter((disease) => disease.trim()).length >
                                0 &&
                              item.disease.split(",").map((disease, index) => (
                                <span
                                  key={index}
                                  className="badge sm-txt bg-quarternary"
                                >
                                  {disease.trim()}
                                </span>
                              ))}

                            {item?.symptoms &&
                              item.symptoms
                                .split(",")
                                .filter((symptom) => symptom.trim()).length >
                                0 &&
                              item.symptoms.split(",").map((symptom, index) => (
                                <span key={index} className="badge sm-txt">
                                  {symptom.trim()}
                                </span>
                              ))}
                          </div>
                          <div className="mb-[18px] flex flex-wrap items-center">
                        <span className="font-bold mr-[6px]">Allergies:</span>
                          {item?.allergies &&
                            item.allergies
                              .split(",")
                              .filter((allergies) => allergies.trim()).length > 0 &&
                              item.allergies
                              .split(",")
                              .map((allergies, index) => (
                                <span
                                  key={index}
                                  className="badge sm-txt bg-pink-400"
                                >
                                  {allergies.trim()}
                                </span>
                              ))}
                        </div>
                          <Accordion
                            collapseAll
                            className="border-0 rounded-none bg-primary-l5"
                          >
                            <Accordion.Panel>
                              <Accordion.Title className="accordian-title block bg-primary-l5 focus:ring-transparent">
                                Read the studies behind your recommendations
                                <BsCaretDown className="custom-arrow" />
                              </Accordion.Title>
                              {item.StudiesLink.map((value) => (
                                <Accordion.Content
                                  className="border-t-0"
                                  key={value.title}
                                >
                                  <ul>
                                    <li
                                      onClick={() => {
                                        StudieshandleClick(value);
                                      }}
                                      className="mb-6"
                                    >
                                      <a className="text-sm text-secondary underline">
                                        {value.title}
                                      </a>
                                    </li>
                                  </ul>
                                </Accordion.Content>
                              ))}
                            </Accordion.Panel>
                          </Accordion>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ):<div className="flex  items-center justify-center w-full">
            <h1  className="text-2xl font-medium" >No Recommendation found </h1>
            </div>}
        </>
      )}
    </>
  );
}

export default PatientDashboard;