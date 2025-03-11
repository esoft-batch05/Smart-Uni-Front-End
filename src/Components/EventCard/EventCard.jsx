import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  AvatarGroup,
  Avatar,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItem,
  List,
  ListItemText,
  IconButton,
} from "@mui/material";
import { EventNote, Update, Delete } from "@mui/icons-material";
import { useSelector } from "react-redux"; // Import useSelector to access the Redux store
import EventServices from "../../Services/EventService";
import { hideLoading, showLoading } from "../../Utils/loadingUtils";
import { showAlert } from "../../Utils/alertUtils";
import { Email, Message, Chat } from "@mui/icons-material";
import VenueServices from "../../Services/VenueService";

const EventCard = ({ event, onEventDeleted }) => {
  const { name, date, venue, image, _id } = event;
  const userRole = useSelector((state) => state.user?.role);
  const userId = useSelector((state) => state.user?._id);

  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [venues, setVenues] = useState([]);
  const [participants, setParticipants] = useState([event?.attendees]);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [openAttendeesModal, setOpenAttendeesModal] = useState(false);

  const handleAttendeesClose = () => {
    setOpenAttendeesModal(false);
  };

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

  useEffect(() => {
    setParticipants(event?.attendees);
    console.log("hello", event?.attendees);
  }, [participants, onEventDeleted]);

  const handleAttendeesOpen = () => {
    setOpenAttendeesModal(true);
  };

  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const [newEvent, setNewEvent] = useState({
    name: event?.name,
    description: event?.description,
    date: formatDateTimeLocal(event?.date),
    eventType: event?.eventType,
    image: event?.image,
    ticketPrice: "",
    venue: event?.venue,
    organizer: event?.organizer,
    role: userRole,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteClick = (id) => {
    setEventToDelete(id);
    setOpenModal(true); // Open confirmation modal
  };

  const handleModalOpen = () => setOpenUpdateModal(true);
  const handleModalClose = () => setOpenUpdateModal(false);

  const isUserAttended = event.attendees.some(
    (attendee) => attendee._id === userId
  );

  const attend = {
    eventId: _id,
    userId: userId,
  };

  const deleteEvent = async () => {
    if (!eventToDelete) return; // Check if there's an event selected to delete
    showLoading("Event is Deleting...");
    try {
      const response = await EventServices.deleteEvent(eventToDelete);
      showAlert("success", "Event is Deleted!");
      onEventDeleted();
      setOpenModal(false); // Close modal after delete
    } catch (error) {
      showAlert("error", "Something went wrong!");
    } finally {
      hideLoading();
    }
  };

  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/file/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      console.log("Upload response:", data);

      setNewEvent((prev) => {
        const updatedEvent = { ...prev, image: data.data.filename };
        console.log("Updated newEvent:", updatedEvent); // Now correctly logs new state
        return updatedEvent;
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleFormSubmit = async () => {
    showLoading("Event is Updating...");
    try {
      const response = await EventServices.updateEvent(event?._id, newEvent);
      showAlert("success", "Event Updated!");
      onEventDeleted();
      setOpenUpdateModal(false);
    } catch (error) {
      showAlert("error", "Something went wrong!");
    } finally {
      hideLoading();
    }
  };

  const attendEvent = async (data) => {
    showLoading("Attending...");
    try {
      const response = await EventServices.attendEvent(data);
      showAlert("success", "Attended to Event!");
      onEventDeleted();
    } catch (error) {
      showAlert("error", "Something went wrong!");
    } finally {
      hideLoading();
    }
  };
  const unAttendEvent = async (eventId, userId) => {
    showLoading("Attending...");
    try {
      const response = await EventServices.unAttendEvent(eventId, userId);
      showAlert("success", "Unattended to Event!");
      onEventDeleted();
    } catch (error) {
      showAlert("error", "Something went wrong!");
    } finally {
      hideLoading();
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "100%",
        margin: "auto",
        boxShadow: 3,
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
        "@media (max-width: 600px)": {
          width: "100%",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={`http://localhost:5000/api/file/${image}`}
          alt={name}
          sx={{
            objectFit: "cover",
            "@media (max-width: 600px)": {
              height: "150px",
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), transparent)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600} color="white">
            {name}
          </Typography>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            alignItems: "center",
            gap: 1,
            "@media (max-width: 600px)": {
              position: "static",
              display: "flex",
              flexDirection: "initial",
              marginTop: 1,
              p: 1,
            },
          }}
        >
          <AvatarGroup max={4}>
            {participants.map((src, index) => (
              <Avatar
                onClick={() => {
                  console.log(participants[index]);
                }}
                key={index}
                src={`http://localhost:5000/api/file/${participants[index]?.profileImage}`}
              />
            ))}
          </AvatarGroup>
          <Rating value={4} precision={0.5} readOnly size="small" />
        </Box>
      </Box>

      <CardContent>
        <Typography variant="body1" color="text.secondary">
          Date:{" "}
          {new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Time:{" "}
          {new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Venue: {venue?.name}
        </Typography>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            // disabled={isUserAttended}
            startIcon={<EventNote />}
            onClick={() => {
              if (isUserAttended) {
                unAttendEvent(event._id, { userId: userId });
              } else {
                attendEvent(attend);
              }
            }}
            sx={{
              marginRight: 1,
              "@media (max-width: 600px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            {isUserAttended ? "Unattend" : "Attend"}
          </Button>
          {userRole === "admin" && (
            <>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Update />}
                onClick={handleModalOpen}
                sx={{
                  marginRight: 1,
                  "@media (max-width: 600px)": {
                    fontSize: "0.8rem",
                  },
                }}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Update />}
                onClick={handleAttendeesOpen}
                sx={{
                  marginRight: 1,
                  "@media (max-width: 600px)": {
                    fontSize: "0.8rem",
                  },
                }}
              >
                View Attendees
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteClick(_id)}
                startIcon={<Delete />}
                sx={{
                  "@media (max-width: 600px)": {
                    fontSize: "0.8rem",
                  },
                }}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </CardContent>

      <Dialog open={openUpdateModal} onClose={handleModalClose}>
        <DialogTitle>Update Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
              <TextField
                label="Event Name"
                variant="outlined"
                fullWidth
                size="small"
                name="name"
                value={newEvent.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                size="small"
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                type="datetime-local"
                fullWidth
                size="small"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={newEvent.eventType}
                  onChange={handleInputChange}
                  label="Event Type"
                  name="eventType"
                >
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="ticket">Ticket</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {newEvent.eventType === "ticket" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ticket Price (LKR)"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="ticketPrice"
                  value={newEvent.ticketPrice}
                  onChange={handleInputChange}
                  type="number"
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Venue</InputLabel>
                <Select
                  name="venue"
                  value={newEvent.venue?._id}
                  onChange={handleInputChange}
                  label="Venue"
                >
                  {venues.map((venue) => (
                    <MenuItem key={venue._id} value={venue._id}>
                      {venue.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <input
                accept="image/*"
                type="file"
                id="upload-banner"
                style={{ display: "none" }}
                onChange={handleBannerUpload}
              />
              <label htmlFor="upload-banner">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  size="small"
                  color="primary"
                >
                  Upload Banner
                </Button>
              </label>
              {newEvent.image && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {newEvent.image}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Organizer"
                variant="outlined"
                fullWidth
                size="small"
                name="organizer"
                value={newEvent.organizer}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleModalClose}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            color="primary"
          >
            Update Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL */}
      <Dialog
        open={openAttendeesModal}
        onClose={handleAttendeesClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Events Submissions List</DialogTitle>
        <DialogContent>
          {Array.isArray(participants) && participants.length > 0 ? (
            <List>
              {participants.flat().map((attendee) => (
                <ListItem key={attendee._id} divider>
                  <ListItemText
                    primary={attendee.name}
                    secondary={attendee.email}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => console.log(attendee.email)}
                  >
                    <Email />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => console.log(attendee._id)}
                  >
                    <Chat />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No participants yet.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAttendeesClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteEvent} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EventCard;
