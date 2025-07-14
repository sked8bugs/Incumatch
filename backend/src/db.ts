import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const connectToDB = async () => {
  const db = await open({
    filename: './src/database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('mentor', 'mentee')) NOT NULL
    );
  `);

  return db;
};
