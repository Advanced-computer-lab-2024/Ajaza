import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Form } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "./Constants";

const Itinerary = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [timelineItems, setTimelineItems] = useState(null);
  const [writeReviewForm] = Form.useForm();

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`${apiUrl}itinerary/${id}`);
        setItinerary(response.data);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };

    fetchItinerary();
  }, [id]);

  useEffect(() => {
    if (itinerary) {
      setTimelineItems({
        timeline: itinerary?.timeline,
        availableDateTime: itinerary?.availableDateTime,
      });
      console.log(itinerary?.timeline);
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
        />
      )}
    </>
  );
};

export default Itinerary;
