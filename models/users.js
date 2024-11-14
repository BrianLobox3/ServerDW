'use strict';
const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    
    validPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  
    static associate(models) {}
  }
  
  Users.init({
    id_rol: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,         
    plainPassword: DataTypes.STRING,    
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    telefono: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });

  Users.beforeCreate(async (user, options) => {
    user.password = await bcrypt.hash(user.plainPassword, 10); 
    console.log("Contraseña encriptada guardada:", user.password);
  });

  return Users;
};
