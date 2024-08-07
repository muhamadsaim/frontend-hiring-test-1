"use client";
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { setCookie } from "nookies";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        username
      }
    }
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f5f5;
`;

const LoginBox = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const LoginPage: React.FC = () => {
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const { data } = await login({ variables: { input: values } });
      setCookie(null, "token", data.login.access_token, { path: "/" });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Typography.Title
          level={4}
          style={{ textAlign: "center", color: "#1890ff" }}
        >
          Log In
        </Typography.Title>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label={<span>User Name</span>}
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span>Password</span>}
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log in
            </Button>
          </Form.Item>
          {error && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Form>
      </LoginBox>
    </LoginContainer>
  );
};

export default LoginPage;
