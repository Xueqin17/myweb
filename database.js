// database.js
// Sequelize configuration for SQLite

import { Sequelize } from 'sequelize';

// Create a new SQLite database (stored as local file)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './sequelize.db', // separate DB file for Sequelize
  logging: false,            // turn off SQL console logs
});

export default sequelize;