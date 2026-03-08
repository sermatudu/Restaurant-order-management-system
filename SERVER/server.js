const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔥 Serve frontend files
app.use(express.static(path.join(__dirname, "../CLIENT")));

let orders = [];

// API routes
app.get("/orders", (req, res) => {
    res.json(orders);
});

app.post("/orders", (req, res) => {
    const newOrder = req.body;
    newOrder.id = Date.now();
    newOrder.completed = false;
    newOrder.createdAt = new Date().toISOString();
    orders.push(newOrder);
    res.status(201).json({ message: "Order added successfully", orderId: newOrder.id });
});

app.put("/orders/:index", (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < orders.length) {
        orders[index] = { ...orders[index], ...req.body };
        res.json({ message: "Order updated successfully" });
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

app.delete("/orders/:index", (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < orders.length) {
        orders.splice(index, 1);
        res.json({ message: "Order deleted successfully" });
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});