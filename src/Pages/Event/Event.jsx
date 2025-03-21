import React, { useState, useEffect } from "react";
import EventCard from "../../Components/EventCard/EventCard";
import Image from "../../assets/Images/photo-1501281668745-f7f57925c3b4.jpeg";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { EventNote, Visibility } from "@mui/icons-material";
import { useSelector } from "react-redux";
import EventServices from "../../Services/EventService";
import { showLoading, hideLoading } from "../../Utils/loadingUtils";
import { showAlert } from "../../Utils/alertUtils";
import FileUpload from "../../Services/FileUploadService";
import { Email, Message, Chat, CheckCircle } from "@mui/icons-material";
import VenueServices from "../../Services/VenueService";
import MessageServices from "../../Services/MessageService";
import { sendEmail } from "../../Utils/emailUtils";

function Event() {
  const userRole = useSelector((state) => state.user?.role);
  const userEmail = useSelector((state) => state.user?.email);
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [venues, setVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openAttendeesModal, setOpenAttendeesModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    eventType: "",
    proposal: "",
    image: "",
    ticketPrice: "",
    location: "",
    venue: "",
    organizer: "",
    role: userRole,
  });

  const handleAttendeesClose = () => {
    setOpenAttendeesModal(false);
  };

  const handleAttendeesOpen = () => {
    setOpenAttendeesModal(true);
    pendingEvents();
  };

  const pendingEvents = async () => {
    showLoading("Fetching Events...");
    try {
      const response = await EventServices.pendingEvent();
      setAttendees(response?.data);
    } catch (error) {
      showAlert("error", "Something went wrong!");
    } finally {
      hideLoading();
    }
  };

  const handleApprove = async (id) => {
    showLoading("Event is Approving...");
    try {
      const response = await EventServices.approveEvent(id);
      showAlert("success", "Event is Approved!");
      pendingEvents();
      fetchEvents();
    } catch (error) {
      showAlert("error", "Something went wrong!");
    } finally {
      hideLoading();
    }
  };

  const handleViewProposal = async (id) => {
    const proposalUrl = `http://localhost:5000/api/file/${id}`;
    window.open(proposalUrl, "_blank");
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

  // const getEvents = async () => {
  //   showLoading("Fetching Events...");
  //   try {
  //     const response = await EventServices.getApprovedEvent();
  //     return response?.data;
  //   } catch (error) {
  //     showAlert("error", "Something went wrong!");
  //   } finally {
  //     hideLoading();
  //   }
  // };

  // useEffect(() => {
  //   const dummyData = [
  //     {
  //       title: "Music Festival 2025",
  //       date: "2025-03-25",
  //       time: "6:00 PM",
  //       venue: "Sunset Park",
  //       banner: Image,
  //       participants: [
  //         "https://via.placeholder.com/40?text=1",
  //         "https://via.placeholder.com/40?text=2",
  //         "https://via.placeholder.com/40?text=3",
  //         "https://via.placeholder.com/40?text=4",
  //       ],
  //       rating: 4.0,
  //       category: "Music",
  //     },
  //     {
  //       title: "Tech Conference 2025",
  //       date: "2025-04-15",
  //       time: "9:00 AM",
  //       venue: "Tech Hub",
  //       banner: Image,
  //       participants: [
  //         "https://via.placeholder.com/40?text=1",
  //         "https://via.placeholder.com/40?text=2",
  //         "https://via.placeholder.com/40?text=3",
  //         "https://via.placeholder.com/40?text=4",
  //       ],
  //       rating: 4.5,
  //       category: "Tech",
  //     },
  //     {
  //       title: "Art Exhibition 2025",
  //       date: "2025-05-10",
  //       time: "5:00 PM",
  //       venue: "Art Gallery",
  //       banner: Image,
  //       participants: [
  //         "https://via.placeholder.com/40?text=1",
  //         "https://via.placeholder.com/40?text=2",
  //         "https://via.placeholder.com/40?text=3",
  //         "https://via.placeholder.com/40?text=4",
  //       ],
  //       rating: 3.5,
  //       category: "Art",
  //     },
  //   ];

  //   const events = getEvents();
  //   console.log("event",events);

  //   setEvents(dummyData);
  // }, []);

  const handleFormSubmit = async () => {
    showLoading("Event is Creating...");
    try {
      const response = await EventServices.createEvent(newEvent);
      const eventStatus = response?.data?.status;
      const eventTitle = newEvent.name;

      if (eventStatus === "approved") {
        showAlert("success", "Event Created!");

        // Send email confirmation for approved event
        sendEmail({
          to: userEmail,
          subject: "🎉 Event Created Successfully - Approved",
          text: `Your event "${eventTitle}" has been approved and is now live!`,
          html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4; border-radius: 10px;">
            <div style="background-color: #28a745; color: white; text-align: center; padding: 15px; border-radius: 10px 10px 0 0;">
              <h2>🎉 Event Approved & Published</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 0 0 10px 10px;">
              <p>Dear User,</p>
              <p>Your event <strong>"${eventTitle}"</strong> has been successfully approved and is now live on our platform! 🎊</p>
              <h3 style="color: #28a745;">Event Details:</h3>
              <ul>
                <li>📅 <strong>Date:</strong> ${newEvent.date}</li>
                <li>⏰ <strong>Time:</strong> ${newEvent.date}</li>
                <li>📍 <strong>Venue:</strong> Smart Uni</li>
              </ul>
              <p>Feel free to share this event with your friends!</p>
              <p>Best Regards,<br><strong>Your Company Name</strong></p>
            </div>
          </div>
        `,
        });

        setOpenModal(false);
        setNewEvent({
          name: "",
          description: "",
          date: "",
          eventType: "",
          proposal: "",
          image: "",
          ticketPrice: "",
          location: "",
          venue: "",
          organizer: "",
          role: userRole,
        });
      } else if (eventStatus === "pending") {
        showAlert(
          "success",
          "Your event is under review and approval is pending. It will be approved within 24 hours after review."
        );

        // Send email for pending approval
        sendEmail({
          to: userEmail,
          subject: "📌 Event Submission Received - Pending Approval",
          text: `Your event "${eventTitle}" is under review and will be approved within 24 hours.`,
          html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4; border-radius: 10px;">
            <div style="background-color: #ffc107; color: white; text-align: center; padding: 15px; border-radius: 10px 10px 0 0;">
              <h2>📌 Event Submission Received</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 0 0 10px 10px;">
              <p>Dear User,</p>
              <p>We have received your event submission: <strong>"${eventTitle}"</strong>. Your event is currently under review and will be approved within the next 24 hours.</p>
              <p>Once approved, you will receive another confirmation email.</p>
              <p>Thank you for using our platform!</p>
              <p>Best Regards,<br><strong>Your Company Name</strong></p>
            </div>
          </div>
        `,
        });

        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      hideLoading();
    }
  };

  const fetchEvents = async () => {
    showLoading("Fetching Events...");
    try {
      const response = await EventServices.getApprovedEvent();
      console.log("event", response?.data);
      setEvents(response?.data);
    } catch (error) {
      showAlert("error", "Something went wrong!");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [openModal]);

  const handleEventDeleted = () => {
    fetchEvents();
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const sortEvents = (eventsToSort) => {
    if (selectedSort === "date") {
      return [...eventsToSort].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    } else if (selectedSort === "rating") {
      return [...eventsToSort].sort((a, b) => b.rating - a.rating);
    } else {
      return eventsToSort;
    }
  };

  const sortedEvents = sortEvents(filteredEvents);

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
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
        console.log("Updated newEvent (image):", updatedEvent); // Log updated event state
        return updatedEvent;
      });
    } catch (error) {
      console.error("Upload failed:", error);
      showAlert("error", "File too Large!");
    }
  };

  const handleProposalUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/file/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload proposal");

      const data = await response.json();
      console.log("Upload response:", data);

      setNewEvent((prev) => {
        const updatedEvent = { ...prev, proposal: data.data.filename };
        console.log("Updated newEvent (proposal):", updatedEvent); // Log updated event state
        return updatedEvent;
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search Event"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Tech">Tech</MenuItem>
              <MenuItem value="Art">Art</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Button
            variant="outlined"
            color="warning"
            sx={{
              marginRight: 1,
              "@media (max-width: 600px)": {
                fontSize: "0.8rem",
              },
            }}
            startIcon={<EventNote />}
            onClick={handleModalOpen}
          >
            {userRole === "admin" ? "Create New Event" : "Organize an Event"}
          </Button>
          {userRole === "admin" && (
            <Button
              variant="outlined"
              color="warning"
              onClick={handleAttendeesOpen}
              sx={{
                marginRight: 1,
                "@media (max-width: 600px)": {
                  fontSize: "0.8rem",
                },
              }}
              startIcon={<Visibility />}
            >
              View Submissions
            </Button>
          )}
        </Grid>
      </Grid>

      <Divider />

      <Grid container spacing={3} mt={3}>
        {sortedEvents.map((event, index) => (
          <Grid item xs={12} sm={6} md={12} key={index}>
            <EventCard
              event={event}
              venues={venues}
              onEventDeleted={handleEventDeleted}
            />
          </Grid>
        ))}
      </Grid>

      {/* Create Event Modal */}
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>
          {userRole === "admin" ? "Create New Event" : "Organize an Event"}
        </DialogTitle>
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

            {/* Upload Banner */}
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

            {/* Upload Project Proposal */}
            <Grid item xs={12}>
              <input
                accept=".pdf"
                type="file"
                id="upload-proposal"
                style={{ display: "none" }}
                onChange={handleProposalUpload}
              />
              <label htmlFor="upload-proposal">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  size="small"
                  color="secondary"
                >
                  Upload Project Proposal (PDF)
                </Button>
              </label>
              {newEvent.proposal && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {newEvent.proposal}
                </Typography>
              )}
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
            Create Event
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
          {attendees?.length > 0 ? (
            <List>
              {attendees.map((attendee) => (
                <ListItem key={attendee._id} divider>
                  <ListItemText
                    primary={attendee.name}
                    secondary={attendee.organizer}
                  />

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      startIcon={<CheckCircle fontSize="small" />}
                      onClick={() => handleApprove(attendee._id)}
                    >
                      Approve
                    </Button>

                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<Visibility fontSize="small" />}
                      onClick={() => handleViewProposal(attendee.proposal)}
                    >
                      View
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No Submissions yet.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAttendeesClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Event;
