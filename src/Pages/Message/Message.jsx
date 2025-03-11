import React, { useState, useEffect, useRef } from "react";
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
  Snackbar,
  Alert,
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
import MessageServices from "../../Services/MessageService";
import { useSelector } from "react-redux";

// Component takes height and width props to fit within existing layout
const Message = ({ height = 820, width = "100%" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const messageEndRef = useRef(null);
  const typingTimeouts = useRef({});
  const messageServices = useRef(new MessageServices());

  const userId = useSelector((state) => state.user?._id);

  // Initialize socket and fetch conversations on component mount
  useEffect(() => {
    const initializeMessageSystem = async () => {
      try {
        messageServices.current.initializeSocket();

        // Set up socket event callbacks
        messageServices.current.setCallbacks({
          onNewMessage: handleNewMessage,
          onUserTyping: handleUserTyping,
          onUserStoppedTyping: handleUserStoppedTyping,
          onMessageRead: handleMessageRead,
          onOnlineUsers: handleOnlineUsers,
          onError: handleError,
        });

        // Fetch conversations
        await fetchConversations();
      } catch (error) {
        setError("Failed to initialize message system");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMessageSystem();

    // Clean up on component unmount
    return () => {
      messageServices.current.disconnectSocket();
    };
  }, []);

  // Handle drawer visibility based on screen size
  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredConversations(conversations);
      return;
    }

    const filtered = conversations.filter((convo) =>
      convo.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch user conversations
  const fetchConversations = async () => {
    try {
      const data = await MessageServices.getConversations(userId);
      setConversations(data);
      
      setFilteredConversations(data);
    } catch (error) {
      setError("Failed to fetch conversations");
      console.error(error);
    }
  };

  // Fetch messages for a specific user
  const fetchMessages = async (userId) => {
    try {
      const data = await MessageServices.getMessages(userId);
      setMessages((prev) => ({
        ...prev,
        [userId]: data,
      }));
    } catch (error) {
      setError("Failed to fetch messages");
      console.error(error);
    }
  };

  // Socket event handlers
  const handleNewMessage = (data) => {
    const { message, sender } = data;

    // Update messages if conversation is active
    setMessages((prev) => {
      const userId = sender._id;
      const currentMessages = prev[userId] || [];
      return {
        ...prev,
        [userId]: [...currentMessages, message],
      };
    });

    // Update conversation list with new message
    updateConversationWithMessage(data);

    // Mark message as read if conversation is active
    if (selectedUser && selectedUser._id === sender._id) {
      messageServices.current.markMessageAsRead(message._id);
    }
  };

  const handleUserTyping = (data) => {
    const { userId, username } = data;

    // Clear existing timeout if any
    if (typingTimeouts.current[userId]) {
      clearTimeout(typingTimeouts.current[userId]);
    }

    // Set typing status
    setTypingUsers((prev) => ({
      ...prev,
      [userId]: username,
    }));

    // Clear typing status after 3 seconds of inactivity
    typingTimeouts.current[userId] = setTimeout(() => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }, 3000);
  };

  const handleUserStoppedTyping = (data) => {
    const { userId } = data;

    // Clear timeout if any
    if (typingTimeouts.current[userId]) {
      clearTimeout(typingTimeouts.current[userId]);
      delete typingTimeouts.current[userId];
    }

    // Remove typing status
    setTypingUsers((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  const handleMessageRead = (messageId) => {
    // Update message read status
    setMessages((prev) => {
      const updatedMessages = { ...prev };

      // Find and update the message
      Object.keys(updatedMessages).forEach((userId) => {
        updatedMessages[userId] = updatedMessages[userId].map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        );
      });

      return updatedMessages;
    });
  };

  const handleOnlineUsers = (userIds) => {
    setOnlineUsers(userIds);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  // Update conversation list with new message
  const updateConversationWithMessage = (data) => {
    const { message, sender } = data;

    setConversations((prev) => {
      // Find if conversation exists
      const existingIndex = prev.findIndex(
        (conv) => conv.user._id === sender._id
      );

      if (existingIndex >= 0) {
        // Update existing conversation
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          lastMessage: message,
          unreadCount:
            selectedUser && selectedUser._id === sender._id
              ? 0
              : updated[existingIndex].unreadCount + 1,
        };

        // Move to top of list
        const [conv] = updated.splice(existingIndex, 1);
        updated.unshift(conv);

        return updated;
      } else {
        // Add new conversation
        return [
          {
            user: sender,
            lastMessage: message,
            unreadCount: 1,
          },
          ...prev,
        ];
      }
    });
  };

  // Handle user selection
  const handleUserSelect = (conversation) => {
    const user = conversation.user;
    setSelectedUser(user);

    // Fetch messages if not already loaded
    if (!messages[user._id]) {
      fetchMessages(user._id);
    }

    // Mark unread messages as read
    if (conversation.unreadCount > 0) {
      // Update unread count in conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.user._id === user._id ? { ...conv, unreadCount: 0 } : conv
        )
      );

      // Mark messages as read in backend
      const userMessages = messages[user._id] || [];
      userMessages
        .filter((msg) => !msg.read && msg.sender === user._id)
        .forEach((msg) => {
          messageServices.current.markMessageAsRead(msg._id);
        });
    }

    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      // Start sending animation/indicator if needed

      // Send message via socket
      const sentMessage = await messageServices.current.sendMessageSocket(
        selectedUser._id,
        newMessage.trim()
      );

      // Update local state
      setMessages((prev) => ({
        ...prev,
        [selectedUser._id]: [...(prev[selectedUser._id] || []), sentMessage],
      }));

      // Update conversation list
      updateLocalConversation(selectedUser._id, sentMessage);

      // Clear input
      setNewMessage("");
    } catch (error) {
      setError("Failed to send message. Try again.");
      console.error(error);
    }
  };

  // Update local conversation list with sent message
  const updateLocalConversation = (userId, message) => {
    setConversations((prev) => {
      // Find if conversation exists
      const existingIndex = prev.findIndex((conv) => conv.user._id === userId);

      if (existingIndex >= 0) {
        // Update existing conversation
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          lastMessage: message,
        };

        // Move to top of list
        const [conv] = updated.splice(existingIndex, 1);
        updated.unshift(conv);

        return updated;
      } else {
        // Should not happen normally but handle just in case
        return [
          {
            user: selectedUser,
            lastMessage: message,
            unreadCount: 0,
          },
          ...prev,
        ];
      }
    });
  };

  // Handle message typing
  const handleMessageTyping = (e) => {
    setNewMessage(e.target.value);

    if (selectedUser) {
      messageServices.current.sendTypingStatus(selectedUser._id, true);
    }
  };

  // Handle message input blur
  const handleMessageBlur = () => {
    if (selectedUser) {
      messageServices.current.sendTypingStatus(selectedUser._id, false);
    }
  };

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  // Format timestamp
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
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

    const userMessages = messages[selectedUser._id] || [];
    const isTyping = typingUsers[selectedUser._id];

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
              <Avatar src={selectedUser.avatar} alt={selectedUser.username} />
            </ListItemAvatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" component="div">
                {selectedUser.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isUserOnline(selectedUser._id) ? (
                  <Box component="span" sx={{ color: "success.main" }}>
                    ● Online
                  </Box>
                ) : (
                  "Offline"
                )}
              </Typography>
            </Box>
            <IconButton>
              <PhoneIcon />
            </IconButton>
            <IconButton>
              <VideocamIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
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
          {userMessages.map((message) => (
            <Box
              key={message._id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  message.sender !== selectedUser._id
                    ? "flex-end"
                    : "flex-start",
                mb: 2,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  bgcolor:
                    message.sender !== selectedUser._id ? "#e3f2fd" : "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {formatMessageTime(message.timestamp)}
                  </Typography>
                  {message.sender !== selectedUser._id && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 2 }}
                    >
                      {message.read ? "✓✓" : "✓"}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Paper
                elevation={1}
                sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(0,0,0,0.05)" }}
              >
                <Typography variant="body2" color="text.secondary">
                  {isTyping} is typing...
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messageEndRef} />
        </Box>

        {/* Message input */}
        <Box sx={{ p: 2, bgcolor: "background.paper" }}>
          <TextField
            fullWidth
            placeholder="Type a message"
            variant="outlined"
            value={newMessage}
            onChange={handleMessageTyping}
            onBlur={handleMessageBlur}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
        display: "flex",
        height,
        width,
        maxWidth: "100%",
        overflow: "hidden",
        m: 0,
        mt: 3,
      }}
    >
      {/* Error message */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

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
          {isLoading ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography>Loading conversations...</Typography>
            </Box>
          ) : filteredConversations.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography>No conversations found</Typography>
            </Box>
          ) : (
            filteredConversations.map((conversation) => (
              <React.Fragment key={conversation.user._id}>
                <ListItem
                  button
                  selected={
                    selectedUser && selectedUser._id === conversation.user._id
                  }
                  onClick={() => handleUserSelect(conversation)}
                >
                  <ListItemAvatar>
                    <Badge
                      color="error"
                      badgeContent={conversation.unreadCount}
                      invisible={conversation.unreadCount === 0}
                    >
                      <Avatar
                        src={conversation.user.avatar}
                        alt={conversation.user.username}
                      />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conversation.user.username}
                    secondary={
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {conversation.lastMessage
                          ? conversation.lastMessage.content
                          : "No messages yet"}
                      </Typography>
                    }
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {conversation.lastMessage
                        ? formatMessageTime(conversation.lastMessage.timestamp)
                        : ""}
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                      {isUserOnline(conversation.user._id) ? (
                        <Box component="span" sx={{ color: "success.main" }}>
                          ● Online
                        </Box>
                      ) : (
                        ""
                      )}
                    </Typography>
                  </Box>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
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

export default Message;
