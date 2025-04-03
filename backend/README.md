
# Trade Craft Hub Backend

This is the Flask-based backend for the Trade Craft Hub marketplace application.

## Setup

1. Create a virtual environment:
```
python -m venv venv
```

2. Activate the virtual environment:
```
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Run the application:
```
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create a new item
- `GET /api/items/<item_id>` - Get a specific item
- `DELETE /api/items/<item_id>` - Delete an item

### User Items
- `GET /api/users/<user_id>/items` - Get all items for a user

## Database

The application uses SQLite database with the following tables:
- `users` - User information
- `items` - Item listings
- `images` - Images associated with items

The database file is created automatically at `marketplace.db` when the application starts.

## Mock Users

The application creates two mock users on startup:

1. Regular User:
   - Username: muser
   - Password: muser
   - Role: user

2. Admin User:
   - Username: mvc
   - Password: mvc
   - Role: admin
