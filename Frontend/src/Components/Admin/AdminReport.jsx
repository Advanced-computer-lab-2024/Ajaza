import React, { useState, useEffect } from 'react';
import { Table, Tabs, message } from 'antd';
import {jwtDecode} from "jwt-decode";
import axios from 'axios';

const { TabPane } = Tabs;

const AdminReport = () => {
  const [data, setData] = useState({ product: [], activity: [], itinerary: [] });
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [totals, setTotals] = useState({
    totalSales: 0,
    productSales: 0,
    activityBookingsCommission: 0,
    itineraryBookingsCommission: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const adminIdFromToken = decoded?.userId || decoded?.adminId || null;
        setAdminId(adminIdFromToken);
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
    if (!adminId) return;

    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/admin/viewSalesReport/${adminId}`);
        const { report, totalSales, productSales, activityBookingsCommission, itineraryBookingsCommission } = response.data;

        if (Array.isArray(report)) {
          const productData = [];
          const activityData = [];
          const itineraryData = [];

          report.forEach((item, index) => {
            if (item.type === 'Product') {
              productData.push({
                key: index,
                productName: item.productName || "Unnamed Product",
                orderDate: item.orderDate
                  ? new Date(item.orderDate).toLocaleDateString()
                  : "No Date",
                quantity: item.quantity || 0,
                price: item.price || 0,
                total: item.total || 0,
              });
            } else if (item.type === 'Activity') {
              activityData.push({
                key: index,
                activityName: item.activityName || "Unnamed Activity",
                activityDate: item.activityDate
                  ? new Date(item.activityDate).toLocaleDateString()
                  : "No Date",
                price: item.price || 0,
                commission: item.commission || 0,
              });
            } else if (item.type === 'Itinerary') {
              itineraryData.push({
                key: index,
                itineraryName: item.itineraryName || "Unnamed Itinerary",
                bookingDate: item.bookingDate
                  ? new Date(item.bookingDate).toLocaleDateString()
                  : "No Date",
                price: item.price || 0,
                commission: item.commission || 0,
              });
            }
          });

          setData({ product: productData, activity: activityData, itinerary: itineraryData });
          setTotals({ totalSales, productSales, activityBookingsCommission, itineraryBookingsCommission });
        } else {
          console.error("Invalid data format:", report);
          setData({ product: [], activity: [], itinerary: [] });
          setTotals({ totalSales: 0, productSales: 0, activityBookingsCommission: 0, itineraryBookingsCommission: 0 });
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
        message.error("Failed to load sales report.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [adminId]);

  const productColumns = [
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text.toFixed(2)}` },
    { title: 'Total Revenue', dataIndex: 'total', key: 'total', render: (text) => `$${text.toFixed(2)}` },
  ];

  const activityColumns = [
    { title: 'Activity Name', dataIndex: 'activityName', key: 'activityName' },
    { title: 'Activity Date', dataIndex: 'activityDate', key: 'activityDate' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text.toFixed(2)}` },
    { title: 'Commission', dataIndex: 'commission', key: 'commission', render: (text) => `$${text.toFixed(2)}` },
  ];

  const itineraryColumns = [
    { title: 'Itinerary Name', dataIndex: 'itineraryName', key: 'itineraryName' },
    { title: 'Booking Date', dataIndex: 'bookingDate', key: 'bookingDate' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text.toFixed(2)}` },
    { title: 'Commission', dataIndex: 'commission', key: 'commission', render: (text) => `$${text.toFixed(2)}` },
  ];

  return (
    <div>
      <h2>Admin Sales Report</h2>
      <Tabs defaultActiveKey="product" centered>
        <TabPane tab="Products" key="product">
          <p><strong>Product Sales:</strong> ${totals.productSales.toFixed(2)}</p>
          <p><strong>Total Sales:</strong> ${totals.totalSales.toFixed(2)}</p>
          <Table
            columns={productColumns}
            dataSource={data.product}
            loading={loading}
            rowKey={(record) => record.key || record.productName}
          />
        </TabPane>
        <TabPane tab="Activities" key="activity">
          <p><strong>Activity Commission:</strong> ${totals.activityBookingsCommission.toFixed(2)}</p>
          <p><strong>Total Sales:</strong> ${totals.totalSales.toFixed(2)}</p>
          <Table
            columns={activityColumns}
            dataSource={data.activity}
            loading={loading}
            rowKey={(record) => record.key || record.activityName}
          />
        </TabPane>
        <TabPane tab="Itineraries" key="itinerary">
          <p><strong>Itinerary Commission:</strong> ${totals.itineraryBookingsCommission.toFixed(2)}</p>
          <p><strong>Total Sales:</strong> ${totals.totalSales.toFixed(2)}</p>
          <Table
            columns={itineraryColumns}
            dataSource={data.itinerary}
            loading={loading}
            rowKey={(record) => record.key || record.itineraryName}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminReport;
