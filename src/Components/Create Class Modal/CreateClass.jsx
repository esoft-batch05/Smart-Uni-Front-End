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
import VenueService from "../../Services/VenueService";
import { showAlert } from "../../Utils/alertUtils";
import dayjs from "dayjs";
import { hideLoading, showLoading } from "../../Utils/loadingUtils";
import { useSelector } from "react-redux";
import { sendEmail } from "../../Utils/emailUtils";

const CourseModal = ({ open, onClose, fetchClasses, instructors, venues }) => {
  const userRole = useSelector((state) => state.user?.role);
  const userEmail = useSelector((state) => state.user?.email);
  const [course, setCourse] = useState({
    name: "",
    instructor: "",
    venue: "",
    schedule: { day: "", time: "" },
    status: "Active",
  });
  
  const [selectedDateTime, setSelectedDateTime] = useState(null);



  const handleScheduleChange = (newValue) => {
    if (newValue) {
      setSelectedDateTime(newValue);
      const formattedDay = dayjs(newValue).format("dddd");
      const formattedTime = dayjs(newValue).format("hh:mm A");
      setCourse((prev) => ({
        ...prev,
        schedule: {
          day: formattedDay,
          time: `${formattedTime} - ${dayjs(newValue).add(2, "hour").format("hh:mm A")}`,
        },
      }));
    } else {
      setSelectedDateTime(null);
      setCourse((prev) => ({ ...prev, schedule: { day: "", time: "" } }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const createClass = async (data) => {
    showLoading();
    try {
      const res = await ClassServices.createClass(data);
      showAlert("success", "Class Created!");
      fetchClasses();
      console.log(data);
      onClose();
  
      const classTitle = res?.data?.name;
  
      // Email content
      const emailContent = {
        subject: "📚 New Class Created!",
        text: `A new class "${classTitle}" has been created.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4; border-radius: 10px;">
            <div style="background-color: #007bff; color: white; text-align: center; padding: 15px; border-radius: 10px 10px 0 0;">
              <h2>📚 New Class Created!</h2>
            </div>
            <div style="background: white; padding: 20px; border-radius: 0 0 10px 10px;">
              <p>Dear Instructor and Students,</p>
              <p>A new class titled <strong>"${classTitle}"</strong> has been successfully created.</p>
              <h3 style="color: #007bff;">Class Details:</h3>
              <ul>
                <li>📖 <strong>Course:</strong> ${classTitle}</li>
                <li>👨‍🏫 <strong>Instructor:</strong> ${data.instructor}</li>
                <li>📍 <strong>Venue:</strong> ${data.venue}</li>
                <li>📅 <strong>Day:</strong> ${data.schedule.day}</li>
                <li>⏰ <strong>Time:</strong> ${data.schedule.time}</li>
              </ul>
              <p>Please be prepared for your first session. 🚀</p>
              <p>Best Regards,<br><strong>Your Institution</strong></p>
            </div>
          </div>
        `,
      };
  
      // Send email to instructor
      sendEmail({ to: userEmail, ...emailContent });
  
    
  
    } catch (error) {
      showAlert("error", "Something went wrong!");
      console.error(error);
    } finally {
      hideLoading();
      
      setCourse({ name: "", instructor: "", venue: "", schedule: { day: "", time: "" }, status: "Active" });
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
              <Select name="instructor" value={course.instructor} onChange={handleInputChange} label="Instructor">
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
            <FormControl fullWidth size="small">
              <InputLabel>Venue</InputLabel>
              <Select name="venue" value={course.venue} onChange={handleInputChange} label="Venue">
                {Array.isArray(venues) &&
                  venues.map((venue) => (
                    <MenuItem key={venue._id} value={venue._id}>
                      {venue.name}
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
                    helperText: course.schedule.day && course.schedule.time ? `${course.schedule.day}, ${course.schedule.time}` : "Select date and time",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          {(userRole === "admin" || userRole === "lecturer") && (
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select name="status" value={course.status} onChange={handleInputChange} label="Status">
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
        <Button onClick={() => createClass(course)} variant="contained" color="primary">
          Create Course
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseModal;
