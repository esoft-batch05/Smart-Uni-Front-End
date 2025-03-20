import React, { useState, useEffect } from 'react';
import CartPage from '../Cart/Cart';

const Shop = () => {
  // Sample products data
  const initialProducts = [
    { id: 1, name: 'University T-Shirt', category: 'Clothing', price: 24.99, image: '/api/placeholder/200/150' },
    { id: 2, name: 'University Hoodie', category: 'Clothing', price: 49.99, image: '/api/placeholder/200/150' },
    { id: 3, name: 'University Wristband', category: 'Accessories', price: 5.99, image: '/api/placeholder/200/150' },
    { id: 4, name: 'University Cap', category: 'Clothing', price: 19.99, image: '/api/placeholder/200/150' },
    { id: 5, name: 'University Notebook', category: 'Stationery', price: 12.99, image: '/api/placeholder/200/150' },
    { id: 6, name: 'University Pen', category: 'Stationery', price: 3.99, image: '/api/placeholder/200/150' },
    { id: 7, name: 'University Mug', category: 'Accessories', price: 15.99, image: '/api/placeholder/200/150' },
    { id: 8, name: 'University Lanyard', category: 'Accessories', price: 7.99, image: '/api/placeholder/200/150' },
  ];

  // State variables
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [cart, setCart] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [showCart, setShowCart] = useState(false); // New state to control page display

  // List of unique categories
  const categories = ['All', ...new Set(initialProducts.map(product => product.category))];

  // Simulate image loading
  useEffect(() => {
    // Initial state: all images are loading
    const loadingState = {};
    initialProducts.forEach(product => {
      loadingState[product.id] = false;
    });
    
    // Simulate random loading times
    initialProducts.forEach(product => {
      const loadTime = Math.random() * 2000 + 500; // Random time between 500ms and 2500ms
      setTimeout(() => {
        setImagesLoaded(prev => ({
          ...prev,
          [product.id]: true
        }));
      }, loadTime);
    });
    
    setImagesLoaded(loadingState);
  }, []);

  // Handle search and filter
  const handleSearch = (term) => {
    setSearchTerm(term);
    filterProducts(term, categoryFilter);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (term, category) => {
    let filteredProducts = initialProducts;
    
    // Filter by search term
    if (term) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Filter by category
    if (category !== 'All') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === category
      );
    }
    
    setProducts(filteredProducts);
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
      
      {/* Product Grid - Using Bootstrap's row and col system for 4 cards per row */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="position-relative" style={{ height: "192px" }}>
                  {!imagesLoaded[product.id] ? (
                    <ImageSkeleton />
                  ) : (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "192px", objectFit: "cover" }}
                    />
                  )}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.category}</p>
                  <p className="card-text text-primary fw-bold">${product.price.toFixed(2)}</p>
                  
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
      
      {/* Cart count indicator - now clickable to navigate to cart */}
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