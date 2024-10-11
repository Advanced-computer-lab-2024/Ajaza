import React, { useState } from 'react';
import { Rate, Input, message } from 'antd';
import axios from 'axios';
import { apiUrl } from "../Common/Constants";
import CustomButton from '../Common/CustomButton';

const Feedback = ({ type, touristId, id, name, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const handleSubmit = async () => {
    try {
      const feedbackData = {};

      if (!rating || !comments) {
        message.error("Both rating and comment are required.");
        return;
      }

      feedbackData.rating = rating;
      feedbackData.comments = comments;

      let endpoint = '';
      switch (type) {
        case 'activity':
          endpoint = `activity/${touristId}/activity/${id}/feedback`;
          break;
        case 'itinerary':
          endpoint = `itinerary/${touristId}/itinerary/${id}/feedback`;
          break;
        case 'guide':
          endpoint = `guide/${touristId}/guide/${id}/feedback`;
          break;
        default:
          throw new Error("Invalid feedback type.");
      }
      
      const response = await axios.post(`${apiUrl}${endpoint}`, feedbackData);
      console.log(response);
      message.success("Feedback submitted successfully!");

    
      setIsSubmitted(true);
      onSubmit(); 
    } catch (error) {
      message.error("Failed to submit feedback.");
    }
  };


  if (isSubmitted) {
    return <p>Thanks for your feedback!</p>; 
  }

  return (
    <div>
      <div>
        <span>Rate this {type}:</span>
        <Rate value={rating} onChange={(value) => setRating(value)} />
      </div>

      <Input.TextArea 
        rows={4} 
        value={comments} 
        onChange={(e) => setComment(e.target.value)} 
        placeholder="Write your comment here"
        style={{ marginTop: '10px' }}
      />
      
      <CustomButton value="Submit" size="s" onClick={handleSubmit} />
    </div>
  );
};

export default Feedback;
