import { authProviderServer } from "@/providers/auth-provider/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: React.PropsWithChildren) {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/");
  }

  return <>{children}</>;
}

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}
