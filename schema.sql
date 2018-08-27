DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
 item_id INTEGER NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(50) NOT NULL,
 department_name VARCHAR(50) NULL,
 price DECIMAL(10, 2) NOT NULL,
 stock_quantity INTEGER(10) NOT NULL,
 PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("hammer", "tools", 7.50, 150),
	("wrench", "tools", 12.00, 120),
    ("screwdriver", "tools", 4.75, 225),
    ("television", "electronics", 500.00, 20),
    ("camera", "electronics", 150.00, 75),
    ("laptop computer", "electronics", 750.00, 15),
    ("towel", "household", 18.50, 180),
    ("cushion", "household", 23.25, 110),
    ("bath mat", "household", 28.00, 90),
    ("plastic flamingo", "outdoor decor", 8.95, 250),
    ("lawn gnome", "outdoor decor", 27.80, 649);
    
/*SELECT * FROM products;

SELECT * FROM products WHERE stock_quantity < 50;

UPDATE products SET stock_quantity = 180 WHERE item_id = 7;*/