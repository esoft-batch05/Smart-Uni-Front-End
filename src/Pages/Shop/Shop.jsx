import React, { useState, useEffect } from 'react';
import CartPage from '../Cart/Cart';
import productService from '../../Services/ShopService'; 

const Shop = () => {
  // State variables
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Keep all products to filter locally
  const [categories, setCategories] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

  // Filter products when search term or category filter changes
  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, allProducts]);

  // Fetch all products once
  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getProducts('', '');
      setAllProducts(response.data || []);
      setProducts(response.data || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setIsLoading(false);
    }
  };

  // Filter products locally based on search and category
  const filterProducts = () => {
    if (!allProducts.length) return;

    let filtered = [...allProducts];

    // Apply category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(product => 
        product.category === categoryFilter
      );
    }

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.category.toLowerCase().includes(searchLower)
      );
    }

    setProducts(filtered);
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      // Add 'All' option to the beginning of categories list
      setCategories(['All', ...response]);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Keep the default 'All' category even if API fails
    }
  };

  // Handle search and filter
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  // Cart functions
  const addToCart = (product) => {
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // If product exists, update quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // If product doesn't exist, add it with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    alert(`${product.name} added to cart!`);
  };

  const buyNow = (product) => {
    // Add the product to cart and go to cart page
    addToCart(product);
    setShowCart(true);
  };

  // Navigation functions
  const navigateToCart = () => {
    setShowCart(true);
  };

  const navigateToShop = () => {
    setShowCart(false);
  };

  // Image skeleton loader component
  const ImageSkeleton = () => (
    <div className="placeholder-glow w-100" style={{ height: "192px" }}>
      <span className="placeholder w-100 h-100 rounded-top"></span>
    </div>
  );

  // Render cart page or shop page based on state
  if (showCart) {
    return <CartPage cart={cart} setCart={setCart} navigateToShop={navigateToShop} />;
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">University Merchandise Shop</h1>
      
      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-6 d-flex justify-content-md-end overflow-auto">
          <div className="btn-group">
            {categories.map(category => (
              <button
                key={category}
                className={`btn ${categoryFilter === category 
                  ? 'btn-primary' 
                  : 'btn-outline-secondary'}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="col">
              <div className="card h-100 shadow-sm">
                <ImageSkeleton />
                <div className="card-body">
                  <h5 className="placeholder-glow">
                    <span className="placeholder col-7"></span>
                  </h5>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-4"></span>
                  </p>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-3"></span>
                  </p>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-3 placeholder-glow">
                    <span className="placeholder col-5"></span>
                    <span className="placeholder col-5"></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Product Grid */
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
          {products.length > 0 ? (
            products.map(product => (
              <div key={product.id} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="position-relative" style={{ height: "192px" }}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "192px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/200/150'; // Fallback image
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted">{product.category}</p>
                    <p className="card-text text-primary fw-bold">${parseFloat(product.price).toFixed(2)}</p>
                    
                    <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-3">
                      <button 
                        className="btn btn-primary me-md-1 flex-fill"
                        onClick={() => buyNow(product)}
                      >
                        Buy Now
                      </button>
                      <button 
                        className="btn btn-outline-primary flex-fill"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4 text-muted">
              No products found matching your search.
            </div>
          )}
        </div>
      )}
      
      {/* Cart count indicator */}
      {cart.length > 0 && (
        <div 
          style={{ position: "fixed", bottom: "24px", right: "24px", cursor: "pointer" }}
          onClick={navigateToCart}
        >
          <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center shadow" 
               style={{ width: "60px", height: "60px", padding: "8px" }}>
            {cart.length} item{cart.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop; 