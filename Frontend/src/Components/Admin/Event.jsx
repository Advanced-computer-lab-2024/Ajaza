import React, { useEffect, useState } from "react";
import { FlagOutlined } from "@ant-design/icons";
import { Modal, Button, Form } from "antd";
import Item from "../Common/Item";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../Common/Constants";
import LoadingSpinner from "../Common/LoadingSpinner";

const Event = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [advertiser, setAdvertiser] = useState(null);
  const [isFlagRed, setIsFlagRed] = useState(false); // Flag color state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [unflagisModalVisible, unflagsetIsModalVisible] = useState(false);

  const fetchActivity = async () => {
    try {
      const response = await axios.get(`${apiUrl}activity/${id}`);
      setActivity(response.data);
      //  const savedFlagState = localStorage.getItem(`flagClicked-${id}`);
      //    setIsFlagRed(savedFlagState === "true"); // Set to true if previously clicked
      // Set to true if previously clicked
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

  // Load flag click state from localStorage
  /* useEffect(() => {
    const savedFlagState = localStorage.getItem(`flagClicked-${id}`);
    setIsFlagRed(savedFlagState === "true"); // Set to true if previously clicked
  }, [id]);*/

  // Fetch activity data

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

  const discount = 10;

  // Show confirmation modal if flag is gray
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
  const removeAllFlags = () => {
    for (let key in localStorage) {
      if (key.startsWith("flagClicked-")) {
        localStorage.removeItem(key); // Remove each flag entry
      }
    }
  };
  if (!activity) {
    return <LoadingSpinner />;
  }

  console.log(activity);

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
        isFlagged={activity?.isFlagged}
        handleFlagClick={handleFlagClick}
      />

      {/* Flag Button and Discount Offer */}
      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handleFlagClick}
          style={{
            width: "50px",
            height: "30px",
            backgroundColor: isFlagRed ? "red" : "gray", // Red if clicked, gray otherwise
            clipPath:
              "polygon(0 0, 100% 0, 100% 50%, 0 50%, 0% 100%, 50% 50%, 0% 0%)", // Flag shape
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        ></button>

        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          Flag as Inappropriate
        </div>
      </div> */}

      {/* Confirmation Modal */}
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

export default Event;
