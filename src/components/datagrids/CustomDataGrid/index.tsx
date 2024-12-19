import { alpha, styled } from "@mui/material";
import { DataGrid, DataGridProps, gridClasses } from "@mui/x-data-grid";
import NoDataOverlay from "../../NoDataOverlay";

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
  },
}));

function CustomDataGrid(props: DataGridProps) {
  return (
    <StripedDataGrid
      {...props}
      density="compact"
      slots={{
        noRowsOverlay: () => <NoDataOverlay />,
        noResultsOverlay: () => <NoDataOverlay />,
      }}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
    />
  );
}

export default CustomDataGrid;
