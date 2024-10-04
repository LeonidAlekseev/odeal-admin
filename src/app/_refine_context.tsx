"use client";

import React, { type PropsWithChildren } from "react";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { useNotificationProvider } from "@refinedev/antd";

import { authProvider } from "@/providers/auth-provider";
import { dataProvider } from "@/providers/data-provider";
import { useTranslation } from "next-i18next";
import "@/providers/i18n-provider";

import { ConfigProvider } from "../context";

import {
  ShoppingOutlined,
  ShopOutlined,
  DashboardOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ScanOutlined,
} from "@ant-design/icons";

import { AgentWhiteIcon } from "@/components/icons";

export const RefineContext = ({ children }: PropsWithChildren) => {
  const { t, i18n } = useTranslation();
  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <>
      <AntdRegistry>
        <ConfigProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "dashboard",
                list: "/dashboard",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <DashboardOutlined />,
                },
              },
              {
                name: "stores",
                list: "/departments",
                create: "/departments/new",
                edit: "/departments/edit/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <ShopOutlined />,
                },
              },
              {
                name: "couriers",
                list: "/agents",
                create: "/agents/new",
                edit: "/agents/edit/:id",
                show: "/agents/show/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <AgentWhiteIcon />,
                },
              },
              {
                name: "categories",
                list: "/lines",
                create: "/lines/new",
                edit: "/lines/edit/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <ScanOutlined />,
                },
              },
              {
                name: "products",
                list: "/products",
                create: "/products/new",
                edit: "/products/edit/:id",
                show: "/products/show/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <UnorderedListOutlined />,
                },
              },
              {
                name: "orders",
                list: "/contracts",
                show: "/contracts/show/:id",
                meta: {
                  // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
                  icon: <ShoppingOutlined />,
                },
              },
            ]}
          >
            {children}
          </Refine>
        </ConfigProvider>
      </AntdRegistry>
    </>
  );
};
