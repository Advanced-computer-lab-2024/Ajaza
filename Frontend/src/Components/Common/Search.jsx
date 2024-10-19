// import React from 'react';
// import { Button, Flex, Tooltip } from 'antd';
// const Search = ({filled}) => (

//     <Flex gap="small" vertical>
//         <Flex wrap gap="small">
//         <Tooltip title="search">
//             <Button type="primary" shape="circle" icon={<SearchOutlined />} />
//         </Tooltip>
//         <Button type="primary" icon={<SearchOutlined />}>
//             Search
//         </Button>
//         <Tooltip title="search">
//             <Button shape="circle" icon={<SearchOutlined />} />
//         </Tooltip>
//         <Button icon={<SearchOutlined />}>Search</Button>
//         </Flex>
//     </Flex>
// );
// export default Search;
import React from "react";
import styles from "./Search.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Colors } from "./Constants";

const Search = ({
  size,
  searchValue,
  setSearchValue,
  activateHover = true,
  textColor,
  style,
  icon: IconComponent = SearchOutlined, // Passed as a prop
  inputStyleParam,
}) => {
  // Use useState to create a state "searchValue" and state modifier "setSearchValue"
  // This is an example
  // const [searchValue, setSearchValue] = useState("")
  // <Search searchValue={searchValue} setSearchValue={setSearchValue} />
  // activateHover=True --> when hover it expands, activateHover=false --> always expanded

  const [hover, setHover] = useState(false);
  let booleanHover = activateHover && !hover;

  // console.log(activateHover & !hover ? "none" : "block");

  let formStyle = { backgroundColor: Colors.grey[100] };
  let inputStyle = {
    backgroundColor: Colors.grey[100],
    display: booleanHover ? "none" : "block",
    color: textColor,
    padding: "0 20px",
  };
  let iconStyle = {};

  if (size === "s") {
    formStyle = {
      ...formStyle,
      width: booleanHover ? "30px" : "150px",
      height: "30px",
      border: "2px solid white",
    };
    inputStyle = {
      ...inputStyle,
      fontSize: "0.9em",
      padding: "0 15px",
    };
    iconStyle = {
      width: "26px",
      height: "26px",
      paddingLeft: "3px",
      fontSize: "20px",
    };
  } else if (size === "m") {
    formStyle = {
      ...formStyle,
      width: booleanHover ? "40px" : "230px",
      height: "40px",
      border: "3px solid white",
    };
    inputStyle = {
      ...inputStyle,
      fontSize: "1.2em",
    };
    iconStyle = {
      width: "35px",
      height: "35px",
      paddingLeft: "5px",
      fontSize: "25px",
    };
  } else {
    formStyle = {
      ...formStyle,
      width: booleanHover ? "50px" : "300px",
      height: "50px",
    };
    inputStyle = {
      ...inputStyle,
      fontSize: "1.5em",
    };
    iconStyle = {
      width: "42.5px",
      height: "42.5px",
      paddingLeft: "6px",
      fontSize: "30px",
    };
  }

  return (
    <div>
      <form
        action=""
        className={styles.searchForm}
        style={{ ...formStyle, ...style }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={styles.searchInput}
          style={{ ...inputStyle, ...inputStyleParam }}
          placeholder="Search..."
        />
        <IconComponent
          className={styles.fa}
          style={{
            ...iconStyle,
            fontSize: "25px",
            paddingLeft: "8px",
          }}
        />
      </form>
    </div>
  );
};

export default Search;
