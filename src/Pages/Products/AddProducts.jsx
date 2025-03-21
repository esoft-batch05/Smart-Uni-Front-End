import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, Eye, X } from 'lucide-react';
import productService from '../../Services/ShopService';

const AdminShopPage = () => {
  // State variables
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    image: ''
  });

  // Fetch products on component mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter, currentPage]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getProducts(searchTerm, categoryFilter, currentPage, 5);
      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setIsLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Handlers
  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowViewModal(false);
    setCurrentProduct(null);
    setNewProduct({
      name: '',
      category: '',
      price: '',
      image: '/api/placeholder/200/150'
    });
  };

  const handleSubmitNewProduct = async (e) => {
    e.preventDefault();
    try {
      await productService.createProduct(newProduct);
      fetchProducts(); // Refresh products list
      handleCloseForm();
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Failed to create product');
    }
  };

  const handleEditProduct = async (product) => {
    try {
      const productDetails = await productService.getProductById(product._id);
      setCurrentProduct(productDetails);
      setNewProduct({ ...productDetails });
      setShowEditForm(true);
    } catch (err) {
      console.error('Error fetching product details:', err);
      alert('Failed to fetch product details');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await productService.updateProduct(currentProduct._id, newProduct);
      fetchProducts(); // Refresh products list
      handleCloseForm();
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product');
    }
  };

  const handleViewProduct = async (product) => {
    
    try {
      const productDetails = await productService.getProductById(product._id);
      setCurrentProduct(productDetails);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching product details:', err);
      alert('Failed to fetch product details');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts(); // Refresh products list
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("://localhost:5005/ahttppi/file/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to upload image");
  
      const data = await response.json();
      console.log("Upload response:", data);
  
      setNewProduct((prev) => {
        const updatedProduct = { 
          ...prev, 
          image: data.data.filename 
        };
        console.log("updatedProduct:", updatedProduct);
        return updatedProduct;
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Function to convert a file to Base64
  const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
      });
  };


  return (
    <div className="container-fluid py-4 bg-light">
      <h1 className="mb-4">Admin Shop Management</h1>
      
      {/* Search and filter row */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="d-flex">
            <div className="input-group me-2" style={{ maxWidth: '300px' }}>
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="form-select me-2"
              style={{ maxWidth: '200px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="col-md-4 text-md-end">
          <button
            className="btn btn-primary"
            onClick={handleAddProduct}
          >
            <Plus size={16} className="me-1" />
            Add Product
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Products table */}
          <div className="card mb-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map(product => (
                        <tr key={product.id}>
                          <td>
                            <img src={`http://localhost:5005/api/uploads/${product.image}`}  alt={product.name} className="img-thumbnail" style={{ maxWidth: '64px' }} />
                            
                          </td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleViewProduct(product)}
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleEditProduct(product)}
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteProduct(product._id)}
                                title="Delete"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-3">No products found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Product pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
      
      {/* Add Product Modal */}
      {showAddForm && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Product</h5>
                <button type="button" className="btn-close" onClick={handleCloseForm}></button>
              </div>
              
              <form onSubmit={handleSubmitNewProduct}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="productName"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="productCategory" className="form-label">Category</label>
                    <select
                      className="form-select"
                      id="productCategory"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="productPrice" className="form-label">Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="productPrice"
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="productImage" className="form-label">Product Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="productImage"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {newProduct.image && (
                      <div className="mt-2">
                        <img src={newProduct.image} alt="Product preview" className="img-thumbnail" style={{ maxHeight: '100px' }} />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {showEditForm && currentProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="btn-close" onClick={handleCloseForm}></button>
              </div>
              
              <form onSubmit={handleUpdateProduct}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="editProductName" className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editProductName"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="editProductCategory" className="form-label">Category</label>
                    <select
                      className="form-select"
                      id="editProductCategory"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="editProductPrice" className="form-label">Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="editProductPrice"
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="editProductImage" className="form-label">Product Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="editProductImage"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {newProduct.image && (
                      <div className="mt-2">
                        <img src={newProduct.image} alt="Product preview" className="img-thumbnail" style={{ maxHeight: '100px' }} />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* View Product Modal */}
      {showViewModal && currentProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product Details</h5>
                <button type="button" className="btn-close" onClick={handleCloseForm}></button>
              </div>
              
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-5 text-center mb-3 mb-md-0">
                    <img src={currentProduct.image} alt={currentProduct.name} className="img-fluid rounded" />
                  </div>
                  
                  <div className="col-md-7">
                    <h4>{currentProduct.name}</h4>
                    
                    <p className="mb-1">
                      <strong>ID:</strong> {currentProduct.id}
                    </p>
                    
                    <p className="mb-1">
                      <strong>Category:</strong> {currentProduct.category}
                    </p>
                    
                    <p className="mb-3">
                      <strong>Price:</strong> ${currentProduct.price.toFixed(2)}
                    </p>
                    
                    {currentProduct.description && (
                      <p className="mb-3">
                        <strong>Description:</strong> {currentProduct.description}
                      </p>
                    )}
                    
                    {currentProduct.createdAt && (
                      <p className="mb-1">
                        <strong>Created:</strong> {new Date(currentProduct.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    
                    {currentProduct.updatedAt && (
                      <p className="mb-1">
                        <strong>Last Updated:</strong> {new Date(currentProduct.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseForm}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success me-2"
                  onClick={() => {
                    handleCloseForm();
                    handleEditProduct(currentProduct);
                  }}
                >
                  <Edit size={16} className="me-1" /> Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    handleCloseForm();
                    handleDeleteProduct(currentProduct.id);
                  }}
                >
                  <Trash size={16} className="me-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShopPage;