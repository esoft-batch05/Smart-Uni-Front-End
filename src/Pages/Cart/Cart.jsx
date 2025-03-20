import React, { useState } from 'react';

const CartPage = ({ cart = [], setCart, navigateToShop }) => {
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA'
  });

  // Calculate cart totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // Assuming 8% tax
  const shipping = subtotal > 100 ? 0 : 12.99; // Free shipping for orders over $100
  const total = subtotal + tax + shipping;

  // Handle quantity changes
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
  };

  // Handle billing address changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value
    });
  };

  // Handle checkout
  const handleCheckout = (e) => {
    e.preventDefault();
    alert('Proceeding to payment...');
    // In a real application, this would proceed to payment processing
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-5">
          <h3>Your cart is empty</h3>
          <p className="mb-4">Looks like you haven't added any items to your cart yet.</p>
          <button className="btn btn-primary" onClick={navigateToShop}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="row">
          {/* Billing Address Form - Left Side */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Billing Address</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="firstName" 
                        name="firstName"
                        value={billingAddress.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="lastName" 
                        name="lastName"
                        value={billingAddress.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      name="email"
                      value={billingAddress.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="address" 
                      name="address"
                      value={billingAddress.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="city" className="form-label">City</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="city" 
                        name="city"
                        value={billingAddress.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="state" className="form-label">State</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="state" 
                        name="state"
                        value={billingAddress.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="zip" className="form-label">ZIP</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="zip" 
                        name="zip"
                        value={billingAddress.zip}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <select 
                      className="form-select" 
                      id="country" 
                      name="country"
                      value={billingAddress.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Cart Summary - Right Side */}
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {cart.map(item => (
                    <li key={item.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="me-3"
                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                          />
                          <div>
                            <h6 className="mb-0">{item.name}</h6>
                            <p className="text-muted small mb-0">{item.category}</p>
                            <p className="text-primary mb-0">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="input-group input-group-sm" style={{ width: "100px" }}>
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input 
                              type="text" 
                              className="form-control text-center" 
                              value={item.quantity}
                              readOnly
                            />
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button 
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => removeItem(item.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold fs-5">${total.toFixed(2)}</span>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={handleCheckout}
                  >
                    Proceed to Payment
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={navigateToShop}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;