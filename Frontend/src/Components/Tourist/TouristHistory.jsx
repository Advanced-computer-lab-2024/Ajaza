import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import axios from 'axios';
import Feedback from './Feedback';
import { apiUrl } from "../Common/Constants";
import { jwtDecode } from "jwt-decode"; 
import CustomButton from "../Common/CustomButton";

const TouristHistory = () => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [touristId, setTouristId] = useState(null); 
  const [activityId, setActivityId] = useState(null);
  const [itineraryId, setItineraryId] = useState(null);
  const [guideId, setGuideId] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userDetails = decodedToken.userDetails;
      console.log('hi',userDetails);
      setTouristId(userDetails._id);

  
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${apiUrl}tourist/history/getHistory/${touristId}`);
        console.log('response',response);
        setHistory(response.data);
        const guideIds = response.data.guides.map(guide => guide.guideId); 
        setGuideId(guideIds); 
        console.log('guide ids', guideIds);
        const activityIds = response.data.activities.map(activity => activity.activityId);
        setActivityId(activityIds); 
        console.log('activity ids', activityIds);
        const itineraryIds = response.data.itineraries.map(itinerary => itinerary.itineraryId);
        setItineraryId('itinerary ids' , itineraryIds);
        console.log('itinerary ids', itineraryIds);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };


    


      
    if (touristId ) {
        fetchHistory();
        
    }
         
      }, [touristId  ]);



  if (loading) {
    return <Spin size="large" />;
  }
  if (!history) {
    return <p>No history available.</p>;
  }
  return (
    <div>
      <h2>My History</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {history.activities.map((activity) => (
          <Card
            key={activity.activityId}
            title={activity.name}
            style={{ width: '300px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
            {activity.gaveFeedback ? (
                <p>Thanks for your feedback!</p>
            ) : (
                <Feedback
                    type="activity"
                    touristId={touristId}
                    id={activity.activityId}
                    name={activity.name}
                    onSubmit={() => {}}
                />
             )}
          </Card>
        ))}
        
        {history.itineraries.map((itinerary) => (
          <Card
            key={itinerary.itineraryId}
            title={itinerary.name}
            style={{ width: '300px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <p><strong>Date:</strong> {new Date(itinerary.date).toLocaleDateString()}</p>
            {itinerary.gaveFeedback? (
                <p>Thanks for your feedback!</p>
            ):(
              <Feedback
                type="itinerary"
                touristId={touristId}
                id={itinerary.itineraryId}
                name={itinerary.name}
                onSubmit={() => {}}
              />
            )}
          </Card>
        ))}

        {history.guides.map((guide) => (
          <Card
            key={guide.guideId}
            title={`Guide: ${guide.name}`}
            style={{ width: '300px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
          >
            {guide.gaveFeedback? (
                <p>Thanks for your feedback!</p>
            ):(
              <Feedback
                type="guide"
                touristId={touristId}
                id={guide.guideId}
                name={guide.name}
                onSubmit={() => {}}
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TouristHistory;
