import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import React from 'react';
import NoDataOverlay from '../../NoDataOverlay';

const CustomDataGrid: React.FC<DataGridProps> = (props) => {
  return (
    <DataGrid
      {...props}
      density="compact"
      components={{
        NoRowsOverlay: () => <NoDataOverlay />,
        NoResultsOverlay: () => <NoDataOverlay />,
      }}
      disableSelectionOnClick
      sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
    />
  );
};

export default CustomDataGrid;
