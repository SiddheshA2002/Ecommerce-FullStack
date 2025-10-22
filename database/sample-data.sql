USE ecommerce_db;

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Fashion and apparel'),
('Books', 'Books and literature'),
('Home & Garden', 'Home and garden supplies');

-- Insert products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity) VALUES
('Smartphone', 'Latest smartphone with advanced features', 699.99, 1, '/uploads/phone.jpg', 50),
('Laptop', 'High-performance laptop for work and gaming', 999.99, 1, '/uploads/laptop.jpg', 30),
('T-Shirt', 'Comfortable cotton t-shirt', 19.99, 2, '/uploads/tshirt.jpg', 100),
('Jeans', 'Classic blue jeans', 49.99, 2, '/uploads/jeans.jpg', 75),
('Novel', 'Bestselling fiction novel', 14.99, 3, '/uploads/novel.jpg', 200),
('Garden Tools', 'Essential gardening tool set', 39.99, 4, '/uploads/tools.jpg', 40);
