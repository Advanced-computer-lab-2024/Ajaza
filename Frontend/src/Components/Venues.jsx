import React, { useEffect, useState } from "react"; 
import { EditOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { Avatar, Card, Space, Modal, message, Form, Input, Button as AntButton, Select, Upload } from "antd";
import axios from "axios";
import Button from "./Common/CustomButton";
import { jwtDecode } from "jwt-decode";
import { apiUrl } from "./Common/Constants";

const { Option } = Select;
const { Dragger } = Upload;

const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const Venues = () => {
    const [venuesData, setVenuesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [editingVenueId, setEditingVenueId] = useState(null);
    // const [tagForm] = Form.useForm();
    const [isTagModalVisible, setIsTagModalVisible] = useState(false);
    const [newTag, setNewTag] = useState(""); 
    const [preferenceTag, setPreferenceTag] = useState("");
    const allowedTagNames = ['Monuments', 'Museums', 'Religious Sites', 'Palaces/Castles'];


    const token = localStorage.getItem("token");
    let decodedToken = null;
    if (token) {
        decodedToken = jwtDecode(token);
    }
    const userid = decodedToken.userId;

    const fetchVenues = async () => {
        try {
            const response = await apiClient.get(`governor/getMyVenues/${userid}`);
            setVenuesData(response.data);
        } catch (error) {
            console.error("Error fetching venues:", error);
            message.error("Failed to fetch venues.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    const createVenue = async (values) => {
        try {
            const newVenue = {
                governorId: userid,
                name: values.name,
                desc: values.desc,
                location: values.location,
                openingHours: {
                    suno: values.openingHours.suno,
                    sunc: values.openingHours.sunc,
                    mono: values.openingHours.mono,
                    monc: values.openingHours.monc,
                    tueo: values.openingHours.tueo,
                    tuec: values.openingHours.tuec,
                    wedo: values.openingHours.wedo,
                    wedc: values.openingHours.wedc,
                    thuo: values.openingHours.thuo,
                    thuc: values.openingHours.thuc,
                    frio: values.openingHours.frio,
                    fric: values.openingHours.fric,
                    sato: values.openingHours.sato,
                    satc: values.openingHours.satc,
                },
                price: {
                    foreigner: values.price.foreigner,
                    native: values.price.native,
                    student: values.price.student,
                },
                pictures: fileList.map(file => file.originFileObj),
            };

            const response = await apiClient.post("governor/createGovernorVenue", newVenue);
            setVenuesData([...venuesData, response.data]);
            message.success("Venue created successfully!");
            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
        } catch (error) {
            console.error("Error creating venue:", error.response ? error.response.data : error);
            message.error("Failed to create venue.");
        }
    };
    const editVenue = async (id) => {
        const venueToEdit = venuesData.find((venue) => venue._id === id);
        if (venueToEdit) {
            form.setFieldsValue({
                name: venueToEdit.name,
                desc: venueToEdit.desc,
                location: venueToEdit.location,
                openingHours: {
                    suno: venueToEdit.openingHours.suno,
                    sunc: venueToEdit.openingHours.sunc,
                    mono: venueToEdit.openingHours.mono,
                    monc: venueToEdit.openingHours.monc,
                    tueo: venueToEdit.openingHours.tueo,
                    tuec: venueToEdit.openingHours.tuec,
                    wedo: venueToEdit.openingHours.wedo,
                    wedc: venueToEdit.openingHours.wedc,
                    thuo: venueToEdit.openingHours.thuo,
                    thuc: venueToEdit.openingHours.thuc,
                    frio: venueToEdit.openingHours.frio,
                    fric: venueToEdit.openingHours.fric,
                    sato: venueToEdit.openingHours.sato,
                    satc: venueToEdit.openingHours.satc,
                },
                price: {
                    foreigner: venueToEdit.price.foreigner,
                    native: venueToEdit.price.native,
                    student: venueToEdit.price.student,
                },
            });
            setIsModalVisible(true);
            setEditingVenueId(id);
        }
    };

    const handleEditSubmit = async (values) => {
        const venueToEdit = venuesData.find((venue) => venue._id === editingVenueId);
        const updatedData = {};

        // Check each field and add it to updatedData if it has changed
        if (values.name !== venueToEdit.name) updatedData.name = values.name;
        if (values.desc !== venueToEdit.desc) updatedData.desc = values.desc;
        if (values.location !== venueToEdit.location) updatedData.location = values.location;
        if (JSON.stringify(values.openingHours) !== JSON.stringify(venueToEdit.openingHours)) {
            updatedData.openingHours = values.openingHours;
        }
        if (JSON.stringify(values.price) !== JSON.stringify(venueToEdit.price)) {
            updatedData.price = values.price;
        }

        // If pictures were changed, append them as well
        if (fileList.length > 0) {
            updatedData.pictures = fileList.map(file => file.originFileObj);
        }

        updatedData.governorId = userid; // Include governorId

        try {
            const response = await apiClient.put(`governor/updateGovernorVenue/${editingVenueId}`, updatedData);
            setVenuesData(
                venuesData.map((venue) => (venue._id === editingVenueId ? response.data : venue))
            );
            message.success("Venue updated successfully!");
            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
            setEditingVenueId(null); // Reset editing ID
        } catch (error) {
            console.error("Error updating venue:", error.response ? error.response.data : error);
            message.error("Failed to update venue.");
        }
    };

    const deleteVenue = async (id) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Do you want to delete this venue?",
            onOk: async () => {
                try {
                    const governorId = userid;
                    await apiClient.delete(`governor/deleteGovernorVenue/${id}`, { data: { governorId } });
                    setVenuesData(venuesData.filter((venue) => venue._id !== id));
                    message.success("Venue deleted successfully!");
                } catch (error) {
                    console.error("Error deleting venue:", error);
                    message.error(error.response?.data?.message || "Failed to delete venue.");
                }
            },
        });
    };

    const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const showModal = () => {
        setIsModalVisible(true);
        setEditingVenueId(null);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setFileList([]);
        setEditingVenueId(null);
    };


    const showTagModal = (venueId) => {
        setEditingVenueId(venueId); // Set the editing venue ID to the selected venue
        setNewTag(""); // Reset the newTag
        setPreferenceTag(""); // Reset the preferenceTag
        setIsTagModalVisible(true); // Open the tag modal
    }; // Function to open tag modal
    const handleTagCancel = () => {
        setNewTag(""); 
        setPreferenceTag(""); 
        setIsTagModalVisible(false); // Close tag modal and reset input fields
    };

    const handleCreateTag = async (venueId) => {
        try {
            // Ensure preferenceTag is an array
            const preferenceTagsArray = preferenceTag ? [preferenceTag] : [];

            const existingTag = venuesData.find(venue => venue._id === venueId).tags.find(tag => tag.name === newTag);
            if (existingTag) {
                message.error("Tag with the same name already exists.");
                return;
            }
    
            const response = await apiClient.post("governor/createTagForVenue", {
                venueId,
                tag: newTag, // Ensure this is a valid tag from validTags in the backend
                preferenceTags: preferenceTagsArray, // This should be an array
            });
    
            message.success("Tag created successfully!");
    
            // Update venuesData to include the new tag
            setVenuesData(prevVenues => prevVenues.map(venue => {
                if (venue._id === venueId) {
                    return { ...venue, tags: [...venue.tags, response.data.tag] };
                }
                return venue;
            }));
            handleTagCancel(); // Close the modal and reset fields after success
        } catch (error) {
            console.error("Error creating tag:", error.response ? error.response.data : error);
            message.error("Failed to create tag.");
        }
    };
    
    

    return (
        <div style={{ display: "flex" }}>
            <div style={{ padding: "20px", flexGrow: 1 }}>
                <h2>My Venues</h2>
                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-start" }}>
                    <Button size={"s"} value={"Create Venue"} rounded={true} onClick={showModal} />
                </div>
    
                {loading ? (
                    <p>Loading venues...</p>
                ) : (
                    <Space direction="horizontal" size="middle" style={{ display: "flex", flexWrap: "wrap" }}>
                        {venuesData.map((venue) => (
                            <Card
                                key={venue._id}
                                actions={[
                                    <EditOutlined key="edit" onClick={() => editVenue(venue._id)} />,
                                    <DeleteOutlined key="delete" onClick={() => deleteVenue(venue._id)} />
                                ]}
                                style={{ width: 300, margin: "10px" }}
                            >
                                <Card.Meta title={venue.name} />
                                <div style={{ marginTop: 10 }}>
                                    <p>Description: {venue.desc}</p>
                                    <p>Location: {venue.location}</p>
                                    <p>Price (Foreigner): ${venue.price.foreigner} </p>
                                    <p>Price (Native): ${venue.price.native}</p>
                                    <p>Price (Student): ${venue.price.student}</p>
                                    <p>Opening Hours:</p>
                                        <ul>
                                            <li>Sunday: {venue.openingHours.suno} - {venue.openingHours.sunc}</li>
                                            <li>Monday: {venue.openingHours.mono} - {venue.openingHours.mnc}</li>
                                            <li>Tuesday: {venue.openingHours.tueo} - {venue.openingHours.tuec}</li>
                                            <li>Wednesday: {venue.openingHours.wedo} - {venue.openingHours.wedc}</li>
                                            <li>Thursday: {venue.openingHours.thuo} - {venue.openingHours.thuc}</li>
                                            <li>Friday: {venue.openingHours.frio} - {venue.openingHours.fric}</li>
                                            <li>Saturday: {venue.openingHours.sato} - {venue.openingHours.satc}</li>
                                        </ul>
                                    <p>Tags: {venue.tags.join(", ")}</p>
                                    <p>Pictures: {venue.pictures}</p>
                                    <Button size={"s"}  value={"Create Tag"} rounded={true} onClick={() => showTagModal(venue._id)}/>
                                 </div>
                            </Card>
                        ))}
                    </Space>
                )}
            </div>
    
            <Modal
                title={editingVenueId ? "Edit Venue" : "Create Venue"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={editingVenueId ? handleEditSubmit : createVenue}
                >
                    <Form.Item
                        label="Venue Name"
                        name="name"
                        rules={[{ required: true, message: "Please input the venue name!" }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="desc"
                        rules={[{ required: true, message: "Please input the venue description!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Location"
                        name="location"
                        rules={[{ required: true, message: "Please input the venue location!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Opening Hours" name="openingHours" rules={[{ required: true, message: "Please input the opening hours!" }]}>
                        <Input.Group compact>
                            {["suno", "sunc", "mono", "monc", "tueo", "tuec", "wedo", "wedc", "thuo", "thuc", "frio", "fric", "sato", "satc"].map(day => (
                                <Form.Item key={day} name={["openingHours", day]} noStyle>
                                    <Input style={{ width: "50%" }} placeholder={`${day.charAt(0).toUpperCase() + day.slice(1)} Open`} />
                                </Form.Item>
                            ))}
                        </Input.Group>
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price"
                    >
                        <Input.Group compact>
                            <Form.Item name={["price", "foreigner"]} noStyle>
                                <Input
                                    style={{ width: "33%" }}
                                    placeholder="Foreigner price"
                                    type="number"
                                />
                            </Form.Item>
                            <Form.Item name={["price", "native"]} noStyle>
                                <Input
                                    style={{ width: "33%" }}
                                    placeholder="Native price"
                                    type="number"
                                />
                            </Form.Item>
                            <Form.Item name={["price", "student"]} noStyle>
                                <Input
                                    style={{ width: "33%" }}
                                    placeholder="Student price"
                                    type="number"
                                />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                    <Form.Item label="Pictures">
                        <Dragger
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false} // Prevent auto-upload
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </Dragger>
                    </Form.Item>
                    <Form.Item>
                        <AntButton type="primary" htmlType="submit">
                            {editingVenueId ? "Update Venue" : "Create Venue"}
                        </AntButton>
                    </Form.Item>
                </Form>
            </Modal>
    
            <Modal
                title="Create Tag"
                visible={isTagModalVisible} // Use the isTagModalVisible state
                onCancel={handleTagCancel} // Correctly handle modal cancel
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={() => handleCreateTag(editingVenueId)} // Pass the editingVenueId here for tag creation
                >
                    <Form.Item
                        label="Tag"
                        rules={[{ required: true, message: "Please select a tag!" }]}
                    >
                        <Select
                            value={newTag}
                            onChange={(value) => setNewTag(value)}
                            placeholder="Select a tag" 
                        >
                            {allowedTagNames.map(tag => (
                                <Option key={tag} value={tag}>{tag}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Preference Tag"
                    >
                        <Input
                            value={preferenceTag}
                            onChange={(e) => setPreferenceTag(e.target.value)}
                            placeholder="Enter preference tag (optional)"
                        />
                    </Form.Item>
                    <Form.Item>
                        <AntButton type="primary" htmlType="submit">
                            Create Tag
                        </AntButton>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
    
};

export default Venues;
