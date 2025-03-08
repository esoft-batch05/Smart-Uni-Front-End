import { get, post, remove } from "../app/apiManager";



class EventServices {


    static async getOrders() {
        try {
            const response = await get("/orders");
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }

    static async createEvent(data) {
        try {
            const response = await post('/event/createEvent', data);
            return response.data; 
        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");
        }
    }
    static async getApprovedEvent(data) {
        try {
            const response = await get('/event/getAllEvents');
            return response.data; 
        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");
        }
    }

    static async deleteEvent(id){
        try{
            const response = await remove(`/event/deleteEvent/${id}`);
            return response.data; 
        } catch(error){
            throw error?.response?.data || new Error("Something went wrong");
        }
    }
    static async attendEvent(data){
        try{
            const response = await post(`/event/attendEvent`,data);
            return response.data; 
        } catch(error){
            throw error?.response?.data || new Error("Something went wrong");
        }
    }
    static async updateEvent(eventId,data){
        try{
            const response = await post(`/event/updateEvent/${eventId}`,data);
            return response.data; 
        } catch(error){
            throw error?.response?.data || new Error("Something went wrong");
        }
    }
    static async unAttendEvent(eventId,data){
        try{
            const response = await post(`/event/deAttendEvent/${eventId}`, data);
            return response.data; 
        } catch(error){
            throw error?.response?.data || new Error("Something went wrong");
        }
    }
    
}

export default EventServices;
