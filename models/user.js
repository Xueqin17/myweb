// models/user.js
// Sequelize model definition for User table

import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lineStatus: {
      type: DataTypes.STRING,
      defaultValue: 'offline',
    },
  },
  {
    tableName: 'Users',
    timestamps: false, // no createdAt/updatedAt columns
  }
);

export default User;