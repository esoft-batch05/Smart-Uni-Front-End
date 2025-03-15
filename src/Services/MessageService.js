import { get, post, remove } from "../app/apiManager";
import io from "socket.io-client";

class MessageServices {

  static async sendMessage(sender, data) {
    try {
      const response = await post(`/message/${sender}`, data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
  static async getConversation(sender) {
    try {
      const response = await get(`/message/conversations/${sender}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }


}

export default MessageServices;
