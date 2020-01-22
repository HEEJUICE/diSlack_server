require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: 0,
    logging: 0,
  },
  test: {
    username: "root",
    password: null,
    database: process.env.DATABASE,
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: false,
  },
  production: {
    username: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: 0,
    logging: 0,
  },
};
