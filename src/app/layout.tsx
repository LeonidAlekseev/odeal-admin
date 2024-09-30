import React, { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { RefineContext } from "./_refine_context";
import "@refinedev/antd/dist/reset.css";

export const metadata: Metadata = {
  title: "odeal - это легко!",
  description: "Разработано для Код Согласия",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  const cookieStore = cookies();
  const lang = cookieStore.get("NEXT_LOCALE");

  return (
    <>
      <html lang={lang?.value || "ru"}>
        <body className="bg-primary">
          <Suspense>
            <RefineContext>{children}</RefineContext>
          </Suspense>
        </body>
      </html>
    </>
  );
}
