import React, { useState, useEffect, useRef } from 'react';
import { Table, message, DatePicker } from 'antd';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import moment from 'moment';
import { FilterOutlined } from '@ant-design/icons';
import { Column } from '@antv/g2plot';

const { RangePicker } = DatePicker;

const SellerReport = () => {
    const [originalSalesData, setOriginalSalesData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [SellerId, setSellerId] = useState(null);
    const [totalSales, setTotalSales] = useState(0);
    const [filters, setFilters] = useState({
        productNames: [],
        dateRange: null,
        filterMode: 'date',
    });
    const chartRef = useRef(null);

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
                        key: index,
                        productName: product.name || "Unnamed Product",
                        orderDate: product.orderDate 
                            ? new Date(product.orderDate).toLocaleDateString() 
                            : "No Date",
                        originalDate: moment(product.orderDate),
                        quantity: product.quantity || 0,
                        price: product.price || 0,
                        totalRevenue: product.total || 0,
                    }));
                    setOriginalSalesData(transformedData);
                    setSalesData(transformedData);
                    setTotalSales(totalSales || 0);
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
    }, [SellerId]);

    const applyFilters = (currentData, currentFilters) => {
        let filteredData = [...currentData];

        if (currentFilters.productNames && currentFilters.productNames.length > 0) {
            filteredData = filteredData.filter((item) =>
                currentFilters.productNames.some((name) =>
                    item.productName.toLowerCase().includes(name.toLowerCase())
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

        return filteredData;
    };

    const handleDateRangeChange = (dates, filterMode = 'date') => {
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

        const filteredData = applyFilters(originalSalesData, {
            ...newFilters,
            dateRange: adjustedDates 
                ? adjustedDates.map(date => date.format("MM-DD-YYYY"))
                : null
        });

        setSalesData(filteredData);

        const newTotalSales = filteredData.reduce((sum, item) => sum + item.totalRevenue, 0);
        setTotalSales(newTotalSales);
    };

    const resetFilters = () => {
        setFilters({
            productNames: [],
            dateRange: null,
            filterMode: 'date',
        });
        setSalesData(originalSalesData);
        setTotalSales(originalSalesData.reduce((sum, item) => sum + item.totalRevenue, 0));
    };

    const uniqueProductNames = [...new Set(originalSalesData.map(item => item.productName))];
    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
            align: 'center',
            filters: uniqueProductNames.map(name => ({ text: name, value: name })),
            filterSearch: true,
            filterMultiple: true,
            onFilter: (value, record) => record.productName.includes(value),
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            align: 'center',
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
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
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
            title: 'Total Revenue',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            align: 'center',
            render: (text) => `$${text.toFixed(2)}`,
        },
    ];

    useEffect(() => {
        if (!salesData?.length || !chartRef.current) return;
    
        // Aggregate data by activity
        const chartData = salesData.reduce((acc, curr) => {
            const existing = acc.find(item => item.product === curr.productName);
            if (existing) {
                existing.sales += curr.price;
            } else {
                acc.push({
                    product: curr.productName,
                    sales: curr.price,
                });
            }
            return acc;
        }, []);
    
        // Initialize chart
        const columnChart = new Column(chartRef.current, {
            data: chartData,
            xField: 'product',
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
            <h2>Seller Sales Report</h2>
            <p>Total Sales: <strong>${totalSales.toFixed(2)}</strong></p>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
            <Table
                columns={columns}
                dataSource={salesData}
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

                    const filteredData = applyFilters(originalSalesData, newFilters);

                    setSalesData(filteredData);
                    const newTotalSales = filteredData.reduce((sum, item) => sum + item.totalRevenue, 0);
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

export default SellerReport;