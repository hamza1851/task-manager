import sequelize from "../config/db.js";
import { Op } from "sequelize";
import Task from "../models/task.model.js";
import { getUserId } from "../services/getUserId.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    if (!title || !priority || !dueDate) {
      return res
        .status(400)
        .json({ message: "Title, priority, and dueDate are required." });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status,
      userId: req.user.id
    });

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const {
      title,
      status,
      priority,
      startDate,
      endDate,
      sortBy = "dueDate",
      order = "DESC"
    } = req.query;

    const userId = getUserId(req).userId;

    const where = { userId };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (title) {
      where.title = { [Op.like]: `%${title}%` };
    }

    if (startDate && endDate) {
      where.dueDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const tasks = await Task.findAll({
      where,
      order: [[sortBy, order.toUpperCase()]]
    });

    console.log("Fetched Tasks: ", tasks);
    console.log("filters: ", where);

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.query.userId }
    });
    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {}
};

export const updateTask = async (req, res) => {
  const { title, description, priority, dueDate, status } = req.body;
  try {
    console.log("TaskID: ", req.params.id, "UserID: ", req.query.userId);
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.query.userId }
    });
    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const newTask = {
      title: title || task.title,
      description: description || task.description,
      priority: priority || task.priority,
      dueDate: dueDate || task.dueDate,
      status: status || task.status
    };

    const isUpdated = await Task.update(newTask, {
      where: { id: req.params.id, userId: req.query.userId }
    });
    console.log("IsUpdated: ", isUpdated);
    if (!isUpdated[0]) {
      return res.status(500).json({
        message: "Unable to update the task"
      });
    }

    res.status(200).json({
      message: "Task successfully updated",
      task: newTask
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.query.userId
      }
    });
    if (!task) {
      res.status(404).json({
        message: "Task not found"
      });
    }

    const isDeleted = await Task.destroy({
      where: {
        id: req.params.id,
        userId: req.query.userId
      }
    });

    if (!isDeleted) {
      return res.status(500).json({
        message: "Unable to delete the task"
      });
    }
    res.status(200).json({
      message: "Task successfully deleted"
    });
  } catch (error) {}
};
