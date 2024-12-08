import React, { useState, useEffect, useRef } from "react";
import { Table, message, DatePicker } from "antd";
import { jwtDecode } from "jwt-decode"; // Corrected import
import axios from "axios";
import moment from "moment";
import { FilterOutlined } from "@ant-design/icons";
import { Column } from '@antv/g2plot';

const { RangePicker } = DatePicker;

const GuideReport = () => {
  const [originalSalesData, setOriginalSalesData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [GuideId, setGuideId] = useState(null);
  const [totalSales, setTotalSales] = useState(0); // State for total sales
  const [filters, setFilters] = useState({
    itineraryNames: [],
    dateRange: null,
    filterMode: 'date',
  });
  const chartRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const GuideIdFromToken = decoded?.userId || decoded?.GuideId || null;
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
            itineraryName: record.name || "Unnamed Itinerary",
            bookingDate: record.Bookingdate
              ? new Date(record.Bookingdate).toLocaleDateString()
              : "No Booking Date",
            originalDate: moment(record.Bookingdate), // Parse as moment object
            price: record.price || 0,
            language: record.language || "No Language Specified",
            accessibility: record.accessibility || "Not specified",
          }));
          setOriginalSalesData(transformedData);
          setSalesData(transformedData);
          setTotalSales(totalSales || 0); // Set total sales
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
  }, [GuideId]);

  const applyFilters = (currentData, currentFilters) => {
    let filteredData = [...currentData];
  
    // Apply itinerary name filters
    if (currentFilters.itineraryNames && currentFilters.itineraryNames.length > 0) {
      filteredData = filteredData.filter((item) =>
        currentFilters.itineraryNames.some((name) =>
          item.itineraryName.toLowerCase().includes(name.toLowerCase())
        )
      );
    }
  
    // Apply date range filters
    if (currentFilters.dateRange && currentFilters.dateRange.length === 2) {
      const [start, end] = currentFilters.dateRange;
      const startDate = moment(start, "MM-DD-YYYY").startOf("day");
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

  const uniqueItineraryNames = [...new Set(originalSalesData.map((item) => item.itineraryName))];

  const columns = [
    {
      title: 'Itinerary Name',
      dataIndex: 'itineraryName',
      key: 'itineraryName',
      align: 'center',
      filters: uniqueItineraryNames.map((name) => ({ text: name, value: name })),
      filterSearch: true,
      filterMultiple: true,
      onFilter: (value, record) => record.itineraryName.includes(value),
    },
    {
      title: 'Itinerary Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      align: 'center',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <RangePicker
            onChange={(dates) => {
              setSelectedKeys(dates ? dates : []);
              confirm();
              handleDateRangeChange(dates, 'date');
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
      <FilterOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (text) => `$${text.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price, 
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      align: 'center',
    },
    {
      title: 'Accessibility',
      dataIndex: 'accessibility',
      key: 'accessibility',
      align: 'center',
    },
  ];

  useEffect(() => {
    if (!salesData?.length || !chartRef.current) return;

    // Aggregate data by itinerary
    const chartData = salesData.reduce((acc, curr) => {
        const existing = acc.find(item => item.itinerary === curr.itineraryName);
        if (existing) {
            existing.sales += curr.price;
        } else {
            acc.push({
                itinerary: curr.itineraryName,
                sales: curr.price,
            });
        }
        return acc;
    }, []);

    // Initialize chart
    const columnChart = new Column(chartRef.current, {
        data: chartData,
        xField: 'itinerary',
        yField: 'sales',
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
      <h2>Guide Sales Report</h2>
      <p>Total Sales: <strong>${totalSales.toFixed(2)}</strong></p>
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
                  rowKey={(record) => record.key || record.itineraryName}
                  onChange={(pagination, filters, sorter) => {
                      const itineraryNames = filters.itineraryName || [];
                      const dateRange = filters.dateRange || null;

                      const newFilters = {
                          itineraryNames: itineraryNames.length > 0 ? itineraryNames : filters.itineraryNames || [],
                          dateRange: dateRange ? dateRange : filters.dateRange || null,
                          filterMode: filters.filterMode || "date",
                      };

                      setFilters((prev) => ({
                          ...prev,
                          itineraryNames: newFilters.itineraryNames,
                          dateRange: newFilters.dateRange,
                      }));

                      const filteredData = applyFilters(originalSalesData, newFilters);
                      setSalesData(filteredData);
                      const newTotalSales = filteredData.reduce((sum, item) => sum + item.price, 0);
                      setTotalSales(newTotalSales);
                  }}
              />
          </div>
          {salesData.length > 0 && (
              <div style={{ flex: 1, minHeight: '400px' }}>
                  <h3 style={{ fontSize: '16px' }}>Itinerary Sales Chart</h3>
                  <div ref={chartRef} />
              </div>
          )}
      </div>
  </div>
);
};

export default GuideReport;