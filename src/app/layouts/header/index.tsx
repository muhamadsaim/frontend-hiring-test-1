"use client";
import CustomButton from "@/components/custom-button";
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getToken from "@/utils/get-token";
import Logo from "../../../../public/Logo.png";
import Image from "next/image";

const { Content } = Layout;

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">{children}</div>
      </Content>
    </Layout>
  );
};

export default HeaderLayout;
