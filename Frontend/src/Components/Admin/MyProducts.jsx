import React, { useEffect, useState } from "react";
import SearchFilterSortContainer from "../Common/SearchFilterSortContainer";
import SearchFilterSortContainerEditCreate from "../Common/SearchFilterSortContainerEditCreate";
import {
  apiUrl,
  calculateYourPrice,
  Colors,
  comparePriceRange,
  getAvgRating,
} from "../Common/Constants";
import axios from "axios";
import BasicCard from "../Common/BasicCard";
import {
  EditOutlined,
  PlusOutlined,
  TranslationOutlined,
} from "@ant-design/icons";
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
  Button,
  Flex,
} from "antd";
import SelectCurrency from "../Tourist/SelectCurrency";
import { useCurrency } from "../Tourist/CurrencyContext";

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

const currencyRates = {
  EGP: 48.58,
  USD: 1,
  EUR: 0.91,
};

const MyProducts = () => {
  const [combinedElements, setCombinedElements] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [archivingProductId, setArchivingProductId] = useState(null);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [refreshElements, setRefreshElements] = useState(false);
  const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const propMapping = {
    title: "name",
    extra: "price",
    rating: "avgRating",
    photo: "photo",
  };
  const fields = {
    Description: "desc",
    Seller: "sellerName",
    Sales: "sales",
    "Quantity Available": "quantity",
  };
  const searchFields = ["name"];
  const constProps = { rateDisplay: true, currency, currencyRates };

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
        const productResponse = await axios.get(
          `${apiUrl}product/viewMyProducts/${userId}`
        );
        let products = productResponse.data;

        // Filter out archived products
        let nonArchivedProducts = products.filter(
          (product) => !product.archived
        );
        let combinedArray = nonArchivedProducts;
        combinedArray = combinedArray.map((element) => {
          return {
            ...element,
            avgRating: getAvgRating(element.feedback),
            sales: element.sales || 0, // Ensure sales is set to 0 if not present
          };
        });

        console.log(combinedArray);

        setCombinedElements(combinedArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refreshElements]);

  const archiveProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userDetails["_id"];

      const response = await axios.patch(
        `${apiUrl}product/${userId}/product/${productId}/adminSellerArchiveProduct`,
        {
          archived: true,
        }
      );
      console.log("API Response:", response.data);
      console.log("inside prodID", productId);
      console.log("inside userID", userId);

      setRefreshElements((prev) => !prev); // Refresh elements
    } catch (error) {
      message.error(
        `Failed to archive product: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const createOnclick2 = (product) => {
    if (product && product._id) {
      archiveProduct(product._id); // Directly archive the product without showing a modal
    } else {
      console.error("No product or product ID provided");
    }
  };

  const createOnclick = () => {
    setEditingProductId(null);
    setIsModalVisible(true);
  };

  useEffect(() => {
    console.log("NOURSALAH arch", archivingProductId);
    console.log("NOURSALAH user", userId);
  }, [archivingProductId, userId]);

  return (
    <>
      <Flex justify="end">
        <Button
          icon={<PlusOutlined style={{ color: "white" }} />}
          onClick={createOnclick}
          style={{
            backgroundColor: Colors.primary.default,
            border: "none",
            width: "30px",
            height: "30px",
            marginLeft: "auto",
          }}
        />
      </Flex>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <SelectCurrency
          basePrice={null}
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
          style={{ left: 1070, top: -29 }}
        />
      </div>
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
        setArchivingProductId={setArchivingProductId}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        userId={userId}
        setRefreshElements={setRefreshElements}
        archivingProductId={archivingProductId}
        setArchiveProductId={setArchivingProductId}
        setIsArchiveModalVisible={setIsArchiveModalVisible} // Pass this as a prop
        onArchive={archiveProduct}
        removeSearchFilterSort={true}
      />
      <Modal
        title="Confirm Archive"
        open={isArchiveModalVisible}
        onOk={() => {
          if (archivingProductId) {
            archiveProduct(archivingProductId); // Pass the archiving product ID to the archive function
          } else {
            message.error("No product selected for archiving.");
          }
        }}
        onCancel={() => setIsArchiveModalVisible(false)}
      >
        <p>Are you sure you want to archive this product?</p>
      </Modal>
      ;
    </>
  );
};

export default MyProducts;
