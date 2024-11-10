import React, { useEffect, useState } from "react";
import Item from "./Item";
import Timeline from "./Timeline";
import { Form } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "./Constants";
import SelectCurrency from "../Tourist/SelectCurrency";
import { useCurrency } from "../Tourist/CurrencyContext";
const Product = () => {
  let { id } = useParams();

  const [product, setProduct] = useState(null);
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };  const [currencyRates] = useState({
    EGP: 48.58,
    USD: 1,
    EUR: 0.91,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(`${apiUrl}product/${id}`);
        let product = productResponse.data;
        setProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchData();
  }, []);

  const [feedbacks, setFeedbacks] = useState([
    {
      rating: 4,
      comments:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      rating: 2,
      comments:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
      rating: 1,
      comments:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
      rating: 3,
      comments:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
      rating: 0,
      comments:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
  ]);
  const [timelineItems, setTimeline] = useState({
    timeline: [
      {
        start: 1,
        id: {
          _id: "67053be2fc0ba8d64ff60e58",
          advertiserId: "670445ad78a7d623eb3aebc4",
          name: "Activity3",
          date: "2024-12-05T22:03:00.000Z",
          location:
            "https://www.google.com/maps?q=30.10389482351926,31.346418750984803",
          upper: 46,
          lower: 32,
          category: ["Category2"],
          tags: ["Tag2", "Tag3"],
          isOpen: true,
          spots: 45,
          hidden: false,
          feedback: [],
          __v: 0,
        },
        type: "Activity",
        duration: 2,
        _id: "67054033fc0ba8d64ff60f15",
      },
      {
        start: 3,
        id: {
          openingHours: {
            suno: 1,
            sunc: 23,
            mono: 12,
            monc: 23,
            tueo: 12,
            tuec: 23,
            wedo: 4,
            wedc: 19,
            thuo: 6,
            thuc: 23,
            frio: 10,
            fric: 23,
            sato: 1,
            satc: 23,
          },
          price: {
            foreigner: 12,
            native: 123,
            student: 1199,
          },
          _id: "67043c885702c8d4426147c7",
          governorId: "6704387a5702c8d4426147b1",
          name: "Venue2",
          desc: "Venue2 Description",
          pictures: ["67043c885702c8d4426147c9"],
          location: "selectedLocation",
          tags: ["1800s-1850s", "Palaces/Castles"],
          isVisible: true,
          __v: 2,
        },
        type: "Venue",
        duration: 3,
        _id: "6705406efc0ba8d64ff60f1a",
      },
    ],
    availableDateTime: [
      {
        date: new Date("2024-11-01T10:00:00Z"),
        spots: 15,
      },
      {
        date: new Date("2024-11-02T14:00:00Z"),
        spots: 20,
      },
      {
        date: new Date("2024-11-03T09:00:00Z"),
        spots: 12,
      },
      {
        date: new Date("2024-11-05T16:00:00Z"),
        spots: 8,
      },
    ],
  });

  const photos = ["6702b737bc1f3e9c8fc16972", "67043c885702c8d4426147c9"];

  const tags = ["fun", "food", "monuments", "skiing", "test", "extra"];
  const category = [
    "fun",
    "food",
    "monuments",
    "skiing",
    "test",
    "extra",
    "test",
    "test",
    "test",
  ];


  const convertedPrice = product ? (product.price * currencyRates[currency]).toFixed(2) : 0;

  const price = 124; // TODO mariem's conversion
  const name = "Product1";
  const sales = 123;
  const quantity = 12;
  const discounts = 10;

  // If tourist can not review this either set writeReviewForm to null or dont pass the prop

  const [writeReviewForm] = Form.useForm();

  const onSubmitWriteReview = (values) => {
    // use the form to give feedback
    console.log(values);
  };

  const sellerName = "Ajaza";

  console.log(product);

  return (
    <>
   <SelectCurrency currency={currency} onCurrencyChange={handleCurrencyChange} style={{left:500, top:45}}/>
      <Item
        // name={product?.name}
        name={product?.name}
        photos={product?.photo}
        price={convertedPrice}
        desc={product?.desc}
        sellerName={product?.sellerName}
        quantity={product?.quantity}
        sales={product?.sales}
        feedbacks={product?.feedback}
        type={"product"}
      />
    </>
  );
};

export default Product;
