import React, { useState, useEffect, useRef } from 'react';
import { Table, message, DatePicker } from 'antd';
import { jwtDecode } from 'jwt-decode'; // Fixing import as per package usage
import axios from 'axios';
import moment from 'moment';
import { FilterOutlined } from '@ant-design/icons';
import { Column } from '@antv/g2plot';

const { RangePicker } = DatePicker;

const GuidTourReport = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [guideId, setGuideId] = useState(null);
    const [totalTourists, setTotalTourists] = useState(0); // State for total tourists
    const [originalSalesData, setOriginalSalesData] = useState([]);
    const [filters, setFilters] = useState({
        dateRange: null,
        filterMode: 'date',
    });
    const chartRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Replace with your token source
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the JWT token
                const guideIdFromToken = decoded?.userId || decoded?.guideId || null; // Adjust key based on your token structure
                setGuideId(guideIdFromToken);
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
        if (!guideId) return; // Do nothing if guideId is not set
        const fetchSalesData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/guide/viewTouristReport/${guideId}`);
                const { totalTourists, report } = response.data;
                if (Array.isArray(report)) {
                    const transformedData = report.map((record, index) => ({
                        key: index, // Unique key for table rows
                        touristUserName: record.touristUserName || "Unknown Tourist", // Tourist username
                        touristDOB: record.touristDOB ? new Date(record.touristDOB).toLocaleDateString() : "No DOB available", // Format DOB
                        touristNationality: record.touristNationality || "Unknown Nationality", // Tourist nationality
                        bookingDate: record.bookingDate ? new Date(record.bookingDate).toLocaleDateString() : "No Booking Date", // Format booking date
                        itineraryName: record.itineraryName || "Unnamed Itinerary", // Itinerary name
                        originalDate: record.bookingDate, // Store original date for filtering
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
    }, [guideId]);

    const applyFilters = (currentData, currentFilters) => {
        let filteredData = [...currentData];

        // Apply date range filters
        if (currentFilters.dateRange && currentFilters.dateRange.length === 2) {
            const [start, end] = currentFilters.dateRange;
            const startDate = moment(start).startOf("day");   // Inclusive of the full start day
            const endDate = moment(end).endOf("day"); // Inclusive of the full end day

            filteredData = filteredData.filter((item) => {
                const itemDate = moment(item.originalDate); // Parse the booking date as a moment object
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
            title: 'Itinerary Date',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
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
            title: 'Itinerary Name',
            dataIndex: 'itineraryName',
            key: 'itineraryName',
            align: 'center',
        },
    ];
    
    useEffect(() => {
        if (!salesData?.length || !chartRef.current) return;
    
        // Aggregate tourist count by itinerary
        const chartData = salesData.reduce((acc, curr) => {
            const existing = acc.find(item => item.itinerary === curr.itineraryName);
            if (existing) {
                existing.touristCount += 1;  // Increment tourist count
            } else {
                acc.push({
                    itinerary: curr.itineraryName,
                    touristCount: 1,
                });
            }
            return acc;
        }, []);
    
        // Initialize chart
        const columnChart = new Column(chartRef.current, {
            data: chartData,
            xField: 'itinerary',
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
            <h2>Guide Tourists Report</h2>
            <p>Total Number of Tourists: <strong>{totalTourists}</strong></p>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <Table
                        columns={columns}
                        dataSource={salesData}
                        loading={loading}
                        rowKey={(record) => record.key}
                    />
                </div>
                <div style={{ flex: 1, minHeight: '400px' }}>
                    <div ref={chartRef} />
                </div>
            </div>
        </div>
    );
};

export default GuidTourReport;