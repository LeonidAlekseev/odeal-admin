import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => {
  return {
    card: {
      position: "relative",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      ":hover": {
        ".viewButton": {
          display: "block !important",
        },
        ".cloneButton": {
          display: "block !important",
        },
      },
    },
    viewButton: {
      position: "absolute",
      display: "none !important",
      width: "max-content !important",
      top: "8px",
      left: "8px",
      padding: "6px !important",
      zIndex: 1,
      backgroundColor: token.colorBgContainer,
    },
    cloneButton: {
      position: "absolute",
      display: "none !important",
      width: "max-content !important",
      top: "8px",
      right: "8px",
      padding: "6px !important",
      zIndex: 1,
      backgroundColor: token.colorBgContainer,
    },
  };
});
