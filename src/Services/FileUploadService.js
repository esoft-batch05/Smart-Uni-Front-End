import { get, post } from "../app/apiManager";



class FileUpload {


    static async upload(file) {
        console.log("file from upload", file);
        
        try {
            const response = await post("/file/upload", file);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }

    
    static async uploadFile(formData) {
        console.log("file from upload", formData);
        
        try {
            const response = await post("/file/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
    

}

export default FileUpload;
