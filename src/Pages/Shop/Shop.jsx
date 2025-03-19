import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const Shop = () => {
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

  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [imagesLoaded, setImagesLoaded] = useState({});

  const categories = ['All', ...new Set(initialProducts.map(product => product.category))];

  useEffect(() => {
    const loadingState = {};
    initialProducts.forEach(product => (loadingState[product.id] = false));
    setImagesLoaded(loadingState);

    initialProducts.forEach(product => {
      setTimeout(() => {
        setImagesLoaded(prev => ({ ...prev, [product.id]: true }));
      }, Math.random() * 2000 + 500);
    });
  }, []);

  const handleSearch = term => {
    setSearchTerm(term);
    filterProducts(term, categoryFilter);
  };

  const handleCategoryFilter = category => {
    setCategoryFilter(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (term, category) => {
    let filteredProducts = initialProducts;
    if (term) {
      filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(term.toLowerCase()));
    }
    if (category !== 'All') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    setProducts(filteredProducts);
  };

  const ImageSkeleton = () => <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg"></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">University Merchandise Shop</h1>
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="relative mb-4 md:mb-0 md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search for products..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto md:justify-end">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg ${categoryFilter === category ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {!imagesLoaded[product.id] ? (
                <ImageSkeleton />
              ) : (
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-500">{product.category}</p>
                <p className="text-blue-600 font-bold mt-2">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default Shop;
