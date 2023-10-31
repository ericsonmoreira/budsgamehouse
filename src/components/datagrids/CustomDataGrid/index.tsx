import { alpha, styled } from '@mui/material';
import { DataGrid, DataGridProps, gridClasses } from '@mui/x-data-grid';
import React from 'react';
import NoDataOverlay from '../../NoDataOverlay';

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
}));

const CustomDataGrid: React.FC<DataGridProps> = (props) => {
  return (
    <StripedDataGrid
      {...props}
      density="compact"
      components={{
        NoRowsOverlay: () => <NoDataOverlay />,
        NoResultsOverlay: () => <NoDataOverlay />,
      }}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      disableSelectionOnClick
      sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
    />
  );
};

export default CustomDataGrid;
