import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import DataGridFiados from '../../components/datagrids/DataGridFiados';
import AddFiadoDialog from '../../components/dialogs/fiados/AddFiadoDialog';
import useFiados from '../../hooks/useFiados';

const Fiados: React.FC = () => {
  const [addFiadoDialogOpen, setAddFiadoDialogOpen] = useState(false);

  const { data, isLoading } = useFiados();

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" color="textPrimary">
          Fiados
        </Typography>
        <Tooltip title="Add">
          <IconButton color="secondary" onClick={() => setAddFiadoDialogOpen(true)}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ margin: 1, height: 1 }}>
        <DataGridFiados
          rows={data?.map((fiado) => ({
            ...fiado,
            actions: {
              handledelete: () => {},
              handleUpdate: () => {},
            },
          }))}
          loading={isLoading}
        />
      </Box>
      <AddFiadoDialog
        title="Adicionar Fiado"
        subTitle="Um Fiado para um Jogador"
        open={addFiadoDialogOpen}
        setOpen={setAddFiadoDialogOpen}
        onClose={() => setAddFiadoDialogOpen(false)}
      />
    </>
  );
};

export default Fiados;
