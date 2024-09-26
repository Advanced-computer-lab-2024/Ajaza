// import React from "react";
// import Icon, { QuestionCircleOutlined } from "@ant-design/icons";
// import { FloatButton } from "antd";
// import "./IconButton.css";
// import { Colors } from "./Constants";

// const IconButton = ({
//   icon,
//   color = Colors.grey[900],
//   shape,
//   badge,
//   backgroundColor,
//   size = 45,
//   fontSize = 25,
//   onClick,
//   tooltip,
//   style,
// }) => {
//   // Check documentation for badge types https://ant.design/components/float-button
//   // tooltip is the text onHover
//   console.log(backgroundColor);

//   return (
//     <div className="iconButton">
//       <FloatButton
//         shape={shape}
//         badge={badge}
//         onClick={onClick}
//         tooltip={tooltip}
//         style={{
//           position: "relative",
//           bottom: 0,
//           width: `${size}px`,
//           height: `${size}px`,
//           insetInlineEnd: 0,
//           ...style,
//           backgroundColor: backgroundColor,
//         }}
//         icon={
//           <Icon
//             component={icon}
//             style={{
//               backgroundColor: backgroundColor,
//               width: "100%",
//               fontSize: `${fontSize}px`,
//               color: color,
//             }}
//             width={"100%"}
//           />
//         }
//       />
//     </div>
//   );
// };

// export default IconButton;

import { FloatButton } from "antd";
import { Icon } from "@ant-design/icons"; // If you need to customize icons

const IconFloatButton = ({
  shape,
  badge,
  onClick,
  tooltip,
  size,
  fontSize,
  backgroundColor,
  color,
  icon: IconComponent, // Passed as a prop
  style,
}) => {
  return (
    <div className="iconButton">
      <FloatButton
        shape={shape}
        badge={badge}
        onClick={onClick}
        tooltip={tooltip}
        style={{
          position: "relative",
          bottom: 0,
          width: `${size}px`,
          height: `${size}px`,
          insetInlineEnd: 0,
          ...style, // Spread custom styles
        }}
        icon={
          <IconComponent
            style={{
              fontSize: `${fontSize}px`,
              color: color, // Icon color
            }}
          />
        }
      />
    </div>
  );
};

export default IconFloatButton;
