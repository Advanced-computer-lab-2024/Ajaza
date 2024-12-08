import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Form, Spin, Flex, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl, Colors } from "./Constants";
import { jwtDecode } from "jwt-decode";
import { Button } from "antd";
import CustomButton from "../Common/CustomButton";

import LoadingSpinner from "./LoadingSpinner";
import SelectCurrency from "../Tourist/SelectCurrency";
import { useCurrency } from "../Tourist/CurrencyContext";
import * as Frigade from "@frigade/react";

const token = localStorage.getItem("token");
let decodedToken = null;
let role = null;
if (token) {
  decodedToken = jwtDecode(token);
  role = decodedToken?.role; // Extract the role from the token
}
console.log("itin role nour", role);
const userid = decodedToken ? decodedToken.userId : null;
const Itinerary = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [timelineItems, setTimelineItems] = useState(null);
  const [creatorFeedback, setCreatorFeedback] = useState([]);
  const [writeReviewForm] = Form.useForm();
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

  // Admin
  const [isFlagRed, setIsFlagRed] = useState(false); // Flag color state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [unflagisModalVisible, unflagsetIsModalVisible] = useState(false); // Modal visibility

  const fetchItinerary = async () => {
    try {
      const response = await axios.get(`${apiUrl}itinerary/future/${id}`);
      setItinerary(response.data);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  useEffect(() => {
    if (itinerary) {
      setCreatorFeedback(itinerary?.guideId?.feedback);

      setTimelineItems({
        timeline: itinerary?.timeline,
        availableDateTime: itinerary?.availableDateTime,
      });
      console.log(itinerary?.timeline);

      // Admin
      if (itinerary.hidden === true) {
        setIsFlagRed(true);

        // localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
      } else {
        setIsFlagRed(false);
      }
    }
  }, [itinerary]);

  const onSubmitWriteReview = (values) => {
    console.log(values); // Handle review form submission logic here
  };

  // Ensure we handle the state when feedback is added or modified
  const handleFeedbackUpdate = (newFeedback) => {
    setItinerary((prevItinerary) => ({
      ...prevItinerary,
      feedback: newFeedback,
    }));
  };

  // Extract relevant data from the itinerary
  // const availableDates =
  //   itinerary?.availableDateTime?.map((d) => d.date).join(", ") || "";
  const handleShowFrigade = () => {
    if (flowStatus === "ENDED") {
      resetFlow(); // Reset the flow to start from the first step
    }
    setShowFrigade(false); // Temporarily hide Frigade to force re-render
    setTimeout(() => {
      setShowFrigade(true); // Show Frigade after resetting
    }, 0);
  };
  if (!itinerary) {
    return <LoadingSpinner />;
  }
  const confirmFlag = async () => {
    //  setIsFlagRed(true);
    // localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
    try {
      const response = await axios.patch(`${apiUrl}itinerary/hide/${id}`);
      //fetchItinerary();
      console.log(response.data);
      //  setItinerary(response.data.updatedItinerary);
      //  setActivity(response.data);
    } catch (error) {
      console.error("Error hiding event:", error);
    }
    fetchItinerary();
    setIsModalVisible(false); // Close the modal
  };

  const handleFlagClick = () => {
    if (!isFlagRed) {
      setIsModalVisible(true); // Open the modal
    } else {
      unflagsetIsModalVisible(true);
    }
  };

  const confirmUnFlag = async () => {
    //  setIsFlagRed(true);
    // localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
    try {
      const response = await axios.patch(`${apiUrl}itinerary/unhide/${id}`);
      console.log(response.data);
      setItinerary(response.data.updatedItinerary);
      //  setActivity(response.data);
    } catch (error) {
      console.error("Error hiding event:", error);
    }
    unflagsetIsModalVisible(false); // Close the modal
  };

  // Handle modal cancellation
  const cancelFlag = () => {
    setIsModalVisible(false); // Close the modal
  };
  const cancelUnFlag = () => {
    unflagsetIsModalVisible(false); // Close the modal
  };

  const convertedPrice = itinerary
    ? (itinerary.price * currencyRates[currency]).toFixed(2)
    : 0;
  const renderFrigadeProvider = () => {
    if (role === null) {
      return (
        <Frigade.Provider
          apiKey="api_public_qO3GMS6zamh9JNuyKBJlI8IsQcnxTuSVWJLu3WUUTUyc8VQrjqvFeNsqTonlB3Ik"
          userId={userid}
          onError={(error) => console.error("Frigade Error:", error)}
        >
          <Frigade.Tour flowId="flow_6pXvUJAc" />
        </Frigade.Provider>
      );
    } else if (role === "tourist") {
      return (
        <Frigade.Provider
          apiKey="api_public_BsnsmMKMGzioY5tWxlro5ECqXG0RnxBcSzVLRIPBot76iWiUwd44kbcaXFdSyvcB"
          userId={userid}
          onError={(error) => console.error("Frigade Error:", error)}
        >
          <Frigade.Tour flowId="flow_nBUck4iC" />
        </Frigade.Provider>
      );
    } else {
      return (
        <Frigade.Provider
          apiKey="api_public_qO3GMS6zamh9JNuyKBJlI8IsQcnxTuSVWJLu3WUUTUyc8VQrjqvFeNsqTonlB3Ik"
          userId={userid}
          onError={(error) => console.error("Frigade Error:", error)}
        >
          <Frigade.Tour flowId="flow_6pXvUJAc" />
        </Frigade.Provider>
      );
    }
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

      {role == "tourist" || !role ? (
        <Button
          id="nour"
          style={{
            right: "0", 
            top: "16px", 
            margin: "16px", 
            padding: "1px", 
            fontSize: "0.1rem", 
            border: "none", 
            background: "transparent", 
            color: "transparent", 
            cursor: "default", 
          }}
        />
      ) : null}

      {showFrigade && renderFrigadeProvider()}
      {/* <SelectCurrency
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        style={{ left: -7, top: 45 }}
      /> */}
      {itinerary && (
        <Item
          id={itinerary._id}
          name={itinerary.name}
          photos={itinerary?.pictures}
          feedbacks={itinerary.feedback}
          setFeedback={handleFeedbackUpdate}
          timelineItems={timelineItems}
          writeReviewForm={writeReviewForm}
          onSubmitWriteReview={onSubmitWriteReview}
          tags={itinerary?.tags}
          price={convertedPrice}
          transportation={{ from: itinerary?.pickUp, to: itinerary?.dropOff }}
          active={itinerary?.active}
          accessibility={itinerary?.accessibility} // Optional: If you want to display accessibility info
          maxTourists={itinerary?.maxTourists} // Optional: If you want to display max tourists
          language={itinerary?.language}
          pickUp={itinerary?.pickUp}
          dropOff={itinerary?.dropOff}
          creatorName={itinerary?.guideId?.username}
          type={"itinerary"}
          isFlagged={itinerary?.isFlagged}
          handleFlagClick={handleFlagClick}
          availableDates={itinerary.availableDateTime}
          currency={currency}
          creatorFeedback={creatorFeedback}
        />
      )}

      {/* Admin modal */}
      <Modal
        title="Confirm Flag"
        visible={isModalVisible}
        onOk={confirmFlag}
        onCancel={cancelFlag}
        okType="danger"
        okText="Flag"
        cancelText="Cancel"
      >
        <p>Are you sure you want to flag this itinerary as Inappropriate?</p>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="Cancel Flagging"
        visible={unflagisModalVisible}
        onOk={confirmUnFlag}
        onCancel={cancelUnFlag}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to unflag this itinerary?</p>
      </Modal>
    </>
  );
};

export default Itinerary;
