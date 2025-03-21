import { get, post } from "../app/apiManager";



class FileUpload {


    static async upload(file) {
        try {
            const response = await post("/file/upload", file);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }


}

export default FileUpload;
