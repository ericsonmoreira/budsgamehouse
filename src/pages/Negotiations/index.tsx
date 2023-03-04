import { Typography, Box, Tooltip, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";

const Negotiations: React.FC = () => {
  const [addNegotiationDialogOpen, setAddNegotiationDialogOpen] =
    useState(false);

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">Negociações</Typography>
        <Tooltip title="Add">
          <IconButton
            color="secondary"
            onClick={() => setAddNegotiationDialogOpen(true)}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default Negotiations;
