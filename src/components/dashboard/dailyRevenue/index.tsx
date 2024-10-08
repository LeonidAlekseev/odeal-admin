"use client";

import { Suspense } from "react";
import { useTranslate, useTranslation } from "@refinedev/core";
import { Area, type AreaConfig } from "@ant-design/plots";
import { dayjsExtend } from "@/utils/dayjs";

import { useConfigProvider } from "@/context";

type Props = {
  data: AreaConfig["data"];
  height: number;
};

export const DailyRevenue = ({ data, height }: Props) => {
  const t = useTranslate();
  const i18n = useTranslation();
  const { mode } = useConfigProvider();

  const config: AreaConfig = {
    isStack: false,
    data: data,
    xField: "timeText",
    yField: "value",
    seriesField: "state",
    animation: true,
    startOnZero: false,
    smooth: true,
    legend: false,
    xAxis: {
      range: [0, 1],
      label: {
        formatter: (v) => {
          if (data.length > 7) {
            return dayjsExtend(v).format("MM/DD");
          }

          return dayjsExtend(v).format("ddd");
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => {
          return `${Number(v) / 1000}`;
        },
      },
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: t("dashboard.revenue.title"),
          value: new Intl.NumberFormat(i18n.getLocale(), {
            style: "currency",
            currency: "RUB",
          }).format(data.value),
        };
      },
    },
    theme: mode,
    areaStyle: () => {
      return mode === "dark"
        ? { fill: "l(270) 0:#15171B 0.5:#1677FF 1:#1677FF" }
        : { fill: "l(270) 0:#ffffff 0.5:#D3EBFF 1:#1677FF" };
    },
    color: () => {
      return mode === "dark" ? "#65A9F3" : "#1677FF";
    },
  };

  return (
    <Suspense>
      <Area {...config} height={height} />
    </Suspense>
  );
};
