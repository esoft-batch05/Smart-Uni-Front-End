import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography, 
  TextField, 
  IconButton, 
  InputAdornment,
  Divider,
  Badge,
  Drawer,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  CssBaseline
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Send as SendIcon, 
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon
} from '@mui/icons-material';

// Sample user data
const USERS = [
  { id: 1, name: 'John Doe', avatar: 'https://mui.com/static/images/avatar/1.jpg', lastSeen: 'Online', unread: 3 },
  { id: 2, name: 'Jane Smith', avatar: 'https://mui.com/static/images/avatar/2.jpg', lastSeen: '10 min ago', unread: 0 },
  { id: 3, name: 'Mike Johnson', avatar: 'https://mui.com/static/images/avatar/3.jpg', lastSeen: '1 hour ago', unread: 5 },
  { id: 4, name: 'Lisa Rodriguez', avatar: 'https://mui.com/static/images/avatar/4.jpg', lastSeen: 'Yesterday', unread: 0 },
  { id: 5, name: 'David Kim', avatar: 'https://mui.com/static/images/avatar/5.jpg', lastSeen: 'Online', unread: 1 },
  { id: 6, name: 'Sarah Williams', avatar: 'https://mui.com/static/images/avatar/6.jpg', lastSeen: '3 days ago', unread: 0 },
  { id: 7, name: 'Robert Chen', avatar: 'https://mui.com/static/images/avatar/7.jpg', lastSeen: 'Online', unread: 0 },
  { id: 8, name: 'Emily Davis', avatar: 'https://mui.com/static/images/avatar/8.jpg', lastSeen: '2 hours ago', unread: 2 },
];

// Sample message data
const INITIAL_MESSAGES = {
  1: [
    { id: 1, sender: 1, text: 'Hey there!', time: '10:00 AM', isUser: false },
    { id: 2, sender: 'me', text: 'Hi John, how are you?', time: '10:02 AM', isUser: true },
    { id: 3, sender: 1, text: 'I\'m good, thanks for asking!', time: '10:05 AM', isUser: false },
    { id: 4, sender: 1, text: 'Do you have time to meet today?', time: '10:06 AM', isUser: false },
  ],
  3: [
    { id: 1, sender: 3, text: 'Have you seen the new project requirements?', time: '09:30 AM', isUser: false },
    { id: 2, sender: 'me', text: 'Not yet, can you share them?', time: '09:35 AM', isUser: true },
    { id: 3, sender: 3, text: 'Sure, I\'ll send them over in a minute.', time: '09:40 AM', isUser: false },
  ],
  5: [
    { id: 1, sender: 5, text: 'Meeting at 2pm today?', time: 'Yesterday', isUser: false },
    { id: 2, sender: 'me', text: 'Yes, I\'ll be there!', time: 'Yesterday', isUser: true },
  ]
};

// Component takes height and width props to fit within existing layout
const Message = ({ height = 820, width = '100%' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(USERS);

  // Handle drawer visibility based on screen size
  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(USERS);
      return;
    }

    const filtered = USERS.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery]);

  // Send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const newMsg = {
      id: messages[selectedUser.id] ? messages[selectedUser.id].length + 1 : 1,
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMsg]
    }));

    setNewMessage('');
    
    // Simulate response (for demo purposes only)
    setTimeout(() => {
      const response = {
        id: messages[selectedUser.id] ? messages[selectedUser.id].length + 2 : 2,
        sender: selectedUser.id,
        text: `This is an automated response from ${selectedUser.name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), response]
      }));
    }, 1000);
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // Render the chat area
  const renderChatArea = () => {
    if (!selectedUser) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            height: '100%', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'background.default',
            flexDirection: 'column',
            p: 3
          }}
        >
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            Select a conversation
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Choose a user from the list to start messaging
          </Typography>
        </Box>
      );
    }

    const userMessages = messages[selectedUser.id] || [];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Chat header */}
        <AppBar position="static" color="inherit" elevation={1}>
          <Toolbar>
            {isMobile && (
              <IconButton 
                edge="start" 
                sx={{ mr: 1 }} 
                onClick={() => setDrawerOpen(true)}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <ListItemAvatar>
              <Avatar src={selectedUser.avatar} alt={selectedUser.name} />
            </ListItemAvatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" component="div">
                {selectedUser.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser.lastSeen}
              </Typography>
            </Box>
            <IconButton><PhoneIcon /></IconButton>
            <IconButton><VideocamIcon /></IconButton>
            <IconButton><MoreVertIcon /></IconButton>
          </Toolbar>
        </AppBar>
        
        {/* Messages area */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2,
          bgcolor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {userMessages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.isUser ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  maxWidth: '70%',
                  bgcolor: message.isUser ? '#e3f2fd' : 'white',
                  borderRadius: 2
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {message.time}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
        
        {/* Message input */}
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <TextField
            fullWidth
            placeholder="Type a message"
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <AttachFileIcon />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    color="primary" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        display: 'flex', 
        height, 
        width,
        maxWidth: '100%',
        overflow: 'hidden',
        m: 0,
        mt:3
      }}
    >
      {/* Users list drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 320,
          flexShrink: 0,
          position: 'relative',
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
            position: 'absolute',
            height: '100%'
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Messages
          </Typography>
          <TextField
            fullWidth
            placeholder="Search users"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Divider />
        
        <List sx={{ overflow: 'auto', flexGrow: 1 }}>
          {filteredUsers.map((user) => (
            <React.Fragment key={user.id}>
              <ListItem 
                button 
                selected={selectedUser && selectedUser.id === user.id}
                onClick={() => handleUserSelect(user)}
              >
                <ListItemAvatar>
                  <Badge 
                    color="error" 
                    badgeContent={user.unread} 
                    invisible={user.unread === 0}
                  >
                    <Avatar src={user.avatar} alt={user.name} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText 
                  primary={user.name} 
                  secondary={
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      noWrap
                    >
                      {messages[user.id] && messages[user.id].length > 0 
                        ? messages[user.id][messages[user.id].length - 1].text
                        : "No messages yet"}
                    </Typography>
                  }
                />
                <Typography variant="caption" color="text.secondary">
                  {user.lastSeen === 'Online' 
                    ? <Box component="span" sx={{ color: 'success.main' }}>● Online</Box> 
                    : user.lastSeen}
                </Typography>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      
      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Mobile header */}
        {isMobile && !drawerOpen && (
          <AppBar position="static">
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Messages
              </Typography>
            </Toolbar>
          </AppBar>
        )}
        
        {renderChatArea()}
      </Box>
    </Paper>
  );
};



export default Message;