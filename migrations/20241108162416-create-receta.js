'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Receta', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      categoria: {
        type: Sequelize.STRING,
      },
      imageUrl: {
        type: Sequelize.STRING,
      },
      visibility: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'private',
        validate: {
          isIn: [['public', 'private']],
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      dislikes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      author: {  
        type: Sequelize.STRING,
        allowNull: true, 
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Receta');
  },
};