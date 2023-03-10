import { INTEGER, Model, NUMBER, STRING } from 'sequelize';
import db from '.';
import Columns from './Column';
import Workspaces from './Workspaces';

class ColumnWorkspaces extends Model {
  declare columnId: number;

  declare workspaceId: number;
}

ColumnWorkspaces.init({
  columnId: {
    type: INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  workspaceId: {
    type: STRING,
    primaryKey: true,
    allowNull: false,
  },
  position: {
    type: NUMBER,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  timestamps: false,
  modelName: 'column_workspaces',
  tableName: 'column_workspaces',
});

ColumnWorkspaces.belongsTo(Workspaces, { foreignKey: 'workspaceId', as: 'columns' });
Workspaces.hasMany(ColumnWorkspaces, { foreignKey: 'workspaceId', as: 'columns' });
ColumnWorkspaces.belongsTo(Columns, { foreignKey: 'columnId' });
Columns.hasMany(ColumnWorkspaces, { foreignKey: 'columnId' });

export default ColumnWorkspaces;