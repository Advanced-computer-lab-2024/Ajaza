import React, { useState, useEffect, useRef } from 'react';
import { Table, message, DatePicker } from 'antd';
import {jwtDecode} from 'jwt-decode'; // Fixing import as per package usage
import axios from 'axios';
import moment from 'moment';
import { FilterOutlined } from '@ant-design/icons';
import { Column } from '@antv/g2plot';

const { RangePicker } = DatePicker;



const AdvTourReport = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [advertiserId, setAdvertiserId] = useState(null);
    const [totalTourists, setTotalTourists] = useState(0); // State for total tourists
    const [originalSalesData, setOriginalSalesData] = useState([]);
    const chartRef = useRef(null);

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
                    setOriginalSalesData(transformedData); // Set original data
                    setTotalTourists(totalTourists); // Set total tourists
                } else {
                    console.error("Invalid data format:", report);
                    setSalesData([]); // Clear sales data if invalid format
                    setOriginalSalesData([]); // Clear original data
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
    


    const [filters, setFilters] = useState({
        dateRange: null,
        filterMode: 'date',
    });
    
    const applyFilters = (currentData, currentFilters) => {
        let filteredData = [...currentData];
    
        // Apply date range filters
        if (currentFilters.dateRange && currentFilters.dateRange.length === 2) {
            const [start, end] = currentFilters.dateRange;
            const startDate = moment(start).startOf("day");   // Inclusive of the full start day
            const endDate = moment(end).endOf("day"); // Inclusive of the full end day
    
            filteredData = filteredData.filter((item) => {
                const itemDate = moment(item.originalDate); // Parse the activity date as a moment object
                return itemDate.isBetween(startDate, endDate, undefined, "[]"); // Inclusive start and end
            });
        }
    
        return filteredData;
    };

const handleDateRangeChange = (dates) => {
    let adjustedDates = dates;

    if (dates && dates.length === 2) {
        adjustedDates = [
            dates[0].startOf('month'), // Start of the first month
            dates[1].endOf('month') // End of the second month
        ];

        // Ensure that if the start month is the same as the end month, it still covers the entire month
        if (dates[0].isSame(dates[1], 'month')) {
            adjustedDates = [
                dates[0].startOf('month'), // Start of the month
                dates[0].endOf('month') // End of the same month
            ];
        }
    }

    const newFilters = {
        ...filters,
        dateRange: adjustedDates, // Update the dateRange filter with the adjusted dates
    };
    
    setFilters(newFilters); // Update the state with the new filters
    
    if (!dates) {
        setSalesData(originalSalesData); // Reset to original data
        setTotalTourists(originalSalesData.length); // Reset total tourists
    } else {
        const filteredData = applyFilters(originalSalesData, {
            ...newFilters,
            dateRange: adjustedDates 
                ? adjustedDates.map(date => date.format("MM-DD-YYYY")) // Format dates to MM-DD-YYYY before filtering
                : null
        });

        setSalesData(filteredData);
        setTotalTourists(filteredData.length);
    }
};



    const columns = [
        {
            title: 'Tourist Username',
            dataIndex: 'touristUserName',
            key: 'touristUserName',
            align: 'center',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'touristDOB',
            key: 'touristDOB',
            align: 'center',
        },
        {
            title: 'Nationality',
            dataIndex: 'touristNationality',
            key: 'touristNationality',
            align: 'center',
        },
        {
            title: 'Activity Date',
            dataIndex: 'activityDate',
            key: 'activityDate',
            align: 'center',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <RangePicker
                        picker="month"
                        onChange={(dates) => {
                            setSelectedKeys(dates ? dates : []);
                            confirm();
                            handleDateRangeChange(dates);
                        }}
                        value={filters.dateRange}
                        style={{ display: 'block' }}
                    />
                </div>
            ),
            filterIcon: (filtered) => (
                <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
        },
        {
            title: 'Activity Name',
            dataIndex: 'activityName',
            key: 'activityName',
            align: 'center',
        },
    ];

    useEffect(() => {
        if (!salesData?.length || !chartRef.current) return;
    
        // Aggregate tourist count by activity
        const chartData = salesData.reduce((acc, curr) => {
            const existing = acc.find(item => item.activity === curr.activityName);
            if (existing) {
                existing.touristCount += 1;  // Increment tourist count
            } else {
                acc.push({
                    activity: curr.activityName,
                    touristCount: 1,
                });
            }
            return acc;
        }, []);
    
        // Initialize chart
        const columnChart = new Column(chartRef.current, {
            data: chartData,
            xField: 'activity',
            yField: 'touristCount',
            label: {
                position: 'middle',
                style: {
                    fill: '#FFFFFF',
                },
            },
            xAxis: {
                label: {
                    autoRotate: false,
                    style: {
                        textAlign: 'center',
                        width: 100, // Set fixed width for label container
                    },
                    formatter: (text) => {
                        // Split text by spaces and join with newlines
                        return text.split(' ').join('\n');
                    },
                },
            },
            meta: {
                touristCount: {
                    alias: 'Number of Tourists',
                }
            }
        });
    
        columnChart.render();
    
        return () => columnChart.destroy();
    }, [salesData]);

    return (
        <div>
            <h2>Advertiser Tourists Report</h2>
            <p>Total Number of Tourists: <strong>{totalTourists}</strong></p>
            <div
                style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent: salesData.length > 0 ? 'space-between' : 'center',
                    alignItems: salesData.length > 0 ? 'flex-start' : 'center',
                    flexDirection: salesData.length > 0 ? 'row' : 'column',
                    minHeight: '400px',
                }}
            >
                <div style={{ flex: 1 }}>
                    <Table
                        columns={columns}
                        dataSource={salesData}
                        loading={loading}
                        rowKey={(record) => record.key}
                    />
                </div>
                {salesData.length > 0 && (
                    <div style={{ flex: 1, minHeight: '400px' }}>
                        <h3 style={{ fontSize: '16px' }}>Tourists Count by Activity</h3>
                        <div ref={chartRef} />
                    </div>
                )}
            </div>
        </div>
    );
};    

export default AdvTourReport;
