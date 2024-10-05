import React from 'react';
import { Card, Flex } from 'antd';

const CustomCard2 = ({ name, description, onClick }) => {
    return (
        <Flex gap="middle" align="start" vertical>
            <Card
                onClick={onClick} // Trigger edit mode when the card is clicked
                style={{
                    minWidth: 300,
                    cursor: 'pointer', // Change cursor to pointer for better UX
                }}
            >
                <Card.Meta
                    title={<p>Seller Details</p>}
                    description={
                        <>
                            <p><strong>Name:</strong> {name}</p>
                            <p><strong>Description:</strong> {description}</p>
                        </>
                    }
                />
            </Card>
        </Flex>
    );
};

export default CustomCard2;
