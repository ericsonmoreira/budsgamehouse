import { Box, Grid, Paper } from "@mui/material";
import { useState } from "react";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import AddSchedulesDialog from "../../components/dialogs/schedules/AddSchedulesDialog";
import useSchedules from "../../hooks/useSchedules";
import SchedleCard from "../../components/SchedleCard";

function Schedules() {
  const { data: schedules, isLoading } = useSchedules();

  const [addScheduleDialogOpen, setAddScheduleDialogOpen] = useState(false);

  return (
    <Page loading={isLoading}>
      <PageHeader
        title="Programação"
        onClickAddButton={() => setAddScheduleDialogOpen(true)}
      />
      <Paper
        sx={{
          margin: 1,
          height: 1,
          overflow: "auto",
        }}
        component={Box}
        p={1}
      >
        {schedules && (
          <Grid container spacing={1}>
            {schedules.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                <SchedleCard schedule={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      <AddSchedulesDialog
        title="Adicionar Programação"
        subTitle="Adicionar Programação"
        open={addScheduleDialogOpen}
        setOpen={setAddScheduleDialogOpen}
      />
    </Page>
  );
}

export default Schedules;
