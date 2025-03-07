import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box, AvatarGroup, Avatar, Rating } from "@mui/material";
import { EventNote, Update, Delete } from "@mui/icons-material";

const EventCard = ({ event }) => {
  const { title, date, time, venue, banner, participants, rating, onAttend, onUpdate, onDelete } = event;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "100%",
        margin: "auto",
        boxShadow: 3,
        borderRadius: 2,
        position: "relative",
        overflow: "hidden", // Ensures no content goes outside the card
        "@media (max-width: 600px)": {
          width: "100%", // Ensure full width on mobile
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={banner}
          alt={title}
          sx={{
            objectFit: "cover",
            "@media (max-width: 600px)": {
              height: "150px", // Adjust the image height for smaller screens
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
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), transparent)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600} color="white">
            {title}
          </Typography>
        </Box>

        {/* Positioning for attendees and rating on larger screens */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            alignItems: "center",
            gap: 1,
            "@media (max-width: 600px)": {
              position: "static", // Move them to the static position for mobile
              display: "flex",
              flexDirection: "initial", 
              marginTop: 1,
              p:1,
            },
          }}
        >
          <AvatarGroup max={4}>
            {participants.map((src, index) => (
              <Avatar key={index} src={src} />
            ))}
          </AvatarGroup>
          <Rating value={rating} precision={0.5} readOnly size="small" />
        </Box>
      </Box>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Date: {date}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Time: {time}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Venue: {venue}
        </Typography>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            onClick={onAttend}
            startIcon={<EventNote />}
            sx={{
              marginRight: 1,
              "@media (max-width: 600px)": {
                fontSize: "0.8rem", // Adjust font size on mobile
              },
            }}
          >
            Attend
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={onUpdate}
            startIcon={<Update />}
            sx={{
              marginRight: 1,
              "@media (max-width: 600px)": {
                fontSize: "0.8rem", // Adjust font size on mobile
              },
            }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={onUpdate}
            startIcon={<Update />}
            sx={{
              marginRight: 1,
              "@media (max-width: 600px)": {
                fontSize: "0.8rem", // Adjust font size on mobile
              },
            }}
          >
            View Attendes
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onDelete}
            startIcon={<Delete />}
            sx={{
              "@media (max-width: 600px)": {
                fontSize: "0.8rem", // Adjust font size on mobile
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
