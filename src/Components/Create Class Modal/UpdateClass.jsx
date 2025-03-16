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
import ClassServices from "../../Services/ClassService";
import { showAlert } from "../../Utils/alertUtils";
import dayjs from "dayjs";
import { hideLoading, showLoading } from "../../Utils/loadingUtils";
import { useSelector } from "react-redux";

const UpdateCourseModal = ({
  open,
  onClose,
  fetchClasses,
  instructors,
  classes,
}) => {
  const userRole = useSelector((state) => state.user?.role);
  // Parse the initial schedule time or use current date/time as fallback
  const parseInitialDateTime = () => {
    if (classes?.schedule?.day && classes?.schedule?.time) {
      // Extract just the start time from the time range (e.g. "02:00 PM - 04:00 PM" → "02:00 PM")
      const startTime = classes.schedule.time.split('-')[0].trim();
      // Combine day and time and parse with dayjs
      const dateTimeStr = `${classes.schedule.day} ${startTime}`;
      return dayjs(dateTimeStr, "dddd hh:mm A");
    }
    return dayjs(); // Default to current date/time
  };

  const [dateTimeValue, setDateTimeValue] = useState(parseInitialDateTime());

  const [course, setCourse] = useState({
    name: classes.name || "",
    instructor: classes.instructor?._id || "",
    schedule: { 
      day: classes?.schedule?.day || "", 
      time: classes?.schedule?.time || "" 
    },
    status: classes.status || "Active",
  });

  const handleSubmit = () => {
    console.log("Updated course:", classes);
     createClass(classes?._id, course);
    // fetchClasses();
  };

  const handleScheduleChange = (newValue) => {
    if (newValue) {
      setDateTimeValue(newValue);
      
      const formattedDay = newValue.format("dddd"); // Get day (e.g., "Friday")
      const formattedTime = newValue.format("hh:mm A"); // Get time (e.g., "2:00 PM")
      
      setCourse((prev) => ({
        ...prev,
        schedule: {
          day: formattedDay,
          time: `${formattedTime} - ${newValue.add(2, "hour").format("hh:mm A")}`,
        },
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const createClass = async (id, data) => {
    showLoading();
    try {
      const response = await ClassServices.updateClass(id,data);
      showAlert("success", "Class Updated!");
      fetchClasses();
    } catch (error) {
      showAlert("error", "something went wrong!");
      console.error(error);
    } finally {
      hideLoading();
      onClose();
      setCourse({
        name: "",
        instructor: "",
        schedule: { day: "", time: "" },
        status: "Active",
      });
      setDateTimeValue(dayjs());
      
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Course</DialogTitle>
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
                value={dateTimeValue}
                onChange={handleScheduleChange}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
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
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          Update Course
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCourseModal;