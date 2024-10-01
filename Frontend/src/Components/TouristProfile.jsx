// import React, { useState } from 'react'; 
// import { CardTemp } from './CardTemp';
// import styles from './CardTemp.module.css';

// export const TouristProfile = () => {
//   const initialCards = [
//     { _id: '1', title: 'Username', content: 'mariemmobarak', isEditing: false },
//     { _id: '2', title: 'Wallet', content: '$500', isEditing: false },
//     { _id: '3', title: 'Email', content: 'johndoe@example.com', isEditing: false },
//   ];

//   const [cards, setCards] = useState(initialCards);

//   const updateTouristProfile = (cardId, newContent) => {
//     const updatedCards = cards.map(card => 
//       card._id === cardId ? { ...card, content: newContent } : card
//     );
//     setCards(updatedCards);
//   };

//   return (
//     <div className={styles.cardContainer}>
//       <CardTemp outerTitle="Profile Details" cardsData={cards} onUpdate={updateTouristProfile} /> 
//     </div>
//   );
// };


// import  { useState, useEffect } from 'react'; 
// import { CardTemp } from './CardTemp';
// import styles from './CardTemp.module.css';



// export const TouristProfile = () => {
//   const [cards, setCards] = useState({}); 

//   useEffect(() => {
//     const fetchCards = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/tourist/touristReadProfile/${id}`); 
//         if (!response.ok) {
//           throw new Error('Network response was not ok'); 
//         }
//         const data = await response.json();
//         setCards({data}); // Assuming it's a single tourist profile
//       } catch (error) {
//         console.error('Error fetching tourist data:', error);
//       }
//     };

//     fetchCards();
//   }, []); 

//   const updateTouristProfile = async (cardId, newContent) => {
//     try {
//       const response = await axios.patch(`http://localhost:5000/tourists/${cardId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newContent),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const updatedCard = await response.json();
//       console.log(`Card updated successfully:`, updatedCard);
//     } catch (error) {
//       console.error('Failed to update card:', error);
//     }
//   };

//   return (
//     <div className={styles.cardContainer}>
//       <CardTemp outerTitle="Profile Details" cardsData={cards} onUpdate={updateTouristProfile} /> 
//     </div>
//   );
// };




import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { CardTemp } from './CardTemp';
import styles from './CardTemp.module.css';

export const TouristProfile = ({ id }) => { // Pass `id` as a prop
  const [cards, setCards] = useState({}); 

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tourist/touristReadProfile/${id}`);
        setCards(response.data); // Directly set the fetched data
      } catch (error) {
        console.error('Error fetching tourist data:', error);
      }
    };

    fetchCards();
  }, [id]); 

  const updateTouristProfile = async (cardId, newContent) => {
    try {
      const response = await axios.patch(`http://localhost:5000/tourists/${cardId}`, newContent, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`Card updated successfully:`, response.data); 
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  return (
    <div className={styles.cardContainer}>
      <CardTemp outerTitle="Profile Details" cardsData={cards} onUpdate={updateTouristProfile} /> 
    </div>
  );
};
