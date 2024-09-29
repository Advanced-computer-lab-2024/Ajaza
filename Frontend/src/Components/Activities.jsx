import React, { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Card, Space, Modal, message, Form, Input, Button as AntButton } from 'antd';
import axios from 'axios';
import CustomLayout from './CustomLayout';
import Button from './Button';

const Activities = () => {
  const [activitiesData, setActivitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch activities from the backend
  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/activities'); // Adjust the API endpoint accordingly
      setActivitiesData(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      message.error('Failed to fetch activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Function to handle creating a new activity
  const createActivity = async (values) => {
    try {
      const newActivity = {
        advertiserId: "your-advertiser-id", // Replace with the actual advertiser ID
        name: values.name,
        date: values.date,
        location: values.location,
        upper: values.upper,
        lower: values.lower,
        category: values.category.split(',').map(cat => cat.trim()), // Example for handling categories as comma-separated string
        tags: values.tags.split(',').map(tag => tag.trim()), // Example for handling tags
        spots: values.spots,
      };
      
      const response = await axios.post('/api/activities', newActivity);
      setActivitiesData([...activitiesData, response.data]);
      message.success('Activity created successfully!');
      setIsModalVisible(false); // Close the modal after success
      form.resetFields(); // Reset the form fields
    } catch (error) {
      console.error("Error creating activity:", error);
      message.error('Failed to create activity.');
    }
  };

  // Function to handle editing an activity
  const editActivity = async (id) => {
    const activityToEdit = activitiesData.find(activity => activity._id === id);
    const updatedActivity = { ...activityToEdit, name: "Updated Activity" }; // Update as needed

    try {
      const response = await axios.patch(`/api/activities/${id}`, updatedActivity);
      setActivitiesData(activitiesData.map(activity => 
        activity._id === id ? response.data : activity
      ));
      message.success('Activity updated successfully!');
    } catch (error) {
      console.error("Error updating activity:", error);
      message.error('Failed to update activity.');
    }
  };

  // Function to handle deleting an activity
  const deleteActivity = async (id) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you want to delete this activity?',
      onOk: async () => {
        try {
          await axios.delete(`/api/activities/${id}`);
          setActivitiesData(activitiesData.filter(activity => activity._id !== id));
          message.success('Activity deleted successfully!');
        } catch (error) {
          console.error("Error deleting activity:", error);
          message.error('Failed to delete activity.');
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
    <div style={{ padding: '20px' }}>
      <CustomLayout>
        <h2>Activities</h2>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <Button size={"s"} value={"Create Activity"} rounded={true} onClick={showModal} />
        </div>

        {loading ? (
          <p>Loading activities...</p>
        ) : (
          <Space direction="horizontal" size="middle" style={{ display: 'flex' }}>
            {activitiesData.map((activity) => (
              <Card
                key={activity._id}
                actions={[
                  <EditOutlined key="edit" onClick={() => editActivity(activity._id)} />,
                  <DeleteOutlined key="delete" onClick={() => deleteActivity(activity._id)} />,
                ]}
                style={{ minWidth: 300 }}
              >
                <Card.Meta
                  avatar={<Avatar src={activity.avatar || "https://api.dicebear.com/7.x/miniavs/svg?seed=1"} />} // Default avatar if none exists
                  title={activity.name}
                  description={
                    <div>
                      <p>{activity.description}</p>
                      <p><strong>Location:</strong> {activity.location}</p>
                      <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                      <p><strong>Upper Limit:</strong> {activity.upper}</p>
                      <p><strong>Lower Limit:</strong> {activity.lower}</p>
                      <p><strong>Category:</strong> {activity.category.join(', ')}</p>
                      <p><strong>Tags:</strong> {activity.tags.join(', ')}</p>
                      <p><strong>Available Spots:</strong> {activity.spots}</p>
                    </div>
                  } // Adjust according to the actual activity properties
                />
              </Card>
            ))}
          </Space>
        )}

        {/* Modal for creating a new activity */}
        <Modal title="Create Activity" visible={isModalVisible} onCancel={handleCancel} footer={null}>
          <Form form={form} layout="vertical" onFinish={createActivity}>
            <Form.Item name="name" label="Activity Name" rules={[{ required: true, message: 'Please input the activity name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please input the activity date!' }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Please input the location!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="upper" label="Upper Limit" rules={[{ required: true, message: 'Please input the upper limit!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="lower" label="Lower Limit" rules={[{ required: true, message: 'Please input the lower limit!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please input the category!' }]}>
              <Input placeholder="Comma-separated categories" />
            </Form.Item>
            <Form.Item name="tags" label="Tags">
              <Input placeholder="Comma-separated tags" />
            </Form.Item>
            <Form.Item name="spots" label="Available Spots" rules={[{ required: true, message: 'Please input the number of available spots!' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item>
              <AntButton type="primary" htmlType="submit">
                Create Activity
              </AntButton>
            </Form.Item>
          </Form>
        </Modal>
      </CustomLayout>
    </div>
  );
};

export default Activities;
