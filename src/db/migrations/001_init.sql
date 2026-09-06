CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE stores (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE catalog (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    price INTEGER NOT NULL CHECK (price >= 0),
    category_id INTEGER,
    store_id INTEGER,
    unit TEXT NOT NULL CHECK (unit IN ('g', 'ml', 'pack', 'unit')),
    size NUMERIC,
    brand TEXT,
    image TEXT,
    barcode TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
    FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE SET NULL
);

CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    is_selected BOOLEAN NOT NULL DEFAULT 0,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id),
    FOREIGN KEY (product_id) REFERENCES catalog (id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    checkout_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    price_at_purchase INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL,
    size NUMERIC,
    brand TEXT,
    image TEXT,
    store TEXT,
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

CREATE TABLE sessions (
    sid TEXT PRIMARY KEY,
    session TEXT NOT NULL,
    expires_at DATETIME NOT NULL
);