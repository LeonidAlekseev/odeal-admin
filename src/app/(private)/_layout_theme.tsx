"use client";

import { ThemedLayoutV2 } from "@refinedev/antd";
import { Header, Sider, Title } from "@/components";

export default function ThemedLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <ThemedLayoutV2 Header={Header} Sider={Sider} Title={Title}>
        {children}
      </ThemedLayoutV2>
    </>
  );
}
