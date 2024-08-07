import { Button } from "antd";
import { MouseEventHandler } from "react";

interface CustomButtonProps {
  onClick?: MouseEventHandler<HTMLElement>;
  children: React.ReactNode;
  type?: "primary" | "link" | "text" | "default" | "dashed" | undefined;
}
const CustomButton = ({
  type = "primary",
  onClick,
  children,
  ...props
}: CustomButtonProps) => {
  return (
    <Button type={type} onClick={onClick} {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
