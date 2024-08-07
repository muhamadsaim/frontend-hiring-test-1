// src/components/ApolloClientProvider.tsx
"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloClient";

const ApolloClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientProvider;
