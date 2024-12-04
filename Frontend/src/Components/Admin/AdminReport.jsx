import React, { useState, useEffect } from 'react';
import { Table, Tabs, message, DatePicker } from 'antd';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import moment from 'moment';
import { FilterOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const AdminReport = () => {
  const [data, setData] = useState({ product: [], activity: [], itinerary: [] });
  const [originalData, setOriginalData] = useState({ product: [], activity: [], itinerary: [] });
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [totals, setTotals] = useState({
    totalSales: 0,
    productSales: 0,
    activityBookingsCommission: 0,
    itineraryBookingsCommission: 0,
  });
  const [filters, setFilters] = useState({
    productNames: [],
    activityNames: [],
    itineraryNames: [],
    dateRange: null,
    filterMode: 'date',
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
                originalDate: moment(item.orderDate),
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
                originalDate: moment(item.activityDate),
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
                originalDate: moment(item.bookingDate),
                price: item.price || 0,
                commission: item.commission || 0,
              });
            }
          });
  
          setData({ product: productData, activity: activityData, itinerary: itineraryData });
          setOriginalData({ product: productData, activity: activityData, itinerary: itineraryData });
          setTotals({ totalSales, productSales, activityBookingsCommission, itineraryBookingsCommission });
        } else {
          console.error("Invalid data format:", report);
          setData({ product: [], activity: [], itinerary: [] });
          setOriginalData({ product: [], activity: [], itinerary: [] });
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

  const applyFilters = (currentData, currentFilters, type) => {
    let filteredData = [...currentData];

    if (type === 'product' && currentFilters.productNames && currentFilters.productNames.length > 0) {
      filteredData = filteredData.filter((item) =>
        currentFilters.productNames.some((name) =>
          item.productName.toLowerCase().includes(name.toLowerCase())
        )
      );
    }

    if (type === 'activity' && currentFilters.activityNames && currentFilters.activityNames.length > 0) {
      filteredData = filteredData.filter((item) =>
        currentFilters.activityNames.some((name) =>
          item.activityName.toLowerCase().includes(name.toLowerCase())
        )
      );
    }

    if (type === 'itinerary' && currentFilters.itineraryNames && currentFilters.itineraryNames.length > 0) {
      filteredData = filteredData.filter((item) =>
        currentFilters.itineraryNames.some((name) =>
          item.itineraryName.toLowerCase().includes(name.toLowerCase())
        )
      );
    }

    if (currentFilters.dateRange && currentFilters.dateRange.length === 2) {
      const [start, end] = currentFilters.dateRange;
      const startDate = moment(start, "MM-DD-YYYY").startOf("day");
      const endDate = moment(end, "MM-DD-YYYY").endOf("day");

      filteredData = filteredData.filter((item) => {
        const itemDate = moment(item.originalDate);
        return itemDate.isBetween(startDate, endDate, undefined, "[]");
      });
    }
    if (type === 'activity') {
      const newActivityCommission = filteredData.reduce((sum, item) => sum + item.commission, 0);
      setTotals((prevTotals) => ({
        ...prevTotals,
        activityBookingsCommission: newActivityCommission,
      }));
    }
  
    if (type === 'itinerary') {
      const newItineraryCommission = filteredData.reduce((sum, item) => sum + item.commission, 0);
      setTotals((prevTotals) => ({
        ...prevTotals,
        itineraryBookingsCommission: newItineraryCommission,
      }));
    }

    return filteredData;
  };

  const handleDateRangeChange = (dates, filterMode = 'date', type) => {
    let adjustedDates = dates;

    if (filterMode === 'month' && dates && dates.length === 2) {
      adjustedDates = [
        dates[0].startOf('month'),
        dates[1].endOf('month')
      ];

      if (dates[0].isSame(dates[1], 'month')) {
        adjustedDates = [
          dates[0].startOf('month'),
          dates[0].endOf('month')
        ];
      }
    }

    const newFilters = {
      ...filters,
      dateRange: adjustedDates,
      filterMode: filterMode,
    };

    setFilters(newFilters);

    const filteredData = applyFilters(originalData[type], {
      ...newFilters,
      dateRange: adjustedDates 
        ? adjustedDates.map(date => date.format("MM-DD-YYYY"))
        : null
    }, type);

    setData((prevData) => ({
      ...prevData,
      [type]: filteredData,
    }));

    if (type === 'product') {
      const newProductSales = filteredData.reduce((sum, item) => sum + item.total, 0);
      setTotals((prevTotals) => ({
        ...prevTotals,
        productSales: newProductSales,
      }));
    }
    if (type === 'activity') {
      const newActivityCommission = filteredData.reduce((sum, item) => sum + item.commission, 0);
      setTotals((prevTotals) => ({
        ...prevTotals,
        activityBookingsCommission: newActivityCommission,
      }));
    }
    if (type === 'itinerary') {
      const newItineraryCommission = filteredData.reduce((sum, item) => sum + item.commission, 0);
      setTotals((prevTotals) => ({
        ...prevTotals,
        itineraryBookingsCommission: newItineraryCommission,
      }));
    } 
  };

  const resetFilters = (type) => {
    setFilters({
      productNames: [],
      activityNames: [],
      itineraryNames: [],
      dateRange: null,
      filterMode: 'date',
    });
    setData((prevData) => ({
      ...prevData,
      [type]: originalData[type],
    }));
    if (type === 'product') {
      const newProductSales = originalData.product.reduce((sum, item) => sum + item.total, 0);
      setTotals((prevTotals) => ({
        ...prevTotals,
        productSales: newProductSales,
      }));
    } else if (type === 'activity') {
      const newActivityCommission = originalData.activity.reduce((sum, item) => sum + item.commission, 0);
      setTotals((prevTotals) => ({
        ...prevTotals,
        activityBookingsCommission: newActivityCommission,
      }));
    } else if (type === 'itinerary') {
      const newItineraryCommission = originalData.itinerary.reduce((sum, item) => sum + item.commission, 0);
      setTotals((prevTotals) => ({
        ...prevTotals,
        itineraryBookingsCommission: newItineraryCommission,
      }));
    }
  };

  const uniqueProductNames = [...new Set(originalData.product.map(item => item.productName))];
  const uniqueActivityNames = [...new Set(originalData.activity.map(item => item.activityName))];
  const uniqueItineraryNames = [...new Set(originalData.itinerary.map(item => item.itineraryName))];

  const productColumns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      filters: uniqueProductNames.map(name => ({ text: name, value: name })),
      filterSearch: true,
      filterMultiple: true,
      onFilter: (value, record) => record.productName.includes(value),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <RangePicker
            onChange={(dates) => {
              setSelectedKeys(dates ? dates : []);
              confirm();
              handleDateRangeChange(dates, 'date', 'product');
            }}
            value={filters.filterMode === 'date' ? filters.dateRange : null}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <RangePicker
            picker="month"
            onChange={(dates) => {
              setSelectedKeys(dates ? dates : []);
              confirm();
              handleDateRangeChange(dates, 'month', 'product');
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
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text.toFixed(2)}`, sorter: (a, b) => a.price - b.price },
  ];

  const activityColumns = [
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
              handleDateRangeChange(dates, 'date', 'activity');
            }}
            value={filters.filterMode === 'date' ? filters.dateRange : null}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <RangePicker
            picker="month"
            onChange={(dates) => {
              setSelectedKeys(dates ? dates : []);
              confirm();
              handleDateRangeChange(dates, 'month', 'activity');
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
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text.toFixed(2)}`, sorter: (a, b) => a.price - b.price },
    { title: 'Commission', dataIndex: 'commission', key: 'commission', render: (text) => `$${text.toFixed(2)}` },
  ];

  const itineraryColumns = [
    {
      title: 'Itinerary Name',
      dataIndex: 'itineraryName',
      key: 'itineraryName',
      filters: uniqueItineraryNames.map(name => ({ text: name, value: name })),
      filterSearch: true,
      filterMultiple: true,
      onFilter: (value, record) => record.itineraryName.includes(value),
    },
    {
      title: 'Itinerary Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <RangePicker
            onChange={(dates) => {
              setSelectedKeys(dates ? dates : []);
              confirm();
              handleDateRangeChange(dates, 'date', 'itinerary');
            }}
            value={filters.filterMode === 'date' ? filters.dateRange : null}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <RangePicker
            picker="month"
            onChange={(dates) => {
              setSelectedKeys(dates ? dates : []);
              confirm();
              handleDateRangeChange(dates, 'month', 'itinerary');
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
    { title: 'Price', dataIndex: 'price', key: 'price', render: (text) => `$${text.toFixed(2)}`, sorter: (a, b) => a.price - b.price },
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
            onChange={(pagination, filters, sorter) => {
              const productNames = filters.productName || [];
              const dateRange = filters.dateRange || null;

              const newFilters = {
                productNames: productNames.length > 0 ? productNames : filters.productNames || [],
                dateRange: dateRange ? dateRange : filters.dateRange || null,
                filterMode: filters.filterMode || 'date',
              };

              setFilters((prev) => ({
                ...prev,
                productNames: newFilters.productNames,
                dateRange: newFilters.dateRange,
              }));

              const filteredData = applyFilters(originalData.product, newFilters, 'product');

              setData((prevData) => ({
                ...prevData,
                product: filteredData,
              }));
              const newProductSales = filteredData.reduce((sum, item) => sum + item.total, 0);
              setTotals((prevTotals) => ({
                ...prevTotals,
                productSales: newProductSales,
              }));
            }}
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
            onChange={(pagination, filters, sorter) => {
            const activityNames = filters.activityName || [];
            const dateRange = filters.dateRange || null;

            const newFilters = {
              activityNames: activityNames.length > 0 ? activityNames : filters.activityNames || [],
              dateRange: dateRange ? dateRange : filters.dateRange || null,
              filterMode: filters.filterMode || 'date',
            };

            setFilters((prev) => ({
              ...prev,
              activityNames: newFilters.activityNames,
              dateRange: newFilters.dateRange,
            }));

            const filteredData = applyFilters(originalData.activity, newFilters, 'activity');

            setData((prevData) => ({
              ...prevData,
              activity: filteredData,
            }));
          }}
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
            onChange={(pagination, filters, sorter) => {
            const itineraryNames = filters.itineraryName || [];
            const dateRange = filters.dateRange || null;

            const newFilters = {
              itineraryNames: itineraryNames.length > 0 ? itineraryNames : filters.itineraryNames || [],
              dateRange: dateRange ? dateRange : filters.dateRange || null,
              filterMode: filters.filterMode || 'date',
            };

            setFilters((prev) => ({
              ...prev,
              itineraryNames: newFilters.itineraryNames,
              dateRange: newFilters.dateRange,
            }));

            const filteredData = applyFilters(originalData.itinerary, newFilters, 'itinerary');

            setData((prevData) => ({
              ...prevData,
              itinerary: filteredData,
            }));
          }}
          />
        </TabPane>

      </Tabs>
    </div>
  );
};

export default AdminReport;