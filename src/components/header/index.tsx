"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  useGetLocale,
  useSetLocale,
  useGetIdentity,
  useTranslate,
  useList,
} from "@refinedev/core";
import { SearchOutlined, DownOutlined, BarsOutlined } from "@ant-design/icons";
import { useThemedLayoutContext } from "@refinedev/antd";

import {
  Dropdown,
  Input,
  Avatar,
  Typography,
  Space,
  Grid,
  Row,
  Col,
  AutoComplete,
  Layout as AntdLayout,
  Button,
  theme,
  type MenuProps,
} from "antd";

import { useTranslation } from "next-i18next";
import debounce from "lodash/debounce";

import { useConfigProvider } from "@/context";
import { IconMoon, IconSun } from "@/components/icons";
import type { IOrder, IStore, ICourier, IIdentity } from "@/interfaces";
import { useStyles } from "./styled";
import { MEDIA_API_URL } from "@/utils/constants";

const { Header: AntdHeader } = AntdLayout;
const { useToken } = theme;
const { Text } = Typography;
const { useBreakpoint } = Grid;

interface IOptionGroup {
  value: string;
  label: string | React.ReactNode;
}

interface IOptions {
  label: string | React.ReactNode;
  options: IOptionGroup[];
}

export const Header: React.FC = () => {
  const { token } = useToken();
  const { styles } = useStyles();
  const { mode, setMode } = useConfigProvider();
  const { i18n } = useTranslation();
  const locale = useGetLocale();
  const changeLanguage = useSetLocale();
  const { data: user } = useGetIdentity<IIdentity>();
  const screens = useBreakpoint();
  const t = useTranslate();

  const currentLocale = locale();

  const renderTitle = (title: string) => (
    <div className={styles.headerTitle}>
      <Text style={{ fontSize: "16px" }}>{title}</Text>
      <Link href={`/${title.toLowerCase()}`}>{t("search.more")}</Link>
    </div>
  );

  const renderItem = (title: string, imageUrl: string, link: string) => ({
    value: title,
    label: (
      <Link href={link} style={{ display: "flex", alignItems: "center" }}>
        {imageUrl && (
          <Avatar
            size={32}
            src={imageUrl}
            style={{ minWidth: "32px", marginRight: "16px" }}
          />
        )}
        <Text>{title}</Text>
      </Link>
    ),
  });

  const [value, setValue] = useState<string>("");
  const [options, setOptions] = useState<IOptions[]>([]);

  const { refetch: refetchOrders } = useList<IOrder>({
    resource: "orders",
    config: {
      filters: [{ field: "orderNumber", operator: "contains", value }],
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const orderOptionGroup = data.data.map((item) =>
          renderItem(
            `#${item.orderNumber} / ${item.amount}`,
            `${MEDIA_API_URL}${item?.product?.image?.url}`,
            `/orders/show/${item.id}`
          )
        );
        if (orderOptionGroup.length > 0) {
          setOptions((prevOptions) => [
            ...prevOptions,
            {
              label: renderTitle(t("orders.orders")),
              options: orderOptionGroup,
            },
          ]);
        }
      },
    },
    meta: {
      populate: {
        product: { populate: ["image"] },
      },
    },
  });

  const { refetch: refetchStores } = useList<IStore>({
    resource: "stores",
    config: {
      filters: [{ field: "title", operator: "contains", value }],
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const storeOptionGroup = data.data.map((item) =>
          renderItem(item.title, "", `/stores/edit/${item.id}`)
        );
        if (storeOptionGroup.length > 0) {
          setOptions((prevOptions) => [
            ...prevOptions,
            {
              label: renderTitle(t("stores.stores")),
              options: storeOptionGroup,
            },
          ]);
        }
      },
    },
  });

  const { refetch: refetchCouriers } = useList<ICourier>({
    resource: "couriers",
    config: {
      filters: [{ field: "user.fullName", operator: "contains", value }],
    },
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        const courierOptionGroup = data.data.map((item) =>
          renderItem(
            item.user.fullName,
            `${MEDIA_API_URL}${item.user?.avatar?.thumbnail?.url || item.user?.avatar?.url}`,
            `/couriers/show/${item.id}`
          )
        );
        if (courierOptionGroup.length > 0) {
          setOptions((prevOptions) => [
            ...prevOptions,
            {
              label: renderTitle(t("couriers.couriers")),
              options: courierOptionGroup,
            },
          ]);
        }
      },
    },
    meta: {
      populate: {
        user: { populate: ["avatar"] },
      },
    },
  });

  useEffect(() => {
    setOptions([]);
    refetchOrders();
    refetchCouriers();
    refetchStores();
  }, [value]);

  const langLabels: { [key: string]: string } = {
    ru: "Русский",
    en: "English",
    de: "Deutsch",
  };
  const menuItems: MenuProps["items"] = [...(i18n.languages || [])]
    .sort()
    .map((lang: string) => ({
      key: lang,
      onClick: () => changeLanguage(lang),
      icon: (
        <span style={{ marginRight: 8 }}>
          <Avatar size={16} src={`/images/flags/${lang}.svg`} />
        </span>
      ),
      label: langLabels[lang],
    }));

  const breakpoint = Grid.useBreakpoint();
  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;
  const { setMobileSiderOpen } = useThemedLayoutContext();

  return (
    <AntdHeader
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        padding: isMobile ? "0 12px" : "0 24px",
        backgroundColor: token.colorBgElevated,
        borderBottom: `1px solid ${token.colorBgLayout}`,
      }}
    >
      <Row
        align="middle"
        style={{
          justifyContent: "space-between",
        }}
      >
        {isMobile && (
          <Col>
            <Button
              onClick={() => setMobileSiderOpen(true)}
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              icon={<BarsOutlined />}
            />
          </Col>
        )}
        <Col xs={0} sm={8} md={12}>
          <AutoComplete
            style={{
              width: "100%",
              maxWidth: "550px",
            }}
            options={options}
            filterOption={false}
            onSearch={debounce((value: string) => setValue(value), 300)}
          >
            <Input
              size="large"
              placeholder={t("search.placeholder")}
              // suffix={<div className={styles.inputSuffix}>/</div>}
              // @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
              prefix={<SearchOutlined className={styles.inputPrefix} />}
            />
          </AutoComplete>
        </Col>
        <Col>
          <Space size={screens.md ? 32 : 16} align="center">
            <Dropdown
              menu={{
                items: menuItems,
                selectedKeys: currentLocale ? [currentLocale] : [],
              }}
            >
              <Button onClick={(e) => e.preventDefault()}>
                <Space>
                  <Text className={styles.languageSwitchText}>
                    {langLabels[currentLocale ?? "ru"]}
                  </Text>
                  {/* @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66 */}
                  <DownOutlined className={styles.languageSwitchIcon} />
                </Space>
              </Button>
            </Dropdown>

            <Button
              className={styles.themeSwitch}
              shape="circle"
              icon={mode === "light" ? <IconMoon /> : <IconSun />}
              onClick={() => {
                setMode(mode === "light" ? "dark" : "light");
                window.location.reload();
              }}
            />

            <Space size={screens.md ? 16 : 8} align="center">
              {/* <Text ellipsis className={styles.userName}>
                {user?.name}
              </Text> */}
              <Avatar
                size="large"
                src={`${MEDIA_API_URL}${user?.avatar?.url}`}
                alt={user?.username}
              />
            </Space>
          </Space>
        </Col>
      </Row>
    </AntdHeader>
  );
};
