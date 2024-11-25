import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import {jwtDecode} from "jwt-decode";
import axios from 'axios';

const SellerReport = () => {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [SellerId, setSellerId] = useState(null);
    const [totalSales, setTotalSales] = useState(0); // State for total sales

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const sellerIdFromToken = decoded?.userId || decoded?.sellerId || null;
                console.log("Decoded SellerId:", sellerIdFromToken);
                setSellerId(sellerIdFromToken);
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
        if (!SellerId) return;

        const fetchSalesData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/seller/viewSalesReport/${SellerId}`);
                const { totalSales, report } = response.data;

                if (Array.isArray(report)) {
                    const transformedData = report.map((product, index) => ({
                        key: index, // Unique key for table rows
                        productName: product.name || "Unnamed Product",
                        orderDate: product.orderDate 
                            ? new Date(product.orderDate).toLocaleDateString() 
                            : "No Date", // Format date
                        quantity: product.quantity || 0,
                        price: product.price || 0,
                        totalRevenue: product.total || 0,
                    }));
                    setSalesData(transformedData);
                    setTotalSales(totalSales || 0); // Set total sales
                } else {
                    console.error("Invalid data format:", report);
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
    }, [SellerId]);

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `$${text.toFixed(2)}`, // Format as currency
        },
        {
            title: 'Total Revenue',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            render: (text) => `$${text.toFixed(2)}`, // Format as currency
        },
    ];

    return (
        <div>
            <h2>Seller Sales Report</h2>
            <p>Total Sales: <strong>${totalSales.toFixed(2)}</strong></p> {/* Display total sales */}
            <Table
                columns={columns}
                dataSource={salesData} // Pass the sales data to the table
                loading={loading}
                rowKey={(record) => record.key || record.productName}
            />
        </div>
    );
};

export default SellerReport;
