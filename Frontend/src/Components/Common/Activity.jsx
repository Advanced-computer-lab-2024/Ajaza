import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Form } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "./Constants";

const Activity = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [advertiser, setAdvertiser] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`${apiUrl}activity/${id}`);
        setActivity(response.data);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchActivity();
  }, [id]);

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}advertiser/${activity.advertiserId}`
        );
        setAdvertiser(response.data);
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
    return <div>Loading activity...</div>;
  }

  const discount = 10;

  return (
    <>
      <Item
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
    </>
  );
};

export default Activity;
