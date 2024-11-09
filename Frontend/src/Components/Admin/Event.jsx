import React, { useEffect, useState } from "react";
import { FlagOutlined } from "@ant-design/icons";
import { Modal, Button, Form } from "antd";
import Item from "../Common/Item";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Common/Constants";

const Event = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [advertiser, setAdvertiser] = useState(null);
  const [isFlagRed, setIsFlagRed] = useState(false); // Flag color state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility

  // Load flag click state from localStorage
  useEffect(() => {
    const savedFlagState = localStorage.getItem(`flagClicked-${id}`);
    setIsFlagRed(savedFlagState === "true"); // Set to true if previously clicked
  }, [id]);

  // Fetch activity data
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`${apiUrl}activity/${id}`);
        setActivity(response.data);
        if(activity.hidden == true){
            setIsFlagRed(true);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
      
    };

    fetchActivity();
  }, [id]);

  // Fetch advertiser data
  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}advertiser/${activity.advertiserId}`
        );
        setAdvertiser(response.data);
      } catch (error) {
        console.error("Error fetching advertiser:", error);
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
    return <div>Loading activity...</div>;
  }

  const discount = 10;

  // Show confirmation modal if flag is gray
  const handleFlagClick = () => {


    if (!isFlagRed) {
      setIsModalVisible(true); // Open the modal
    }
  };

  // Handle modal confirmation
  const confirmFlag = async () => {
    setIsFlagRed(true);
    localStorage.setItem(`flagClicked-${id}`, "true"); // Persist flag clicked state for this event ID
    try {
        await axios.patch(`${apiUrl}activity/hide/${id}`);
      //  setActivity(response.data);
      } catch (error) {
        console.error("Error hiding event:", error);
      }
    setIsModalVisible(false); // Close the modal
  };

  // Handle modal cancellation
  const cancelFlag = () => {
    setIsModalVisible(false); // Close the modal
  };
  const removeAllFlags = () => {
    for (let key in localStorage) {
      if (key.startsWith("flagClicked-")) {
        localStorage.removeItem(key); // Remove each flag entry
      }
    }
  };

  return (
    <>
      <Item
        id={activity?._id}
        name={activity?.name}
        feedbacks={activity?.feedback}
        setFeedback={(newFeedback) =>
          setActivity({ ...activity, feedback: newFeedback })
        }
        tags={activity?.tags || []}
        price={`${activity?.lower || 0} - ${activity?.upper || 0}`} // Display price range
        priceLower={activity?.lower}
        priceUpper={activity?.upper}
        category={activity?.category}
        location={activity?.location}
        transportation={activity?.transportation}
        date={activity?.date}
        isOpen={activity?.isOpen}
        spots={activity?.spots}
        discounts={activity?.discounts}
        creatorName={advertiser?.username}
        type={"activity"}
      />

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
        <p>Are you sure you want to flag this activity as Inappropriate?</p>
      </Modal>
    </>
  );
};

export default Event;
