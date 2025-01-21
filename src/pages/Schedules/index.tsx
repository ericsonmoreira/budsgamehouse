import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import useSchedules from "@/hooks/useSchedules";
import routesNames from "@/routes/routesNames";
import { Box, Grid2 as Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SchedleCard from "./SchedleCard";

function Schedules() {
  const navigate = useNavigate();

  const { data: schedules, isLoading } = useSchedules();

  return (
    <Page loading={isLoading}>
      <PageHeader
        title="Programações"
        onClickAddButton={() => navigate(routesNames.CREATE_SCHEDULE)}
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
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <SchedleCard schedule={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Page>
  );
}

export default Schedules;
