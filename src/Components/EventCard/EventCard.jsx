import React, { useState } from "react";
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
} from "@mui/material";
import { EventNote, Update, Delete } from "@mui/icons-material";
import { useSelector } from "react-redux"; // Import useSelector to access the Redux store
import EventServices from "../../Services/EventService";
import { hideLoading, showLoading } from "../../Utils/loadingUtils";
import { showAlert } from "../../Utils/alertUtils";

const EventCard = ({ event, onEventDeleted }) => {
  const { name, date, location, image, _id } = event;
  const userRole = useSelector((state) => state.user?.role);

  // State to handle modal visibility
  const [openModal, setOpenModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null); // Track event to delete

  const handleDeleteClick = (id) => {
    setEventToDelete(id);
    setOpenModal(true); // Open confirmation modal
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
          {/* <AvatarGroup max={4}> */}
          {/* {participants.map((src, index) => ( */}
          {/* <Avatar key={index} src={src} /> */}
          {/* ))} */}
          {/* </AvatarGroup> */}
          {/* <Rating value={rating} precision={0.5} readOnly size="small" /> */}
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
          Venue: {location}
        </Typography>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            startIcon={<EventNote />}
            sx={{
              marginRight: 1,
              "@media (max-width: 600px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            Attend
          </Button>
          {userRole === "admin" && (
            <>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Update />}
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
