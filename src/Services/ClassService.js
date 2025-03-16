import { get, post, remove } from "../app/apiManager";



class ClassServices {


    static async getClasses() {
        try {
            const response = await get("/class/getClasses");
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }

    static async deleteClasses(id) {
        try {
            const response = await remove(`/class/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
    static async createClass(data) {
        try {
            const response = await post(`/class/createClass`, data);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
    static async updateClass(id,data) {
        try {
            const response = await post(`/class/updateClass/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }

    
    
}

export default ClassServices;
