import React, { useState, useEffect } from "react";
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
  CssBaseline,
} from "@mui/material";
import {
  Search as SearchIcon,
  Send as SendIcon,
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon,
} from "@mui/icons-material";
import UserServices from "../../Services/UserService";
import MessageServices from "../../Services/MessageService";
import { useSelector } from "react-redux";

// Component takes height and width props to fit within existing layout
const MessageApp = ({ height = 800, width = "100%" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const currentUser = useSelector((state) => state.user?._id);

  // Handle drawer visibility based on screen size
  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  // Get all conversations for the current user
  const getConversations = async (user) => {
    try {
      const response = await MessageServices.getConversation(user);
      if (Array.isArray(response)) {
        setConversations(response);
        
        // Update user list with conversation data
        updateUsersWithConversations(response);
      } else {
        console.error("Expected array of conversations but got:", response);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Update the user list with conversation data
  const updateUsersWithConversations = (conversationData) => {
    setUsers(prevUsers => {
      const updatedUsers = [...prevUsers];
      
      // Add unread message counts and last messages to user objects
      conversationData.forEach(conv => {
        const userIndex = updatedUsers.findIndex(user => user.id === conv.user._id);
        if (userIndex !== -1) {
          updatedUsers[userIndex].lastMessage = conv.lastMessage;
          // You could add unread count logic here if that data becomes available
        }
      });
      
      return updatedUsers;
    });
  };

  // Load initial data
  useEffect(() => {
      
      getConversations(selectedUser?.id);
      getAllUsers();
   
  }, [selectedUser]);

  // Get all users
  const getAllUsers = async () => {
    try {
      const response = await UserServices.getAllUsers();
      const userData = response?.data?.data;

      if (userData && Array.isArray(userData)) {
        // Map API users to expected format
        const formattedUsers = userData.map((user) => ({
          id: user._id, // Use MongoDB _id as unique ID
          name: `${user.firstName} ${user.lastName}`, // Ensure the name field is correctly formatted
          avatar: user.profileImage
            ? `http://localhost:5000/api/file/${user.profileImage}`
            : "https://mui.com/static/images/avatar/1.jpg",
          unread: 0,
        }));

        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } else {
        console.error("Invalid user data format:", userData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) =>
      user.name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // When a user is selected, load their messages
  useEffect(() => {
    if (selectedUser) {
      // Find the conversation for this user
      const userConversation = conversations.find(
        conv => conv.user?._id === selectedUser.id
      );
      
      if (userConversation && userConversation.lastMessage) {
        // For now, we only have the last message. In a real app, you would
        // load the full message history for this conversation
        setCurrentMessages(conversations);
      } else {
        setCurrentMessages([]);
      }
    }
  }, [selectedUser, conversations]);

  // Send a new message
  const sendMessage = async (recipientId, data) => {
    try {
      const response = await MessageServices.sendMessage(recipientId, data);
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    // Prepare message data for API
    const messageData = {
      recipientId: selectedUser.id,
      senderId: currentUser,
      content: newMessage,
    };

    // Create a new message object for UI
    const newMsg = {
      _id: Date.now().toString(), // Temporary ID until we get response
      sender: currentUser,
      recipient: selectedUser.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Add to current messages immediately for responsive UI
    setCurrentMessages(prev => [...prev, newMsg]);
    
    // Send to API
    const response = await sendMessage(selectedUser.id, messageData);
    
    // If successful, update the message with server data
    if (response) {
      // You could update the message ID or other properties here
      // For now we'll just refresh conversations
      getConversations(selectedUser?.id);
      console.log("heloo",selectedUser)

    }

    setNewMessage("");
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
     getConversations(selectedUser?.id);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // Format timestamp for display
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render the chat area
  const renderChatArea = () => {
    if (!selectedUser) {
      return (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            flexDirection: "column",
            p: 3,
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

    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
              <Typography variant="caption" color="text.secondary">
                {selectedUser.lastSeen}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Messages area */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 2,
            bgcolor: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {currentMessages.map((message) => (
            <Box
            onClick={()=>{console.log(currentMessages)}} 
              key={message._id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: message?.user?._id === currentUser ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  bgcolor: message?.user?._id  === currentUser ? "#e3f2fd" : "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1">{message?.lastMessage?.content}</Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {formatTime(message?.lastMessage?.timestamp)}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>

        {/* Message input */}
        <Box sx={{ p: 2, bgcolor: "background.paper" }}>
          <TextField
            fullWidth
            placeholder="Type a message"
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            InputProps={{
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
        display: "flex",
        height,
        width,
        maxWidth: "100%",
        overflow: "hidden",
        m: 0,
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
          position: "relative",
          "& .MuiDrawer-paper": {
            width: 320,
            boxSizing: "border-box",
            position: "absolute",
            height: "100%",
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

        <List sx={{ overflow: "auto", flexGrow: 1 }}>
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
                  secondary={user.lastMessage?.content || "No messages yet"}
                />
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
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
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

export default MessageApp;