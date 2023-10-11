import { Grid, Tab, Tabs } from '@mui/material';
import React, { useMemo, useState } from 'react';
import CommandCard from '../../components/CommandCard';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import AddCommandDialog from '../../components/dialogs/commands/AddCommandDialog';
import useCommands from '../../hooks/useCommands';

type TabPanelProps = {
  children: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel: React.FC<TabPanelProps> = ({ children, index, value, ...rest }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...rest}
    >
      {value === index && children}
    </div>
  );
};

const Commands: React.FC = () => {
  const [openAddCommandDialog, setOpenAddCommandDialog] = useState(false);

  const [activeTabValue, setActiveTabValue] = useState(0);

  const handleChangeActiveTabValue = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTabValue(newValue);
  };

  const { data: openedCommands, isLoading: openedCommandsIsLoading } = useCommands('open');
  const { data: closedCommands, isLoading: closedCommandsIsLoading } = useCommands('closed');
  const { data: canceledCommands, isLoading: canceledCommandsIsLoading } = useCommands('canceled');

  const isLoading = useMemo(
    () => openedCommandsIsLoading || closedCommandsIsLoading || canceledCommandsIsLoading,
    [openedCommandsIsLoading, closedCommandsIsLoading, canceledCommandsIsLoading]
  );

  return (
    <Page loading={isLoading}>
      <PageHeader title="Comandas" onClickAddButton={() => setOpenAddCommandDialog(true)} />
      <Tabs value={activeTabValue} onChange={handleChangeActiveTabValue} variant="fullWidth">
        <Tab label="Abertos" />
        <Tab label="Fechados" />
        <Tab label="Cancelados" />
      </Tabs>
      <TabPanel value={activeTabValue} index={0}>
        <Grid container padding={1} spacing={1}>
          {openedCommands &&
            openedCommands.map((command) => (
              <Grid item key={command.id} xs={12} sm={6} md={4} lg={3}>
                <CommandCard data={command} key={command.id} />
              </Grid>
            ))}
        </Grid>
      </TabPanel>
      <TabPanel value={activeTabValue} index={1}>
        <Grid container padding={1} spacing={1}>
          {closedCommands &&
            closedCommands.map((command) => (
              <Grid item key={command.id} xs={12} sm={6} md={4} lg={3}>
                <CommandCard data={command} key={command.id} />
              </Grid>
            ))}
        </Grid>
      </TabPanel>
      <TabPanel value={activeTabValue} index={2}>
        <Grid container padding={1} spacing={1}>
          {canceledCommands &&
            canceledCommands.map((command) => (
              <Grid item key={command.id} xs={12} sm={6} md={4} lg={3}>
                <CommandCard data={command} key={command.id} />
              </Grid>
            ))}
        </Grid>
      </TabPanel>
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
