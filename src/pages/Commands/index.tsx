import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Backdrop, Box, CircularProgress, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import CommandCard from '../../components/CommandCard';
import useCommands from '../../hooks/useCommands';
import AddCommandDialog from '../../components/dialogs/commands/AddCommandDialog';

const Commands: React.FC = () => {
  const [openAddCommandDialog, setOpenAddCommandDialog] = useState(false);

  const { data: commands, isLoading } = useCommands('open');

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
          Comandas
        </Typography>
        <Tooltip title="Adicionar Comanda">
          <IconButton color="secondary" onClick={() => setOpenAddCommandDialog(true)}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Grid container padding={1} spacing={1}>
        {commands &&
          commands.map((command) => (
            <Grid item key={command.id} xs={12} sm={6} md={4} lg={3}>
              <CommandCard data={command} key={command.id} />
            </Grid>
          ))}
      </Grid>
      <AddCommandDialog
        title="Criar uma nova Comanda"
        subTitle="Preencha as informações da nova Comanda"
        open={openAddCommandDialog}
        setOpen={setOpenAddCommandDialog}
      />
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default Commands;
