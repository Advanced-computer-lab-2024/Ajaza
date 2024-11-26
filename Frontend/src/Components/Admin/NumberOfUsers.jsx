import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Typography, DatePicker } from 'antd';
import moment from 'moment';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { apiUrl } from "../Common/Constants";

const { Title } = Typography;

const NumberOfUsers = () => {
    const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
    const [users, setNumberOfUsers] = useState();
    const [newuser, setNumberOfNewUsers] = useState();
  // Dummy data for new users per month
  const dummyData = {
    '2024-01': 100,
    '2024-02': 120,
    '2024-03': 150,
    '2024-04': 110,
    '2024-05': 130,
    '2024-06': 140,
    '2024-07': 90,
    '2024-08': 200,
    '2024-09': 180,
    '2024-10': 160,
    '2024-11': 110,
  };
  const fetchMonth = async () => {
    if (selectedMonth){
        setNumberOfNewUsers(selectedMonth);  
    }
    else{
        setNumberOfNewUsers(10);
    }   
  }

  const fetch = async () => {
    try {
        let guides = await axios.get(apiUrl + "guide/accepted");

        guides = guides.data.map((guide) => {
          return {
            ...guide,
            type: "guide",
          };
        });

        let advertisers = await axios.get(apiUrl + "advertiser/accepted");

        advertisers = advertisers.data.map((advertiser) => {
          return {
            ...advertiser,
            type: "advertiser",
          };
        });

        let governors = await axios.get(apiUrl + "governor/getAllGov");

        governors = governors.data.map((governor) => {
          return {
            ...governor,
            type: "governor",
          };
        });

        let tourists = await axios.get(apiUrl + "tourist");

        tourists = tourists.data.map((tourist) => {
          return {
            ...tourist,
            type: "tourist",
          };
        });

        let sellers = await axios.get(apiUrl + "seller/accepted");
        sellers = sellers.data.map((seller) => ({
          ...seller,
          type: "seller",
        }));

        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.userDetails._id;
        console.log(userId);

        let admins = await axios.get(apiUrl + "admin");
        admins = admins.data.map((admin) => ({
          ...admin,
          type: "admin",
        }));
        admins = admins.filter((admin) => {
          return admin._id != userId;
        });

        const combinedArray = [
          ...admins,
          ...tourists,
          ...sellers,
          ...guides,
          ...advertisers,
          ...governors,
        ];
        setNumberOfUsers(combinedArray.length);
        
      } catch (exception) {
      }




  };
  useEffect(() => {
    fetch();
  }, []); // Fetch new complaint data whenever the ID changes


  useEffect(() => {
    fetchMonth();
  }, [selectedMonth]);

  const totalUsers = 5000;

  // State to hold the selected month
  

  // Get the number of users for the selected month
  const newUsers = dummyData[selectedMonth] || 0;

  // Handle month change
  const onMonthChange = (date) => {
    const formattedDate = date ? date.format('YYYY-MM') : moment().format('YYYY-MM');
    setSelectedMonth(formattedDate);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', padding: '20px' }}>
      <Card
        style={{
          width: '80%',
          maxWidth: '900px',
          textAlign: 'center',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
          padding: '40px',
        }}
      >
        <Title level={2} style={{ fontSize: '36px', marginBottom: '30px' }}>
          User Statistics
        </Title>

        {/* Date Picker for month selection */}
        <DatePicker.MonthPicker
          
          onChange={onMonthChange}
          style={{ marginBottom: '30px', fontSize: '18px', padding: '10px', width: '100%' }}
          placeholder="Select month"
        />

        <Row gutter={[32, 32]} justify="center" style={{ marginTop: '20px' }}>
          <Col span={12}>
            <Statistic
              title={<span style={{ fontSize: '20px' }}>Total Users</span>}
              value={users}
              valueStyle={{ color: '#3f8600', fontSize: '36px' }}
              suffix="users"
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={
                <span style={{ fontSize: '20px' }}>
                  New Users in {moment(selectedMonth, 'YYYY-MM').format('MMMM YYYY')}
                </span>
              }
              value={newuser}
              valueStyle={{ color: '#cf1322', fontSize: '36px' }}
              suffix="users"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default NumberOfUsers;
