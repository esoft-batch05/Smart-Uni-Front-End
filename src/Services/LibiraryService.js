import { get, post, remove } from "../app/apiManager";

class LibraryServices {
    static async addLibraryBook(data) {
        try {
            const response = await post('/library/addBook', data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");
        }
    }

    static async getAllLibraryBooks() {
        try {
            const response = await get('/library/getAllBooks');
            return response.data;
        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");
        }
    }

    static async deleteLibraryBook(id) {
        try {
            const response = await remove(`/library/deleteBook/${id}`);
            return response.data;
        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");
        }
    }

    static async updateLibraryBook(id, data) {
        try {
            const response = await post(`/library/updateBook/${id}`, data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");
        }
    }

    static async borrowLibraryBook(id, data) {
        try {
            const response = await post(`/library/borrowBook/${id}`, data);
            return response.data;
        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");
        }
    }

    static async getAllPendingLibraryBooks() {
        try {
            const response = await get(`/library/getAllPendingBooks`);
            return response.data;
        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");
        }
    }

    static async approveLibraryBook(bookId) {
        try {
            const response = await get(`/library/approveBook/${bookId}`);
            return response.data;
        } catch (error) {
            throw error?.response?.data || new Error("Something went wrong");
        }
    }
}

export default LibraryServices;
