const { Sequelize } = require("sequelize");
const { db } = require("./env");
console.log(db);
const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  dialect: db.dialect || "mysql", // Change to "postgres" if using PostgreSQL
  logging: false,

  
});

module.exports = sequelize;
