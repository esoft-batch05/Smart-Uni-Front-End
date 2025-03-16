import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import UpdateCourseModal from "../Create Class Modal/UpdateClass";
import { useSelector } from "react-redux";

const ClassCard = ({ classes, onEventDeleted, instructors, fetchClasses }) => {
  const [openModal, setOpenModal] = useState(false);
  const userRole = useSelector((state) => state.user?.role);

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const onEventUpdate = () => {
    handleModalOpen();
  };
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "cancelled":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Extract first letter of instructor name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // Day of week blocks
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Function to determine if a day is the class day
  const isClassDay = (day) => {
    if (!classes.schedule?.day) return false;
    return classes.schedule.day.toLowerCase().includes(day.toLowerCase());
  };

  // Function to get color for day blocks based on existing theme
  const getDayColor = (day) => {
    if (isClassDay(day)) {
      switch (classes.status?.toLowerCase()) {
        case "active":
          return "success";
        case "cancelled":
          return "error";
        case "pending":
          return "warning";
        default:
          return "primary";
      }
    }
    return "default";
  };

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {classes.name}
              </Typography>
              <Chip
                label={classes.status}
                color={getStatusColor(classes?.status)}
                size="small"
                sx={{ mb: 1 }}
              />
            </Box>
          </Box>
          {(userRole === "admin" || userRole === "lecturer") && (
            <Box>
              <IconButton
                size="small"
                aria-label="edit"
                onClick={() => onEventUpdate(classes?._id)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                aria-label="delete"
                onClick={() => onEventDeleted(classes?._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />
        
        {/* Weekday blocks */}
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          {weekdays.map((day) => (
            <Chip
              key={day}
              label={day}
              size="small"
              color={getDayColor(day)}
              variant={isClassDay(day) ? "filled" : "outlined"}
              sx={{
                minWidth: 36,
                height: 28,
                fontSize: '0.7rem',
                fontWeight: isClassDay(day) ? 'bold' : 'regular',
              }}
            />
          ))}
        </Box>

        <Grid container spacing={2} sx={{ my: 1 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon sx={{ color: "text.secondary", mr: 1 }} />
              <Typography variant="body1">
                {classes.instructor?.name || "No instructor assigned"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EmailIcon sx={{ color: "text.secondary", mr: 1 }} />
              <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                {classes.instructor?.email || "No email available"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarTodayIcon sx={{ color: "text.secondary", mr: 1 }} />
              <Typography variant="body1">
                {classes.schedule?.day || "Day not specified"}
              </Typography>
            </Box>
          </Grid>
          <UpdateCourseModal
            open={openModal}
            onClose={handleModalClose}
            classes={classes}
            instructors={instructors}
            fetchClasses={fetchClasses}
          />

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon sx={{ color: "text.secondary", mr: 1 }} />
              <Typography variant="body1">
                {classes.schedule?.time || "Time not specified"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ClassCard;