import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import offer1 from "../../../assets/images/offer-1.png";
import offer2 from "../../../assets/images/offer-2.png";
import offer3 from "../../../assets/images/offer-3.png";


function SpecialOffers() {
  const handleback = () => {
    window.history.back();
  };

  return (
    <>
      <div className="w-full md:w-[calc(100%-268px)]">
        <div className="bg-quaternary-l3 px-[30px] lg:px-[50px] xl:px-[100px] py-[20px] lg:py-[50px] border-b-[1px] border-quarternary">
          <h1 className="main-title text-lg sm:text-xl lg:text-[32px]">
            Integrations + Prepared Food Recommendations
          </h1>
        </div>
        <div className="px-[30px] lg:px-[50px] xl:px-[100px] py-[30px] sm:py-[48px]">
          <div onClick={handleback} className="text-secondary text-base mb-6">
            <IoArrowBackOutline className="inline-block m-2" />{" "}
            <span>Back</span>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <a href="https://www.factor75.com/pages/meal-delivery?channel=sea?&c=MS-FJ01&mealsize=1-8&discount_comm_id=2f6046d9-e990-4130-9e67-5de3e55cbaf9&c_comms=PERCENT&utm_source=google&utm_medium=cpc&utm_campaign=SEA_FJ_google_Act_2024_Brand_Benefits_Control&vs_campaign_id=6a31bc08-4134-4bc3-917a-85a723bb6f9d&utm_content=act_paidsearch_seabrand&dis_channel=sea-brand&utm_source=google&utm_medium=cpc&utm_campaign=7720237664&utm_keyword=factor%20x%20meals&gad_source=1&gclid=CjwKCAjwx-CyBhAqEiwAeOcTdcb7_WG2HeEAkdbXi7ZkvnIl0ouJj5MykZPcP1deCGVP9l5FeJ70VBoCFB8QAvD_BwE">
              <div className="card-border mb-6">
                <h2 className="title mb-[18px]">
                  Enter promo code{" "}
                  <span className="text-primary">“koyl15”</span> and get 15% off
                  your first grocery order*
                </h2>
                <img src={offer1} className="offer-img"></img>
                <p className="text-base text-neutral-d1 mb-0">
                  *Offer valid until 05/29/2024
                </p>
              </div>
            </a>
            <a href="https://vegetableandbutcher.com/products/4-day-intro-to-plant-based-eating-non-vegan">
              <div className="card-border mb-6">
                <h2 className="title mb-[18px]">
                  Enter promo code{" "}
                  <span className="text-primary">“koyl20”</span> and get 20% off
                  your first meal*
                </h2>
                <img src={offer2} className="offer-img"></img>
                <p className="text-base text-neutral-d1 mb-0">
                  *Offer valid until 05/29/2024
                </p>
              </div>
            </a>
            <a href="https://www.greenchef.com/?c=MOON50&c_comms=PERCENT&cjdata=MXxOfDB8WXww&cjevent=7ca4d1241ea911ef80f3cc3d0a82b821&mealsize=2-3&tv=su4&utm_campaign=Moonshot%3A%2050%25%20off%20%2B%20First%20Box%20Ships%20Free%20%2B%2020%25%20Off%20For%202%20Months&utm_id=cj~15540193&utm_medium=cpa&utm_source=Moonshot%20Marketing%20LTD.~cj">
              <div className="card-border mb-6">
                <h2 className="title mb-[18px]">
                  Enter promo code{" "}
                  <span className="text-primary">“koyl25”</span> and get 25% off
                  your first order*
                </h2>
                <img src={offer3} className="offer-img"></img>
                <p className="text-base text-neutral-d1 mb-0">
                  *Offer valid until 05/29/2024
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default SpecialOffers;
