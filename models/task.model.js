import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

const Task = sequelize.define(
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
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

export default Task;
