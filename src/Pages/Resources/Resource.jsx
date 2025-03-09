import React, { useEffect, useState } from "react";
import {
  Divider,
  Box,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  EventNote,
  Visibility,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import ResourceCard from "../../Components/ResourceCard/ResourceCard";
import Image1 from "../../assets/Images/65fe64a89de64a706c0120dc-canon-eos-5d-mark-iv-dslr-camera-with.jpg";
import Image2 from "../../assets/Images/GVM-800D-RGB-LED-Studio-2-Video-Light-Kit-1.jpg";
import Image3 from "../../assets/Images/images.jpeg";
import CreateResourceModal from "../../Components/Create Resource/CreateResource";
import ResourceServices from "../../Services/ResourceService";
import { hideLoading, showLoading } from "../../Utils/loadingUtils";

function Resources() {
  const userRole = useSelector((state) => state.user?.role);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [resources, setResources] = useState([]);


  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const resourceTypes = [
    {
      id: 1,
      title: "Professional DSLR Camera",
      type: "Photography",
      image: Image1,
      stock: 12,
      available: true,
      rating: 4.8,
      description:
        "High-end DSLR camera with 4K video capability and multiple lens options.",
    },
    {
      id: 2,
      title: "LED Lighting Kit",
      type: "Lighting",
      image: Image2,
      stock: 8,
      available: true,
      rating: 4.5,
      description:
        "Professional lighting kit with adjustable brightness and color temperature.",
    },
    {
      id: 3,
      title: "Wireless Microphone Set",
      type: "Audio",
      image: Image3,
      stock: 0,
      available: false,
      rating: 4.7,
      description:
        "Lavalier and handheld wireless microphone set for clear audio recording.",
    },
    {
      id: 3,
      title: "Wireless Microphone Set",
      type: "Audio",
      image: Image3,
      stock: 0,
      available: false,
      rating: 4.7,
      description:
        "Lavalier and handheld wireless microphone set for clear audio recording.",
    },
  ];

  const getResources =async () => {
    showLoading();
    try{
        const response = await ResourceServices.getAllResource();
        setResources(response?.data);
    }catch(error){
        console.log(error);
        
    }finally{
        hideLoading();
    }
  }

  useEffect(()=>{
    getResources();
  },[])

  const handleAttendeesOpen = () => {
    // Open attendees logic
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Search Resource */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search Resource"
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

        {/* Category Select */}
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

        {/* Sort By Select */}
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

        {/* Action Buttons */}
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
            {userRole === "admin" ? "Create New Resource" : ""}
          </Button>

          {/* View Submissions Button for Admin */}
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
              Approve Resource Bookings
            </Button>
          )}
        </Grid>
      </Grid>
      <Divider />

      <Grid container spacing={3} mt={3}>
        {resources.map((resource) => (
          <Grid item xs={12} sm={6} md={3} key={resource.id}>
            <ResourceCard resource={resource} fetchList={getResources} />
          </Grid>
        ))}
      </Grid>

      <CreateResourceModal open={openModal} handleClose={handleModalClose} fetchList={getResources} />
    </Box>
  );
}

export default Resources;
