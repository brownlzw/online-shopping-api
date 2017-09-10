DROP DATABASE IF EXISTS shopping;
CREATE DATABASE shopping;

\c shopping;

CREATE TABLE categories (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(80), -- category name
);

CREATE TABLE products (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30), -- product name
  category int references(categories(ID)), -- category of the product
);

CREATE TABLE customers (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30), -- customer name
);

CREATE TABLE orders (
  ID SERIAL PRIMARY KEY,
  cID int references(customers(ID)), -- customer of the order
  status VARCHAR(20) NOT NULL, -- status of the order
  placeDate DATE -- date of the order placed
);

CREATE TABLE orderDetails (
  oID int references(orders(ID)), -- order ID
  pID int references(products(ID)), -- product of the order
  quatity int NOT NULL, -- number of this product in the order
);


