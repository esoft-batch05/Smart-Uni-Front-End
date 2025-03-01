import { get, post } from "../app/apiManager";



class UserServices {
    static async userLogin(credentials) {
        try {
            const response = await post("/admin/login", credentials);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }

    static async getOrders() {
        try {
            const response = await get("/orders");
            
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
}

export default UserServices;
