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
  { label: "Cairo", value: "-290692" },
  { label: "Paris", value: "-1456928" },
  { label: "London", value: "-2601889" },
  { label: "Alexandria", value: "-290263" },
  { label: "Sharm", value: "-302053" },
  { label: "Hurghada", value: "-290029" },
  { label: "Aswan", value: "-291535" },
  { label: "Rome", value: "-126693" },
  { label: "Barcelona", value: "-372490" },
  { label: "Madrid", value: "-390625" },
  { label: "Amsterdam", value: "-2140479" },
  { label: "Berlin", value: "20097081" },
  { label: "Prague", value: "-553173" },
];

const Hotels = () => {
  const [firstDate, setFirstDate] = useState(null);
  const [hotels, setHotels] = useState([]); // State for hotel data
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null); // Store decoded token or API data
  const [userDetails, setUserDetails] = useState(null);
  const [formVisible, setFormVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelImages, setHotelImages] = useState([]);
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
        `${apiUrl}tourist/hotels/searchHotels`,
        {
          dest_id: values.city,
          checkInDate: values.firstDate.format("YYYY-MM-DD"),
          checkOutDate: values.secondDate.format("YYYY-MM-DD"),
          count: values.numberInput,
        }
      );
      console.log("API Response:", response.data);
      setHotels(response.data);
      if (response.data.length === 0) {
        message.warning("No hotels found for the selected criteria.");
      } else {
        message.success("Successfully fetched hotel data.");
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      message.error("Failed to fetch hotel data. Please try again.");
    } finally {
      if (response) {
        setHotels(response.data);
      }
      console.log("API Response:", hotels);
      setLoading(false);
    }
  };

  const handleFormFail = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
  };

  const fetchImages = async (hotelName) => {
    try {
      const response = await axios.get(
        `${apiUrl}tourist/hotels/fetchImagesPlz/${hotelName}`
      );
      setHotelImages(response.data); // Store images in state
    } catch (error) {
      console.error("Error fetching images:", error);
      message.error("Failed to load images.");
    }
  };

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setModalVisible(true);
    fetchImages(hotel.name); // Fetch images for the selected hotel
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setHotelImages([]); // Clear images when modal is closed
  };

  const handleBooking = async () => {
    if (!touristId) {
      message.error("You must be logged in to book a hotel.");
      return;
    }

    const bookingData = {
      hotelName: selectedHotel.name,
      city: selectedHotel.city,
      price: selectedHotel.price,
      currency: selectedHotel.currency,
      checkin: selectedHotel.checkin,
      checkout: selectedHotel.checkout,
      score: selectedHotel.score,
    };

    try {
      const response = await axios.post(
        `${apiUrl}tourist/hotels/bookHotel/${touristId}`,
        bookingData
      );
      if (response.status === 200) {
        message.success("Hotel booked successfully!");
        handleModalClose(); // Close the modal after booking
      }
    } catch (error) {
      console.error("Error booking hotel:", error);
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
                rules={[{ required: true, message: "Please select a city!" }]}
              >
                <Select placeholder="Choose a city">
                  {cityOptions.map((city) => (
                    <Option key={city.value} value={city.value}>
                      {city.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="firstDate"
                label="Select Check In Date"
                rules={[
                  { required: true, message: "Please select a start date!" },
                ]}
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
                rules={[
                  { required: true, message: "Please select an end date!" },
                  {
                    validator: (_, value) => {
                      if (
                        value &&
                        firstDate &&
                        value.isBefore(firstDate, "day")
                      ) {
                        return Promise.reject(
                          new Error(
                            "Check-out date cannot be before check-in date"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
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
                rules={[{ required: true, message: "Please enter a number!" }]}
              >
                <InputNumber
                  min={1}
                  placeholder="Enter a number"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ backgroundColor: Colors.primary.default }}
                >
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
        hotels.length > 0 &&
        !formVisible && ( // Render list if hotels are available and form is not visible
          <Card
            style={{
              width: "100%",
              maxWidth: 600,
              margin: "20px auto",
              padding: "20px",
            }}
          >
            <Title level={4}>Available Hotels</Title>
            {/* <SelectCurrency
              currency={currency}
              onCurrencyChange={handleCurrencyChange}
              style={{ float: "right", left:-700 , top: -70 }}
            /> */}
            <List
              itemLayout="vertical"
              dataSource={hotels}
              renderItem={(hotel) => (
                <List.Item key={hotel.name}>
                  <List.Item.Meta
                    title={hotel.name}
                    description={`City: ${hotel.city} | Price: ${convertPrice(
                      hotel.price,
                      hotel.currency
                    )} ${currency}`}
                  />
                  <div>
                    Check-in: {hotel.checkin} <br />
                    Check-out: {hotel.checkout} <br />
                    Score: {hotel.score}
                  </div>
                  <Button
                    type="link"
                    style={{ color: Colors.primary.default }}
                    onClick={() => handleViewDetails(hotel)}
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
        title={selectedHotel ? selectedHotel.name : "Hotel Details"}
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedHotel && (
          <>
            <p>
              <strong>City:</strong> {selectedHotel.city}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {convertPrice(selectedHotel.price, selectedHotel.currency)}{" "}
              {currency}
            </p>
            <p>
              <strong>Check-in:</strong> {selectedHotel.checkin}
            </p>
            <p>
              <strong>Check-out:</strong> {selectedHotel.checkout}
            </p>
            <p>
              <strong>Score:</strong> {selectedHotel.score}
            </p>
          </>
        )}

        <CustomButton
          value="Book"
          key="book"
          type="primary"
          onClick={handleBooking}
          size={"s"}
        ></CustomButton>
        <Space wrap>
          {hotelImages.map((image, index) => (
            <Image key={index} width={300} src={image} alt="Hotel Room" />
          ))}
        </Space>
      </Modal>
    </>
  );
};

export default Hotels;
