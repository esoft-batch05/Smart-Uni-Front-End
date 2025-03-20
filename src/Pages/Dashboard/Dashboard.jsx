import React, { useState, useEffect } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Tabs,
  Tab,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  Avatar,
  Divider
} from "@mui/material";
import { 
  EventNote, 
  School, 
  AccessTime, 
  CalendarMonth, 
  LocationOn,
  Person,
  Group
} from "@mui/icons-material";
import EventCalendar from "../../Components/Calender/EventCalender";
import TodoList from "../../Components/TODO List/Todo";
import EventServices from "../../Services/EventService";

// Component to display upcoming and ongoing events/classes
const UpcomingActivities = () => {
  const [value, setValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [ongoingClasses, setOngoingClasses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await EventServices.getEventAndClasses();
        setEvents(response?.data?.events || []);
        setClasses(response?.data?.classes || []);
        
        // Process events and classes
        processEvents(response?.data?.events || []);
        processClasses(response?.data?.classes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const processEvents = (eventData) => {
    const now = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);

    const ongoing = [];
    const upcoming = [];

    eventData.forEach(event => {
      const eventDate = new Date(event.date);
      
      // Check if event is today
      if (isSameDay(eventDate, now)) {
        ongoing.push(event);
      } 
      // Check if event is within the next 7 days
      else if (eventDate > now && eventDate <= oneWeekLater) {
        upcoming.push(event);
      }
    });

    setOngoingEvents(ongoing);
    setUpcomingEvents(upcoming);
  };

  const processClasses = (classData) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = dayNames[dayOfWeek];

    const ongoing = [];
    const upcoming = [];

    classData.forEach(classItem => {
      const classDay = classItem.schedule?.day;
      
      // Check if class is scheduled for today
      if (classDay === today) {
        ongoing.push(classItem);
      } else {
        upcoming.push(classItem);
      }
    });

    setOngoingClasses(ongoing);
    setUpcomingClasses(upcoming);
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short'
    });
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={value} onChange={handleChange} aria-label="activity tabs">
            <Tab icon={<EventNote />} iconPosition="start" label="Events" />
            <Tab icon={<School />} iconPosition="start" label="Classes" />
          </Tabs>
        </Box>

        {/* Events View */}
        <TabPanel value={value} index={0}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 1 }} /> Ongoing Events
            </Typography>
            
            {ongoingEvents.length > 0 ? (
              ongoingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                No ongoing events today
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarMonth sx={{ mr: 1 }} /> Upcoming Events
            </Typography>
            
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                No upcoming events in the next 7 days
              </Typography>
            )}
          </Box>
        </TabPanel>

        {/* Classes View */}
        <TabPanel value={value} index={1}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 1 }} /> Today's Classes
            </Typography>
            
            {ongoingClasses.length > 0 ? (
              ongoingClasses.map((classItem) => (
                <ClassCard key={classItem._id} classItem={classItem} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                No classes scheduled for today
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarMonth sx={{ mr: 1 }} /> Upcoming Classes
            </Typography>
            
            {upcomingClasses.length > 0 ? (
              upcomingClasses.slice(0, 3).map((classItem) => (
                <ClassCard key={classItem._id} classItem={classItem} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                No upcoming classes scheduled
              </Typography>
            )}
          </Box>
        </TabPanel>
      </CardContent>
    </Card>
  );
};

// Component for individual event cards
const EventCard = ({ event }) => (
  <Paper elevation={1} sx={{ mb: 2, p: 1.5, borderRadius: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <EventNote />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
            {event.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} /> 
            {formatDate(event.date)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn fontSize="small" sx={{ mr: 0.5 }} /> 
            {event.venue?.name || event.location}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Group fontSize="small" sx={{ mr: 0.5 }} /> 
            {event.attendees?.length || 0} attendees
          </Typography>
        </Box>
      </Box>
      <Chip 
        label={event.eventType} 
        size="small" 
        color={event.eventType === 'free' ? 'success' : 'primary'} 
        variant="outlined" 
      />
    </Box>
  </Paper>
);

// Component for individual class cards
const ClassCard = ({ classItem }) => (
  <Paper elevation={1} sx={{ mb: 2, p: 1.5, borderRadius: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
          <School />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
            {classItem.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} /> 
            {classItem.schedule?.day} • {classItem.schedule?.time}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn fontSize="small" sx={{ mr: 0.5 }} /> 
            {classItem.venue?.name || "No venue assigned"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Person fontSize="small" sx={{ mr: 0.5 }} /> 
            {classItem.instructor?.firstName || classItem.instructor?.name || "No instructor"}
          </Typography>
        </Box>
      </Box>
      <Chip 
        label={classItem.status} 
        size="small" 
        color={classItem.status === 'Active' ? 'success' : 'default'} 
        variant="outlined" 
      />
    </Box>
  </Paper>
);

// TabPanel component for tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short'
  });
};

// Main Dashboard component
export default function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={8}>
          <EventCalendar />
        </Grid>
        <Grid item xs={12} md={4}>
          
          <UpcomingActivities />
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom component="div">
                Activity Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={2}
                    sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}
                  >
                    <EventNote color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h6" component="div">
                      Events
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {/* This would be populated with actual event counts */}
                      2
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upcoming this week
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={2}
                    sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}
                  >
                    <School color="secondary" sx={{ fontSize: 40 }} />
                    <Typography variant="h6" component="div">
                      Classes
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {/* This would be populated with actual class counts */}
                      3
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active this week
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <TodoList />
        </Grid>
      </Grid>
    </Box>
  );
}