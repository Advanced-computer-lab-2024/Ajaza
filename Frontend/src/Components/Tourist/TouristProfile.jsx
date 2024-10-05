// import React, { useState } from "react";
// import { CardTemp } from "./CardTemp";
// import styles from "./CardTemp.module.css";

// export const TouristProfile = () => {
//   const initialCards = [
//     { _id: "1", title: "Username", content: "mariemmobarak", isEditing: false },
//     { _id: "2", title: "Wallet", content: "$500", isEditing: false },
//     {
//       _id: "3",
//       title: "Email",
//       content: "johndoe@example.com",
//       isEditing: false,
//     },
//   ];

//   const [cards, setCards] = useState(initialCards);

//   const updateTouristProfile = (cardId, newContent) => {
//     const updatedCards = cards.map((card) =>
//       card._id === cardId ? { ...card, content: newContent } : card
//     );
//     setCards(updatedCards);
//   };

//   return (
//      <div className={styles.cardContainer}>
//       <CardTemp
//         outerTitle="Profile Details"
//         cardsData={cards}
//         onUpdate={updateTouristProfile}
//       />
//     </div>
    
//   );
// };
