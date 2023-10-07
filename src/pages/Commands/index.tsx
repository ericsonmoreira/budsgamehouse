import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import CommandCard from '../../components/CommandCard';
import useCommands from '../../hooks/useCommands';

// type CardSuite = 'club' | 'diamond' | 'heart' | 'spade';

const Commands: React.FC = () => {
  const { data: commands } = useCommands('open');

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
          <IconButton color="secondary">
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Grid container padding={1} spacing={1}>
        {commands && commands.map((command) => <CommandCard data={command} key={command.id} />)}
      </Grid>
    </>
  );
};

export default Commands;
