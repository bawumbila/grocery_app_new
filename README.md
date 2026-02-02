# Grocery CRUD App

A full-stack CRUD (Create, Read, Update, Delete) application for managing your grocery shopping list.

## Features

- ✅ Add new grocery items with name, quantity, and category
- ✅ View all grocery items in a beautiful interface
- ✅ Edit existing items
- ✅ Delete items
- ✅ Mark items as purchased
- ✅ Filter items (All, To Buy, Purchased)
- ✅ Responsive design for mobile and desktop

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Storage**: In-memory (resets on server restart)

## Installation

1. Open the project folder in VS Code

2. Open the integrated terminal (Terminal → New Terminal)

3. Install dependencies:

```bash
npm install
```

## Running the App

1. Start the server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

2. Open your browser and go to:

```
http://localhost:3000
```

## Usage

### Adding Items

1. Fill in the item name, quantity, and select a category
2. Click "Add Item"

### Marking as Purchased

- Click the checkbox next to any item to mark it as purchased/unpurchased

### Editing Items

1. Click the "Edit" button on any item
2. Update the fields in the modal
3. Click "Save Changes"

### Deleting Items

- Click the "Delete" button on any item
- Confirm the deletion

### Filtering

- Click "All Items" to see everything
- Click "To Buy" to see only unpurchased items
- Click "Purchased" to see only purchased items

## API Endpoints

- `GET /api/groceries` - Get all groceries
- `GET /api/groceries/:id` - Get a single grocery
- `POST /api/groceries` - Create a new grocery
- `PUT /api/groceries/:id` - Update a grocery
- `DELETE /api/groceries/:id` - Delete a grocery

## Project Structure

```
grocery-app/
├── server.js           # Express server with API routes
├── package.json        # Project dependencies
├── public/
│   ├── index.html     # Main HTML file
│   ├── styles.css     # Styling
│   └── app.js         # Frontend JavaScript
└── README.md          # This file
```

## Notes

- Data is stored in memory and will be lost when the server restarts
- To persist data, consider adding a database (SQLite, MongoDB, etc.)
- The app runs on port 3000 by default

## Future Enhancements

- Database integration for persistent storage
- User authentication
- Multiple grocery lists
- Shopping list sharing
- Price tracking
- Recipe integration
