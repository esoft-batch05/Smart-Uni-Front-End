import { get, post, remove } from "../app/apiManager";



class EmailServices {



    static async sendEmail(data) {
        try {
            const response = await post(`/email/send`, data);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }



}

export default EmailServices;
