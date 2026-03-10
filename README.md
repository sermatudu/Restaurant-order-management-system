# Restaurant Order Management System

A full-stack web application for managing restaurant orders.
Customers can browse the menu, customize items, and place orders directly from their device. Orders are sent to a backend server and displayed in an admin dashboard where restaurant staff can monitor and process them.

---

## Overview

This project simulates a digital ordering system for a restaurant environment.
Customers select food items from the website, customize them if needed, and submit orders. The system stores these orders on a server and displays them in an administrative panel where the restaurant manager or staff can track order status.

The application consists of a **frontend client interface** and a **Node.js backend server**.

---

## Features

Customer Side

* Browse food menu
* View item details
* Customize food items
* Add items to cart
* Adjust quantity
* Place orders

Admin Side

* View all incoming orders
* Track order status
* Mark orders as completed
* Monitor total orders and revenue
* Order summary dashboard

System Features

* Cart stored using browser storage
* Orders sent to backend server via API
* Admin dashboard dynamically loads orders
* Simple REST API architecture

---

## Project Structure

```
Restaurant-Order-Management-System
│
├── CLIENT
│   ├── index.html
│   ├── admin.html
│   ├── cart.html
│   ├── menu item pages (pizza.html, burger.html, etc.)
│   ├── style.css
│   └── script.js
│
├── SERVER
│   └── server.js
│
├── package.json
├── package-lock.json
└── README.md
```

---

## Technologies Used

Frontend

* HTML
* CSS
* JavaScript

Backend

* Node.js
* Express.js

Other Tools

* Git
* GitHub
* VS Code
* Nodemon

---

## Installation

1. Clone the repository

```
git clone https://github.com/yourusername/restaurant-order-management-system.git
```

2. Navigate into the project directory

```
cd restaurant-order-management-system
```

3. Install dependencies

```
npm install
```

4. Install nodemon globally (if not already installed)

```
npm install -g nodemon
```

5. Start the backend server

```
nodemon SERVER/server.js
```

The server will run at:

```
http://localhost:5000
```

6. Open the frontend

Open `CLIENT/index.html` using a local server such as **VS Code Live Server**.

---

## How It Works

1. A customer visits the website.
2. They browse the menu and select food items.
3. Items are added to the cart.
4. The order is sent to the backend server through an API request.
5. The server stores the order in memory.
6. The admin dashboard fetches orders from the server.
7. Staff can view and manage incoming orders.

---

## Author

Serma Tudu
Engineering Student

---

## License

This project is released under the MIT License.