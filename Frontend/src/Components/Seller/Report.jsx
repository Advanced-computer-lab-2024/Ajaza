// import React, { useState, useEffect } from 'react';
// import { Table, message } from 'antd';
// import { jwtDecode } from "jwt-decode";
// import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
// import axios from 'axios';

// const Report = () => {
//     const [salesData, setSalesData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [SellerId, setSellerId] = useState(null);
//     const [filteredData, setFilteredData] = useState([]);
//     const filterFields = {
//         product: {
//             displayName: "Product Name",
//             values: [
//                 { displayName: "Product A", filterCriteria: "Product A" },
//                 { displayName: "Product B", filterCriteria: "Product B" },
//             ],
//             compareFn: (filterCriteria, element) => element.productName === filterCriteria,
//         },
//         date: {
//             displayName: "Date Sold",
//             values: [
//                 { displayName: "Last 7 Days", filterCriteria: 7 },
//                 { displayName: "Last 30 Days", filterCriteria: 30 },
//                 { displayName: "Last 6 Months", filterCriteria: 180 },
//                 { displayName: "Last Year", filterCriteria: 365 },
//             ],
//             compareFn: (filterCriteria, element) => filterByDateRange(filterCriteria, element.saleDate),
//         },
//         month: {
//             displayName: "Month",
//             values: [
//                 { displayName: "January", filterCriteria: 0 },
//                 { displayName: "February", filterCriteria: 1 },
//                 { displayName: "March", filterCriteria: 2 },
//                 { displayName: "April", filterCriteria: 3 },
//                 { displayName: "May", filterCriteria: 4 },
//                 { displayName: "June", filterCriteria: 5 },
//                 { displayName: "July", filterCriteria: 6 },
//                 { displayName: "August", filterCriteria: 7 },
//                 { displayName: "September", filterCriteria: 8 },
//                 { displayName: "October", filterCriteria: 9 },
//                 { displayName: "November", filterCriteria: 10 },
//                 { displayName: "December", filterCriteria: 11 },
//             ],
//             compareFn: (filterCriteria, element) => filterByMonth(filterCriteria, element.saleDate),
//         },
//     };

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         const decoddedToken = jwtDecode(token);
//         setSellerId(decoddedToken.userDetails["_id"]);
//     }, []);

//     useEffect(() => {
//         const fetchSalesData = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(`http://localhost:5000/seller/viewSalesReport/${SellerId}`);
//                 setSalesData(response.data);
//                 setFilteredData(response.data);
//             } catch (error) {
//                 message.error("Failed to load sales report.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchSalesData();
//     }, []);

//     const columns = [
//         {
//             title: 'Product Name',
//             dataIndex: 'productName',
//             key: 'productName',
//         },
//         {
//             title: 'Quantity Sold',
//             dataIndex: 'quantitySold',
//             key: 'quantitySold',
//         },
//         {
//             title: 'Date Sold',
//             dataIndex: 'dateSold',
//             key: 'dateSold',
//         },
//         {
//             title: 'Sale Price',
//             dataIndex: 'salePrice',
//             key: 'salePrice',
//         },
//         {
//             title: 'Total Revenue',
//             dataIndex: 'totalRevenue',
//             key: 'totalRevenue',
//         },
//     ];

//     return (
//         <div>
//             <h2>Sales Report</h2>
//             <Table
//                 dataSource={salesData}
//                 columns={columns}
//                 loading={loading}
//                 rowKey={(record) => record._id}
//             />
//         </div>
//     );
// };

// export default Report;
