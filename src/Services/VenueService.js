import { get, post } from "../app/apiManager";



class VenueServices {

    static async getAllVenue() {
        try {
            const response = await get(`/venue/getVenue`)
            return response.data;
        } catch (e) {
            throw e.response ? e.response.data : e;
        }
    }
    
}

export default VenueServices;
