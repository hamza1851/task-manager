import { DataTypes } from "sequelize";
import db from "../connections/sequelize/mySql.connection.js";


const Task = db.sequelize.define(
  "tasks",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false
    },
    dueDate: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "completed"),
      defaultValue: "pending"
    }
  },
  {
    timestamps: true,
    createdAt: "created_at", // sequelize uses camelCase by default, so snake_case needs to be specified
    updatedAt: "updated_at"
  }
);

export default Task;
