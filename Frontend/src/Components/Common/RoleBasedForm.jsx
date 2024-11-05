import React, { useState, createContext, useContext } from 'react';
import { Card } from 'antd';
import CustomButton from '../Common/CustomButton';
import Tourist from '../Tourist/Tourist';
import TourGuide from '../TourGuide/TourGuide';
import Seller from '../Seller/Seller';
import Advertiser from '../Advertiser/Advertiser';

// Create a RoleContext to manage role state
const RoleContext = createContext();

// Custom hook to use RoleContext
export const useRole = () => useContext(RoleContext);

// Tabs for different roles
const tabList = [
    { key: 'Tourist', tab: 'Tourist' },
    { key: 'Tour Guide', tab: 'Tour Guide' },
    { key: 'Seller', tab: 'Seller' },
    { key: 'Advertiser', tab: 'Advertiser' },
];

// Content to display based on active tab
const contentList = {
    Tourist: <Tourist />,
    'Tour Guide': <TourGuide />,
    Seller: <Seller />,
    Advertiser: <Advertiser />,
};

const RoleBasedForm = () => {
    const [activeTabKey, setActiveTabKey] = useState('Tourist'); // Set default active tab
    const { role, setRole } = useRole(); // Get role and setRole from context

    const onTabChange = (key) => {
        setActiveTabKey(key); // Change the active tab
        setRole(key); // Update the role in context when the tab changes
    };

    return (
        <div>
            {/* Tabs for switching roles */}
            <Card
                style={{ width: '100%', marginBottom: '20px' }}
                tabList={tabList} // Define the tabs
                activeTabKey={activeTabKey} // Set the active tab
                onTabChange={onTabChange} // Handle tab changes
            >
                {/* Display the form based on the active tab */}
                {contentList[activeTabKey]}
            </Card>

            {/* Role-based dynamic heading */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    Register as a {role}
                </h1>
            </div>
        </div>
    );
};

export default RoleBasedForm;
