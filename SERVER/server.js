const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/restaurantDB")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Create Order Schema
const OrderSchema = new mongoose.Schema({
    tableNumber: Number,
    items: [
        {
            name: String,
            price: Number
        }
    ],
    total: Number,
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", OrderSchema);

// Serve frontend files
app.use(express.static(path.join(__dirname, "../CLIENT")));

// API routes

// Get all orders
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new order
app.post("/orders", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order added successfully", orderId: newOrder._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order (mark as done)
app.put("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (order) {
            res.json({ message: "Order updated successfully" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete order
app.delete("/orders/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (order) {
            res.json({ message: "Order deleted successfully" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

