import { get, post, put, remove } from "../app/apiManager";

const ShopServices = {
  // Get all products with optional filters
  getProducts: async (searchTerm = '', category = '', page = 1, limit = 5) => {
    try {
      const response = await get('/shop/products', {
        params: {
          search: searchTerm,
          category,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single product by ID
  getProductById: async (id) => {
    try {
      const response = await get(`/shop/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new product
  createProduct: async (productData) => {
    try {
      const response = await post('/shop/products', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an existing product
  updateProduct: async (id, productData) => {
    try {
      const response = await put(`/shop/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    try {
      const response = await remove(`/shop/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all product categories
  getCategories: async () => {
    try {
      const response = await get('/shop/products/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload product image
  uploadProductImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await post('/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default ShopServices;