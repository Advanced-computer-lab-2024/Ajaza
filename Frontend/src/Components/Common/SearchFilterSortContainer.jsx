import React, { useEffect, useState } from "react";
import { Col, Row, Card, Avatar, Flex } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Search from "./Search";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Typography } from "antd";

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

const SearchFilterSortContainer = ({
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
  loading,
}) => {
  const [displayedElements, setDisplayedElements] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterFn, setFilterFn] = useState(() => {});
  const [filterCriteria, setFilterCriteria] = useState(null);
  const [filterField, setFilterField] = useState(null);

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

  useEffect(() => {
    let temp = filterSearchArray(elements, searchValue, searchFields);
    temp = sortElements(temp, sortField, sortAsc);
    if (filterCriteria && filterField && filterFn) {
      temp = temp.filter((element) => {
        let returnValue = filterFn(filterCriteria, element);
        return returnValue;
      });
    }
    setDisplayedElements(temp);
  }, [searchValue, sortField, sortAsc, filterField, filterCriteria, filterFn]);

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

  // const filterItems = [];
  let filterItems = [
    {
      key: "1",
      type: "group",
      label: "Group title",
      children: [
        {
          key: "1-1",
          label: "1st menu item",
        },
        {
          key: "1-2",
          label: "2nd menu item",
        },
      ],
    },
    {
      key: "2",
      label: "sub menu",
      children: [
        {
          key: "2-1",
          label: "3rd menu item",
        },
        {
          key: "2-2",
          label: "4th menu item",
        },
      ],
    },
    {
      key: "3",
      label: "disabled sub menu",
      disabled: true,
      children: [
        {
          key: "3-1",
          label: "5d menu item",
        },
        {
          key: "3-2",
          label: "6th menu item",
        },
      ],
    },
  ];

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

  filterItems = generateFilterItems(filterFields);

  return (
    <>
      <Flex align="center">
        {searchFields ? (
          <Search
            activateHover={false}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        ) : null}

        <Dropdown
          menu={{
            selectable: true,
            items: filterItems,
          }}
        >
          <a onClick={(e) => e.preventDefault()} style={{ marginLeft: "auto" }}>
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
      <Row gutter={[horizontalGap, verticalGap]}>
        {displayedElements?.map((element, index) => {
          const mappedProps = mapPropsToValues(element, propMapping);
          const mappedFields = mapPropsToValues(element, fields);
          const combinedProps = { ...mappedProps, ...constProps };
          return (
            <Col span={span} key={element["_id"]}>
              {/* set element.name this to id */}
              <CardComponent {...combinedProps} fields={mappedFields} />
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default SearchFilterSortContainer;
