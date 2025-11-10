// config.js
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const PORT = process.env.PORT || 8000;
const DB_PATH =
  process.env.DB_PATH || path.resolve(__dirname, "leaderboard.sqlite3");

const ADMIN_USER = process.env.ADMIN_USER || "baganaa";
const ADMIN_PASS = process.env.ADMIN_PASS || "123456";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "CHANGE_THIS_SESSION_SECRET";

// Frontend URL for CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

module.exports = {
  PORT,
  DB_PATH,
  ADMIN_USER,
  ADMIN_PASS,
  SESSION_SECRET,
  FRONTEND_URL
};

