DROP DATABASE IF EXISTS shopping;
CREATE DATABASE shopping;

\c shopping;

CREATE TABLE categories (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL, -- category's name
);

CREATE TABLE category-product (
  cID number references(categories(ID)), -- category's ID
  pID number references(products(ID)), -- product's ID
);

CREATE TABLE products (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL, -- product's name
  quantity int NOT NULL -- number of the product stored
);

CREATE TABLE customers (
  ID SERIAL PRIMARY KEY,
  firstName VARCHAR(30) NOT NULL, -- customer's first name
  lastName VARCHAR(30) NOT NULL -- customer's last name
);

CREATE TABLE orders (
  ID SERIAL PRIMARY KEY,
  cID int references(customers(ID)), -- customer of the order
  status VARCHAR(30) NOT NULL, -- status of an order: waiting for delivery, on its way, delivered...
  placeDate DATE -- date of the order placed
);

CREATE TABLE orderDetails (
  oID int references(orders(ID)), -- order ID
  pID int references(products(ID)), -- product of the order
  quantity int NOT NULL, -- number of this product in the order
);


