
from flask import Flask, request, jsonify, g
from flask_cors import CORS
import sqlite3
import os
import hashlib
import uuid
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database configuration
DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'marketplace.db')

# Helper functions for database connection
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    """Initialize the database with tables if they don't exist"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    ''')
    
    # Create items table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        condition TEXT NOT NULL,
        location TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create images table (for item images)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        item_id TEXT NOT NULL,
        url TEXT NOT NULL,
        FOREIGN KEY (item_id) REFERENCES items (id)
    )
    ''')
    
    # Insert mock users if they don't exist
    cursor.execute("SELECT * FROM users WHERE username = 'muser'")
    if not cursor.fetchone():
        # Add mock user
        hash_password = hashlib.sha256('muser'.encode()).hexdigest()
        cursor.execute('''
        INSERT INTO users (id, username, password, email, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (str(uuid.uuid4()), 'muser', hash_password, 'muser@example.com', 'user', datetime.now().isoformat()))
    
    cursor.execute("SELECT * FROM users WHERE username = 'mvc'")
    if not cursor.fetchone():
        # Add mock admin
        hash_password = hashlib.sha256('mvc'.encode()).hexdigest()
        cursor.execute('''
        INSERT INTO users (id, username, password, email, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (str(uuid.uuid4()), 'mvc', hash_password, 'mvc@example.com', 'admin', datetime.now().isoformat()))
    
    conn.commit()
    conn.close()

# Initialize database on app startup
with app.app_context():
    init_db()

# Helper function to hash passwords
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# API Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    
    if not all([username, password, email]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Hash password
    hashed_password = hash_password(password)
    
    try:
        db = get_db()
        # Check if username already exists
        cursor = db.execute('SELECT id FROM users WHERE username = ?', (username,))
        if cursor.fetchone():
            return jsonify({'error': 'Username already exists'}), 409
        
        # Check if email already exists
        cursor = db.execute('SELECT id FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email already exists'}), 409
            
        # Create new user
        user_id = str(uuid.uuid4())
        db.execute(
            'INSERT INTO users (id, username, password, email, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            (user_id, username, hashed_password, email, 'user', datetime.now().isoformat())
        )
        db.commit()
        
        return jsonify({
            'id': user_id,
            'username': username,
            'email': email,
            'role': 'user'
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not all([username, password]):
        return jsonify({'error': 'Missing username or password'}), 400
    
    try:
        db = get_db()
        # Find user by username
        cursor = db.execute(
            'SELECT id, username, password, email, role, created_at FROM users WHERE username = ?',
            (username,)
        )
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'error': 'Invalid username or password'}), 401
            
        # Check password
        hashed_password = hash_password(password)
        if hashed_password != user['password']:
            return jsonify({'error': 'Invalid username or password'}), 401
            
        return jsonify({
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'role': user['role'],
            'created_at': user['created_at']
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/items', methods=['GET'])
def get_items():
    try:
        db = get_db()
        cursor = db.execute('''
            SELECT i.*, u.username as seller_username 
            FROM items i
            JOIN users u ON i.user_id = u.id
            ORDER BY i.created_at DESC
        ''')
        items = cursor.fetchall()
        
        # Get images for each item
        result = []
        for item in items:
            item_dict = dict(item)
            
            # Get images for this item
            img_cursor = db.execute('SELECT url FROM images WHERE item_id = ?', (item['id'],))
            images = [img['url'] for img in img_cursor.fetchall()]
            item_dict['images'] = images
            
            result.append(item_dict)
            
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/items', methods=['POST'])
def create_item():
    data = request.json
    user_id = data.get('user_id')
    title = data.get('title')
    description = data.get('description')
    price = data.get('price')
    category = data.get('category')
    condition = data.get('condition')
    location = data.get('location')
    image_urls = data.get('images', [])
    
    if not all([user_id, title, description, price, category, condition, location]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        db = get_db()
        # Create new item
        item_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        db.execute('''
            INSERT INTO items (id, user_id, title, description, price, category, condition, location, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (item_id, user_id, title, description, price, category, condition, location, now, now))
        
        # Add images if provided
        for url in image_urls:
            db.execute(
                'INSERT INTO images (id, item_id, url) VALUES (?, ?, ?)',
                (str(uuid.uuid4()), item_id, url)
            )
            
        db.commit()
        
        return jsonify({
            'id': item_id,
            'user_id': user_id,
            'title': title,
            'description': description,
            'price': price,
            'category': category,
            'condition': condition,
            'location': location,
            'created_at': now,
            'updated_at': now,
            'images': image_urls
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/items/<item_id>', methods=['GET'])
def get_item(item_id):
    try:
        db = get_db()
        cursor = db.execute('''
            SELECT i.*, u.username as seller_username 
            FROM items i
            JOIN users u ON i.user_id = u.id
            WHERE i.id = ?
        ''', (item_id,))
        item = cursor.fetchone()
        
        if not item:
            return jsonify({'error': 'Item not found'}), 404
            
        item_dict = dict(item)
        
        # Get images for this item
        img_cursor = db.execute('SELECT url FROM images WHERE item_id = ?', (item_id,))
        images = [img['url'] for img in img_cursor.fetchall()]
        item_dict['images'] = images
        
        return jsonify(item_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/items/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    user_id = request.headers.get('User-Id')
    user_role = request.headers.get('User-Role')
    
    if not user_id:
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        db = get_db()
        # Get item to check ownership
        cursor = db.execute('SELECT user_id FROM items WHERE id = ?', (item_id,))
        item = cursor.fetchone()
        
        if not item:
            return jsonify({'error': 'Item not found'}), 404
            
        # Check if user is owner or admin
        if item['user_id'] != user_id and user_role != 'admin':
            return jsonify({'error': 'Not authorized to delete this item'}), 403
            
        # Delete images first (foreign key constraint)
        db.execute('DELETE FROM images WHERE item_id = ?', (item_id,))
        # Delete item
        db.execute('DELETE FROM items WHERE id = ?', (item_id,))
        db.commit()
        
        return jsonify({'message': 'Item deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<user_id>/items', methods=['GET'])
def get_user_items(user_id):
    try:
        db = get_db()
        cursor = db.execute('''
            SELECT i.* 
            FROM items i
            WHERE i.user_id = ?
            ORDER BY i.created_at DESC
        ''', (user_id,))
        items = cursor.fetchall()
        
        # Get images for each item
        result = []
        for item in items:
            item_dict = dict(item)
            
            # Get images for this item
            img_cursor = db.execute('SELECT url FROM images WHERE item_id = ?', (item['id'],))
            images = [img['url'] for img in img_cursor.fetchall()]
            item_dict['images'] = images
            
            result.append(item_dict)
            
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
