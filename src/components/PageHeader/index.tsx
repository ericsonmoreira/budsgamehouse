import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type PageHeaderProps = {
  title: string;
  onClickAddButton?(): void;
  containsBackButton?: boolean;
};

function PageHeader({
  title,
  onClickAddButton,
  containsBackButton,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <Box
      m={1}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="row" spacing={1}>
        {containsBackButton && (
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h4" color="textPrimary">
          {title}
        </Typography>
      </Stack>
      {onClickAddButton && (
        <Tooltip title="Add">
          <IconButton color="secondary" onClick={onClickAddButton}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

export default PageHeader;
