import { get, post, remove } from "../app/apiManager";



class ResourceServices {

    static async createResource(data) {
        try {
            const response = await post('/resource/createResource', data);
            return response.data;

        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");

        }


    }
}


export default ResourceServices;
