import React, { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Card, Space, Modal, message, Form, Input, Button as AntButton, Select } from 'antd';
import axios from 'axios';
import SideBar from './SideBar';
import { CustomLayout } from '.';

const { Option } = Select;

const Itineraries = () => {
  const [itinerariesData, setItinerariesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch itineraries from the backend
  const fetchItineraries = async () => {
    try {
      const response = await axios.get('/api/itineraries'); // Adjust the API endpoint accordingly
      setItinerariesData(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      message.error('Failed to fetch itineraries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  // Function to handle creating a new itinerary
  const createItinerary = async (values) => {
    try {
      const newItinerary = {
        guideId: "your-guide-id", // Replace with the actual guide ID
        name: values.name,
        timeline: [],
        language: values.language,
        price: values.price,
        availableDateTime: [],
        pickUp: values.pickUp,
        dropOff: values.dropOff,
      };
      
      const response = await axios.post('/api/itineraries', newItinerary);
      setItinerariesData([...itinerariesData, response.data]);
      message.success('Itinerary created successfully!');
      setIsModalVisible(false); // Close the modal after success
      form.resetFields(); // Reset the form fields
    } catch (error) {
      console.error("Error creating itinerary:", error);
      message.error('Failed to create itinerary.');
    }
  };

  // Function to handle editing an itinerary
  const editItinerary = async (id) => {
    const itineraryToEdit = itinerariesData.find(itinerary => itinerary._id === id);
    const updatedItinerary = { ...itineraryToEdit, name: "Updated Itinerary" }; // Update as needed

    try {
      const response = await axios.patch(`/api/itineraries/${id}`, updatedItinerary);
      setItinerariesData(itinerariesData.map(itinerary => 
        itinerary._id === id ? response.data : itinerary
      ));
      message.success('Itinerary updated successfully!');
    } catch (error) {
      console.error("Error updating itinerary:", error);
      message.error('Failed to update itinerary.');
    }
  };

  // Function to handle deleting an itinerary
  const deleteItinerary = async (id) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you want to delete this itinerary?',
      onOk: async () => {
        try {
          await axios.delete(`/api/itineraries/${id}`);
          setItinerariesData(itinerariesData.filter(itinerary => itinerary._id !== id));
          message.success('Itinerary deleted successfully!');
        } catch (error) {
          console.error("Error deleting itinerary:", error);
          message.error('Failed to delete itinerary.');
        }
      },
    });
  };

  // Function to show the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle modal cancellation
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      <CustomLayout>
        <div style={{ padding: '20px', flexGrow: 1 }}>
          <h2>Itineraries</h2>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
            <AntButton type="primary" onClick={showModal}>
              Create Itinerary
            </AntButton>
          </div>

          {loading ? (
            <p>Loading itineraries...</p>
          ) : (
            <Space direction="horizontal" size="middle" style={{ display: 'flex', flexWrap: 'wrap' }}>
              {itinerariesData.map((itinerary) => (
                <Card
                  key={itinerary._id}
                  actions={[
                    <EditOutlined key="edit" onClick={() => editItinerary(itinerary._id)} />,
                    <DeleteOutlined key="delete" onClick={() => deleteItinerary(itinerary._id)} />,
                  ]}
                  style={{ minWidth: 300, margin: '10px' }} // Adding margin for better spacing
                >
                  <Card.Meta
                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />} // Use a relevant avatar
                    title={itinerary.name}
                    description={<p>{`Price: ${itinerary.price}, Language: ${itinerary.language}, Pick Up: ${itinerary.pickUp}, Drop Off: ${itinerary.dropOff}`}</p>}
                  />
                </Card>
              ))}
            </Space>
          )}

          {/* Modal for creating a new itinerary */}
          <Modal title="Create Itinerary" visible={isModalVisible} onCancel={handleCancel} footer={null}>
            <Form form={form} layout="vertical" onFinish={createItinerary}>
              <Form.Item name="name" label="Itinerary Name" rules={[{ required: true, message: 'Please input the itinerary name!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="language" label="Language" rules={[{ required: true, message: 'Please select a language!' }]}>
                <Select placeholder="Select a language">
                  <Option value="English">English</Option>
                  <Option value="Spanish">Spanish</Option>
                  <Option value="French">French</Option>
                  {/* Add more options as needed */}
                </Select>
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
                <Input type="number" />
              </Form.Item>
              <Form.Item name="pickUp" label="Pick Up Location" rules={[{ required: true, message: 'Please input the pick up location!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="dropOff" label="Drop Off Location" rules={[{ required: true, message: 'Please input the drop off location!' }]}>
                <Input />
              </Form.Item>
              <Form.Item>
                <AntButton type="primary" htmlType="submit">
                  Create Itinerary
                </AntButton>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </CustomLayout>
    </div>
  );
};

export default Itineraries;
