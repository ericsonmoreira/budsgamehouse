import { Box } from "@mui/material";
import Lottie from "lottie-react";
import React from "react";
import NotFoundAnimation from "../../assets/lotties/404.json";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";

function NotFoundPage() {
  return (
    <Page>
      <PageHeader title="Opss..." containsBackButton />
      <Box
        width={1}
        height={1}
        p={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Lottie animationData={NotFoundAnimation} />
      </Box>
    </Page>
  );
}

export default NotFoundPage;
