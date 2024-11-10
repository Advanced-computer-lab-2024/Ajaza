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
  Modal,
  Image,
  Spin
} from "antd";
import { jwtDecode } from "jwt-decode";
import CustomButton from "../Common/CustomButton";
import axios from "axios";
import { apiUrl } from "../Common/Constants";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import SelectCurrency from "./SelectCurrency";
import { useCurrency } from "./CurrencyContext";

const { Option } = Select;
const { Title } = Typography;

const cityOptions = [
    { label: "Paris", value: "CDG" },
    { label: "New York", value: "JFK" },
    { label: "London", value: "LON" },
    { label: "Dubai", value: "DXB" },
    { label: "Los Angeles", value: "LAX" },
];



const Transportations = () => {
  const [firstDate, setFirstDate] = useState(null);
  const [transportations, setTransportations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); // Store decoded token or API data
  const [userDetails, setUserDetails] = useState(null);
  const [formVisible, setFormVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedTransportation, setSelectedTransportation] = useState(null);
  const [touristId, setTouristId] = useState(localStorage.getItem("touristId"));
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  }; 
   const [currencyRates] = useState({
    EGP: 48.58,
    USD: 1,
    EUR: 0.91,
  });
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation


  const convertPrice = (price, hotelCurrency) => {
    const conversionRate = currencyRates[currency] / currencyRates[hotelCurrency];
    return (price * conversionRate).toFixed(2);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserDetails(decodedToken.userDetails);
      console.log("Decoded Token:", decodedToken.userDetails._id);
      setTouristId(decodedToken.userDetails._id);
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
      const response = await axiosInstance.post(`${apiUrl}tourist/transportation/searchTransportation`, {
        IATA: values.iata,
        endAddressLine: values.address,
        startDateTime: values.firstDate.format("YYYY-MM-DDTHH:mm:ss")
      });
      console.log("API Response:", response.data);
      setTransportations(response.data);
      if (response.data.length === 0) {
        message.warning("No transportation found for the selected criteria.");
      }
    } catch (error) {
      console.error("Error fetching transportation data:", error);
      message.error("Failed to fetch transportation data. Please try again. Make sure you entered a valid address line.");
    } finally {
        //message.success("Successfully fetched transportation data.");
        if(response) {
            setTransportations(response.data);
        }
        console.log(transportations);
        setLoading(false);
    }
  };

  const handleFormFail = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
  };


  const handleViewDetails = (transportation) => {
    setSelectedTransportation(transportation);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleBooking = async () => {
    if (!touristId) {
      message.error("You must be logged in to book a transportation.");
      return;
    }



    const bookingData = {
        transferType: selectedTransportation.transferType,
        start_dateTime: selectedTransportation.start_dateTime,
        start_locationCode: selectedTransportation.start_locationCode, 
        end_dateTime: selectedTransportation.end_dateTime, 
        end_address_line: selectedTransportation.end_address_line, 
        end_address_cityName: selectedTransportation.end_address_cityName, 
        vehicle_code: selectedTransportation.vehicle_code, 
        vehicle_description: selectedTransportation.vehicle_description, 
        vehicle_seats: selectedTransportation.vehicle_seats, 
        quotation_monetaryAmount: selectedTransportation.quotation_monetaryAmount, 
        quotation_currencyCode: selectedTransportation.quotation_currencyCode, 
        distance_value: selectedTransportation.distance_value, 
        distance_unit: selectedTransportation.distance_unit
    };

    try {
      const response = await axios.post(`${apiUrl}tourist/transportation/bookTransportation/${touristId}`, bookingData);
      if (response.status === 200) {
        message.success("Transportation booked successfully!");
        handleModalClose(); // Close the modal after booking
      }
    } catch (error) {
      console.error("Error booking transportation:", error);
      message.error(error.response?.data?.error || "Booking failed.");
    }
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
          <h1>Search for Transportation</h1>
          <Space direction="vertical" align="center" style={{ width: "100%" }}>
            <Form
              name="basic"
              layout="vertical"
              onFinish={handleFormSubmit}
              onFinishFailed={handleFormFail}
              style={{ width: "100%" }}
            >
              <Form.Item
                name="iata"
                label="Select City Airport"
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
                label="Select Date Time"
                rules={[{ required: true, message: 'Please select a start date!' }]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:MM"
                  showTime
                  disabledDate={disablePastDates}
                  placeholder="Select a start date"
                  onChange={(date) => setFirstDate(date)}
                />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address!' }]}
              >
                <Input placeholder="Enter an Address" style={{ width: '100%' }} />
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
      {loading ? (
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Spin tip="Searching..." />
      </div>
    ) : (
      transportations?.length > 0 && !formVisible && ( // Render list if hotels are available and form is not visible
        <Card style={{ width: "100%", maxWidth: 600, margin: "20px auto", padding: "20px" }}>
          <Title level={4}>Available Transportations</Title>
          <SelectCurrency
              currency={currency}
              onCurrencyChange={handleCurrencyChange}
              style={{ float: "right" , left:-700 , top: -70}}
            />
          <List
            itemLayout="vertical"
            dataSource={transportations}
            renderItem={transportation => (
              <List.Item key={transportation.vehicle_code}>
                <List.Item.Meta
                  title={transportation.vehicle_description}
                  description={`City: ${transportation.end_address_cityName} | Price: ${convertPrice(transportation.quotation_monetaryAmount, transportation.quotation_currencyCode)} ${currency}`}
                />
                <div>
                   Transfer Type: {transportation.transferType} <br />
                   Start Date Time: {new Date(transportation.start_dateTime).toISOString().slice(0, 16).replace("T", " ")} <br />
                   Airport: {transportation.start_locationCode} <br />
                   End Date Time: {new Date(transportation.end_dateTime).toISOString().slice(0, 16).replace("T", " ")} <br />
                   Distance: {transportation.distance_value + transportation.distance_unit} <br />
                   Vehicle Seats: {transportation.vehicle_seats} <br />
                   End Address: {transportation.end_address_line} <br />
                </div>
                <Button type="link" onClick={() => handleViewDetails(transportation)}>
                  View Details
                </Button>
              </List.Item>
            )}
          />
        </Card>
      ))}
<Modal
        title={selectedTransportation ? selectedTransportation.name : "Transportation Details"}
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedTransportation && (
          <>
            <p><strong>Vehicle Description:</strong> {selectedTransportation.vehicle_description}</p>
            <p><strong>City:</strong> {selectedTransportation.end_address_cityName}</p>
            <p><strong>Price:</strong> {convertPrice(selectedTransportation.quotation_monetaryAmount, selectedTransportation.quotation_currencyCode)} {currency}</p>
            <p><strong>Transfer Type:</strong> {selectedTransportation.transferType}</p>
            <p><strong>Start Date Time:</strong> {new Date(selectedTransportation.start_dateTime).toISOString().slice(0, 16).replace("T", " ")}</p>
            <p><strong>Start Airport:</strong> {selectedTransportation.start_locationCode}</p>
            <p><strong>End Date Time:</strong> {new Date(selectedTransportation.end_dateTime).toISOString().slice(0, 16).replace("T", " ")}</p>
            <p><strong>Distance:</strong> {selectedTransportation.distance_value + " " + selectedTransportation.distance_unit}</p>
            <p><strong>Vehicle Seats:</strong> {selectedTransportation.vehicle_seats}</p>
            <p><strong>End Address:</strong> {selectedTransportation.end_address_line}</p>
          </>
        )}
        
        <CustomButton value="Book" key="book" type="primary" onClick={handleBooking}/>
      </Modal>
    </>
  );
};

export default Transportations;
