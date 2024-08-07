import React from "react";
import { Input } from "antd";

interface CustomInputFieldProps {
  value?: string;
  placeholder?: string;
  size?: "large" | "small";
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
  value,
  placeholder,
  size,
  ...props
}) => {
  return (
    <Input value={value} placeholder={placeholder} size={size} {...props} />
  );
};

export default CustomInputField;
