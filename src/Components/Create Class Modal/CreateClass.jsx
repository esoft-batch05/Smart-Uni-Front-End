import React, { useState } from "react";
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
import ClassServices from "../../Services/ClassService";
import { showAlert } from "../../Utils/alertUtils";
import dayjs from "dayjs";
import { hideLoading, showLoading } from "../../Utils/loadingUtils";
import { useSelector } from "react-redux";

const CourseModal = ({ open, onClose, fetchClasses, instructors }) => {
  const userRole = useSelector((state) => state.user?.role);
  const [course, setCourse] = useState({
    name: "",
    instructor: "",
    schedule: { day: "", time: "" },
    status: "Active",
  });
  
  // Add a separate state to track the selected date/time
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const handleSubmit = () => {
    createClass(course);
    fetchClasses();
  };

  const handleScheduleChange = (newValue) => {
    if (newValue) {
      // Store the selected date/time
      setSelectedDateTime(newValue);
      
      const formattedDay = dayjs(newValue).format("dddd"); // Get full day name (e.g., "Friday")
      const formattedTime = dayjs(newValue).format("hh:mm A"); // Get time in 12-hour format

      setCourse((prev) => ({
        ...prev,
        schedule: {
          day: formattedDay,
          time: `${formattedTime} - ${dayjs(newValue)
            .add(2, "hour")
            .format("hh:mm A")}`, // Example: "2:00 PM - 4:00 PM"
        },
      }));
    } else {
      // Handle clearing the date
      setSelectedDateTime(null);
      setCourse((prev) => ({
        ...prev,
        schedule: { day: "", time: "" },
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const createClass = async (data) => {
    showLoading();
    try {
      const response = await ClassServices.createClass(data);
      showAlert("success", "Class Created!");
    } catch (error) {
      showAlert("error", "something went wrong!");
      console.error(error);
    } finally {
      hideLoading();
      onClose();
      // Reset form state
      setCourse({
        name: "",
        instructor: "",
        schedule: { day: "", time: "" },
        status: "Active",
      });
      setSelectedDateTime(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Class</DialogTitle>
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
                {Array.isArray(instructors) &&
                  instructors.map((inst) => (
                    <MenuItem key={inst._id} value={inst._id}>
                      {inst.firstName} {inst.lastName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Schedule"
                value={selectedDateTime}
                onChange={handleScheduleChange}
                slotProps={{ 
                  textField: { 
                    fullWidth: true, 
                    size: "small",
                    helperText: course.schedule.day && course.schedule.time ? 
                      `${course.schedule.day}, ${course.schedule.time}` : 
                      "Select date and time"
                  } 
                }}
              />
            </LocalizationProvider>
          </Grid>
          {(userRole === "admin" || userRole === "lecturer") && (
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
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit(course)}
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