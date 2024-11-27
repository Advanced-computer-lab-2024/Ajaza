import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import {jwtDecode} from "jwt-decode"; // Corrected import
import axios from "axios";

const GuideReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [GuideId, setGuideId] = useState(null);
  const [totalSales, setTotalSales] = useState(0); // State for total sales

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const GuideIdFromToken = decoded?.userId || decoded?.GuideId || null;
        console.log("Decoded GuideId:", GuideIdFromToken);
        setGuideId(GuideIdFromToken);
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
    if (!GuideId) return;

    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/guide/viewSalesReport/${GuideId}`);
        const { totalSales, report } = response.data;

        if (Array.isArray(report)) {
          const transformedData = report.map((record, index) => ({
            key: index, // Unique key for table rows
            itineraryName: record.name || "Unnamed Itinerary", // Itinerary name
            bookingDate: record.Bookingdate ? new Date(record.Bookingdate).toLocaleDateString() : "No Booking Date", // Format booking date
            price: record.price || 0, // Price
            language: record.language || "No Language Specified", // Language used
            accessibility: record.accessibility || "Not specified", // Accessibility
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
  }, [GuideId]);

  const columns = [
    {
      title: "Itinerary Name",
      dataIndex: "itineraryName",
      key: "itineraryName",
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text.toFixed(2)}`, // Format as currency
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Accessibility",
      dataIndex: "accessibility",
      key: "accessibility",
    },
  ];

  return (
    <div>
      <h2>Guide Sales Report</h2>
      <p>Total Sales: <strong>${totalSales.toFixed(2)}</strong></p> {/* Display total sales */}
      <Table
        columns={columns}
        dataSource={salesData}
        loading={loading}
        rowKey={(record) => record.key || record.itineraryName}
      />
    </div>
  );
};

export default GuideReport;
