import CommandCard from "@/components/CommandCard";
import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import AddCommandDialog from "@/components/dialogs/commands/AddCommandDialog";
import useCommands from "@/hooks/useCommands";
import useLastTwelveMonths from "@/hooks/useLastTwelveMonths";
import {
  Box,
  Grid2 as Grid,
  MenuItem,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";

type TabPanelProps = {
  children: React.ReactNode;
  index: number;
  value: number;
};

function TabPanel({ children, index, value, ...rest }: TabPanelProps) {
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
}

function Commands() {
  const [openAddCommandDialog, setOpenAddCommandDialog] = useState(false);

  const [activeTabValue, setActiveTabValue] = useState(0);

  const handleChangeActiveTabValue = (
    event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setActiveTabValue(newValue);
  };

  const lastTwelveMonths = useLastTwelveMonths(12);

  const [selectedMonth, setSelectedMonth] = useState(
    format(Date.now(), "MM/yyyy"),
  );

  const [mes, ano] = selectedMonth.split("/");

  const { data: openedCommands, isLoading: openedCommandsIsLoading } =
    useCommands("open", new Date(`${ano}-${mes}-01T00:00:00`));

  const { data: closedCommands, isLoading: closedCommandsIsLoading } =
    useCommands("closed", new Date(`${ano}-${mes}-01T00:00:00`));

  const { data: canceledCommands, isLoading: canceledCommandsIsLoading } =
    useCommands("canceled", new Date(`${ano}-${mes}-01T00:00:00`));

  const isLoading = useMemo(
    () =>
      openedCommandsIsLoading ||
      closedCommandsIsLoading ||
      canceledCommandsIsLoading,
    [
      openedCommandsIsLoading,
      closedCommandsIsLoading,
      canceledCommandsIsLoading,
    ],
  );

  return (
    <Page loading={isLoading}>
      <PageHeader
        title="Comandas"
        onClickAddButton={() => setOpenAddCommandDialog(true)}
      />
      <Box ml={1}>
        <TextField
          select
          label="Mês"
          variant="outlined"
          size="small"
          margin="normal"
          value={selectedMonth}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedMonth(event.target.value);
          }}
        >
          {lastTwelveMonths.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Tabs
        value={activeTabValue}
        onChange={handleChangeActiveTabValue}
        variant="fullWidth"
      >
        <Tab label="Abertos" />
        <Tab label="Fechados" />
        <Tab label="Cancelados" />
      </Tabs>
      <TabPanel value={activeTabValue} index={0}>
        <Grid container padding={1} spacing={1}>
          {openedCommands?.map((command) => (
            <Grid key={command.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <CommandCard data={command} key={command.id} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      <TabPanel value={activeTabValue} index={1}>
        <Grid container padding={1} spacing={1}>
          {closedCommands?.map((command) => (
            <Grid key={command.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <CommandCard data={command} key={command.id} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
      <TabPanel value={activeTabValue} index={2}>
        <Grid container padding={1} spacing={1}>
          {canceledCommands?.map((command) => (
            <Grid key={command.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
}

export default Commands;
