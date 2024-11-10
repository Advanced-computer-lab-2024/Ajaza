import React, { useEffect, useState } from "react";
import Item from "../Common/Item";
import { Form,Modal } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Common/Constants";

const ItineraryAdmin = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [timelineItems, setTimelineItems] = useState(null);
  const [writeReviewForm] = Form.useForm();
  const [isFlagRed, setIsFlagRed] = useState(false); // Flag color state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [unflagisModalVisible, unflagsetIsModalVisible] = useState(false); // Modal visibility

 /* useEffect(() => {
    const savedFlagState = localStorage.getItem(`flagClicked-${id}`);
    setIsFlagRed(savedFlagState === "true"); // Set to true if previously clicked
  }, [id]);*/
  const fetchItinerary = async () => {
    try {
      const response = await axios.get(`${apiUrl}itinerary/${id}`);
      setItinerary(response.data);
    //  const savedFlagState = localStorage.getItem(`flagClicked-${id}`);
  //    setIsFlagRed(savedFlagState === "true"); // Set to true if previously clicked
       // Set to true if previously clicked
      if(itinerary.hidden === true  ){

          setIsFlagRed(true);

         // localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
      }
      else{
          setIsFlagRed(false);
      }
     
    } catch (error) {
      console.error("Error fetching itinerary:", error);
    }
  };

  useEffect(() => {
    

    fetchItinerary();
  }, [id]);

  useEffect(() => {
    if (itinerary) {
     
        if(itinerary.hidden === true  ){

            setIsFlagRed(true);

           // localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
        }
       else{
        setIsFlagRed(false);
       }




      setTimelineItems({
        timeline: itinerary?.timeline,
        availableDateTime: itinerary?.availableDateTime,
      });
    //  console.log(itinerary?.timeline);
    }
  }, [itinerary]);

  const onSubmitWriteReview = (values) => {
   // console.log(values); // Handle review form submission logic here
  };

  // Ensure we handle the state when feedback is added or modified
  const handleFeedbackUpdate = (newFeedback) => {
    setItinerary((prevItinerary) => ({
      ...prevItinerary,
      feedback: newFeedback,
    }));
  };
  const handleFlagClick = () => {


    if (!isFlagRed) {
      setIsModalVisible(true); // Open the modal
    }
    else{
        unflagsetIsModalVisible(true);  
    }
  };



  const confirmFlag = async () => {
  //  setIsFlagRed(true);
   // localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
    try {
      const response =   await axios.patch(`${apiUrl}itinerary/hide/${id}`);
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

  const confirmUnFlag = async () => {
    //  setIsFlagRed(true);
     // localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
      try {
        const response =   await axios.patch(`${apiUrl}itinerary/unhide/${id}`);
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
  const removeAllFlags = () => {
    for (let key in localStorage) {
      if (key.startsWith("flagClicked-")) {
        localStorage.removeItem(key); // Remove each flag entry
      }
    }
  };

  // Extract relevant data from the itinerary
  // const availableDates =
  //   itinerary?.availableDateTime?.map((d) => d.date).join(", ") || "";

  if (!itinerary) {
    return <div>Loading itienerary... </div>;
  }
  console.log(itinerary);

  return (
    <>
      {itinerary && (
        <Item
          id={itinerary._id}
          name={itinerary.name}
          feedbacks={itinerary.feedback}
          setFeedback={handleFeedbackUpdate}
          timelineItems={timelineItems}
          writeReviewForm={writeReviewForm}
          onSubmitWriteReview={onSubmitWriteReview}
          tags={itinerary?.tags}
          price={itinerary?.price}
          transportation={{ from: itinerary?.pickUp, to: itinerary?.dropOff }}
          active={itinerary?.active}
          accessibility={itinerary?.accessibility} // Optional: If you want to display accessibility info
          maxTourists={itinerary?.maxTourists} // Optional: If you want to display max tourists
          language={itinerary?.language}
          pickUp={itinerary?.pickUp}
          dropOff={itinerary?.dropOff}
          creatorName={itinerary?.guideId?.username}
          type={"itinerary"}
          availableDates={itinerary.availableDateTime}
        />
      )}


      {/* Flag Button and Discount Offer */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "20px" }}>
        <button
          onClick={handleFlagClick}
          style={{
            width: "50px",
            height: "30px",
            backgroundColor: isFlagRed ? "red" : "gray", // Red if clicked, gray otherwise
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%, 0% 100%, 50% 50%, 0% 0%)", // Flag shape
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px" 
          }}
        >
        
        </button>
        

        {/* Display the Discount */}
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          Flag as Inappropriate
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Flag"
        visible={isModalVisible}
        onOk={confirmFlag}
        onCancel={cancelFlag}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to flag this itinerary as Inappropriate?</p>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Flag"
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

export default ItineraryAdmin;
