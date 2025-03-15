import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CourseModal = ({ open, onClose, handleSubmit }) => {
  const [course, setCourse] = useState({
    name: "",
    instructor: "",
    schedule: null,
    status: "Active",
  });

  const [instructors, setInstructors] = useState([
    { _id: "1", name: "John Doe" },
    { _id: "2", name: "Jane Smith" },
  ]);

  useEffect(() => {
    
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Course</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <TextField
              label="Course Name"
              variant="outlined"
              fullWidth
              size="small"
              name="name"
              value={course.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Instructor</InputLabel>
              <Select
                name="instructor"
                value={course.instructor}
                onChange={handleInputChange}
                label="Instructor"
              >
                {Array.isArray(instructors) && instructors.map((inst) => (
                  <MenuItem key={inst._id} value={inst._id}>
                    {inst.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Schedule"
                value={course.schedule}
                onChange={(newValue) => setCourse((prev) => ({ ...prev, schedule: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={course.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
        //   onClick={() => handleSubmit(course)}
          
          variant="contained"
          color="primary"
        >
          Create Course
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseModal;