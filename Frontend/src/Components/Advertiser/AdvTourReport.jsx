import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import {jwtDecode} from 'jwt-decode'; // Fixing import as per package usage
import axios from 'axios';

const AdvTourReport = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [advertiserId, setAdvertiserId] = useState(null);
    const [totalTourists, setTotalTourists] = useState(0); // State for total tourists

    useEffect(() => {
        const token = localStorage.getItem("token"); // Replace with your token source
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the JWT token
                const advertiserIdFromToken = decoded?.userId || decoded?.AdvertiserId || null; // Adjust key based on your token structure
                setAdvertiserId(advertiserIdFromToken);
            } catch (error) {
                console.error("Invalid token:", error);
                message.error("Unable to decode token.");
            }
        } else {
            console.warn("No token found.");
            message.warning("You are not logged in.");
        }
    }, []);

    useEffect(() => {
        if (!advertiserId) return; // Do nothing if advertiserId is not set

        const fetchSalesData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/advertiser/viewTouristReport/${advertiserId}`);
                const { totalTourists, report } = response.data;

                if (Array.isArray(report)) {
                    const transformedData = report.map((record, index) => ({
                        key: index, // Unique key for table rows
                        touristUserName: record.touristUserName || "Unknown Tourist", // Tourist username
                        touristDOB: record.touristDOB ? new Date(record.touristDOB).toLocaleDateString() : "No DOB available", // Format DOB
                        touristNationality: record.touristNationality || "Unknown Nationality", // Tourist nationality
                        activityDate: record.activityDate ? new Date(record.activityDate).toLocaleDateString() : "No Activity Date", // Format activity date
                        activityName: record.activityName || "Unnamed Activity", // Activity name
                    }));
                    setSalesData(transformedData); // Set transformed data
                    setTotalTourists(totalTourists); // Set total tourists
                } else {
                    console.error("Invalid data format:", report);
                    setSalesData([]); // Clear sales data if invalid format
                    setTotalTourists(0); // Reset total tourists
                }
            } catch (error) {
                console.error("Error fetching sales data:", error);
                message.error("Failed to load sales report.");
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, [advertiserId]);

    const columns = [
        {
            title: 'Tourist Username',
            dataIndex: 'touristUserName',
            key: 'touristUserName',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'touristDOB',
            key: 'touristDOB',
        },
        {
            title: 'Nationality',
            dataIndex: 'touristNationality',
            key: 'touristNationality',
        },
        {
            title: 'Activity Date',
            dataIndex: 'activityDate',
            key: 'activityDate',
        },
        {
            title: 'Activity Name',
            dataIndex: 'activityName',
            key: 'activityName',
        },
    ];

    return (
        <div>
            <h2>Sales Report</h2>
            <p>Total Number of Tourists: <strong>{totalTourists}</strong></p> {/* Display total tourists */}
            <Table
                columns={columns}
                dataSource={salesData} // Pass the sales data to the table
                loading={loading}
                rowKey={(record) => record.key}
            />
        </div>
    );
};

export default AdvTourReport;
