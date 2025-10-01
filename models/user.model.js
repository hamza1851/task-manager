import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "users",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
  },
  {
    timestamps: true,
    createdAt: "created_at", // sequelize uses camelCase by default, so snake_case needs to be specified
    updatedAt: "updated_at",
    validate: {} // removing all validations
  }
);

export default User;
