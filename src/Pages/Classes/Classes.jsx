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
import CreateClass from "../../Components/Create Class Modal/CreateClass";
import ClassCard from "../../Components/Class Card/ClassCard";
import ClassServices from "../../Services/ClassService";
import UserServices from "../../Services/UserService";

function Classes() {
  const userRole = useSelector((state) => state.user?.role);
  const [classes, setClasses] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [venues, setVenues] = useState([]);
  const [lecturers, setLecturers] = useState([]);
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
    showLoading("Fetching classes...");
    try {
      const response = await EventServices.pendingEvent();
      setAttendees(response?.data);
    } catch (error) {
      showAlert("error", "Something went wrong!");
    } finally {
      hideLoading();
    }
  };

  const getInstructors = async () => {
    try {
      const response = await UserServices.getLecturer();
      setLecturers(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInstructors();
  }, []);

  const handleViewProposal = async (id) => {
    const proposalUrl = `http://localhost:5000/api/file/${id}`;
    window.open(proposalUrl, "_blank");
  };

  useEffect(() => {
    const getEvents = async () => {
      showLoading("Fetching classes...");
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

  const fetchClasses = async () => {
    showLoading("Fetching classes...");
    try {
      const response = await ClassServices.getClasses();
      console.log("event", response?.data);
      setClasses(response?.data);
    } catch (error) {
      showAlert("error", "Something went wrong!");
      console.log(error);
    } finally {
      hideLoading();
    }
  };

  const handleEventDeleted = (id) => {
    deleteClasses(id);
  };

  const deleteClasses = async (id) => {
    showLoading("Fetching classes...");
    try {
      const response = await ClassServices.deleteClasses(id);
      showAlert("success", "Class Deleted!");
    } catch (error) {
      showAlert("error", "Something went wrong!");
      console.log(error);
    } finally {
      hideLoading();
      fetchClasses();
    }
  };

  const filteredClasses = classes.filter((event) => {
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

  const sortedClasses = sortEvents(filteredClasses);

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    fetchClasses();
  }, [openModal]);

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
          {(userRole === "admin" || userRole === "lecturer") && (
            <Button
              variant="outlined"
              color="warning"
              onClick={handleModalOpen}
              sx={{
                marginRight: 1,
                "@media (max-width: 600px)": {
                  fontSize: "0.8rem",
                },
              }}
              startIcon={<EventNote />}
            >
              Create New Class
            </Button>
          )}
        </Grid>
      </Grid>

      <Divider />

      <Grid container spacing={3} mt={3}>
        {sortedClasses.map((classes, index) => (
          <Grid item xs={12} sm={6} md={12} key={index}>
            <ClassCard
              venues={venues}
              fetchClasses={fetchClasses}
              instructors={lecturers}
              classes={classes}
              onEventDeleted={handleEventDeleted}
            />
          </Grid>
        ))}
      </Grid>

      {/* Create Event Modal */}
      <CreateClass
        venues={venues}
        fetchClasses={fetchClasses}
        instructors={lecturers}
        open={openModal}
        onClose={handleModalClose}
        fetch={fetchClasses}
      />
    </Box>
  );
}

export default Classes;
