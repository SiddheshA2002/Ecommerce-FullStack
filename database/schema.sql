CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INT,
  image_url VARCHAR(500),
  stock_quantity INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Latest electronic devices and gadgets'),
('Clothing', 'Fashionable clothing for all seasons'),
('Books', 'Educational and entertaining books'),
('Home & Garden', 'Everything for your home and garden'),
('Sports', 'Sports equipment and accessories'),
('Beauty', 'Beauty and personal care products');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, stock_quantity, featured) VALUES
('Smartphone X', 'Latest smartphone with advanced camera and processor', 799.99, 1, 50, TRUE),
('Gaming Laptop', 'High-performance laptop for gaming and work', 1299.99, 1, 25, TRUE),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 1, 100, FALSE),
('Cotton T-Shirt', 'Comfortable 100% cotton t-shirt', 24.99, 2, 200, FALSE),
('Designer Jeans', 'Premium quality denim jeans', 89.99, 2, 75, TRUE),
('Winter Jacket', 'Warm and stylish winter jacket', 149.99, 2, 40, FALSE),
('Bestseller Novel', 'Award-winning fiction novel', 14.99, 3, 150, TRUE),
('Cookbook', 'Collection of delicious recipes', 29.99, 3, 80, FALSE),
('Garden Tool Set', 'Complete gardening tool kit', 49.99, 4, 60, FALSE),
('Indoor Plant', 'Beautiful indoor decorative plant', 34.99, 4, 30, TRUE),
('Basketball', 'Professional quality basketball', 39.99, 5, 90, FALSE),
('Yoga Mat', 'Non-slip premium yoga mat', 29.99, 5, 120, FALSE),
('Skincare Set', 'Complete daily skincare routine', 79.99, 6, 70, TRUE),
('Perfume', 'Luxury fragrance for everyday wear', 59.99, 6, 45, FALSE);