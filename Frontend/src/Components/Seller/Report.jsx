import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import SearchFilterSortContainer from '../Common/SearchFilterSortContainer';

const Report = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [SellerId, setSellerId] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const filterFields = {
        product: {
            displayName: "Product Name",
            values: [], // Will populate dynamically after fetching data
            compareFn: (filterCriteria, element) => element.productName === filterCriteria,
        },
        date: {
            displayName: "Date Sold",
            values: [
                { displayName: "Last 7 Days", filterCriteria: 7 },
                { displayName: "Last 30 Days", filterCriteria: 30 },
                { displayName: "Last 6 Months", filterCriteria: 180 },
                { displayName: "Last Year", filterCriteria: 365 },
            ],
            compareFn: (filterCriteria, element) => filterByDateRange(filterCriteria, element.saleDate),
        },
        month: {
            displayName: "Month",
            values: [
                { displayName: "January", filterCriteria: 0 },
                { displayName: "February", filterCriteria: 1 },
                { displayName: "March", filterCriteria: 2 },
                { displayName: "April", filterCriteria: 3 },
                { displayName: "May", filterCriteria: 4 },
                { displayName: "June", filterCriteria: 5 },
                { displayName: "July", filterCriteria: 6 },
                { displayName: "August", filterCriteria: 7 },
                { displayName: "September", filterCriteria: 8 },
                { displayName: "October", filterCriteria: 9 },
                { displayName: "November", filterCriteria: 10 },
                { displayName: "December", filterCriteria: 11 },
            ],
            compareFn: (filterCriteria, element) => filterByMonth(filterCriteria, element.saleDate),
        },
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        setSellerId(decodedToken.userDetails["_id"]);
    }, []);

    useEffect(() => {
        const fetchSalesData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/seller/viewSalesReport/${SellerId}`);
                const data = response.data;

                if (Array.isArray(data)) {
                    setSalesData(data);
                    setFilteredData(data); // Set initial filtered data
                    // Dynamically populate the product names for filtering
                    filterFields.product.values = data.map(item => ({
                        displayName: item.productName,
                        filterCriteria: item.productName,
                    }));
                } else {
                    console.error('Invalid data format, expected an array', data);
                    setSalesData([]);
                    setFilteredData([]);
                }
            } catch (error) {
                message.error("Failed to load sales report.");
            } finally {
                setLoading(false);
            }
        };

        if (SellerId) {
            fetchSalesData();
        }
    }, [SellerId]);

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Quantity Sold',
            dataIndex: 'quantitySold',
            key: 'quantitySold',
        },
        {
            title: 'Date Sold',
            dataIndex: 'dateSold',
            key: 'dateSold',
        },
        {
            title: 'Sale Price',
            dataIndex: 'salePrice',
            key: 'salePrice',
        },
        {
            title: 'Total Revenue',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
        },
    ];

    const filterByDateRange = (days, saleDate) => {
        const currentDate = new Date();
        const targetDate = new Date(saleDate);
        const diffTime = Math.abs(currentDate - targetDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
        return diffDays <= days;
    };

    const filterByMonth = (month, saleDate) => {
        const targetMonth = new Date(saleDate).getMonth(); // Get month of the sale
        return targetMonth === month;
    };

    const handleFilterChange = (filterCriteria, field) => {
        const filtered = salesData.filter((item) => filterFields[field].compareFn(filterCriteria, item));
        setFilteredData(filtered);
    };

    return (
        <div>
            <h2>Sales Report</h2>
            <SearchFilterSortContainer
                filterFields={filterFields}
                onFilterChange={handleFilterChange}
                elements={salesData} // Pass the data to the container
            // Remove sortFields to disable sorting
            />
            <Table
                dataSource={filteredData || []}  // Ensure dataSource is always an array
                columns={columns}
                loading={loading}
                rowKey={(record) => record._id}
            />
        </div>
    );
};

export default Report;
