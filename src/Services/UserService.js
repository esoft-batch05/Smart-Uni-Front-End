import { get, post } from "../app/apiManager";



class UserServices {
    static async userLogin(credentials) {
        try {
            const response = await post("/user/login", credentials);
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

    static async userRegister(data) {
        try {
            const response = await post("/user/register",
                data
            );
            return response.data;
        } catch (e) {
            throw e.response ? e.response.data : e;
        }
    }
    static async getUserInfo(userId) {
        try {
            const response = await get(`/user/getUserInfo/${userId}`)
            return response.data;
        } catch (e) {
            throw e.response ? e.response.data : e;
        }
    }
    static async updateUser(userId, data) {
        try {
            const response = await post(`/user/updateUser/${userId}`, data)
            return response.data;
        } catch (e) {
            throw e.response ? e.response.data : e;
        }
    }
}

export default UserServices;
