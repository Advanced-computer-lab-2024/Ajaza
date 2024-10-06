import React, { useEffect, useState } from "react";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import SearchFilterSortContainerEditCreate from "../Common/SearchFilterSortContainerEditCreate";
import {
  apiUrl,
  calculateYourPrice,
  comparePriceRange,
  getAvgRating,
} from "../Common/Constants";
import axios from "axios";
import BasicCard from "../Common/BasicCard";
import { EditOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import CustomButton from "../Common/CustomButton";
import {
  Card,
  Modal,
  message,
  Form,
  Input,
  Button as AntButton,
  Select,
} from "antd";

const convertCategoriesToValues = (categoriesArray) => {
  return categoriesArray.map((categoryObj) => {
    return {
      displayName: categoryObj.category,
      filterCriteria: categoryObj.category,
    };
  });
};

const convertTagsToValues = (tagsArray) => {
  return tagsArray.map((tagObj) => {
    return {
      displayName: tagObj.tag,
      filterCriteria: tagObj.tag,
    };
  });
};

const handleUpdate = async () => {};

const MyProducts = () => {
  const [combinedElements, setCombinedElements] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refreshElements, setRefreshElements] = useState(false);

  const propMapping = {
    title: "name",
    extra: "price",
    rating: "avgRating",
  };
  const fields = {
    Description: "desc",
    Seller: "sellerName",
    Sales: "sales",
    "Quantity Available": "quantity",
  };
  const searchFields = ["name"];
  const constProps = { rateDisplay: true };
  const sortFields = ["avgRating", "price"];
  const [filterFields, setfilterFields] = useState({
    price: {
      displayName: "Price",
      values: [
        { displayName: "0-20", filterCriteria: [0, 20] },
        { displayName: "21-60", filterCriteria: [21, 60] },
        { displayName: "61-100", filterCriteria: [61, 100] },
        { displayName: "101+", filterCriteria: [101, 9999999999] },
      ],
      compareFn: (filterCriteria, element) =>
        comparePriceRange(filterCriteria, element),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      let decodedToken = null;
      if (token) {
        decodedToken = jwtDecode(token);
      }
      const userId = decodedToken.userDetails["_id"];
      setUserId(userId);

      try {
        const [productResponse] = await Promise.all([
          axios.get(`${apiUrl}product/viewMyProducts/${userId}`),
        ]);
        let products = productResponse.data;

        let combinedArray = products;

        combinedArray = combinedArray.map((element) => {
          return { ...element, avgRating: getAvgRating(element.feedback) };
        });

        console.log(combinedArray);

        setCombinedElements(combinedArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refreshElements]);

  const createOnclick = () => {
    setEditingProductId(null);
    setIsModalVisible(true);
  };

  return (
    <>
      <CustomButton
        size={"s"}
        value={"Create Product"}
        onClick={createOnclick}
      />
      <SearchFilterSortContainerEditCreate
        cardComponent={BasicCard}
        elements={combinedElements}
        propMapping={propMapping}
        searchFields={searchFields}
        constProps={constProps}
        fields={fields}
        sortFields={sortFields}
        filterFields={filterFields}
        editingProductId={editingProductId}
        setEditingProductId={setEditingProductId}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        userId={userId}
        setRefreshElements={setRefreshElements}
      />
    </>
  );
};

export default MyProducts;
