import { Header } from "antd/es/layout/layout";
import Image from "next/image";
import React from "react";
import Logo from "../../../public/Logo.png";
interface LayoutForLoginProps {
  children: React.ReactNode;
}
const LayoutForLogin = ({ children }: LayoutForLoginProps) => {
  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          border: "1px solid gray ",
        }}
      >
        <div className="demo-logo" style={{ marginRight: "auto" }}>
          <Image
            src={Logo}
            alt="Logo"
            style={{ height: "31px", width: "150px" }}
          />
        </div>
      </Header>
      <>{children}</>
    </>
  );
};

export default LayoutForLogin;
