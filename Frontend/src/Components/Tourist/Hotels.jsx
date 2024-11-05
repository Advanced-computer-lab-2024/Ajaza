import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Space,
  Input,
  Button,
  Form,
  message,
  List,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { apiUrl } from "../Common/Constants";
import moment from 'moment';
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

const cityOptions = [
  { label: 'Cairo', value: '-290692' },
  { label: 'Paris', value: '-1456928' },
  { label: 'London', value: '-2601889' },
  { label: 'Alexandria', value: '-290263' },
  { label: 'Sharm', value: '-302053' },
  { label: 'Hurghada', value: '-290029' },
  { label: 'Aswan', value: '-291535' },
  { label: 'Rome', value: '-126693' },
  { label: 'Barcelona', value: '-372490' },
  { label: 'Madrid', value: '-390625' },
  { label: 'Amsterdam', value: '-2140479' },
  { label: 'Berlin', value: '20097081' },
  { label: 'Prague', value: '-553173' }
];

const Hotels = () => {
  const [firstDate, setFirstDate] = useState(null);
  const [hotels, setHotels] = useState([]); // State for hotel data
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); // Store decoded token or API data
  const [userDetails, setUserDetails] = useState(null);
  const [formVisible, setFormVisible] = useState(true);
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserDetails(decodedToken.userDetails);
    }
  }, []);

  const disablePastDates = (current) => {
    return current && current < moment().endOf('day');
  };

  const disableDatesAfterFirstDate = (current) => {
    return current && current <= moment(firstDate).endOf('day');
  };

  const axiosInstance = axios.create({
    timeout: 10000, // Set timeout for axios requests
  });

  const handleFormSubmit = async (values) => {
    setLoading(true);
    setFormVisible(false);
    try {
      console.log("Form Values:", values);
      const response = await axiosInstance.post(`${apiUrl}tourist/hotels/searchHotels`, {
        dest_id: values.city,
        checkInDate: values.firstDate.format("YYYY-MM-DD"),
        checkOutDate: values.secondDate.format("YYYY-MM-DD"),
        count: values.numberInput
      });

      setHotels(response.data);
      if (response.data.length === 0) {
        message.warning("No hotels found for the selected criteria.");
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      message.error("Failed to fetch hotel data. Please try again.");
    } finally {
        message.success("Successfully fetched hotel data.");
        if(response) {
            setHotels(response.data);
        }
        console.log("API Response:", hotels);
        setLoading(false);
    }
  };

  const handleFormFail = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
  };

  return (
    <>
      {formVisible && ( // Render form conditionally based on formVisible state
        <Card
          style={{
            width: "100%",
            maxWidth: 600,
            margin: "50px auto",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1>Search for Hotels</h1>
          <Space direction="vertical" align="center" style={{ width: "100%" }}>
            <Form
              name="basic"
              layout="vertical"
              onFinish={handleFormSubmit}
              onFinishFailed={handleFormFail}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="city"
                label="Select City"
                rules={[{ required: true, message: 'Please select a city!' }]}
              >
                <Select placeholder="Choose a city">
                  {cityOptions.map(city => (
                    <Option key={city.value} value={city.value}>
                      {city.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="firstDate"
                label="Select Check In Date"
                rules={[{ required: true, message: 'Please select a start date!' }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  disabledDate={disablePastDates}
                  placeholder="Select a start date"
                  onChange={(date) => setFirstDate(date)}
                />
              </Form.Item>

              <Form.Item
                name="secondDate"
                label="Select Check Out Date"
                rules={[{ required: true, message: 'Please select an end date!' }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  disabledDate={disableDatesAfterFirstDate}
                  placeholder="Select an end date"
                />
              </Form.Item>
              <Form.Item
                name="numberInput"
                label="Number of visitors"
                rules={[{ required: true, message: 'Please enter a number!' }]}
              >
                <InputNumber min={1} placeholder="Enter a number" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Search
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      )}
      {hotels.length > 0 && !formVisible && ( // Render list if hotels are available and form is not visible
        <Card style={{ width: "100%", maxWidth: 600, margin: "20px auto", padding: "20px" }}>
          <Title level={4}>Available Hotels</Title>
          <List
            itemLayout="vertical"
            dataSource={hotels}
            renderItem={hotel => (
              <List.Item key={hotel.name}>
                <List.Item.Meta
                  title={hotel.name}
                  description={`City: ${hotel.city} | Price: ${hotel.price} ${hotel.currency}`}
                />
                <div>
                  Check-in: {hotel.checkin} <br />
                  Check-out: {hotel.checkout} <br />
                  Score: {hotel.score}
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}
    </>
  );
};

export default Hotels;
