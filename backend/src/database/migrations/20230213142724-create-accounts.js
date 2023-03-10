/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersAccounts = await queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
    return usersAccounts;
  },

  down: async (queryInterface, _Sequelize) => queryInterface.dropTable('accounts'),
};