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
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  EventNote,
  Visibility,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import ResourceCard from "../../Components/ResourceCard/ResourceCard";
import CreateResourceModal from "../../Components/Create Resource/CreateResource";
import ResourceServices from "../../Services/ResourceService";
import { hideLoading, showLoading } from "../../Utils/loadingUtils";
import { CheckCircle } from "@mui/icons-material";
import dayjs from "dayjs";
import { showAlert } from "../../Utils/alertUtils";

function Resources() {
  const userRole = useSelector((state) => state.user?.role);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [resources, setResources] = useState([]);
  const [openAttendeesModal, setOpenAttendeesModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleAttendeesClose = () => {
    setOpenAttendeesModal(false);
  };

  const handleAttendeesOpen = () => {
    setOpenAttendeesModal(true);
  };

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
  const getAllPendingResources = async () => {
    showLoading();
    try {
      const response = await ResourceServices.getAllPendingResources();
      console.log("hello", response);

      setSubmissions(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    getResources();
    getAllPendingResources();
  }, []);

  const handleApprove = async (id) => {
    showLoading();
    try{
        const response = await ResourceServices.approveResource(id);
        showAlert('success', 'Approved Resource!');
        handleAttendeesClose();
    }catch(error){
        showAlert('error', 'something went wrong!');
    }finally{
        hideLoading();
    }
  }

  // Apply filtering logic
  const filteredResources = resources.filter((resource) => {
    return (
      (searchQuery === "" ||
        resource.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
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
                onClick={handleAttendeesOpen}
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

      <CreateResourceModal
        open={openModal}
        handleClose={handleModalClose}
        fetchList={getResources}
      />

      {/* Modal */}
      <Dialog
        open={openAttendeesModal}
        onClose={handleAttendeesClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Resource Submissions List</DialogTitle>
        <DialogContent>
          {submissions?.length > 0 ? (
            <List>
              {submissions.map((attendee) => (
                <ListItem key={attendee._id} divider>
                  <ListItemText
                    primary={attendee.name} // Who booked the resource
                    secondary={
                      <>
                        <Typography variant="body2">
                          <strong>Event:</strong> {attendee.event.name}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date:</strong>{" "}
                          {dayjs(attendee.eventDate).format("DD/MM/YYYY")}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Organizer:</strong> {attendee.bookedBy.name}
                        </Typography>
                      </>
                    }
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

export default Resources;
