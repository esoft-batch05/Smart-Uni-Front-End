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
import { Search as SearchIcon, EventNote, Visibility } from "@mui/icons-material";
import { useSelector } from "react-redux";
import ResourceCard from "../../Components/ResourceCard/ResourceCard";
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

  const getResources = async () => {
    showLoading();
    try {
      const response = await ResourceServices.getAllResource();
      setResources(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    getResources();
  }, []);

  // Apply filtering logic
  const filteredResources = resources.filter((resource) => {
    return (
      (searchQuery === "" || resource.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === "" || resource.type === selectedCategory)
    );
  });

  // Apply sorting logic
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (!selectedSort) return 0;
    return a.type.localeCompare(b.type);
  });

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
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
              <MenuItem value="Lighting">Lighting</MenuItem>
              <MenuItem value="Audio">Audio</MenuItem>
              <MenuItem value="Visual">Visual</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
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
              <MenuItem value="type">Category</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} sm={12} md={6}>
          {userRole === "admin" && (
            <>
              <Button
                variant="outlined"
                color="warning"
                sx={{ marginRight: 1 }}
                startIcon={<EventNote />}
                onClick={handleModalOpen}
              >
                Create New Resource
              </Button>

              <Button
                variant="outlined"
                color="warning"
                sx={{ marginRight: 1 }}
                startIcon={<Visibility />}
              >
                Approve Resource Bookings
              </Button>
            </>
          )}
        </Grid>
      </Grid>
      <Divider />

      <Grid container spacing={3} mt={3}>
        {sortedResources.map((resource) => (
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
