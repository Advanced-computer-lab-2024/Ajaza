import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import {jwtDecode }from "jwt-decode"; // Corrected import
import axios from "axios";

const GuideReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [GuideId, setGuideId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with your token source
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the JWT token
        const GuideIdFromToken = decoded?.userId || decoded?.GuideId || null; // Adjust key based on your token structure
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
    if (!GuideId) return; // Do nothing if GuideId is not set

    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/guide/viewSalesReport/${GuideId}`);
        const { itineraryDetails } = response.data;

        if (Array.isArray(itineraryDetails)) {
          const transformedData = itineraryDetails.map((itinerary, index) => ({
            key: index, // Unique key for table rows
            itineraryName: itinerary.name || "Unnamed Itinerary", // Itinerary name
            bookings: itinerary.bookings || 0, // Number of bookings
            pricePerPerson: itinerary.pricePerPerson || 0, // Price per person
            guideName: itinerary.guideId?.name || "Unknown", // Fetch guide name
            dateCreated: itinerary.dateCreated || "No date available", // Creation date
            totalRevenue: (itinerary.bookings || 0) * (itinerary.pricePerPerson || 0), // Calculate revenue
            category: itinerary.category.join(", ") || "Uncategorized", // Convert category array to string
          }));
          setSalesData(transformedData); // Set transformed data
        } else {
          console.error("Invalid data format:", itineraryDetails);
          setSalesData([]); // Clear sales data if invalid format
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
      title: "Bookings",
      dataIndex: "bookings",
      key: "bookings",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
    },
    {
      title: "Price per Person",
      dataIndex: "pricePerPerson",
      key: "pricePerPerson",
      render: (text) => `$${text.toFixed(2)}`, // Format as currency
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (text) => `$${text.toFixed(2)}`, // Format as currency
    },
  ];

  return (
    <div>
      <h2>Guide Sales Report</h2>
      <Table
        columns={columns}
        dataSource={salesData} // Pass the sales data to the table
        loading={loading}
        rowKey={(record) => record.key || record.itineraryName}
      />
    </div>
  );
};

export default GuideReport;
