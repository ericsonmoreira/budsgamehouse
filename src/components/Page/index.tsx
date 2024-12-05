import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

type PageProps = {
  loading?: boolean;
  children: React.ReactNode;
};

const Page: React.FC<PageProps> = ({ children, loading = false }) => {
  return (
    <>
      {children}
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default Page;
