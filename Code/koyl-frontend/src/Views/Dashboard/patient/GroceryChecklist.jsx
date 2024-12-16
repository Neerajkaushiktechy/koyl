import React, { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { Accordion } from "flowbite-react";
import { BsCaretDown } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { UpdateRecommendation } from "../../../Store/Service/SaveRecommendation";
import { FetchGroceryChecklist } from "../../../Store/Service/ChatgptService";
import logo from "../../../assets/images/logo-koyl-white.svg";
import PageLoader from "../../../Components/Account/PageLoader";

function GroceryCheckList(props) {
  const [getAllData, setAllData] = useState([]);
  const [getSingleData, setSingleData] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [disabledItems, setDisabledItems] = useState([]);
  const [checkedItemsCount, setCheckedItemsCount] = useState(0);
  const [getChatData, setChatData] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [cachedData, setCachedData] = useState(null);
  const location = useLocation();
  const [pageLoading, SetpageLoading] = useState(false);
  const isGroceryChecklistPath = location?.pathname === "/grocerychecklist";

  useEffect(() => {
    if (location?.state) {
      setSingleData(location?.state);
    }
  }, [location?.state]);

  useEffect(() => {
    if (getSingleData) {
      chating();
    }
  }, [getSingleData]);
  const chating = async () => {
    SetpageLoading(true);
    if (cachedData) {
      setFoodCategories(cachedData);
      return;
    }

    try {
      const chatgptData = await FetchGroceryChecklist(getSingleData);
      let data = chatgptData?.data?.response;
      const startIndex = data?.indexOf("{");
      const endIndex = data?.lastIndexOf("}");
      const jsonSegment = data?.substring(startIndex, endIndex + 1);

      try {
        const appdata = JSON.parse(jsonSegment);
        setFoodCategories(appdata?.Foods);
        setCachedData(appdata?.Foods); // Cache the data
      } catch (error) {
        console.error("JSON parse error:", error);
      }
    } catch (err) {
      console.error("ChatgptService error:", err);
    } finally {
      SetpageLoading(false);
    }
  };

  //handle back to previos page
  const handleback = () => {
    window.history.back();
  };

  //handle seleted item and disable items
  useEffect(() => {
    if (getSingleData?.food) {
      const initialCheckedItems = getSingleData.food
        .split(",")
        .map((item) => item.trim());
      setCheckedItems(initialCheckedItems);
      setDisabledItems(initialCheckedItems);
    }
  }, [getSingleData]);

  //handle checkbox  items
  const handleCheckboxChange = (value) => {
    if (disabledItems.includes(value)) return;
    let updatedCheckedItems;
    if (checkedItems.includes(value)) {
      updatedCheckedItems = checkedItems.filter((item) => item !== value);
      setCheckedItemsCount((count) => count - 1);
    } else {
      updatedCheckedItems = [...checkedItems, value];
      setCheckedItemsCount((count) => count + 1);
    }

    setCheckedItems(updatedCheckedItems);

    setIsButtonDisabled(updatedCheckedItems.length === 0);
  };

  //handle update recommendation
  const handleSave = () => {
    const currentFoods = getSingleData.food
      .split(",")
      .map((item) => item.trim());

    checkedItems.forEach((item) => {
      const trimmedItem = item.trim();
      if (!currentFoods.includes(trimmedItem)) {
        currentFoods.push(trimmedItem);
      }
    });

    const updatedFood = currentFoods.join(", ");

    getSingleData.food = updatedFood;

    const updateRecommendation = async (id, data) => {
      try {
        const updateRecommendationsResponse = await UpdateRecommendation(
          id,
          data
        );
        if (updateRecommendationsResponse.status) {
          toast.success("Recommendations diet update");
          setCheckedItems([]);
          setIsButtonDisabled(true);
        }
      } catch (error) {
        toast.error("Error saving recommendations");
      }
    };

    updateRecommendation(getSingleData._id, getSingleData);
  };

  //handle disable save button
  useEffect(() => {
    setIsButtonDisabled(checkedItemsCount === 0);
  }, [checkedItemsCount]);

  return (
    <>
      {pageLoading ? (
        <PageLoader/>
      ) : (
        <>
          {isGroceryChecklistPath && (
            <div className="bg-primary flex justify-between items-center px-9 py-2">
              <img src={logo} className="w-28" alt="Logo" />
            </div>
          )}
          {Object.keys(foodCategories)?.length > 0 ||
          getSingleData?.length > 0 ? (
            <div className="w-full md:w-[calc(100%-268px)]">
              {foodCategories.length > 0 ? (
                <div className="bg-primary flex justify-between items-center px-9 py-2">
                  <img src={logo} className="w-28"></img>
                </div>
              ) : null}
              <div className="bg-quaternary-l3 px-[30px] lg:px-[50px] xl:px-[100px] py-[20px] lg:py-[50px] border-b-[1px] border-quarternary">
                {/* <span><CgMenu /></span> */}
                <h1 className="main-title">Grocery Check List</h1>
              </div>
              <div className="px-[30px] lg:px-[50px] xl:px-[100px] py-[30px] sm:py-[48px]">
                <div
                  onClick={handleback}
                  className="text-secondary text-base mb-6"
                >
                  <IoArrowBackOutline className="inline-block m-2" />{" "}
                  <span>Back</span>
                </div>

                <>
                  {" "}
                  <div>
                    <div className="card-border mb-6">
                      <div className="sm:block lg:flex justify-between items-center mb-[18px]">
                        <h2 className="title">
                          {getSingleData?.recommendations}
                        </h2>
                        <p className="text-neutral-d1 text-sm sm:text-base">
                          Sent by{" "}
                          <span className="text-primary font-bold">
                            Dr. Bright{" "}
                          </span>
                          <span className="block lg:inline-block">
                            <span className="font-bold">
                              {new Date(
                                getSingleData?.createdAt
                              ).toLocaleDateString("en-US", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                              })}
                            </span>{" "}
                            at{" "}
                            <span className="font-bold">
                              {new Date(
                                getSingleData?.createdAt
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </span>
                          </span>
                        </p>
                      </div>
                      {Object.keys(foodCategories).length > 0 ? (
                        <Accordion
                          collapseAll
                          className="border-l-0 border-r-0 rounded-none"
                        >
                          {Object.keys(foodCategories)?.map(
                            (category, index) => (
                              <Accordion.Panel key={index}>
                                <Accordion.Title className="accordian-title block focus:ring-transparent">
                                  {category}{" "}
                                  <BsCaretDown className="custom-arrow" />
                                </Accordion.Title>

                                <Accordion.Content>
                                  {foodCategories[category]?.map(
                                    (food, index) => {
                                      const trimmedValue = food?.trim();
                                      return (
                                        <div className="flex items-center mb-[10px]">
                                          <input
                                            type="checkbox"
                                            className="custom-checkbox"
                                            checked={checkedItems.includes(
                                              trimmedValue
                                            )}
                                            onChange={() =>
                                              handleCheckboxChange(trimmedValue)
                                            }
                                            disabled={disabledItems.includes(
                                              trimmedValue
                                            )}
                                          />
                                          <label className="text-body-color text-base font-normal leading-6">
                                            {food}{" "}
                                          </label>
                                        </div>
                                      );
                                    }
                                  )}
                                </Accordion.Content>
                              </Accordion.Panel>
                            )
                          )}
                        </Accordion>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleSave}
                      disabled={isButtonDisabled}
                      className={`text-base lg:text-xl bg-secondary rounded-md px-12 py-1 lg:py-2 leading-[30px] text-white ${
                        isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

export default GroceryCheckList;
