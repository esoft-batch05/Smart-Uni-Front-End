import { get, post, remove } from "../app/apiManager";
import io from "socket.io-client";

class MessageServices {
  constructor() {
    this.socket = null;
    this.callbacks = {
      onNewMessage: null,
      onUserTyping: null,
      onUserStoppedTyping: null,
      onMessageRead: null,
      onOnlineUsers: null,
      onError: null
    };
  }

  // Initialize socket connection
  initializeSocket() {
    const BASE_URL = "http://localhost:5000";
    
    // Close existing connection if any
    if (this.socket) {
      this.socket.disconnect();
    }

    // Create new connection
    this.socket = io(BASE_URL);

    // Set up event listeners
    this.socket.on("connect", () => {
      console.log("Socket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("newMessage", (data) => {
      if (this.callbacks.onNewMessage) {
        this.callbacks.onNewMessage(data);
      }
    });

    this.socket.on("userTyping", (data) => {
      if (this.callbacks.onUserTyping) {
        this.callbacks.onUserTyping(data);
      }
    });

    this.socket.on("userStoppedTyping", (data) => {
      if (this.callbacks.onUserStoppedTyping) {
        this.callbacks.onUserStoppedTyping(data);
      }
    });

    this.socket.on("messageRead", (messageId) => {
      if (this.callbacks.onMessageRead) {
        this.callbacks.onMessageRead(messageId);
      }
    });

    this.socket.on("onlineUsers", (userIds) => {
      if (this.callbacks.onOnlineUsers) {
        this.callbacks.onOnlineUsers(userIds);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      if (this.callbacks.onError) {
        this.callbacks.onError("Connection error. Please try again.");
      }
    });

    this.socket.on("messageError", (error) => {
      if (this.callbacks.onError) {
        this.callbacks.onError(error.message);
      }
    });
  }

  // Disconnect socket
  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Set callback functions
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // API: Get all conversations
  static async getConversations(userId) {
    try {
      const response = await get(`/messages/conversations/${userId}`);
      return response.data;
    } catch (error) {
      throw error?.response?.data || new Error("Failed to fetch conversations");
    }
  }

  // API: Get messages between current user and another user
  static async getMessages(userId) {
    try {
      const response = await get(`/messages/${userId}`);
      return response.data;
    } catch (error) {
      throw error?.response?.data || new Error("Failed to fetch messages");
    }
  }

  // API: Send a message (REST API fallback)
  static async sendMessage(recipientId, content) {
    try {
      const response = await post("/messages", { recipientId, content });
      return response.data;
    } catch (error) {
      throw error?.response?.data || new Error("Failed to send message");
    }
  }

  // API: Delete a message
  static async deleteMessage(messageId) {
    try {
      const response = await remove(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw error?.response?.data || new Error("Failed to delete message");
    }
  }

  // Socket: Send a message
  sendMessageSocket(recipientId, content) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      // Set up one-time event listeners for this message
      const onMessageSent = (message) => {
        this.socket.off("messageSent", onMessageSent);
        this.socket.off("messageError", onMessageError);
        resolve(message);
      };

      const onMessageError = (error) => {
        this.socket.off("messageSent", onMessageSent);
        this.socket.off("messageError", onMessageError);
        reject(error);
      };

      // Listen for response
      this.socket.once("messageSent", onMessageSent);
      this.socket.once("messageError", onMessageError);

      // Send the message
      this.socket.emit("sendMessage", { recipientId, content });
    });
  }

  // Socket: Notify typing status
  sendTypingStatus(recipientId, isTyping = true) {
    if (!this.socket || !this.socket.connected) return;
    
    const event = isTyping ? "typing" : "stopTyping";
    this.socket.emit(event, { recipientId });
  }

  // Socket: Mark message as read
  markMessageAsRead(messageId) {
    if (!this.socket || !this.socket.connected) return;
    this.socket.emit("markAsRead", messageId);
  }
}

export default MessageServices;
