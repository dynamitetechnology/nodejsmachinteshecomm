CREATE database cart_geek;

CREATE TABLE users(
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(255)  NOT NULL,
	mobile VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE products(
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
product_name VARCHAR(200) NOT NULL,
product_price INT NOT NULL,
stock INT NOT NULL,
product_description text NOT  NULL,
product_image text NOT NULL 
);