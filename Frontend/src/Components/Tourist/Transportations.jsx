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
  Spin,
} from "antd";
import { jwtDecode } from "jwt-decode";
import CustomButton from "../Common/CustomButton";
import axios from "axios";
import { apiUrl, Colors } from "../Common/Constants";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import SelectCurrency from "./SelectCurrency";
import { useCurrency } from "./CurrencyContext";

const { Option } = Select;
const { Title } = Typography;

const cityOptions = [
  { label: "Paris", value: "CDG" },
  { label: "New York", value: "JFK" },
  { label: "London", value: "LHR" },
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
    AED: 3.6725,
    ARS: 1004.0114,
    AUD: 1.5348,
    BDT: 110.5,
    BHD: 0.376,
    BND: 1.3456,
    BRL: 5.8149,
    CAD: 1.3971,
    CHF: 0.8865,
    CLP: 973.6481,
    CNY: 7.2462,
    COP: 4389.3228,
    CZK: 24.2096,
    DKK: 7.1221,
    EGP: 48.58,
    EUR: 0.9549,
    GBP: 0.7943,
    HKD: 7.7825,
    HUF: 392.6272,
    IDR: 15911.807,
    ILS: 3.7184,
    INR: 84.5059,
    JPY: 154.4605,
    KRW: 1399.323,
    KWD: 0.3077,
    LKR: 291.0263,
    MAD: 10.5,
    MXN: 20.4394,
    MYR: 4.4704,
    NOK: 11.0668,
    NZD: 1.7107,
    OMR: 0.385,
    PHP: 58.9091,
    PKR: 279.0076,
    PLN: 4.1476,
    QAR: 3.64,
    RUB: 101.2963,
    SAR: 3.75,
    SEK: 11.063,
    SGD: 1.3456,
    THB: 34.7565,
    TRY: 34.5345,
    TWD: 32.5602,
    UAH: 36.9,
    USD: 1,
    VND: 24000.0,
    ZAR: 18.0887,
  });
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  const convertPrice = (price, hotelCurrency) => {
    const conversionRate =
      currencyRates[currency] / currencyRates[hotelCurrency];
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
    return current && current < moment().endOf("day");
  };

  const disableDatesAfterFirstDate = (current) => {
    return current && current <= moment(firstDate).endOf("day");
  };

  const axiosInstance = axios.create({
    timeout: 10000, // Set timeout for axios requests
  });

  const handleFormSubmit = async (values) => {
    setLoading(true);
    setFormVisible(false);
    try {
      console.log("Form Values:", values);
      const response = await axiosInstance.post(
        `${apiUrl}tourist/transportation/searchTransportation`,
        {
          IATA: values.iata,
          endAddressLine: values.address,
          startDateTime: values.firstDate.format("YYYY-MM-DDTHH:mm:ss"),
        }
      );
      console.log("API Response:", response.data);
      setTransportations(response.data);
      if (response.data.length === 0) {
        message.warning("No transportation found for the selected criteria.");
      }
    } catch (error) {
      console.error("Error fetching transportation data:", error);
      message.error(
        "Failed to fetch transportation data. Please try again. Make sure you entered a valid address line."
      );
    } finally {
      //message.success("Successfully fetched transportation data.");
      if (response) {
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
      distance_unit: selectedTransportation.distance_unit,
    };

    try {
      const response = await axios.post(
        `${apiUrl}tourist/transportation/bookTransportation/${touristId}`,
        bookingData
      );
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
        <div style={{ display: "flex", height: "80vh" }}>
        <Card
          style={{
            maxWidth: 600,
            margin: "50px auto",
            marginTop: "0px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            width: "60%",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <h1>Search for Transportation</h1><br />
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
                rules={[{ required: true, message: "Please select a city!" }]}
              >
                <Select placeholder="Choose a city"  style={{ width: "300px"}}>
                  {cityOptions.map((city) => (
                    <Option key={city.value} value={city.value}>
                      {city.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="firstDate"
                label="Select Date Time"
                rules={[
                  { required: true, message: "Please select a start date!" },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:MM"
                  showTime
                  style={{ width: "300px"}}
                  disabledDate={disablePastDates}
                  placeholder="Select a start date"
                  onChange={(date) => setFirstDate(date)}
                />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please enter address!" }]}
              >
                <Input
                  placeholder="Enter an Address"
                  style={{ width: "300px" }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ backgroundColor: Colors.primary.default, width: "300px" }}
                >
                  Search
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
         <div
         style={{
           width: "40%",
           background: "url(/taxi.jpg) no-repeat center center",
           backgroundSize: "cover",
           height: "80vh",
           display: "flex",
           justifyContent: "center",
           alignItems: "center",
           color: "white", // To make the text stand out
           padding: "20px",
           borderRadius: "15px",
           position: "relative",
         }}
       >
         <div
         style={{
           textAlign: "left",  // Align the text to the left
           maxWidth: "50%",
           position: "absolute",  // Position it absolutely inside its parent
           bottom: "20px",  // Add some space from the top
           right: "20px",  // Add some space from the left
           backgroundColor: "#319899",  // Background color
           color: "white",  // Text color to contrast with the background
           padding: "20px",  // Padding for some space around the content
           borderRadius: "10px",  // Rounded corners for the background container
           boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
         }}
       >
         <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>Plan Your Next Ride</h1>
         <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
            Travel seamlessly. Connect to your flights with ease and enjoy stress-free journeys with our airport transportation services.
         </p>
       </div>
         </div>
       </div>
      )}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Spin tip="Searching..." />
        </div>
      ) : (
        transportations?.length > 0 &&
        !formVisible && ( // Render list if hotels are available and form is not visible
          <Card
            style={{
              width: "100%",
              maxWidth: 600,
              margin: "20px auto",
              padding: "20px",
            }}
          >
            <Title level={4}>Available Transportations</Title>
            {/* <SelectCurrency
              currency={currency}
              onCurrencyChange={handleCurrencyChange}
              style={{ float: "right" , left:-700 , top: -70}}
            /> */}
            <List
              itemLayout="vertical"
              dataSource={transportations}
              renderItem={(transportation) => (
                <List.Item key={transportation.vehicle_code}>
                  <List.Item.Meta
                    title={transportation.vehicle_description}
                    description={`City: ${
                      transportation.end_address_cityName
                    } | Price: ${convertPrice(
                      transportation.quotation_monetaryAmount,
                      transportation.quotation_currencyCode
                    )} ${currency}`}
                  />
                  <div>
                    Transfer Type: {transportation.transferType} <br />
                    Start Date Time:{" "}
                    {new Date(transportation.start_dateTime)
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")}{" "}
                    <br />
                    Airport: {transportation.start_locationCode} <br />
                    End Date Time:{" "}
                    {new Date(transportation.end_dateTime)
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")}{" "}
                    <br />
                    Distance:{" "}
                    {transportation.distance_value +
                      transportation.distance_unit}{" "}
                    <br />
                    Vehicle Seats: {transportation.vehicle_seats} <br />
                    End Address: {transportation.end_address_line} <br />
                  </div>
                  <Button
                    type="link"
                    style={{ color: Colors.primary.default }}
                    onClick={() => handleViewDetails(transportation)}
                  >
                    View Details
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        )
      )}
      <Modal
        title={
          selectedTransportation
            ? selectedTransportation.name
            : "Transportation Details"
        }
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedTransportation && (
          <>
            <p>
              <strong>Vehicle Description:</strong>{" "}
              {selectedTransportation.vehicle_description}
            </p>
            <p>
              <strong>City:</strong>{" "}
              {selectedTransportation.end_address_cityName}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {convertPrice(
                selectedTransportation.quotation_monetaryAmount,
                selectedTransportation.quotation_currencyCode
              )}{" "}
              {currency}
            </p>
            <p>
              <strong>Transfer Type:</strong>{" "}
              {selectedTransportation.transferType}
            </p>
            <p>
              <strong>Start Date Time:</strong>{" "}
              {new Date(selectedTransportation.start_dateTime)
                .toISOString()
                .slice(0, 16)
                .replace("T", " ")}
            </p>
            <p>
              <strong>Start Airport:</strong>{" "}
              {selectedTransportation.start_locationCode}
            </p>
            <p>
              <strong>End Date Time:</strong>{" "}
              {new Date(selectedTransportation.end_dateTime)
                .toISOString()
                .slice(0, 16)
                .replace("T", " ")}
            </p>
            <p>
              <strong>Distance:</strong>{" "}
              {selectedTransportation.distance_value +
                " " +
                selectedTransportation.distance_unit}
            </p>
            <p>
              <strong>Vehicle Seats:</strong>{" "}
              {selectedTransportation.vehicle_seats}
            </p>
            <p>
              <strong>End Address:</strong>{" "}
              {selectedTransportation.end_address_line}
            </p>
          </>
        )}

        <CustomButton
          value="Book"
          key="book"
          type="primary"
          onClick={handleBooking}
          size={"s"}
        />
      </Modal>
    </>
  );
};

export default Transportations;
