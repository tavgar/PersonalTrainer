const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite'); // Using a file-based database

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    age INTEGER,
    weight REAL,
    height REAL
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    type TEXT,
    duration INTEGER,
    calories REAL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS nutrition (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    meal TEXT,
    food TEXT,
    calories REAL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    weight REAL,
    fat REAL,
    water REAL,
    muscles REAL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    type TEXT,
    target TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

    // Insert a hardcoded user
    db.run(`INSERT OR IGNORE INTO users (id, name, email, age, weight, height)
          VALUES (1, 'Sasanian God', 'Sasan@example.krd', 30, 70.0, 175.0)`);
});

module.exports = db;
