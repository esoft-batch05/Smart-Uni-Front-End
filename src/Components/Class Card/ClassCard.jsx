import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  alpha,
  Paper,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import UpdateCourseModal from "../Create Class Modal/UpdateClass";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ClassCard = ({ classes, onEventDeleted, instructors, fetchClasses, venues }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const userRole = useSelector((state) => state.user?.role);
  const navigate = useNavigate();

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  
  const handleLocationClick = () => {
    navigate("/map", { state: { venueId: classes.venue?._id } });
  };

  // Status colors and gradients
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return { 
          color: "success", 
          gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
          icon: "#00C853" 
        };
      case "cancelled":
        return { 
          color: "error", 
          gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
          icon: "#FF5252" 
        };
      case "pending":
        return { 
          color: "warning", 
          gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
          icon: "#FF9800" 
        };
      default:
        return { 
          color: "primary", 
          gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
          icon: "#2196F3" 
        };
    }
  };

  const statusInfo = getStatusColor(classes?.status);

  // Function to get abbreviated day names
  const getAbbreviatedDays = () => {
    if (!classes.schedule?.day) return [];
    
    const daysMap = {
      "monday": "Mon",
      "tuesday": "Tue",
      "wednesday": "Wed",
      "thursday": "Thu",
      "friday": "Fri",
      "saturday": "Sat",
      "sunday": "Sun"
    };
    
    const daysLower = classes.schedule.day.toLowerCase();
    return Object.keys(daysMap).filter(day => 
      daysLower.includes(day)
    ).map(day => daysMap[day]);
  };
  
  const classDays = getAbbreviatedDays();

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: isHovered 
          ? `0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.10)`
          : `0 5px 15px rgba(0,0,0,0.08)`,
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        background: "white",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status indicator with gradient background */}
      <Box
        sx={{
          height: 8,
          width: "100%",
          background: statusInfo.gradient,
        }}
      />
      
      {/* Class subject icon */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1,
          opacity: 0.15,
          transform: isHovered ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.4s ease",
        }}
      >
        <SchoolRoundedIcon sx={{ fontSize: 60, color: statusInfo.icon }} />
      </Box>
      
      <CardContent sx={{ pt: 3, pb: 3 }}>
        {/* Class title and status */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: "text.primary",
              position: "relative",
              maxWidth: "80%",
            }}
          >
            {classes.name}
            <Box 
              sx={{
                position: "absolute",
                height: "8px",
                width: "40%",
                bottom: "-4px",
                left: "0px",
                background: statusInfo.gradient,
                opacity: 0.5,
                borderRadius: "4px",
              }}
            />
          </Typography>
          
          <Chip
            label={classes.status || "No Status"}
            size="small"
            color={statusInfo.color}
            sx={{ 
              fontWeight: 600, 
              fontSize: "0.7rem",
              height: 24,
              "& .MuiChip-label": {
                px: 1.5,
              }
            }}
          />
        </Box>
        
        {/* Days display */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: 500 }}>
            CLASS DAYS
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {classDays.length > 0 ? (
              classDays.map(day => (
                <Paper
                  key={day}
                  elevation={0}
                  sx={{
                    py: 0.5,
                    px: 1.5,
                    backgroundColor: theme => alpha(theme.palette[statusInfo.color].main, 0.1),
                    border: `1px solid ${alpha(statusInfo.icon, 0.2)}`,
                    borderRadius: 2,
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: statusInfo.icon,
                      fontSize: "0.8rem"
                    }}
                  >
                    {day}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No scheduled days
              </Typography>
            )}
          </Box>
        </Box>

        <Grid container spacing={2.5}>
          {/* Instructor */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme => alpha(theme.palette[statusInfo.color].main, 0.1),
                  borderRadius: 2,
                  p: 1,
                  mr: 1.5,
                }}
              >
                <PersonRoundedIcon sx={{ color: statusInfo.icon, fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 500, lineHeight: 1 }}>
                  INSTRUCTOR
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {classes.instructor?.name || "Not assigned"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Time */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme => alpha(theme.palette[statusInfo.color].main, 0.1),
                  borderRadius: 2,
                  p: 1,
                  mr: 1.5,
                }}
              >
                <AccessTimeRoundedIcon sx={{ color: statusInfo.icon, fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 500, lineHeight: 1 }}>
                  TIME
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {classes.schedule?.time || "Not set"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Location */}
          <Grid item xs={12}>
            <Tooltip title="Click to view on map" placement="top">
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  cursor: "pointer",
                  p: 1.5,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  backgroundColor: isHovered ? alpha(statusInfo.icon, 0.08) : "transparent",
                  border: `1px dashed ${alpha(statusInfo.icon, 0.3)}`,
                  "&:hover": {
                    backgroundColor: alpha(statusInfo.icon, 0.12),
                  },
                }}
                onClick={handleLocationClick}
              >
                <LocationOnRoundedIcon sx={{ color: statusInfo.icon, fontSize: 20, mr: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {classes.venue?.name || "Location not specified"}
                </Typography>
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
        
        {/* Action buttons */}
        {(userRole === "admin" || userRole === "lecturer") && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.3s ease",
            }}
          >
            <Tooltip title="Edit class">
              <IconButton
                size="small"
                onClick={handleModalOpen}
                sx={{ 
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  mr: 1,
                  "&:hover": {
                    backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete class">
              <IconButton
                size="small"
                onClick={() => onEventDeleted(classes?._id)}
                sx={{ 
                  backgroundColor: theme => alpha(theme.palette.error.main, 0.1),
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: theme => alpha(theme.palette.error.main, 0.2),
                  }
                }}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </CardContent>

      <UpdateCourseModal
        open={openModal}
        onClose={handleModalClose}
        classes={classes}
        instructors={instructors}
        fetchClasses={fetchClasses}
        venues={venues}
      />
    </Card>
  );
};

export default ClassCard;