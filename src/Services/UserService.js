import { apiMethods } from "../app/apiManager";
const credentials = {
    email: 'kavishkasahandj@gmail.com',
    password: 'Sahan@1234',
}

class UserServices {
    static async userLogin(credentials) {
        try {
            const response = await apiMethods.post("/admin/login", credentials);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }

    static async getOrders() {
        try {
            const response = await apiMethods.get("/orders");
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
}

export default UserServices;
