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