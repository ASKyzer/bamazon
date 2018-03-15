DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(101),
  department_name VARCHAR(101),
  price DECIMAL(10,2),
  stock_quantity INT(11),
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bicycle Lights", "Sports & Outdoors", 13.90, 659);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Head Neck Scarf", "Accessory", 11.99, 2790);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Steampunk Goggles", "Accessory", 13.99, 94);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sheer Hooded Cloak", "Clothing", 12.95, 5);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Faux Fur Hooded Sleeveless Vest", "Clothing", 35.50, 61);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Face Mask with Filter", "Sports & Outdoors", 12.99, 29);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Neon Electroluminescent Wire 6 Pack", "Tools & Home Improvement", 20.99, 120);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Light Up LED Skeleton Hand Gloves", "Accessory", 13.95, 350);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Metallic Temporary Tattoos", "Tools & Home Improvement", 9.97, 213);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("26-inch Men's Fat Tire Bike ", "Sports & Outdoors", 233.99, 320);
