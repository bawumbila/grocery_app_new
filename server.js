const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// In-memory data store (replace with a database in production)
let groceries = [
  { id: 1, name: "Milk", quantity: 2, category: "Dairy", purchased: false },
  { id: 2, name: "Bread", quantity: 1, category: "Bakery", purchased: false },
  { id: 3, name: "Eggs", quantity: 12, category: "Dairy", purchased: true },
];

let nextId = 4;

// GET all groceries
app.get("/api/groceries", (req, res) => {
  res.json(groceries);
});

// GET single grocery by ID
app.get("/api/groceries/:id", (req, res) => {
  const grocery = groceries.find((g) => g.id === parseInt(req.params.id));
  if (!grocery) {
    return res.status(404).json({ error: "Grocery item not found" });
  }
  res.json(grocery);
});

// POST create new grocery
app.post("/api/groceries", (req, res) => {
  const { name, quantity, category, purchased } = req.body;

  if (!name || quantity === undefined) {
    return res.status(400).json({ error: "Name and quantity are required" });
  }

  const newGrocery = {
    id: nextId++,
    name,
    quantity: parseInt(quantity),
    category: category || "Other",
    purchased: purchased || false,
  };

  groceries.push(newGrocery);
  res.status(201).json(newGrocery);
});

// PUT update grocery
app.put("/api/groceries/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = groceries.findIndex((g) => g.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Grocery item not found" });
  }

  const { name, quantity, category, purchased } = req.body;

  groceries[index] = {
    id,
    name: name || groceries[index].name,
    quantity:
      quantity !== undefined ? parseInt(quantity) : groceries[index].quantity,
    category: category || groceries[index].category,
    purchased: purchased !== undefined ? purchased : groceries[index].purchased,
  };

  res.json(groceries[index]);
});

// DELETE grocery
app.delete("/api/groceries/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = groceries.findIndex((g) => g.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Grocery item not found" });
  }

  const deleted = groceries.splice(index, 1)[0];
  res.json({ message: "Grocery item deleted", grocery: deleted });
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Grocery CRUD app running on http://localhost:${PORT}`);
});
