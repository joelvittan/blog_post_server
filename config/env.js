require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  jwtCredentials: {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.REFRESH_SECRET,
  },
};
