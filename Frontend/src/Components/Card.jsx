import React, { useState } from 'react';
import { DropboxOutlined } from '@ant-design/icons';
import { Avatar, Card, Flex, Switch } from 'antd';
const actions = [
    <DropboxOutlined key="archive" />,
];
const CustomCard = ({ title, price, quantity, onClick }) => {
    return (
        <Flex gap="middle" align="start" vertical>
            <Card
                actions={actions}
                onClick={onClick} // Trigger edit mode when the card is clicked
                style={{
                    minWidth: 300,
                    cursor: 'pointer', // Change cursor to pointer for better UX
                }}
            >
                <Card.Meta
                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                    title={
                        <p>Details:{title}</p>
                    } // Use passed title
                    description={
                        <>
                            <p><strong>Price:</strong> ${price}</p>
                            <p><strong>Quantity:</strong> {quantity}</p>
                        </>
                    }
                />
            </Card>
        </Flex>
    );
};

export default CustomCard;