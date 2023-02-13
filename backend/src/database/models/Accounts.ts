import { INTEGER, Model, STRING } from 'sequelize';
import db from '.';
import Users from './Users';

class Accounts extends Model {
  declare id: number;
  declare accountId: number;
  declare name: string;
  declare lastName: string;
  declare image: string;
}

Accounts.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  accountId: {
    type: INTEGER,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  lastName: {
    type: STRING,
    allowNull: false,
  },
  image: {
    type: STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  timestamps: false,
  modelName: 'accounts',
  tableName: 'accounts',
});

Accounts.belongsTo(Users, { foreignKey: 'accountId', as: 'accountId' });
Users.hasOne(Accounts, { foreignKey: 'accountId', as: 'accountId' });

export default Accounts;