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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Import the search icon


function Event() {
  const [events, setEvents] = useState([]); // State to store events
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category for filter
  const [selectedSort, setSelectedSort] = useState(""); // Selected sorting option


  useEffect(() => {
    // Simulating fetching data from an API
    const dummyData = [
      {
        title: "Music Festival 2025",
        date: "2025-03-25",
        time: "6:00 PM",
        venue: "Sunset Park",
        banner: Image,
        participants: [
          "https://via.placeholder.com/40?text=1",
          "https://via.placeholder.com/40?text=2",
          "https://via.placeholder.com/40?text=3",
          "https://via.placeholder.com/40?text=4",
        ],
        rating: 4.0,
        category: "Music",
        onAttend: () => alert("Attend clicked!"),
        onUpdate: () => alert("Update clicked!"),
        onDelete: () => alert("Delete clicked!"),
      },
      {
        title: "Tech Conference 2025",
        date: "2025-04-15",
        time: "9:00 AM",
        venue: "Tech Hub",
        banner: Image,
        participants: [
          "https://via.placeholder.com/40?text=1",
          "https://via.placeholder.com/40?text=2",
          "https://via.placeholder.com/40?text=3",
          "https://via.placeholder.com/40?text=4",
        ],
        rating: 4.5,
        category: "Tech",
        onAttend: () => alert("Attend clicked!"),
        onUpdate: () => alert("Update clicked!"),
        onDelete: () => alert("Delete clicked!"),
      },
      {
        title: "Art Exhibition 2025",
        date: "2025-05-10",
        time: "5:00 PM",
        venue: "Art Gallery",
        banner: Image,
        participants: [
          "https://via.placeholder.com/40?text=1",
          "https://via.placeholder.com/40?text=2",
          "https://via.placeholder.com/40?text=3",
          "https://via.placeholder.com/40?text=4",
        ],
        rating: 3.5,
        category: "Art",
        onAttend: () => alert("Attend clicked!"),
        onUpdate: () => alert("Update clicked!"),
        onDelete: () => alert("Delete clicked!"),
      },
    ];
    setEvents(dummyData);
  }, []);

  // Filter events based on the search query and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? event.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Sorting function based on selected option
  const sortEvents = (eventsToSort) => {
    if (selectedSort === "date") {
      return [...eventsToSort].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    } else if (selectedSort === "rating") {
      return [...eventsToSort].sort((a, b) => b.rating - a.rating); // Sort by rating (descending)
    } else {
      return eventsToSort;
    }
  };

  const sortedEvents = sortEvents(filteredEvents);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Filter and Search Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Search Field */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search Event"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            size="small" // Makes the text field smaller
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Category Filter */}
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

        {/* Sort By */}
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
      </Grid>

      <Divider />
      {/* Event Cards Section */}
      <Grid container spacing={3} mt={3}>
        {sortedEvents.map((event, index) => (
          <Grid item xs={12} sm={6} md={12} key={index}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Event;
