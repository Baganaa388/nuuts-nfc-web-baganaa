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

module.exports = {
  PORT,
  DB_PATH,
  ADMIN_USER,
  ADMIN_PASS,
  SESSION_SECRET
};
