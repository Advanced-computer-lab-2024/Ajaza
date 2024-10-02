import React from 'react';
import AccordionComponent from './Accordion';
import {Card} from 'antd';
import { Box } from '@mui/material';

const MappedAccordionComponent = () => {
  const accordionData = [
    {
      title: 'Upcoming Activities',
      details: [
        'City Walking Tour - Date:October 5th 10:00 AM , Budget:10$ , Category: Tour , rating: 4.5',
        'Sunset Boat Cruise - October 6th, 6:00 PM , Budget:15$ , Category: Cruise , rating: 4.2',
        'Wine Tasting Event - October 7th, 3:00 PM , Budget:25$ Category: Tasting , rating: 5',
      ],
    },
    {
      title: 'Historical Museums',
      details: [
        'National History Museum: November 5th, 10:00 AM',
        'War Memorial Museum: November 7th, 12:00 PM',
        'Art & History Museum: December 20th, 11:00 AM',
      ],
    },
    {
      title: 'Itineraries',
      details: [
        'Day 1 (October 26th) - Arrival & City Tour',
        'Day 2 (October 27th) - Adventure & Nature',
        'Day 3 (October 28th) - Cultural Experiences',
      ],
    },
  ];

  return (
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh" 
  >
    <div>
        <Card
        title ={<strong>Upcoming Activities/Itineraries/Historical Places and Museums </strong>}
        bordered={false}
        style={{
          maxWidth: 800,
          margin: 'auto',
        }}
      >
     
      {accordionData.map((accordion, index) => (
        <AccordionComponent
          key={index}
          title={accordion.title}
          details={accordion.details}
        />
      ))}
      </Card>
    </div>
    </Box>
  );
};

export default MappedAccordionComponent;
