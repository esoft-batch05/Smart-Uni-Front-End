import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import OrderService from '../../Services/orderService'; // Import OrderService

const CartPage = ({ cart = [], setCart, navigateToShop }) => {
  const userId = useSelector((state) => state.user._id);
  
  // Set up loading state
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);

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

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvc: ''
  });
  const [errors, setErrors] = useState({});

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

  // Handle payment details changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    // Validate input based on field type
    if (name === 'cardNumber') {
      // Allow only numbers and limit to 16 digits
      const cleanValue = value.replace(/\D/g, '').slice(0, 16);
      setPaymentDetails({
        ...paymentDetails,
        cardNumber: cleanValue
      });
    } else if (name === 'expiry') {
      // Format as MM/YY
      const cleanValue = value.replace(/\D/g, '').slice(0, 4);
      if (cleanValue.length > 2) {
        setPaymentDetails({
          ...paymentDetails,
          expiry: cleanValue.slice(0, 2) + '/' + cleanValue.slice(2)
        });
      } else {
        setPaymentDetails({
          ...paymentDetails,
          expiry: cleanValue
        });
      }
    } else if (name === 'cvc') {
      // Allow only numbers and limit to 3-4 digits
      const cleanValue = value.replace(/\D/g, '').slice(0, 4);
      setPaymentDetails({
        ...paymentDetails,
        cvc: cleanValue
      });
    } else {
      setPaymentDetails({
        ...paymentDetails,
        [name]: value
      });
    }
  };

  // Handle checkout
  const handleCheckout = (e) => {
    e.preventDefault();
    setShowPaymentModal(true);
  };

  // Validate payment form
  const validatePaymentForm = () => {
    const newErrors = {};

    // Validate card number (16 digits)
    if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    // Validate card holder
    if (!paymentDetails.cardHolder.trim()) {
      newErrors.cardHolder = 'Cardholder name is required';
    }

    // Validate expiry (MM/YY format)
    if (!paymentDetails.expiry || !/^\d{2}\/\d{2}$/.test(paymentDetails.expiry)) {
      newErrors.expiry = 'Valid MM/YY format required';
    } else {
      const [month, year] = paymentDetails.expiry.split('/');
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiry = 'Invalid month';
      }

      const currentYear = new Date().getFullYear() % 100;
      if (parseInt(year) < currentYear) {
        newErrors.expiry = 'Card has expired';
      }
    }

    // Validate CVC (3-4 digits)
    if (!paymentDetails.cvc || paymentDetails.cvc.length < 3) {
      newErrors.cvc = 'CVC must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate billing address
  const validateBillingAddress = () => {
    // In a real application, you would validate all fields
    return (
      billingAddress.firstName.trim() !== '' &&
      billingAddress.lastName.trim() !== '' &&
      billingAddress.email.trim() !== '' &&
      billingAddress.address.trim() !== '' &&
      billingAddress.city.trim() !== '' &&
      billingAddress.state.trim() !== '' &&
      billingAddress.zip.trim() !== ''
    );
  };

  // Handle payment submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    if (validatePaymentForm() && validateBillingAddress()) {
      // Create complete order object with all details
      const orderData = createOrderObject();

      // Save order to database
      saveOrderToDatabase(orderData);

      // Clear cart and close modal
      setShowPaymentModal(false);
      setCart([]);
    } else if (!validateBillingAddress()) {
      alert('Please complete all billing address fields before proceeding.');
      setShowPaymentModal(false);
    }
  };

  // Create a complete order object with all details
  const createOrderObject = () => {
    // Generate a unique order ID (in a real app, your backend would do this)
    const orderId = 'ORD-' + Date.now();

    // Create an order timestamp
    const orderDate = new Date().toISOString();

    // Create a sanitized version of payment details (never store full card number in your database)
    const sanitizedPaymentDetails = {
      cardType: getCardType(paymentDetails.cardNumber),
      lastFourDigits: paymentDetails.cardNumber.slice(-4),
      cardHolder: paymentDetails.cardHolder,
      expiryMonth: paymentDetails.expiry.split('/')[0],
      expiryYear: '20' + paymentDetails.expiry.split('/')[1]
    };

    // Create line items from cart items
    const lineItems = cart.map(item => ({
      productId: item.id,
      productName: item.name,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity
    }));

    // Compile the complete order object
    const completeOrder = {
      orderId,
      orderDate,
      orderStatus: 'Pending',
      userId, // Initial status

      // Customer info
      customer: {
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        email: billingAddress.email,
        fullName: `${billingAddress.firstName} ${billingAddress.lastName}`
      },

      // Billing address
      billingAddress: {
        ...billingAddress,
        fullAddress: `${billingAddress.address}, ${billingAddress.city}, ${billingAddress.state} ${billingAddress.zip}, ${billingAddress.country}`
      },

      // Payment details (sanitized)
      payment: {
        ...sanitizedPaymentDetails,
        method: 'Credit Card',
        status: 'Processed'
      },

      // Order items
      items: lineItems,

      // Order totals
      totals: {
        subtotal,
        tax,
        shipping,
        total
      }
    };

    return completeOrder;
  };

  // Determine card type based on first digits
  const getCardType = (cardNumber) => {
    // Simplified logic - in real world, use a more robust solution
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = parseInt(cardNumber.substring(0, 2));

    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'MasterCard';
    if (firstDigit === '3' && (cardNumber.charAt(1) === '4' || cardNumber.charAt(1) === '7')) return 'American Express';
    if (firstDigit === '6') return 'Discover';
    if (firstTwoDigits >= 51 && firstTwoDigits <= 55) return 'MasterCard';
    return 'Unknown';
  };

  // Save order to database with OrderService
  const saveOrderToDatabase = async (orderData) => {
    try {
      setIsLoading(true);

      // Use OrderService instead of fetch
      const data = await OrderService.saveOrder(orderData);

      // Set success state and display success message
      setOrderSuccess(true);
      alert(`Order ${data.orderId} has been successfully placed!`);

      // Clear cart
      setCart([]);

      // Navigate to order confirmation page (if you have one)
      // navigate(`/orders/${data.orderId}`);

      return data;
    } catch (error) {
      console.error('Error saving order:', error);
      setOrderError(error.message);
      alert(`There was an error processing your order: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
      setShowPaymentModal(false);
    }
  };

  // Format card number with spaces for display
  const formatCardNumberDisplay = (number) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
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
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={navigateToShop}
                    disabled={isLoading}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Payment Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">Card Number</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumberDisplay(paymentDetails.cardNumber)}
                      onChange={handlePaymentChange}
                      required
                    />
                    {errors.cardNumber && (
                      <div className="invalid-feedback">{errors.cardNumber}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cardHolder" className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cardHolder ? 'is-invalid' : ''}`}
                      id="cardHolder"
                      name="cardHolder"
                      placeholder="John Doe"
                      value={paymentDetails.cardHolder}
                      onChange={handlePaymentChange}
                      required
                    />
                    {errors.cardHolder && (
                      <div className="invalid-feedback">{errors.cardHolder}</div>
                    )}
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="expiry" className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={paymentDetails.expiry}
                        onChange={handlePaymentChange}
                        required
                      />
                      {errors.expiry && (
                        <div className="invalid-feedback">{errors.expiry}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="cvc" className="form-label">CVC</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cvc ? 'is-invalid' : ''}`}
                        id="cvc"
                        name="cvc"
                        placeholder="123"
                        value={paymentDetails.cvc}
                        onChange={handlePaymentChange}
                        required
                      />
                      {errors.cvc && (
                        <div className="invalid-feedback">{errors.cvc}</div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between border-top pt-3">
                    <span className="fs-5">Total:</span>
                    <span className="fs-5 fw-bold">${total.toFixed(2)}</span>
                  </div>

                  <div className="d-grid gap-2 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Pay Now'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPaymentModal(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;