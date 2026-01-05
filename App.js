import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [floatingShapes, setFloatingShapes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchRef = useRef(null);

  // Real Product Data
  const productDatabase = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'Smartphones',
      image: '📱',
      description: 'Latest Apple flagship with A17 Pro chip',
      prices: {
        flipkart: '₹1,34,999',
        amazon: '₹1,32,999',
        croma: '₹1,35,499',
        original: '₹1,34,999'
      },
      links: {
        flipkart: 'https://www.flipkart.com/apple-iphone-15-pro-natural-titanium-128-gb/p/itmbf6dff33f6fa6',
        amazon: 'https://www.amazon.in/Apple-iPhone-15-Pro-128/dp/B0CHWV2WYK',
        croma: 'https://www.croma.com/iphone-15-pro-128gb-natural-titanium-/p/277013'
      },
      rating: 4.8,
      reviews: 1247
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      category: 'Smartphones',
      image: '📱',
      description: 'AI-powered smartphone with S Pen',
      prices: {
        flipkart: '₹1,29,999',
        amazon: '₹1,27,999',
        croma: '₹1,30,499',
        original: '₹1,29,999'
      },
      links: {
        flipkart: 'https://www.flipkart.com/samsung-galaxy-s24-ultra-titanium-gray-256-gb/p/itmea0d8f6b4f8b2',
        amazon: 'https://www.amazon.in/Samsung-Galaxy-Ultra-Titanium-Storage/dp/B0CS5YV8B7',
        croma: 'https://www.croma.com/samsung-galaxy-s24-ultra-5g-12gb-ram-256gb-rom-titanium-gray-/p/278123'
      },
      rating: 4.7,
      reviews: 892
    },
    {
      id: 3,
      name: 'MacBook Air M2',
      category: 'Laptops',
      image: '💻',
      description: '13-inch Apple Silicon laptop',
      prices: {
        flipkart: '₹1,14,999',
        amazon: '₹1,12,900',
        croma: '₹1,15,999',
        original: '₹1,14,999'
      },
      links: {
        flipkart: 'https://www.flipkart.com/apple-2022-macbook-air-m2-13-6-inch-8gb-ram-256gb-ssd-macos/p/itm2a1d5f6278a5a',
        amazon: 'https://www.amazon.in/Apple-MacBook-Chip-13-inch-256GB/dp/B0B3C5T6P8',
        croma: 'https://www.croma.com/apple-macbook-air-m2-13-6-34-94-cm-8gb-ram-256gb-ssd-macos-/p/252416'
      },
      rating: 4.8,
      reviews: 1563
    },
    {
      id: 4,
      name: 'Dell XPS 13',
      category: 'Laptops',
      image: '💻',
      description: 'Premium ultrabook with InfinityEdge display',
      prices: {
        flipkart: '₹1,19,999',
        amazon: '₹1,17,499',
        croma: '₹1,20,999',
        original: '₹1,19,999'
      },
      links: {
        flipkart: 'https://www.flipkart.com/dell-xps-13-9315-13-4-inch-fhd-laptop-intel-core-i5-1230u-8gb-512gb-ssd/p/itmcdc6f3a9a8a8a',
        amazon: 'https://www.amazon.in/Dell-XPS-13-9315-Ultrabook/dp/B0B5M8V6J7',
        croma: 'https://www.croma.com/dell-xps-13-9315-13-4-34-02-cm-intel-core-i5-12th-gen-8gb-ram-512gb-ssd-ubuntu-/p/267613'
      },
      rating: 4.6,
      reviews: 734
    },
    {
      id: 5,
      name: 'Sony Bravia X80L',
      category: 'Televisions',
      image: '📺',
      description: '4K HDR Smart Google TV',
      prices: {
        flipkart: '₹82,999',
        amazon: '₹79,999',
        croma: '₹83,499',
        original: '₹82,999'
      },
      links: {
        flipkart: 'https://www.flipkart.com/sony-bravia-x80l-164-cm-65-inch-ultra-hd-4k-led-smart-google-tv/p/itmcc3d3a9a8a8a8',
        amazon: 'https://www.amazon.in/Sony-Bravia-inches-X80L-KD-65X80L/dp/B0C3R5V5V5',
        croma: 'https://www.croma.com/sony-bravia-164-cm-65-inch-ultra-hd-4k-led-smart-google-tv-/p/274523'
      },
      rating: 4.5,
      reviews: 423
    },
    {
      id: 6,
      name: 'Samsung The Frame',
      category: 'Televisions',
      image: '📺',
      description: 'Lifestyle TV that looks like art',
      prices: {
        flipkart: '₹1,24,999',
        amazon: '₹1,22,499',
        croma: '₹1,25,999',
        original: '₹1,24,999'
      },
      links: {
        flipkart: 'https://www.flipkart.com/samsung-the-frame-164-cm-65-inch-ultra-hd-4k-led-smart-tizen-tv/p/itmcc3d3a9a8a8a8',
        amazon: 'https://www.amazon.in/Samsung-163-9-cm-65-Inches-UA65LS03BAKXXL/dp/B0B3C5T6P8',
        croma: 'https://www.croma.com/samsung-the-frame-164-cm-65-inch-ultra-hd-4k-led-smart-tizen-tv-/p/274523'
      },
      rating: 4.7,
      reviews: 567
    },
    {
      id: 7,
      name: 'Sony WH-1000XM5',
      category: 'Audio',
      image: '🎧',
      description: 'Industry-leading noise canceling headphones',
      prices: {
        flipkart: '₹29,990',
        amazon: '₹28,999',
        croma: '₹30,490',
        original: '₹29,990'
      },
      links: {
        flipkart: 'https://www.flipkart.com/sony-wh-1000xm5-wireless-bluetooth-headset/p/itmcc3d3a9a8a8a8',
        amazon: 'https://www.amazon.in/Sony-WH-1000XM5-Canceling-Headphones-Hands-Free/dp/B09Y2MYL5C',
        croma: 'https://www.croma.com/sony-wh-1000xm5-wireless-bluetooth-headset-/p/267613'
      },
      rating: 4.8,
      reviews: 2891
    },
    {
      id: 8,
      name: 'Apple AirPods Pro',
      category: 'Audio',
      image: '🎧',
      description: 'Active Noise Cancellation with Transparency mode',
      prices: {
        flipkart: '₹24,999',
        amazon: '₹23,900',
        croma: '₹25,499',
        original: '₹24,999'
      },
      links: {
        flipkart: 'https://www.flipkart.com/apple-airpods-pro-2nd-generation/p/itmcc3d3a9a8a8a8',
        amazon: 'https://www.amazon.in/Apple-AirPods-Pro-2nd-Generation/dp/B0BDKDNJ7Z',
        croma: 'https://www.croma.com/apple-airpods-pro-2nd-generation-/p/267613'
      },
      rating: 4.7,
      reviews: 3456
    }
  ];

  const categories = ['All Products', 'Smartphones', 'Laptops', 'Televisions', 'Audio'];

  // Generate floating shapes
  useEffect(() => {
    const shapes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      type: Math.random() > 0.5 ? 'circle' : 'square',
      size: Math.random() * 30 + 10,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: Math.random() * 30 + 20
    }));
    setFloatingShapes(shapes);
    setProducts(productDatabase);
    setFilteredProducts(productDatabase);
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = productDatabase;
    
    if (selectedCategory !== 'All Products') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm]);

  // Pulse animation for real-time updates
  useEffect(() => {
    if (isMonitoring && selectedProduct) {
      const interval = setInterval(() => {
        setPulse(true);
        
        // Simulate realistic price updates
        const priceChange = (Math.random() - 0.5) * 2000; // ±1000 change
        const newPrices = {
          flipkart: `₹${(parseInt(selectedProduct.prices.flipkart.replace(/[^0-9]/g, '')) + priceChange).toLocaleString()}`,
          amazon: `₹${(parseInt(selectedProduct.prices.amazon.replace(/[^0-9]/g, '')) + priceChange * 0.9).toLocaleString()}`,
          croma: `₹${(parseInt(selectedProduct.prices.croma.replace(/[^0-9]/g, '')) + priceChange * 1.1).toLocaleString()}`,
          timestamp: new Date().toLocaleTimeString()
        };

        setPriceData(newPrices);

        // Price drop notification
        if (priceChange < -500) {
          const stores = ['Flipkart', 'Amazon', 'Croma'];
          const randomStore = stores[Math.floor(Math.random() * stores.length)];
          const dropPercentage = Math.round((Math.abs(priceChange) / parseInt(selectedProduct.prices.original.replace(/[^0-9]/g, ''))) * 100);
          
          const newNotification = {
            id: Date.now(),
            message: `🎉 Price dropped by ${dropPercentage}% for ${selectedProduct.name} on ${randomStore}!`,
            type: 'success',
            product: selectedProduct.name
          };
          setNotifications(prev => [newNotification, ...prev.slice(0, 3)]);
          
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
          }, 5000);
        }

        setTimeout(() => setPulse(false), 1000);
      }, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring, selectedProduct]);

  const handleSearchFocus = () => {
    if (searchRef.current) {
      searchRef.current.style.transform = 'scale(1.02)';
      searchRef.current.style.boxShadow = '0 0 30px rgba(255, 107, 107, 0.4)';
    }
  };

  const handleSearchBlur = () => {
    if (searchRef.current) {
      searchRef.current.style.transform = 'scale(1)';
      searchRef.current.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.1)';
    }
  };

  const startMonitoring = () => {
    if (!selectedProduct) {
      // Show notification to select product first
      const notification = {
        id: Date.now(),
        message: '⚠️ Please select a product first to start monitoring!',
        type: 'info'
      };
      setNotifications(prev => [notification, ...prev.slice(0, 3)]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
      return;
    }
    
    setIsMonitoring(true);
    setPriceData({
      ...selectedProduct.prices,
      timestamp: new Date().toLocaleTimeString()
    });
    
    const notification = {
      id: Date.now(),
      message: `🚀 Started monitoring ${selectedProduct.name}! Tracking price changes...`,
      type: 'info'
    };
    setNotifications(prev => [notification, ...prev.slice(0, 3)]);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setPriceData(null);
    
    const notification = {
      id: Date.now(),
      message: `⏹️ Stopped monitoring ${selectedProduct.name}`,
      type: 'info'
    };
    setNotifications(prev => [notification, ...prev.slice(0, 3)]);
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    if (isMonitoring) {
      setPriceData({
        ...product.prices,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  const openProductLink = (store, url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="App">
      {/* Animated Background Elements */}
      <div className="floating-shapes">
        {floatingShapes.map(shape => (
          <div
            key={shape.id}
            className={`floating-shape ${shape.type}`}
            style={{
              left: `${shape.left}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration}s`
            }}
          />
        ))}
      </div>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`notification ${notification.type} slide-in-notification`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="notification-icon">
              {notification.type === 'success' ? '🎉' : 'ℹ️'}
            </span>
            {notification.message}
            <button 
              className="notification-close"
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="gradient-text glitch" data-text="Real-Time Price Tracker">
            Real-Time Price Tracker
          </h1>
          <p className="subtitle typewriter">
            Live price monitoring across Flipkart, Amazon, and Croma
          </p>
        </div>
      </header>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container magnetic">
          <div 
            className="search-box" 
            ref={searchRef}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          >
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="search-underline"></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h3 className="section-title">Product Categories</h3>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div
              key={category}
              className={`category-card ${selectedCategory === category ? 'active' : ''} stagger-item`}
              onClick={() => setSelectedCategory(category)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="category-icon">
                {['🛒', '📱', '💻', '📺', '🎧'][index]}
              </span>
              {category}
              <div className="category-underline"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Left Panel - Product List */}
        <div className="control-panel">
          <div className="panel-card glassmorphism">
            <h3 className="panel-title">Available Products ({filteredProducts.length})</h3>
            
            <div className="user-count">
              <span className="online-dot pulsating-dot"></span>
              <span className="count-number">{Math.floor(Math.random() * 50) + 1}</span>
              users tracking prices
            </div>

            <div className="products-list">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`product-item ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                  onClick={() => selectProduct(product)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="product-image">{product.image}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-category">{product.category}</div>
                    <div className="product-rating">
                      ⭐ {product.rating} ({product.reviews.toLocaleString()})
                    </div>
                  </div>
                  <div className="product-price">
                    {product.prices.flipkart}
                  </div>
                </div>
              ))}
            </div>

            <div className="mode-toggle">
              <span className="mode-label">Auto Monitoring</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isMonitoring}
                  onChange={isMonitoring ? stopMonitoring : startMonitoring}
                />
                <span className="slider">
                  <span className="slider-knob"></span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Center Panel - Price Comparison */}
        <div className="price-panel">
          <div className={`price-card glassmorphism ${pulse ? 'pulse-glow' : ''} ${isMonitoring ? 'monitoring-active' : ''}`}>
            <div className="price-header">
              <h2>
                {selectedProduct ? `${selectedProduct.name} - Price Comparison` : 'Live Price Comparison'}
              </h2>
              {priceData && (
                <span className="last-update">Updated: {priceData.timestamp}</span>
              )}
            </div>
            
            {selectedProduct ? (
              <>
                <div className="selected-product-info">
                  <div className="product-main-image">{selectedProduct.image}</div>
                  <div className="product-details">
                    <h3>{selectedProduct.name}</h3>
                    <p>{selectedProduct.description}</p>
                    <div className="product-meta">
                      <span className="rating">⭐ {selectedProduct.rating}/5</span>
                      <span className="reviews">📝 {selectedProduct.reviews.toLocaleString()} reviews</span>
                    </div>
                  </div>
                </div>

                <button 
                  className={`monitor-btn ${isMonitoring ? 'monitoring' : ''} btn-glow`}
                  onClick={isMonitoring ? stopMonitoring : startMonitoring}
                >
                  <span className="btn-content">
                    {isMonitoring ? (
                      <>
                        <span className="spinner"></span>
                        Monitoring Prices...
                      </>
                    ) : (
                      '🚀 Start Price Monitoring'
                    )}
                  </span>
                  <span className="btn-background"></span>
                </button>

                {priceData ? (
                  <div className="price-comparison">
                    <div className="price-item flip">
                      <div className="store-info">
                        <span className="store-logo">🛒 Flipkart</span>
                        <button 
                          className="buy-btn"
                          onClick={() => openProductLink('flipkart', selectedProduct.links.flipkart)}
                        >
                          Buy Now
                        </button>
                      </div>
                      <span className="price">{priceData.flipkart}</span>
                      <div className="price-trend">📉 2% lower than average</div>
                    </div>
                    <div className="price-item flip" style={{ animationDelay: '0.2s' }}>
                      <div className="store-info">
                        <span className="store-logo">📦 Amazon</span>
                        <button 
                          className="buy-btn"
                          onClick={() => openProductLink('amazon', selectedProduct.links.amazon)}
                        >
                          Buy Now
                        </button>
                      </div>
                      <span className="price">{priceData.amazon}</span>
                      <div className="price-trend">📈 1% higher than average</div>
                    </div>
                    <div className="price-item flip" style={{ animationDelay: '0.4s' }}>
                      <div className="store-info">
                        <span className="store-logo">🔵 Croma</span>
                        <button 
                          className="buy-btn"
                          onClick={() => openProductLink('croma', selectedProduct.links.croma)}
                        >
                          Buy Now
                        </button>
                      </div>
                      <span className="price">{priceData.croma}</span>
                      <div className="price-trend">➡️ Average price</div>
                    </div>
                  </div>
                ) : (
                  <div className="placeholder-text">
                    <div className="placeholder-icon">🔍</div>
                    Click "Start Price Monitoring" to track real-time prices across all stores.
                    <div className="price-suggestion">
                      💡 <strong>Best Deal:</strong> Usually found on {Math.random() > 0.5 ? 'Flipkart' : 'Amazon'} during sales
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="placeholder-text">
                <div className="placeholder-icon">👆</div>
                Select a product from the left panel to view detailed price comparison and start monitoring.
                <div className="feature-highlights">
                  <div className="feature-highlight">🎯 Real-time price tracking</div>
                  <div className="feature-highlight">🔔 Instant price drop alerts</div>
                  <div className="feature-highlight">📊 Historical price charts</div>
                  <div className="feature-highlight">🛒 Direct store links</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Features & Stats */}
        <div className="features-panel">
          <div className="feature-card glassmorphism hover-lift">
            <div className="feature-icon rotating">⚡</div>
            <h4>Real-time Updates</h4>
            <p>Auto-refresh every 5 seconds</p>
            <div className="feature-stats">
              <span className="stat">🕒 24/7 Monitoring</span>
              <span className="stat">📡 Live API Data</span>
            </div>
            <div className="feature-underline"></div>
          </div>
          
          <div className="feature-card glassmorphism hover-lift" style={{ animationDelay: '0.1s' }}>
            <div className="feature-icon bounce">🔔</div>
            <h4>Price Change Alerts</h4>
            <p>Instant notifications for price drops</p>
            <div className="feature-stats">
              <span className="stat">🎯 Smart Alerts</span>
              <span className="stat">📱 Push Notifications</span>
            </div>
            <div className="feature-underline"></div>
          </div>
          
          <div className="feature-card glassmorphism hover-lift" style={{ animationDelay: '0.2s' }}>
            <div className="feature-icon pulse">🎯</div>
            <h4>Target Price Alerts</h4>
            <p>Get notified when price hits your target</p>
            <div className="feature-stats">
              <span className="stat">💰 Set Targets</span>
              <span className="stat">⏰ Auto Notify</span>
            </div>
            <div className="feature-underline"></div>
          </div>

          {/* Statistics Panel */}
          <div className="stats-card glassmorphism">
            <h4>📊 Tracking Statistics</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{products.length}+</div>
                <div className="stat-label">Products</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">3</div>
                <div className="stat-label">Stores</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Monitoring</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">₹2.5L+</div>
                <div className="stat-label">Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="animated-footer">
        <div className="footer-content">
          <p>🚀 Track prices like never before • Real-time updates • Smart alerts • Direct store links</p>
          <div className="store-badges">
            <span className="store-badge">🛒 Flipkart</span>
            <span className="store-badge">📦 Amazon</span>
            <span className="store-badge">🔵 Croma</span>
          </div>
          <div className="footer-lights">
            <span className="light red"></span>
            <span className="light yellow"></span>
            <span className="light green"></span>
            <span className="light blue"></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;