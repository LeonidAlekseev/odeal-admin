import { Flex } from "antd";
import Link from "next/link";
import { MainLogoIcon, MainLogoText } from "@/components";

export const authRenderContent = (content: React.ReactNode) => {
  return (
    <div
      style={{
        maxWidth: 408,
        margin: "auto",
      }}
    >
      <Link href="/">
        <Flex
          align="center"
          justify="center"
          gap={12}
          style={{
            marginBottom: 16,
          }}
        >
          <MainLogoIcon
            style={{
              width: "75px",
              height: "75px",
              color: "#fff",
            }}
          />
          <MainLogoText
            style={{
              color: "#fff",
              width: "200px",
              height: "50px",
            }}
          />
        </Flex>
      </Link>
      {content}
    </div>
  );
};
