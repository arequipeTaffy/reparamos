CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    add_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255)
);
