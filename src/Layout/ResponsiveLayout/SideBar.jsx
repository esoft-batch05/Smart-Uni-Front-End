import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
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
  useTheme
} from '@mui/material';
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
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// Define constants
const DRAWER_WIDTH = 200;
const COLLAPSED_WIDTH = 84;

// Styled components
const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: '#ff8300',
    color: 'white',
    borderRight: 'none',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.7)',
  padding: theme.spacing(1, 2),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

const ProfileSection = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  color: 'white',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: '4px',
  margin: '4px 8px',
  backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));



const ImprovedLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation menu items
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Projects', icon: <ProjectsIcon />, path: '/projects' },
    { text: 'Messages', icon: <MessagesIcon />, path: '/messages' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  ];

  const shortcutsItems = [
    { text: 'Tasks', icon: <TasksIcon />, path: '/tasks' },
    { text: 'Help', icon: <HelpIcon />, path: '/help' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Function to handle navigation when clicking on sidebar items
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  // Drawer content
  const drawer = (
    <>
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
          <Avatar sx={{ bgcolor: 'white', color: '#ff8300', width: 30, height: 30 }}>A</Avatar>
          {open && (
            <Typography variant="h6" noWrap component="div">
              Aqumex
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton 
              active={isActive(item.path) ? 1 : 0}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
      
      {open && <SectionTitle>SHORTCUTS</SectionTitle>}
      
      <List>
        {shortcutsItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton 
              active={isActive(item.path) ? 1 : 0}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>

      <ProfileSection>
        {open ? (
          <>
            <Avatar sx={{ width: 36, height: 36, mr: 2 }}>JD</Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                John Doe
              </Typography>
              <Typography variant="caption">
                Admin
              </Typography>
            </Box>
            <IconButton sx={{ ml: 'auto', color: 'white' }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Avatar sx={{ width: 36, height: 36 }}>JD</Avatar>
          </Box>
        )}
      </ProfileSection>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
      >
        {drawer}
      </StyledDrawer>
      
      <Main open={open}>
        {<Outlet />}
      </Main>
    </Box>
  );
};

export default ImprovedLayout;