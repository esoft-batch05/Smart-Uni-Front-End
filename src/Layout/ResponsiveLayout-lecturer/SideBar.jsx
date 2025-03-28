import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Folder as ProjectsIcon,
  Message as MessagesIcon,
  BarChart as AnalyticsIcon,
  Task as TasksIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearTokens } from "../../Reducers/authSlice";
import { showAlert } from "../../Utils/alertUtils";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MapIcon from '@mui/icons-material/Map';


// Define constants
const DRAWER_WIDTH = 200;
const COLLAPSED_WIDTH = 74;

// Styled components
const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
    boxSizing: "border-box",
    backgroundColor: "#ff8300",
    color: "white",
    borderRight: "none",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  marginLeft: 0,
  ...(open &&
    !isMobile && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: "bold",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.7)",
  padding: theme.spacing(1, 2),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

const ProfileSection = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  width: "100%",
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  color: "white",
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: "4px",
  margin: "4px 8px",
  backgroundColor: active ? "rgba(255, 255, 255, 0.2)" : "transparent",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}));

const StyledAppBar = styled(AppBar)(({ theme, open, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "white",
  color: "#333",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  display: isMobile ? "block" : "none",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const ImprovedLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  let user = useSelector((state) => state.user);
  const userRole = useSelector((state) => state.user?.role);

  // Update drawer state when screen size changes
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const dispatch = useDispatch();

  const logOut = async () => {
    try {
      dispatch(clearTokens({}));
      navigate("/login");
      showAlert("success", "Logout successful!");
    } catch (error) {
      showAlert("error", "Failed to logout!");
    }
  };

  // Navigation menu items
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: `/${userRole}-dashboard` },
    { text: "Events", icon: <EventIcon />, path: `/${userRole}-events` },
    { text: "Classes", icon: <SchoolIcon />, path: `/${userRole}-classes` },
    { text: "Library", icon: <LibraryBooksIcon />, path: `/${userRole}-library` },
    { text: "Resources", icon: <CameraAltIcon />, path: `/${userRole}-resources` },
  ];

  const shortcutsItems = [
    { text: "Map", icon: <MapIcon />, path: "/map" },
    { text: "Inbox", icon: <MessagesIcon />, path: `/${userRole}-message` },
    { text: "Shop", icon: <ShoppingCartIcon />, path: "/shop" },
    { text: "Settings", icon: <SettingsIcon />, path: `/${userRole}-settings` },
  ];

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  // Function to handle navigation when clicking on sidebar items
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Check if a menu item is active
  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path))
    );
  };

  // Drawer content
  const drawer = (
    <>
      <DrawerHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
          <Avatar
            sx={{ bgcolor: "white", color: "#ff8300", width: 30, height: 30 }}
          >
            U 
          </Avatar>
          {(open || isMobile) && (
            <Typography variant="h6" noWrap component="div">
              Smart UNI 
            </Typography>
          )}
        </Box>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </DrawerHeader>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              active={isActive(item.path) ? 1 : 0}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "white" }}>
                {item.icon}
              </ListItemIcon>
              {(open || isMobile) && <ListItemText primary={item.text} />}
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>

      {(open || isMobile) && <SectionTitle>SHORTCUTS</SectionTitle>}

      <List>
        {shortcutsItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              active={isActive(item.path) ? 1 : 0}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "white" }}>
                {item.icon}
              </ListItemIcon>
              {(open || isMobile) && <ListItemText primary={item.text} />}
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>

      <ProfileSection>
        {open || isMobile ? (
          <>
            <Avatar sx={{ width: 36, height: 36, mr: 2 }}>
              <Avatar
                sx={{ width: 36, height: 36 }}
                src={`http://localhost:5000/api/file/${user.profileImage}`}
              >
                {!user?.profileImage &&
                  user?.firstName?.split(" ")[0]?.charAt(0).toUpperCase()}
              </Avatar>
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                {user?.firstName?.split(" ")[0]?.charAt(0).toUpperCase() +
                  user?.firstName?.split(" ")[0]?.slice(1).toLowerCase()}
              </Typography>
              <Typography>
                {user?.role?.split(" ")[0]?.charAt(0).toUpperCase() +
                  user?.role?.split(" ")[0]?.slice(1).toLowerCase()}
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                logOut();
              }}
              sx={{ ml: "auto", color: "white" }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Avatar sx={{ width: 36, height: 36 }}>
              <Avatar
                sx={{ width: 36, height: 36 }}
                src={`http://localhost:5000/api/file/${user.profileImage}`}
              >
                {!user?.profileImage &&
                  user?.firstName?.split(" ")[0]?.charAt(0).toUpperCase()}
              </Avatar>
            </Avatar>
          </Box>
        )}
      </ProfileSection>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile app bar */}
      <StyledAppBar position="fixed" open={mobileOpen} isMobile={isMobile}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Smart UNI 
          </Typography>
        </Toolbar>
      </StyledAppBar>

      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { 
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              backgroundColor: "#ff8300",
              color: "white",
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <StyledDrawer
          variant="permanent"
          open={open}
        >
          {drawer}
        </StyledDrawer>
      )}

      <Main open={open} isMobile={isMobile}>
        {isMobile && <Box sx={{ height: theme.spacing(7) }} />}
        {<Outlet />}
      </Main>
    </Box>
  );
};

export default ImprovedLayout;