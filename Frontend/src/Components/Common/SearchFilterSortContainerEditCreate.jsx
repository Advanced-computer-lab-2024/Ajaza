import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Card,
  Flex,
  Space,
  Modal,
  message,
  Form,
  Input,
  Button as AntButton,
  Upload,
  Select,
  Dropdown,
  Typography,
} from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ArchiveIcon from "@mui/icons-material/Archive";
import Search from "./Search";
import { DownOutlined, InboxOutlined } from "@ant-design/icons";
import { apiUrl } from "./Constants";
import axios from "axios";
import CustomButton from "./CustomButton";

function mapPropsToValues(element, propMapping) {
  if (!propMapping || !element) {
    return {};
  }

  // Create an object containing the mapped properties for the element
  const mapping = {};
  Object.entries(propMapping).forEach(([propName, fieldName]) => {
    mapping[propName] = element[fieldName];
  });

  return mapping;
}

const filterSearchArray = (elements, searchValue, searchFields) => {
  if (
    !elements ||
    !Array.isArray(elements) ||
    !searchFields ||
    !Array.isArray(searchFields)
  ) {
    return []; // Return an empty array if input is invalid
  }

  if (searchValue === "") {
    return elements; // Return all elements if search value is empty
  }

  const lowerCaseSearchValue = searchValue.toLowerCase(); // Convert search value to lowercase for case-insensitive search

  // Filter elements based on the search value and specified fields
  return elements.filter((element) => {
    const values = [];
    searchFields.forEach((field) => {
      values.push(element[field]);
    });
    // Values contain all the values to search in

    for (const value of values) {
      if (Array.isArray(value)) {
        // value is an array -> map the array
        for (const valueElem of value) {
          if (
            valueElem?.toString().toLowerCase().includes(lowerCaseSearchValue)
          ) {
            return true;
          }
        }
      } else {
        // value is not an array
        if (value?.toString().toLowerCase().includes(lowerCaseSearchValue)) {
          return true;
        }
      }
    }
    return false;
  });
};

const sortElements = (elements, sortField, sortAsc) => {
  return [...elements].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    if (sortField == "price") {
      if (!typeof aValue == Number) {
        aValue = a.lower;
      }
      if (!typeof bValue == Number) {
        bValue = b.lower;
      }
    }

    if (isNaN(aValue)) return sortAsc ? -1 : 1;
    if (isNaN(bValue)) return sortAsc ? 1 : -1;

    if (aValue < bValue) return sortAsc ? -1 : 1;
    if (aValue > bValue) return sortAsc ? 1 : -1;
    return 0;
  });
};

const convertToTitleCase = (inputString) => {
  // Split the string by uppercase letters and join with a space
  return inputString
    .replace(/([A-Z])/g, " $1") // Add a space before each uppercase letter
    .trim() // Remove leading/trailing spaces
    .split(" ") // Split the string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter and lower the rest
    .join(" "); // Join the words back into a string
};

const getAllKeys = (arrayOfObjects) => {
  return [
    ...new Set(
      arrayOfObjects.reduce((keys, obj) => {
        return keys.concat(Object.keys(obj));
      }, [])
    ),
  ];
};

const genericCompare = (value1, value2, compareFn) => {
  if (typeof compareFn === "function") {
    return compareFn(value1, value2);
  }
  throw new Error("compareFn must be a function");
};

const SearchFilterSortContainerEditCreate = ({
  cardComponent: CardComponent = Card, // Pass your custom Card (IF NEEDED)
  searchFields,
  filterFields,
  sortFields,
  elements, // array of objects to be displayed
  propMapping,
  // This is for your own Card Component !!!!!!!!!!!!!!!!!!!! (IF PASSED A CARD COMPONENT)
  // Objects will be
  //   {...all fields and their values,
  //     propName1: field name to use
  //     propName2: field name to use
  //     propName3: field name to use
  //     propName4: field name to use
  // } eg:
  // const propsMapping = {
  //   size: 'btnSize',
  //   style: 'btnStyle',
  //   rounded: 'roundShape',
  //   value: 'label',
  //   onClick: 'action',
  //   disabled: 'isDisabled',
  //   loading: 'isLoading',
  //   htmlType: 'type'
  // };
  fields, // the field to just be in the card
  constProps, // props that are consistent throughout the components
  cardsPerRow = 3,
  horizontalGap = 30,
  verticalGap = 30,
  // Edit
  editingProductId,
  setEditingProductId,
  archivingProductId,
  setArchivingProductId,
  setIsArchiveModalVisible,
  onArchive,
  isModalVisible,
  setIsModalVisible,
  setRefreshElements,
  userId,
  loading,
}) => {
  const [displayedElements, setDisplayedElements] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterFn, setFilterFn] = useState(() => {});
  const [filterCriteria, setFilterCriteria] = useState(null);
  const [filterField, setFilterField] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const { Dragger } = Upload;

  const span = 24 / cardsPerRow;

  useEffect(() => {
    setDisplayedElements(elements);
  }, [elements]);

  // useEffect(() => {
  //   let temp = filterSearchArray(elements, searchValue, searchFields);
  //   temp = sortElements(temp, sortField, sortAsc);
  //   console.log("search useEffect");

  //   setDisplayedElements(temp);
  // }, [searchValue]);

  // useEffect(() => {
  //   let temp = filterSearchArray(elements, searchValue, searchFields);
  //   temp = sortElements(temp, sortField, sortAsc);
  //   console.log("sortField useEffect");

  //   setDisplayedElements(temp);
  // }, [sortField]);

  // useEffect(() => {
  //   let temp = filterSearchArray(elements, searchValue, searchFields);
  //   temp = sortElements(temp, sortField, sortAsc);

  //   setDisplayedElements(temp);
  // }, [sortAsc]);

  // useEffect(() => {
  //   let temp = filterSearchArray(elements, searchValue, searchFields);
  //   temp = sortElements(temp, sortField, sortAsc);
  //   if (filterCriteria && filterField && filterFn) {
  //     temp = temp.filter((element) => {
  //       let returnValue = filterFn(filterCriteria, element);
  //       return returnValue;
  //     });
  //   }
  //   setDisplayedElements(temp);
  // }, [searchValue, sortField, sortAsc, filterField, filterCriteria, filterFn]);

  // useEffect(() => {
  //   let temp = filterSearchArray(elements, searchValue, searchFields);
  //   temp = sortElements(temp, sortField, sortAsc);

  //   // Filter out archived products
  //   temp = temp.filter(element => !element.isArchived); // Ensure 'isArchived' is correctly mapped from your data

  //   if (filterCriteria && filterField && filterFn) {
  //     temp = temp.filter((element) => {
  //       let returnValue = filterFn(filterCriteria, element);
  //       return returnValue;
  //     });
  //   }
  //   setDisplayedElements(temp);
  // }, [searchValue, sortField, sortAsc, filterField, filterCriteria, filterFn, elements]);

  // useEffect(() => {
  //   console.log(displayedElements);
  // }, [displayedElements]);

  const sortItems = [];
  sortFields?.forEach((field, index) => {
    const fieldName = convertToTitleCase(field);
    sortItems.push({
      key: index * 2 + 1,
      label: `${fieldName}: High to Low`,
      onClick: () => {
        setSortAsc(false);
        setSortField(field);
      },
    });
    sortItems.push({
      key: index * 2 + 2,
      label: `${fieldName}: Low to High`,
      onClick: () => {
        setSortAsc(true);
        setSortField(field);
      },
    });
  });

  let filterItems = [];

  function generateFilterItems(filterFields) {
    let filterItems = [
      {
        key: 1,
        label: "None",
        onClick: () => {
          setFilterCriteria(null);
          setFilterField(null);
          setFilterFn(null);
        },
      },
    ];
    let groupKey = 2;

    for (const [fieldName, fieldData] of Object.entries(filterFields)) {
      let group = {
        key: String(groupKey),
        label: fieldData.displayName,
        children: [],
      };

      let itemKey = 2;
      for (const value of fieldData.values) {
        group.children.push({
          key: `${groupKey}-${itemKey}`,
          label: value.displayName,
          onClick: () => {
            // Set the compare function without executing it
            setFilterFn(() => (filterCriteria, element) => {
              return fieldData.compareFn(filterCriteria, element);
            });
            setFilterCriteria(value.filterCriteria);
            setFilterField(fieldName);
          },
        });
        itemKey++;
      }

      filterItems.push(group);
      groupKey++;
    }

    return filterItems;
  }

  useEffect(() => {
    console.log(editingProductId);
  }, [editingProductId]);

  useEffect(() => {
    console.log(archivingProductId);
  }, [archivingProductId]);

  // Edit part
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProductId(null);
    form.resetFields();
  };

  const showEditModal = (product) => {
    setIsModalVisible(true);
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      desc: product.desc,
      quantity: product.quantity,
    });
    setEditingProductId(product._id);
  };

  const createProduct = async (formValues) => {
    try {
      const formData = new FormData();
      Object.entries(formValues).map(([key, value]) => {
        formData.append(key, value);
      });
      console.log(formValues.photo);

      if (formValues.photo && formValues.photo.length > 0) {
        formData.append("photo", formValues.photo[0].originFileObj);
      }
      console.log(formData);

      const response = await axios.post(
        `${apiUrl}product/${userId}/product/adminSellerAddProduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setRefreshElements((prev) => !prev);
      message.success("Product updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setEditingProductId(null);
    } catch (error) {
      message.error(
        "Failed to create Product. " + error?.response?.data?.error
      );
    }
  };

  const editProduct = async (formValues) => {
    try {
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.entries(formValues).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      // Check if a new photo is being uploaded
      if (formValues.photo && formValues.photo.length > 0) {
        formData.append("photo", formValues.photo[0].originFileObj);
      }
  
      const response = await axios.patch(
        `${apiUrl}product/${userId}/product/${editingProductId}/adminSellerEditProduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setRefreshElements((prev) => !prev);
      message.success("Product updated successfully!");
      setIsModalVisible(false);
      form.resetFields();
      setEditingProductId(null);
    } catch (error) {
      message.error(
        "Failed to edit Product." + error?.response?.data?.error
      );
    }
  };

  const showArchiveModal = (product) => {
    Modal.confirm({
      title: "Are you sure you want to archive this product?",
      onOk: () => {
        setArchivingProductId(product._id); // Set the ID of the product being archived
        onArchive(product._id); // Call the onArchive function
        message.success(`${product.name} has been archived.`); // Optional: success message
      },
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleFileChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  filterItems = generateFilterItems(filterFields);
  return (
    <>
      <Flex align="center" justify="center" style={{ marginBottom: "30px" }}>
        {searchFields ? (
          <Search
            activateHover={false}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            style={{ width: "600px" }}
            inputStyleParam={{ paddingLeft: "40px" }}
          />
        ) : null}

        <Flex style={{ position: "absolute", right: "70px" }}>
          <Dropdown
            menu={{
              selectable: true,
              items: filterItems,
            }}
          >
            <a
              onClick={(e) => e.preventDefault()}
              style={{ marginLeft: "auto" }}
            >
              <Space>
                Filter
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>

          <Dropdown
            menu={{
              items: sortItems,
              selectable: true,
              defaultSelectedKeys: ["3"],
            }}
          >
            <Typography.Link style={{ marginLeft: "30px" }}>
              <Space>
                Sort
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </Flex>
      </Flex>
      <Row gutter={[horizontalGap, verticalGap]}>
        {displayedElements?.map((element, index) => {
          const mappedProps = mapPropsToValues(element, propMapping);
          const mappedFields = mapPropsToValues(element, fields);
          const combinedProps = { ...mappedProps, ...constProps };
          return (
            <Col span={span} key={element["_id"]}>
              {/* set element.name this to id */}
              <CardComponent
                {...combinedProps}
                fields={mappedFields}
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => showEditModal(element)}
                  />,
                  setArchivingProductId ? (
                    <ArchiveIcon
                      key="archive"
                      onClick={() => showArchiveModal(element)}
                    />
                  ) : null,
                ]}
              />
            </Col>
          );
        })}
      </Row>

      <Modal
        title={editingProductId ? "Edit Product" : "Create Product"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingProductId ? editProduct : createProduct} // TODO
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="desc"
            label="Description"
            rules={[
              { required: true, message: "Please input the description" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input the quantity" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Photo"
            name="photo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Dragger
              name="photo"
              listType="text"
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <AntButton type="primary" htmlType="submit">
              {editingProductId ? "Save Changes" : "Create Product"}
            </AntButton>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SearchFilterSortContainerEditCreate;
