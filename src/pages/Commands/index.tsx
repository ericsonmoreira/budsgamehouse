import { Grid } from '@mui/material';
import React, { useState } from 'react';
import CommandCard from '../../components/CommandCard';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import AddCommandDialog from '../../components/dialogs/commands/AddCommandDialog';
import useCommands from '../../hooks/useCommands';

const Commands: React.FC = () => {
  const [openAddCommandDialog, setOpenAddCommandDialog] = useState(false);

  const { data: commands, isLoading } = useCommands('open');

  return (
    <Page loading={isLoading}>
      <PageHeader title="Comandas" onClickAddButton={() => setOpenAddCommandDialog(true)} />
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
    </Page>
  );
};

export default Commands;
