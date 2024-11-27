import React, { useState, useEffect } from 'react';
import { Table, message, DatePicker } from 'antd';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import moment from 'moment';
import { FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const AdvertiserReport = () => {
    const [originalSalesData, setOriginalSalesData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [AdvertiserId, setAdvertiserId] = useState(null);
    const [totalSales, setTotalSales] = useState(0);
    const [filters, setFilters] = useState({
        activityNames: [],
        dateRange: null,
        filterMode: 'date',
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const AdvertiserIdFromToken = decoded?.userId || decoded?.AdvertiserId || null;
                setAdvertiserId(AdvertiserIdFromToken);
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
        if (!AdvertiserId) return;

        const fetchSalesData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/advertiser/viewSalesReport/${AdvertiserId}`);
                const { totalSales, report } = response.data;

                if (Array.isArray(report)) {
                    const transformedData = report.map((activity, index) => ({
                        key: index, // Unique key for table rows
                        activityName: activity.name || "Unnamed Activity", // Activity name
                        activityDate: activity.activityDate
                            ? new Date(activity.activityDate).toLocaleDateString()
                            : "No Date",
                        originalDate: moment(activity.activityDate), // Parse as moment object
                        price: activity.price || 0, // Price
                        category: activity.category?.join(", ") || "Uncategorized", // Convert category array to string
                    }));

                    setOriginalSalesData(transformedData);
                    setSalesData(transformedData);
                    setTotalSales(totalSales || 0);
                    // Debug: Log the original data
                console.log("Original Sales Data (Initial Load):", transformedData);
                } else {
                    console.error("Invalid data format:", report);
                    setOriginalSalesData([]);
                    setSalesData([]);
                    setTotalSales(0);
                }
            } catch (error) {
                console.error("Error fetching sales data:", error);
                message.error("Failed to load sales report.");
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, [AdvertiserId]);

    const applyFilters = (currentData, currentFilters) => {
        let filteredData = [...currentData];

    if (currentFilters.activityNames && currentFilters.activityNames.length > 0) {
        filteredData = filteredData.filter(item =>
            currentFilters.activityNames.some(name =>
                item.activityName.toLowerCase().includes(name.toLowerCase())
            )
        );
    }

    if (currentFilters.dateRange && currentFilters.dateRange.length === 2) {
        const [start, end] = currentFilters.dateRange;

        filteredData = filteredData.filter(item => {
            const itemDate = moment(item.originalDate);
            const startDate = moment(start, "MM-DD-YYYY");
            const endDate = moment(end, "MM-DD-YYYY");

            return itemDate.isBetween(startDate, endDate, undefined, "[]");
        });
    }

    return filteredData;
    };

    const handleDateRangeChange = (dates, filterMode = 'date') => {
        const newFilters = {
            ...filters,
            dateRange: dates, // Keep original Moment objects
            filterMode: filterMode,
        };
    
        setFilters(newFilters);
        
        // When applying filters, format the dates to MM-DD-YYYY to avoid the issue of empty results
        const filteredData = applyFilters(originalSalesData, {
            ...newFilters,
            dateRange: dates 
                ? dates.map(date => date.format("MM-DD-YYYY")) 
                : null
        });
        
        setSalesData(filteredData);
    
        const newTotalSales = filteredData.reduce((sum, item) => sum + item.price, 0);
        setTotalSales(newTotalSales);
    };

    const resetFilters = () => {
        setFilters({
            activityNames: [],
            dateRange: null,
            filterMode: 'date',
        });
        setSalesData(originalSalesData);
        setTotalSales(originalSalesData.reduce((sum, item) => sum + item.price, 0));
    };

    const uniqueActivityNames = [...new Set(originalSalesData.map(item => item.activityName))];

    const columns = [
        {
            title: 'Activity Name',
            dataIndex: 'activityName',
            key: 'activityName',
            filters: uniqueActivityNames.map(name => ({ text: name, value: name })),
            filterSearch: true,
            filterMultiple: true,
            onFilter: (value, record) => record.activityName.includes(value),
        },
        {
            title: 'Activity Date',
            dataIndex: 'activityDate',
            key: 'activityDate',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <RangePicker
                        onChange={(dates) => {
                            setSelectedKeys(dates ? dates : []);
                            confirm();
                            handleDateRangeChange(dates, 'date');
                        }}
                        value={filters.filterMode === 'date' ? filters.dateRange : null}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <RangePicker
                        picker="month"
                        onChange={(dates) => {
                            setSelectedKeys(dates ? dates : []);
                            confirm();
                            handleDateRangeChange(dates, 'month');
                        }}
                        value={filters.filterMode === 'month' ? filters.dateRange : null}
                        style={{ display: 'block' }}
                    />
                </div>
            ),
            filterIcon: (filtered) => (
                <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `$${text.toFixed(2)}`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        }
    ];

    return (
        <div>
            <h2>Advertiser Sales Report</h2>

            <p>Total Sales: <strong>${totalSales.toFixed(2)}</strong></p>

            <Table
                columns={columns}
                dataSource={salesData}
                loading={loading}
                rowKey={(record) => record.key || record.activityName}
            />
        </div>
    );
};

export default AdvertiserReport;