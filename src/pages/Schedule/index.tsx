import { Box, Paper } from '@mui/material';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';

const locales = {
  ptBR: ptBR,
};

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const Schedule: React.FC = () => {
  return (
    <Page>
      <PageHeader title="Programação" />
      <Paper sx={{ margin: 1, height: 1 }} component={Box} p={1}>
        <Calendar
          onDoubleClickEvent={(event) => console.log(event)}
          localizer={localizer}
          events={[
            {
              start: new Date(),
              end: new Date(),
              title: 'Teste',
              tooltip: 'Teste',
            },
          ]}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          tooltipAccessor="tooltip"
          culture="ptBR"
        />
      </Paper>
    </Page>
  );
};

export default Schedule;
