import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Grid,
  Stack,
  useTheme,
  Tooltip,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Today } from "@mui/icons-material";
import EventServices from "../../Services/EventService";

const EventCalendar = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [calendarItems, setCalendarItems] = useState([]);
  const today = new Date(); // Store actual today's date separately

  const getEventAndClasses = async () => {
    try {
      const response = await EventServices.getEventAndClasses();
      
      // Set the raw data
      setEvents(response?.data?.events || []);
      setClasses(response?.data?.classes || []);
      
      // Process events for calendar display
      const formattedEvents = (response?.data?.events || []).map(event => ({
        id: event._id,
        title: event.name,
        date: new Date(event.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
        color: theme.palette.primary.light,
        type: 'event',
        details: event
      }));
      
      // Process classes for calendar display
      const formattedClasses = (response?.data?.classes || []).map(classItem => {
        // Extract day and get date of next occurrence
        const day = classItem.schedule?.day;
        const nextDate = getNextDayDate(day);
        
        return {
          id: classItem._id,
          title: classItem.name,
          date: nextDate,
          color: theme.palette.secondary.light,
          type: 'class',
          details: classItem
        };
      });
      
      // Combine both types of items
      setCalendarItems([...formattedEvents, ...formattedClasses]);
    } catch (error) {
      console.log(error);
    }
  };
  
  // Function to get the date of the next occurrence of a day
  const getNextDayDate = (dayName) => {
    if (!dayName) return null;
    
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const dayIndex = days.findIndex(d => d === dayName);
    
    if (dayIndex === -1) return null;
    
    const todayIndex = today.getDay();
    const daysUntilNext = (dayIndex + 7 - todayIndex) % 7;
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNext);
    
    return nextDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  useEffect(() => {
    getEventAndClasses();
  }, []);

  const prevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const daysInMonth = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const formatDate = (day) => {
    return `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getItemsForDate = (day) => {
    const formattedDate = formatDate(day);
    return calendarItems.filter(item => item.date === formattedDate);
  };

  // Check if a day is today
  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: "100%",
        margin: "auto",
        p: 3,
        borderRadius: 2,
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary">
          {monthYear}
        </Typography>
        <Box>
          <IconButton onClick={prevMonth}>
            <ChevronLeft />
          </IconButton>
          <Button variant="outlined" onClick={goToToday} startIcon={<Today />}>
            Today
          </Button>
          <IconButton onClick={nextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={1} sx={{ textAlign: "center" }}>
        {dayNames.map((day, index) => (
          <Grid item xs={12 / 7} sm={12 / 7} key={index}>
            <Typography variant="subtitle2" fontWeight="bold">
              {day}
            </Typography>
          </Grid>
        ))}
        {[...Array(firstDayIndex)].map((_, index) => (
          <Grid item xs={12 / 7} sm={12 / 7} key={`empty-${index}`} />
        ))}
        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const dayItems = getItemsForDate(day);
          const todayFlag = isToday(day);
          return (
            <Grid item xs={12 / 7} sm={12 / 7} key={index}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: todayFlag ? theme.palette.primary.main : "divider",
                  p: 1,
                  borderRadius: 1,
                  bgcolor: todayFlag ? theme.palette.primary.main + "20" : "inherit",
                  minHeight: 60,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  boxShadow: todayFlag ? `0 0 4px ${theme.palette.primary.main}` : "none",
                }}
              >
                {todayFlag && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      bgcolor: theme.palette.error.main,
                    }}
                  />
                )}
                <Typography
                  variant="body1"
                  fontWeight={todayFlag ? "bold" : "normal"}
                  color={todayFlag ? theme.palette.primary.dark : "inherit"}
                >
                  {day}
                </Typography>
                <Stack spacing={0.5} mt={1}>
                  {dayItems.map((item) => (
                    <Tooltip 
                      key={item.id} 
                      title={`${item.type === 'event' ? 'Event' : 'Class'}: ${item.title}`}
                    >
                      <Paper
                        sx={{
                          p: 0.5,
                          bgcolor: item.color,
                          borderRadius: 1,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{ 
                            fontSize: "0.75rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis" 
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Paper>
                    </Tooltip>
                  ))}
                </Stack>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Today indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.primary.main + "20", border: `1px solid ${theme.palette.primary.main}`, boxShadow: `0 0 4px ${theme.palette.primary.main}`, mr: 1, borderRadius: 1 }} />
          <Typography variant="caption">Today</Typography>
        </Box>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.primary.light, mr: 1, borderRadius: 1 }} />
            <Typography variant="caption">Events</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.secondary.light, mr: 1, borderRadius: 1 }} />
            <Typography variant="caption">Classes</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default EventCalendar;