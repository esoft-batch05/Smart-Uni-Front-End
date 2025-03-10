import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Tab,
  Tabs,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircle,
  PhotoCamera,
  Phone,
  Email,
  Home,
  Lock,
  Notifications,
  Save,
  Cancel,
} from "@mui/icons-material";
import UserServices from "../../Services/UserService";
import { useSelector } from "react-redux";

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SettingPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const userId = useSelector((state) => state.user?._id);

  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const [user, setUser] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  // Sample user data
  const [userData, setUserData] = useState({
    firstName: user?.firstName,
    lastName: "",
    email: user?.email,
    phone: user?.phone,
    alternatePhone: "",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    password: "",
    confirmPassword: "",
    bio: "",
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setUserData({
        ...userData,
        [parent]: {
          ...userData[parent],
          [child]: value,
        },
      });
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = (section) => {
    setSnackbar({
      open: true,
      message: `${section} settings saved successfully!`,
      severity: "success",
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getUserData = async () => {
    try {
      const response = await UserServices.getUserInfo(userId);
      setUser(response?.data);
      console.log(user);
      
      return response?.data;
    } catch (error) {}
  };

  useEffect(() => {
    getUserData();
  }, [userData]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: isSmallScreen ? 2 : 4, borderRadius: 2 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              src={profileImage}
              sx={{
                width: 150,
                height: 150,
                mb: 2,
                mx: "auto",
              }}
            />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="profile-image-input"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="profile-image-input">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCamera />}
                sx={{ mt: 1 }}
              >
                Change Photo
              </Button>
            </label>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              ml: isSmallScreen ? 0 : 4,
              mt: isSmallScreen ? 3 : 0,
            }}
          >
            <Typography variant="h4" gutterBottom>
              User Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your personal information and account preferences
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isSmallScreen ? "scrollable" : "fullWidth"}
              scrollButtons={isSmallScreen ? "auto" : false}
            >
              <Tab icon={<AccountCircle />} label="Profile" />
              <Tab icon={<Home />} label="Address" />
              <Tab icon={<Phone />} label="Contact" />
              <Tab icon={<Lock />} label="Security" />
              <Tab icon={<Notifications />} label="Notifications" />
            </Tabs>
          </Box>

          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={userData.bio}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button variant="outlined" startIcon={<Cancel />}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={() => handleSave("Profile")}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Address Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="address.street"
                  value={userData.address.street}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="address.city"
                  value={userData.address.city}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  name="address.state"
                  value={userData.address.state}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ZIP/Postal Code"
                  name="address.zipCode"
                  value={userData.address.zipCode}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="address.country"
                  value={userData.address.country}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button variant="outlined" startIcon={<Cancel />}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={() => handleSave("Address")}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Contact Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Primary Phone Number"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Alternate Phone Number (Optional)"
                  name="alternatePhone"
                  value={userData.alternatePhone}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button variant="outlined" startIcon={<Cancel />}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={() => handleSave("Contact")}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button variant="outlined" startIcon={<Cancel />}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={() => handleSave("Security")}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Customize your notification preferences here
            </Typography>

            {/* Placeholder for notification settings */}
            <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1, mb: 2 }}>
              <Typography variant="body2">
                This section is currently under development.
              </Typography>
            </Box>

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={() => handleSave("Notification")}
              >
                Save Preferences
              </Button>
            </Grid>
          </TabPanel>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingPage;
