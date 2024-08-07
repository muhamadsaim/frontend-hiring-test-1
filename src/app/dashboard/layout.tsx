"use client";
import CustomButton from "@/components/custom-button";
import getToken from "@/utils/get-token";
import { Header } from "antd/es/layout/layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logo from "../../../public/Logo.png";

interface DashbaordLayoutProps {
  children: React.ReactNode;
}
const DashbaordLayout = ({ children }: DashbaordLayoutProps) => {
  const router = useRouter();

  const [token, setToken] = useState<string>("");

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setToken("");
    router.push("/login");
  };

  useEffect(() => {
    const token = getToken();
    setToken(token ?? "");
  }, []);
  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          justifyContent: "space-between",
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
        {token ? (
          <CustomButton type="primary" onClick={handleLogout}>
            Log out
          </CustomButton>
        ) : null}
      </Header>
      <div style={{ backgroundColor: "white" }}>{children}</div>
    </>
  );
};

export default DashbaordLayout;
