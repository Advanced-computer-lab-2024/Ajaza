import React, { useState, useEffect, useRef } from 'react';
import { Table, message, DatePicker } from 'antd';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import moment from 'moment';
import { FilterOutlined } from '@ant-design/icons';
import { Column } from '@antv/g2plot';

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
    const chartRef = useRef(null);


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
    
        // Apply activity name filters
        if (currentFilters.activityNames && currentFilters.activityNames.length > 0) {
            filteredData = filteredData.filter((item) =>
                currentFilters.activityNames.some((name) =>
                    item.activityName.toLowerCase().includes(name.toLowerCase()) // Check if activity name includes any selected name
                )
            );
        }
    

        // Apply date range filters
        if (currentFilters.dateRange && currentFilters.dateRange.length === 2) {
            const [start, end] = currentFilters.dateRange;
            const startDate = moment(start, "MM-DD-YYYY").startOf("day");   // Inclusive of the full start day
            const endDate = moment(end, "MM-DD-YYYY").endOf("day"); // Inclusive of the full end day

            filteredData = filteredData.filter((item) => {
            const itemDate = moment(item.originalDate); // Parse the activity date as a moment object
            return itemDate.isBetween(startDate, endDate, undefined, "[]"); // Inclusive start and end
            });
        }

        return filteredData;
    };
    
    const handleDateRangeChange = (dates, filterMode = 'date') => {
        let adjustedDates = dates;
    
        if (filterMode === 'month' && dates && dates.length === 2) {
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
            filterMode: filterMode, // Update the filter mode (e.g., 'date' or 'month')
        };
        
        setFilters(newFilters); // Update the state with the new filters
        
        // Apply filters with the selected date range formatted to avoid empty results
        const filteredData = applyFilters(originalSalesData, {
            ...newFilters,
            dateRange: adjustedDates 
                ? adjustedDates.map(date => date.format("MM-DD-YYYY")) // Format dates to MM-DD-YYYY before filtering
                : null
        });
        
        setSalesData(filteredData); // Update the sales data to show only filtered results
    
        const newTotalSales = filteredData.reduce((sum, item) => sum + item.price, 0); // Recalculate total sales from filtered data
        setTotalSales(newTotalSales); // Update total sales state
    };
    
    const resetFilters = () => {
        setFilters({
            activityNames: [], // Reset activity names filter
            dateRange: null, // Reset date range filter
            filterMode: 'date', // Reset filter mode to 'date'
        });
        setSalesData(originalSalesData); // Reset sales data to the original data
        setTotalSales(originalSalesData.reduce((sum, item) => sum + item.price, 0)); // Recalculate and reset total sales
    };

    const uniqueActivityNames = [...new Set(originalSalesData.map(item => item.activityName))]; // Extract unique activity names for filters
    const columns = [
        {
            title: 'Activity Name',
            dataIndex: 'activityName',
            key: 'activityName',
            align: 'center',
            filters: uniqueActivityNames.map(name => ({ text: name, value: name })), // Add activity name filter options
            filterSearch: true, // Enable search functionality in the filter
            filterMultiple: true, // Allow multiple selections in the filter
            onFilter: (value, record) => record.activityName.includes(value), // Define filter logic for activity names
        },
        {
            title: 'Activity Date',
            dataIndex: 'activityDate',
            key: 'activityDate',
            align: 'center',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <RangePicker
                        onChange={(dates) => {
                            setSelectedKeys(dates ? dates : []); // Update selected keys with chosen dates
                            confirm(); // Apply the filter
                            handleDateRangeChange(dates, 'date'); // Handle the date range filter change
                        }}
                        value={filters.filterMode === 'date' ? filters.dateRange : null} // Show selected date range in the picker
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <RangePicker
                        picker="month"
                        onChange={(dates) => {
                            setSelectedKeys(dates ? dates : []); // Update selected keys with chosen months
                            confirm(); // Apply the filter
                            handleDateRangeChange(dates, 'month'); // Handle the month range filter change
                        }}
                        value={filters.filterMode === 'month' ? filters.dateRange : null} // Show selected month range in the picker
                        style={{ display: 'block' }}
                    />
                </div>
            ),
            filterIcon: (filtered) => (
                <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} /> // Change filter icon color if filter is applied
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
            render: (text) => `$${text.toFixed(2)}`,
            sorter: (a, b) => a.price - b.price, // Enable sorting by price
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            align: 'center',
        }
    ];


    useEffect(() => {
        if (!salesData?.length || !chartRef.current) return;
    
        // Aggregate data by activity
        const chartData = salesData.reduce((acc, curr) => {
            const existing = acc.find(item => item.activity === curr.activityName);
            if (existing) {
                existing.sales += curr.price;
            } else {
                acc.push({
                    activity: curr.activityName,
                    sales: curr.price,
                });
            }
            return acc;
        }, []);
    
        // Initialize chart
        const columnChart = new Column(chartRef.current, {
            data: chartData,
            xField: 'activity',
            yField: 'sales',
            label: {
                position: 'middle',
                style: {
                    fill: '#FFFFFF',
                },
            },
            xAxis: {
                label: {
                    autoRotate: true,
                },
            },
            meta: {
                sales: {
                    alias: 'Total Sales ($)',
                    formatter: (v) => `$${v.toFixed(2)}`
                }
            }
        });
    
        columnChart.render();
    
        return () => columnChart.destroy();
    }, [salesData]);


    return (
        <div>
            <h2>Advertiser Sales Report</h2>
            <p>Total Sales: <strong>${totalSales.toFixed(2)}</strong></p>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <Table
                        columns={columns}
                        dataSource={salesData}
                        loading={loading}
                        rowKey={(record) => record.key || record.activityName}
                        onChange={(pagination, filters, sorter) => {
                            // Extract the filters for activity names and date range
                            const activityNames = filters.activityName || [];
                            const dateRange = filters.dateRange || null;
    
                            // Construct the new filters state
                            const newFilters = {
                                activityNames: activityNames.length > 0 ? activityNames : filters.activityNames || [],
                                dateRange: dateRange ? dateRange : filters.dateRange || null,
                                filterMode: filters.filterMode || 'date',
                            };
    
                            // Update the filter state
                            setFilters((prev) => ({
                                ...prev,
                                activityNames: newFilters.activityNames,
                                dateRange: newFilters.dateRange,
                            }));
    
                            // Apply both filters at once
                            const filteredData = applyFilters(originalSalesData, newFilters);
    
                            // Update the sales data and total sales
                            setSalesData(filteredData);
                            const newTotalSales = filteredData.reduce((sum, item) => sum + item.price, 0);
                            setTotalSales(newTotalSales);
                        }}
                    />
                </div>
                <div style={{ flex: 1, minHeight: '400px' }}>
                    <div ref={chartRef} />
                </div>
            </div>
        </div>
    );
};

export default AdvertiserReport;