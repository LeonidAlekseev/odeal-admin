import { Suspense } from "react";
import { Authenticated, CanAccess } from "@refinedev/core";
import ThemedLayout from "./_layout_theme";

export default function PrivateLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Suspense>
        <Authenticated key="authenticated-routes">
          <ThemedLayout>
            <CanAccess fallback={null}>{children}</CanAccess>
          </ThemedLayout>
        </Authenticated>
      </Suspense>
    </>
  );
}
