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
  initialHover = false,
}) => {
  // TODO remove initialHover after previewing
  // Use useState to create a state "searchValue" and state modifier "setSearchValue"
  // This is an example
  // const [searchValue, setSearchValue] = useState("")
  // <Search searchValue={searchValue} setSearchValue={setSearchValue} />

  const [hover, setHover] = useState(initialHover);

  let formStyle = {};
  let inputStyle = {
    display: hover ? "block" : "none",
    color: Colors.grey[900],
    padding: "0 20px",
  };
  let iconStyle = {};

  if (size === "s") {
    formStyle = {
      width: hover ? "150px" : "30px",
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
      width: hover ? "230px" : "40px",
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
    formStyle = { width: hover ? "300px" : "50px", height: "50px" };
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
        style={formStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={styles.searchInput}
          style={inputStyle}
          placeholder="Search..."
        />
        <SearchOutlined className={styles.fa} style={iconStyle} />
      </form>
    </div>
  );
};

export default Search;
