import React, { useEffect, useState } from "react";
import { Card, Empty, Spin } from "antd";
import axios from "axios";
import Feedback from "./Feedback";
import { apiUrl } from "../Common/Constants";
import { jwtDecode } from "jwt-decode";
import CustomButton from "../Common/CustomButton";
import LoadingSpinner from "../Common/LoadingSpinner";

const TouristHistory = () => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [touristId, setTouristId] = useState(null);
  const [activityId, setActivityId] = useState(null);
  const [itineraryId, setItineraryId] = useState(null);
  const [guideId, setGuideId] = useState(null);
  const [productId, setProductId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userDetails = decodedToken.userDetails;
      console.log("hi", userDetails);
      setTouristId(userDetails._id);
    }
  }, []);

  const handleFeedbackSubmit = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}tourist/history/getHistory/${touristId}`
      );
      console.log("response", response);
      setHistory(response.data);
      const guideIds = response.data.guides.map((guide) => guide.guideId);
      setGuideId(guideIds);
      console.log("guide ids", guideIds);
      const activityIds = response.data.activities.map(
        (activity) => activity.activityId
      );
      setActivityId(activityIds);
      console.log("activity ids", activityIds);
      const itineraryIds = response.data.itineraries.map(
        (itinerary) => itinerary.itineraryId
      );
      setItineraryId("itinerary ids", itineraryIds);
      console.log("itinerary ids", itineraryIds);
      const productIds = response.data.products.map(
        (product) => product.productId
      );
      setProductId("product ids", productIds);
      console.log("product ids", productIds);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}tourist/history/getHistory/${touristId}`
        );
        console.log("response", response);
        setHistory(response.data);
        const guideIds = response.data.guides.map((guide) => guide.guideId);
        setGuideId(guideIds);
        console.log("guide ids", guideIds);
        const activityIds = response.data.activities.map(
          (activity) => activity.activityId
        );
        setActivityId(activityIds);
        console.log("activity ids", activityIds);
        const itineraryIds = response.data.itineraries.map(
          (itinerary) => itinerary.itineraryId
        );
        setItineraryId("itinerary ids", itineraryIds);
        console.log("itinerary ids", itineraryIds);
        const productIds = response.data.products.map(
          (product) => product.productId
        );
        setProductId("product ids", productIds);
        console.log("product ids", productIds);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (touristId) {
      fetchHistory();
    }
  }, [touristId]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!history) {
    return <Empty />;
  }
  return (
    <div>
      <h2 style={{ marginBottom: "30px" }}>My History</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {history.activities.filter((activity) => activity.gaveFeedback === false).map((activity) => (
          <Card
            key={activity.activityId}
            title={activity.name}
            style={{
              width: "315px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p>
              <strong>Date:</strong>{" "}
              {new Date(activity.date).toLocaleDateString()}
            </p>
            {activity.gaveFeedback ? (
              <p>Thanks for your feedback!</p>
            ) : (
              <Feedback
                type="activity"
                touristId={touristId}
                id={activity.activityId}
                name={activity.name}
                onSubmit={handleFeedbackSubmit}
              />
            )}
          </Card>
        ))}

        {history.itineraries.filter((activity) => activity.gaveFeedback === false).map((itinerary) => (
          <Card
            key={itinerary.itineraryId}
            title={itinerary.name}
            style={{
              width: "315px",
            }}
          >
            <p>
              <strong>Date:</strong>{" "}
              {new Date(itinerary.date).toLocaleDateString()}
            </p>
            {itinerary.gaveFeedback ? (
              <p>Thanks for your feedback!</p>
            ) : (
              <Feedback
                type="itinerary"
                touristId={touristId}
                id={itinerary.itineraryId}
                name={itinerary.name}
                onSubmit={handleFeedbackSubmit}
              />
            )}
          </Card>
        ))}

        {history.guides.filter((activity) => activity.gaveFeedback === false).map((guide) => (
          <Card
            key={guide.guideId}
            title={`Guide: ${guide.name}`}
            style={{ width: "315px" }}
          >
            {guide.gaveFeedback ? (
              <p>Thanks for your feedback!</p>
            ) : (
              <Feedback
                type="guide"
                touristId={touristId}
                id={guide.guideId}
                name={guide.name}
                onSubmit={handleFeedbackSubmit}
              />
            )}
          </Card>
        ))}

        {history.products.filter((activity) => activity.gaveFeedback === false).map((product) => (
          <Card
            key={product.productId}
            title={product.name}
            style={{
              width: "315px",
            }}
          >
            <p>
              <strong>Date:</strong>{" "}
              {new Date(product.date).toLocaleDateString()}
            </p>
            {product.gaveFeedback ? (
              <p>Thanks for your feedback!</p>
            ) : (
              <Feedback
                type="product"
                touristId={touristId}
                id={product.productId}
                name={product.name}
                onSubmit={handleFeedbackSubmit}
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TouristHistory;
