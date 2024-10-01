import { FloatButton } from "antd";
import { Icon } from "@ant-design/icons"; // If you need to customize icons
import { UserOutlined } from "@ant-design/icons";

const IconFloatButton = ({
  shape,
  badge,
  onClick,
  tooltip,
  size,
  fontSize,
  backgroundColor,
  color,
  icon: IconComponent = UserOutlined, // Passed as a prop
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
