'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Receta = sequelize.define('Receta', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['private', 'public']],
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    author: { 
      type: DataTypes.STRING,
      allowNull: true, 
    },
  });

  Receta.associate = (models) => {
    Receta.belongsTo(models.Users, { foreignKey: 'userId' });
  };

  return Receta;
};
