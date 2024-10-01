import React, { useState } from 'react';
import { DropboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Card, Flex, Switch } from 'antd';
const actions = [
    <DropboxOutlined key="archive" />,
    <UploadOutlined key="upload" />,
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
                cover={
                    <img
                        alt="example"
                        src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                    />
                }
            >
                <Card.Meta
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