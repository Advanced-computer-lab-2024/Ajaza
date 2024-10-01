import React, { useState } from "react";
import { Card, Button, Input } from "antd";

export const CardTemp = ({ outerTitle, cardsData, onUpdate }) => {
  const [cards, setCards] = useState(cardsData);

  const handleEdit = (index) => {
    const newCards = [...cards];
    newCards[index].isEditing = true;
    setCards(newCards);
  };

  const handleSave = async (index, newContent) => {
    const cardId = cards[index]._id; // Assuming each card has a unique '_id'
    const newCards = [...cards];
    newCards[index].content = newContent;
    newCards[index].isEditing = false;

    setCards(newCards);

    // Call the update function passed as a prop
    await onUpdate(cardId, newContent);
  };

  return (
    <Card title={outerTitle}>
      {cards?.map((card, index) => (
        <Card key={index} type="inner" title={card.title}>
          {card.isEditing ? (
            <Input
              defaultValue={card.content}
              onPressEnter={(e) => handleSave(index, e.target.value)}
              onBlur={() => handleSave(index, card.content)} // Optional: save on blur
            />
          ) : (
            <span>{card.content}</span>
          )}
          {card.title !== "Username" &&
            card.title !== "Wallet" &&
            !card.isEditing && (
              <Button type="link" onClick={() => handleEdit(index)}>
                Edit
              </Button>
            )}
        </Card>
      ))}
    </Card>
  );
};
