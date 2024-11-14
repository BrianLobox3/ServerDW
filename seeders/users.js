module.exports = {
    up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [
        {
        id_rol: 0,
        username: "peter",
        password: "pete",
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      {
        id_rol: 1,
        username: "johndoe",
        password: "john1234",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_rol: 2,
        username: "janedoe",
        password: "jane5678",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_rol: 3,
        username: "charliebrown",
        password: "charlie4321",
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      
      ]);
    },
  
    down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
    }
  };
  