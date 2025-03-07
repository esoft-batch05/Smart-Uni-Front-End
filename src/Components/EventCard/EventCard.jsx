import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box, AvatarGroup, Avatar, Rating } from "@mui/material";

const EventCard = ({ event }) => {
  const { title, date, time, venue, banner, participants, rating, onAttend, onUpdate, onDelete } = event;

  return (
    <Card sx={{ width: "100%", maxWidth: "100%", margin: "auto", boxShadow: 3, borderRadius: 2, position: "relative" }}>
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={banner}
          alt={title}
          sx={{ objectFit: "cover" }}
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
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <AvatarGroup max={4}>
            {participants.map((src, index) => (
              <Avatar key={index} src={src} />
            ))}
          </AvatarGroup>
          <Rating value={rating} precision={0.5} readOnly />
        </Box>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button variant="contained" color="primary" onClick={onAttend}>Attend</Button>
          <Button variant="outlined" color="warning" onClick={onUpdate}>Update</Button>
          <Button variant="outlined" color="error" onClick={onDelete}>Delete</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
