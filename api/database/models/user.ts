import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

export type LineStatus = 'idle' | 'busy' | 'offline';

export interface UserAttributes {
  id: number;
  name: string;
  lineStatus: LineStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'lineStatus'>;

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: number;
  declare name: string;
  declare lineStatus: LineStatus;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    lineStatus: {
      type: DataTypes.ENUM('idle', 'busy', 'offline'),
      allowNull: false,
      defaultValue: 'idle',
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  }
);

export default User;
