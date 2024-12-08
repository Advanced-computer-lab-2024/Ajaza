import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Form, Modal } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "./Constants";
import { jwtDecode } from "jwt-decode";
import LoadingSpinner from "./LoadingSpinner";
import SelectCurrency from "../Tourist/SelectCurrency";
import { useCurrency } from "../Tourist/CurrencyContext";
import * as Frigade from "@frigade/react";
import CustomButton from "../Common/CustomButton";
import { Button } from "antd";

const token = localStorage.getItem("token");
let decodedToken = null;
let role = null;
if (token) {
  decodedToken = jwtDecode(token);
  role = decodedToken?.role; // Extract the role from the token
}
console.log("acti role nour", role);
const userid = decodedToken ? decodedToken.userId : null;

const Activity = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [advertiser, setAdvertiser] = useState(null);
  const { currency, setCurrency } = useCurrency();

  const { Tour, useFrigade } = Frigade; // Access Tour and useFrigade from Frigade default export

  const { flowStatus, resetFlow } = useFrigade(); // Importing flow management functions
  const [showFrigade, setShowFrigade] = useState(false);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };
  const [currencyRates] = useState({
    AED: 3.6725,
    ARS: 1004.0114,
    AUD: 1.5348,
    BDT: 110.5,
    BHD: 0.376,
    BND: 1.3456,
    BRL: 5.8149,
    CAD: 1.3971,
    CHF: 0.8865,
    CLP: 973.6481,
    CNY: 7.2462,
    COP: 4389.3228,
    CZK: 24.2096,
    DKK: 7.1221,
    EGP: 48.58,
    EUR: 0.9549,
    GBP: 0.7943,
    HKD: 7.7825,
    HUF: 392.6272,
    IDR: 15911.807,
    ILS: 3.7184,
    INR: 84.5059,
    JPY: 154.4605,
    KRW: 1399.323,
    KWD: 0.3077,
    LKR: 291.0263,
    MAD: 10.5,
    MXN: 20.4394,
    MYR: 4.4704,
    NOK: 11.0668,
    NZD: 1.7107,
    OMR: 0.385,
    PHP: 58.9091,
    PKR: 279.0076,
    PLN: 4.1476,
    QAR: 3.64,
    RUB: 101.2963,
    SAR: 3.75,
    SEK: 11.063,
    SGD: 1.3456,
    THB: 34.7565,
    TRY: 34.5345,
    TWD: 32.5602,
    UAH: 36.9,
    USD: 1,
    VND: 24000.0,
    ZAR: 18.0887,
  });

  // admin
  const [isFlagRed, setIsFlagRed] = useState(false); // Flag color state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [unflagisModalVisible, unflagsetIsModalVisible] = useState(false);

  const fetchActivity = async () => {
    try {
      const response = await axios.get(`${apiUrl}activity/${id}`);
      setActivity(response.data);
      if (response.data.hidden === true) {
        setIsFlagRed(true);

        // localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
      } else {
        setIsFlagRed(false);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [id]);

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}advertiser/${activity.advertiserId}`
        );
        console.log(response.data);
        console.log(activity.feedback);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };
    if (activity) {
      fetchAdvertiser();
    }
  }, [activity]);
  const [writeReviewForm] = Form.useForm();

  const onSubmitWriteReview = (values) => {
    console.log(values); // Process the review form submission
  };

  if (!activity) {
    return <LoadingSpinner />;
  }
  const renderFrigadeProvider = () => {
    if (role === null) {
      return (
        <Frigade.Provider
          apiKey="api_public_qO3GMS6zamh9JNuyKBJlI8IsQcnxTuSVWJLu3WUUTUyc8VQrjqvFeNsqTonlB3Ik"
          userId={userid}
          onError={(error) => console.error("Frigade Error:", error)}
        >
          <Frigade.Tour flowId="flow_k40qeJxX" />
        </Frigade.Provider>
      );
    } else if (role === "tourist") {
      return (
        <Frigade.Provider
          apiKey="api_public_BsnsmMKMGzioY5tWxlro5ECqXG0RnxBcSzVLRIPBot76iWiUwd44kbcaXFdSyvcB"
          userId={userid}
          onError={(error) => console.error("Frigade Error:", error)}
        >
          <Frigade.Tour flowId="flow_XpXP41GH" />
        </Frigade.Provider>
      );
    } else {
      return (
        <Frigade.Provider
          apiKey="api_public_qO3GMS6zamh9JNuyKBJlI8IsQcnxTuSVWJLu3WUUTUyc8VQrjqvFeNsqTonlB3Ik"
          userId={userid}
          onError={(error) => console.error("Frigade Error:", error)}
        >
          <Frigade.Tour flowId="flow_k40qeJxX" />
        </Frigade.Provider>
      );
    }
  };

  const handleShowFrigade = () => {
    if (flowStatus === "ENDED") {
      resetFlow(); // Reset the flow to start from the first step
    }
    setShowFrigade(false); // Temporarily hide Frigade to force re-render
    setTimeout(() => {
      setShowFrigade(true); // Show Frigade after resetting
    }, 0);
  };

  const convertedLowerPrice = activity
    ? (activity.lower * currencyRates[currency]).toFixed(2)
    : 0;
  const convertedUpperPrice = activity
    ? (activity.upper * currencyRates[currency]).toFixed(2)
    : 0;

  // Admin

  const handleFlagClick = () => {
    if (!isFlagRed) {
      setIsModalVisible(true); // Open the modal
    } else {
      unflagsetIsModalVisible(true);
    }
  };

  const confirmFlag = async () => {
    //  setIsFlagRed(true);
    // localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
    try {
      const response = await axios.patch(`${apiUrl}activity/hide/${id}`);
      console.log(response.data);
      setActivity(response.data.updatedActivity);
      //  setActivity(response.data);
    } catch (error) {
      console.error("Error hiding event:", error);
    }

    setIsModalVisible(false); // Close the modal
    fetchActivity();
  };

  const confirmUnFlag = async () => {
    //  setIsFlagRed(true);
    // localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
    try {
      const response = await axios.patch(`${apiUrl}activity/unhide/${id}`);
      console.log(response.data);
      setActivity(response.data.updatedActivity);
      //  setActivity(response.data);
    } catch (error) {
      console.error("Error unhiding event:", error);
    }

    unflagsetIsModalVisible(false); // Close the modal
    fetchActivity();
  };

  // Handle modal confirmation

  // Handle modal cancellation
  const cancelFlag = () => {
    setIsModalVisible(false); // Close the modal
  };
  const cancelUnFlag = () => {
    unflagsetIsModalVisible(false); // Close the modal
  };

  return (
    <>
      {role == "tourist" || !role ? (
        <CustomButton
          size={"s"}
          value={"Hint"}
          onClick={handleShowFrigade}
          style={{ marginBottom: "16px" }}
        />
      ) : null}
      {showFrigade && renderFrigadeProvider()}

      {/* <SelectCurrency
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        style={{ left: -7, top: 45 }}
      /> */}
      {role == "tourist" || !role ? (
        <Button
          id="nour2"
          style={{
            right: "0", // Aligns it to the maximum right
            top: "0", // Optional: Aligns it to the top of its container
            margin: "16px", // Adds some spacing from the edges (adjust as needed)
            padding: "1px", // Makes the button tiny
            fontSize: "0.1rem", // Reduces the text size to be almost invisible
            border: "none", // Removes border (optional)
            background: "transparent", // Makes the background transparent (optional)
            color: "transparent", // Hides the text color (optional)
            cursor: "default", // Makes it less clickable-looking
          }}
        />
      ) : null}
      <Item
        id={activity?._id}
        name={activity?.name}
        photos={activity?.pictures}
        feedbacks={activity?.feedback}
        setFeedback={(newFeedback) =>
          setActivity({ ...activity, feedback: newFeedback })
        }
        tags={activity?.tags || []}
        price={`${convertedLowerPrice} - ${convertedUpperPrice}`}
        priceLower={convertedLowerPrice}
        priceUpper={convertedUpperPrice}
        category={activity?.category}
        location={activity?.location}
        transportation={activity?.transportation}
        date={activity?.date}
        isOpen={activity?.isOpen}
        spots={activity?.spots}
        discounts={activity?.discounts}
        creatorName={advertiser?.username}
        creatorFeedback={advertiser?.feedback}
        type={"activity"}
        isFlagged={activity?.isFlagged}
        handleFlagClick={handleFlagClick}
        currency={currency}
      />

      {/* admin */}
      <Modal
        title="Confirm UnFlag"
        visible={unflagisModalVisible}
        onOk={confirmUnFlag}
        onCancel={cancelUnFlag}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to unflag this activity?</p>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Flag"
        visible={isModalVisible}
        onOk={confirmFlag}
        onCancel={cancelFlag}
        okType="danger"
        okText="Flag"
        cancelText="Cancel"
      >
        <p>Are you sure you want to flag this activity as Inappropriate?</p>
      </Modal>
    </>
  );
};

export default Activity;
