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
    static async getAllResource(data) {
        try {
            const response = await get('/resource/getAllResources');
            return response.data;

        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");

        }


    }
    static async deleteResource(id) {
        try {
            const response = await remove(`/resource/deleteResource/${id}`);
            return response.data;

        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");

        }


    }
    static async updateResource(id, data) {
        try {
            const response = await post(`/resource/updateResource/${id}`, data);
            return response.data;

        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");

        }


    }
    static async bookResource(id, data) {
        try {
            const response = await post(`/resource/bookaResource/${id}`, data);
            return response.data;

        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");

        }


    }
    static async getAllPendingResources() {
        try {
            const response = await get(`/resource/getAllPendingResources`);
            return response.data;

        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");

        }


    }
    static async approveResource(resourceId) {
        try {
            const response = await get(`resource/approveResource/${resourceId}`);
            return response.data;

        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");

        }


    }


}


export default ResourceServices;
