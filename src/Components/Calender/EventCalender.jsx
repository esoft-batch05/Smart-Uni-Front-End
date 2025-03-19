import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Grid,
  Stack,
  useTheme
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today
} from '@mui/icons-material';

const EventCalendar = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    // { id: 1, title: 'Team Meeting', date: '2025-03-10', color: theme.palette.primary.light },
    // { id: 2, title: 'Product Launch', date: '2025-03-15', color: theme.palette.success.light },
    // { id: 4, title: 'Conference Call', date: '2025-03-07', color: theme.palette.error.light },
    // { id: 5, title: 'Project Deadline', date: '2025-03-22', color: theme.palette.secondary.light }
  ]);

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  const formatDate = (day) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (day) => {
    return events.filter(event => event.date === formatDate(day));
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: '100%', margin: 'auto', p: 3, borderRadius: 2, overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          {monthYear}
        </Typography>
        <Box>
          <IconButton onClick={prevMonth}><ChevronLeft /></IconButton>
          <Button variant="outlined" onClick={goToToday} startIcon={<Today />}>Today</Button>
          <IconButton onClick={nextMonth}><ChevronRight /></IconButton>
        </Box>
      </Box>

      <Grid container spacing={1} sx={{ textAlign: 'center' }}>
        {dayNames.map((day, index) => (
          <Grid item xs={12 / 7} sm={12 / 7} key={index}>
            <Typography variant="subtitle2" fontWeight="bold">{day}</Typography>
          </Grid>
        ))}
        {[...Array(firstDayIndex)].map((_, index) => (
          <Grid item xs={12 / 7} sm={12 / 7} key={`empty-${index}`} />
        ))}
        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const dayEvents = getEventsForDate(day);
          return (
            <Grid item xs={12 / 7} sm={12 / 7} key={index}>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: currentDate.getDate() === day ? theme.palette.primary.light : 'inherit',
                  minHeight: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body1" fontWeight="bold">{day}</Typography>
                <Stack spacing={0.5} mt={1}>
                  {dayEvents.map(event => (
                    <Paper key={event.id} sx={{ p: 0.5, bgcolor: event.color, borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.75rem' }}>{event.title}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default EventCalendar;
