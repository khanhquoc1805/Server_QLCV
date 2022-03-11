import { Sequelize } from "sequelize";
const sequelize = new Sequelize(
  "quanlycongvan",
  "khanhquoc1805",
  "khanhquoc1805",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;