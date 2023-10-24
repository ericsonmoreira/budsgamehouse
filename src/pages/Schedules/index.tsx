import { Box, Paper } from '@mui/material';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import AddSchedulesDialog from '../../components/dialogs/schedules/AddSchedulesDialog';
import useSchedules from '../../hooks/useSchedules';

const locales = {
  ptBR: ptBR,
};

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const Schedules: React.FC = () => {
  const { data: schedules, isLoading } = useSchedules();

  const [addScheduleDialogOpen, setAddScheduleDialogOpen] = useState(false);

  return (
    <Page loading={isLoading}>
      <PageHeader title="Programação" onClickAddButton={() => setAddScheduleDialogOpen(true)} />
      <Paper sx={{ margin: 1, height: 1 }} component={Box} p={1}>
        <Calendar
          localizer={localizer}
          events={schedules?.map(({ start, end, title }) => ({ start: start.toDate(), end: end.toDate(), title }))}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          culture="ptBR"
        />
      </Paper>
      <AddSchedulesDialog
        title="Adicionar Programação"
        subTitle="Adicionar Programação"
        open={addScheduleDialogOpen}
        setOpen={setAddScheduleDialogOpen}
      />
    </Page>
  );
};

export default Schedules;
