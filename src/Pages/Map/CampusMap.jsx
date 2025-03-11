import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  Tooltip,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import VenueServices from "../../Services/VenueService";
import { showAlert } from "../../Utils/alertUtils";
import { hideLoading, showLoading } from "../../Utils/loadingUtils";

const CampusMap = ({ events = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      showLoading("Fetching Events...");
      try {
        const response = await VenueServices.getAllVenue();
        setVenues(response?.data);
        return response?.data;
      } catch (error) {
        showAlert("error", "Something went wrong!");
      } finally {
        hideLoading();
      }
    };
    getEvents();
  }, []);

  // Example campus building data
  const buildings = [
    {
      _id: venues[0]?._id,
      id: "A1",
      name: venues[0]?.name,
      type: "lecture",
      x: 50,
      y: 90,
      width: 120,
      height: 50,
      color: "#e3f2fd",
    },
    {
      _id: venues[1]?._id,
      id: "A2",
      name: venues[1]?.name,
      type: "lecture",
      x: 220,
      y: 30,
      width: 100,
      height: 70,
      color: "#e8f5e9",
    },
    {
      _id: venues[2]?._id,
      id: "A3",
      name: venues[2]?.name,
      type: "lecture",
      x: 600,
      y: 160,
      width: 120,
      height: 60,
      color: "#fff3e0",
    },
    {
      _id: venues[3]?._id,
      id: "B1",
      name: venues[3]?.name,
      type: "lecture",
      x: 500,
      y: 250,
      width: 150,
      height: 80,
      color: "#f3e5f5",
    },
    {
      _id: venues[4]?._id,
      id: "B2",
      name: venues[4]?.name,
      type: "facility",
      x: 130,
      y: 150,
      width: 150,
      height: 90,
      color: "#e0f7fa",
    },
    {
      _id: venues[5]?._id,
      id: "C1",
      name: venues[5]?.name,
      type: "facility",
      x: 450,
      y: 120,
      width: 90,
      height: 50,
      color: "#fff8e1",
    },
    {
      _id: venues[6]?._id,
      id: "D1",
      name: venues[6]?.name,
      type: "facility",
      x: 820,
      y: 200,
      width: 200,
      height: 100,
      color: "#fce4ec",
    },
    {
      _id: venues[7]?._id,
      id: "C2",
      name: venues[7]?.name,
      type: "facility",
      x: 230,
      y: 300,
      width: 100,
      height: 60,
      color: "#e1bee7",
    },
    {
      _id: venues[8]?._id,
      id: "B3",
      name: venues[8]?.name,
      type: "facility",
      x: 370,
      y: 20,
      width: 150,
      height: 80,
      color: "#c8e6c9",
    },
    {
      _id: venues[9]?._id,
      id: "D2",
      name: venues[9]?.name,
      type: "facility",
      x: 300,
      y: 200,
      width: 80,
      height: 50,
      color: "#ffebee",
    },
    {
      _id: venues[10]?._id,
      id: "A4",
      name: venues[10]?.name,
      type: "facility",
      x: 600,
      y: 400,
      width: 110,
      height: 70,
      color: "#ffecb3",
    },
  ];

  // Find buildings with active events
  const buildingsWithEvents = events.map((event) => event.venue);
  

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.6));
  };

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
  };

  // Get events for a specific building
  const getBuildingEvents = (buildingId) => {
    return events.filter((event) => event.venue === buildingId);
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: "100%", overflow: "hidden" }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h5" component="h2">
                Campus Map
              </Typography>
              <Box>
                <IconButton onClick={handleZoomOut} size="small">
                  <ZoomOutIcon />
                </IconButton>
                <IconButton onClick={handleZoomIn} size="small">
                  <ZoomInIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                position: "relative",
                height: isMobile ? "350px" : "500px",
                overflow: "auto",
                background: "#f5f5f5",
                backgroundImage:
                  "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "400px",
                  height: "300px",
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "0 0",
                  transition: "transform 0.3s ease",
                }}
              >
                {buildings.map((building) => {
                  const hasEvent = buildingsWithEvents.includes(building._id);
                  
                  
                  return (
                    <Tooltip
                      key={building.id}
                      title={`${building.name} ${
                        hasEvent ? "(Has Events)" : ""
                      }`}
                      arrow
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: `${building.x}px`,
                          top: `${building.y}px`,
                          width: `${building.width}px`,
                          height: `${building.height}px`,
                          backgroundColor: building.color,
                          border: hasEvent
                            ? "3px solid #f44336"
                            : "1px solid #9e9e9e",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          boxShadow: hasEvent
                            ? "0 0 10px rgba(244, 67, 54, 0.5)"
                            : "none",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            zIndex: 10,
                          },
                        }}
                        onClick={() => handleBuildingClick(building)}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            textAlign: "center",
                            fontWeight: hasEvent ? "bold" : "normal",
                            fontSize: `${Math.max(
                              8,
                              (12 * Math.min(building.width, building.height)) /
                                50
                            )}px`,
                            padding: "2px",
                          }}
                        >
                          {building.name}
                          {hasEvent && (
                            <Box
                              display="flex"
                              justifyContent="center"
                              mt={0.5}
                            >
                              <EventIcon color="error" fontSize="small" />
                            </Box>
                            
                          )}
                        </Typography>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
              {selectedBuilding ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    {selectedBuilding.name}
                    <Chip
                      size="small"
                      label={selectedBuilding.type}
                      color={
                        selectedBuilding.type === "lecture"
                          ? "primary"
                          : "default"
                      }
                      sx={{ ml: 1 }}
                    />
                  </Typography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2">
                      Building ID: {selectedBuilding.id}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Events:
                  </Typography>

                  {getBuildingEvents(selectedBuilding._id).length > 0 ? (
                    getBuildingEvents(selectedBuilding._id).map(
                      (event, index) => (
                        <Card
                          key={index}
                          variant="outlined"
                          sx={{ mb: 1, bgcolor: "#fafafa" }}
                        >
                          <CardContent
                            sx={{ py: 1, "&:last-child": { pb: 1 } }}
                          >
                            <Typography variant="subtitle2" color="primary">
                              {event.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              display="block"
                              color="textSecondary"
                            >
                              {new Date(event.date).toLocaleDateString()} ,{" "}
                              {new Date(event.date).toLocaleTimeString()}
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {event.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      )
                    )
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No events scheduled for this location.
                    </Typography>
                  )}
                </>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <InfoIcon
                    color="action"
                    sx={{ fontSize: 40, mb: 2, opacity: 0.7 }}
                  />
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    align="center"
                  >
                    Select a building on the map to view details and events
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                size="small"
                icon={<EventIcon color="error" />}
                label="Active Events"
                variant="outlined"
              />
              <Chip
                size="small"
                style={{
                  backgroundColor: "#e3f2fd",
                  border: "1px solid #9e9e9e",
                }}
                label="Lecture Hall"
              />
              <Chip
                size="small"
                style={{
                  backgroundColor: "#f3e5f5",
                  border: "1px solid #9e9e9e",
                }}
                label="Facility"
              />
              <Chip
                size="small"
                style={{
                  backgroundColor: "#fce4ec",
                  border: "1px solid #9e9e9e",
                }}
                label="Admin"
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Example usage:

export default CampusMap;
