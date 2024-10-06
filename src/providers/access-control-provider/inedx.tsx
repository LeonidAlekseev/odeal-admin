import { AccessControlProvider } from "@refinedev/core";
import { authProvider } from "../auth-provider";
import { IUser } from "@/interfaces";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    const data = (await authProvider.getPermissions?.()) as IUser;
    const role = data?.role?.type || "public";

    let can = ["admin"].includes(role);
    let reason = "Unauthorized";

    switch (resource) {
      case "dashboard":
        can =
          action === "list"
            ? ["admin", "courier"].includes(role)
            : ["admin"].includes(role);
        break;
      case "orders":
        can = ["admin", "courier"].includes(role);
        break;
      case "products":
        can =
          action === "list"
            ? ["admin", "courier"].includes(role)
            : ["admin"].includes(role);
        break;
    }

    return {
      can: can,
      reason: reason,
    };
  },
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  },
};
