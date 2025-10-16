import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

export const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  lineStatus: {
    type: DataTypes.ENUM('idle', 'busy', 'offline'),
    defaultValue: 'idle',
  },
});

export async function syncModels() {
  await sequelize.sync({ alter: true });
  console.log('Database synced.');
}