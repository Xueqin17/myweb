import { Sequelize } from 'sequelize';
import path from 'path';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(process.cwd(), 'api/database/sqlite/database.sqlite'),
  logging: false,
});

export async function ensureDB() {
  try {
    await sequelize.authenticate();
    console.log('SQLite connection established.');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

export default sequelize;