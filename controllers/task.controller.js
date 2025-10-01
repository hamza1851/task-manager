import { Op } from "sequelize";
import { Task } from "../models/index.js";
import { getUserId } from "../utils/getUserId.js";
import logger from "../utils/logger.js";
// All controllers for task CRUD

// creating the task
export const createTask = async (req, res, next) => {
  const userId = getUserId(req).userId;
  try {
    const { title, description, priority, dueDate, status } = req.body; // extract all info form body

    if (!title || !priority || !dueDate) {
      // throw error if required fields are missing
      logger.error("Title, priority, and dueDate are required.");
      const err = new Error("Title, priority, and dueDate are required.");
      err.statusCode = 400;
      throw err;
    }

    // updated task object
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status,
      userId
    });

    //success response
    logger.info(`Task created with ID: ${task.id} for User ID: ${userId}`);
    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    next(err); // pass the error to error handling middleware
  }
};

// fetching all tasks with filters and sorting
export const getTasks = async (req, res, next) => {
  const userId = getUserId(req).userId;

  try {
    const {
      title,
      status,
      priority,
      startDate,
      endDate,
      sortBy = "dueDate",
      order = "DESC"
    } = req.query; // extract filters

    //construct the where clause
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

    // fetch tasks
    const tasks = await Task.findAll({
      where,
      order: [[sortBy, order.toUpperCase()]]
    });

    if (!tasks.length) {
      // if no task found
      logger.error("No tasks found")
      const err = new Error("No task found");
      err.statusCode = 404;
      throw err;
    }

    logger.info('Tasks fetched successfully')
    res.status(200).json(tasks);
  } catch (error) {
    next(error); // pass the error to error middleware
  }
};

// api for getting task by id
export const getTaskById = async (req, res, next) => {
  const userId = getUserId(req).userId;
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId }
    });
    if (!task) {
      // if no task then contruct the err and throw
      logger.error("Task not found by ID: ", req.params.id)
      const err = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }

    logger.info("Task fetched by ID: ", req.params.id)
    res.status(200).json(task);
  } catch (error) {
    next(error); // pass the error to error middleware
  }
};

export const updateTask = async (req, res, next) => {
  const userId = getUserId(req).userId;

  // extract the fields from body
  const { title, description, priority, dueDate, status } = req.body;
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId }
    });
    if (!task) {
      // if no task for id and userId
      logger.error("Task not found for update with ID: ", req.params.id)
      const err = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }

    // contruct new task object for updation
    const newTask = {
      title: title ?? task.title,
      description: description ?? task.description,
      priority: priority ?? task.priority,
      dueDate: dueDate ?? task.dueDate,
      status: status ?? task.status
    };

    const isUpdated = await Task.update(newTask, {
      // returns [affectedCount]
      where: { id: req.params.id, userId }
    });

    if (!isUpdated[0]) {
      logger.error("Unable to update task with ID: ", req.params.id)
      const err = new Error("Unable to update the task");
      err.statusCode = 500;
      throw err; // throw error for error handling middleware
    }

    logger.info("Task updated with ID: ", req.params.id)
    res.status(200).json({
      message: "Task successfully updated",
      task: newTask
    });
  } catch (error) {
    next(error);
  }
};

// API for deleting the task
export const deleteTask = async (req, res, next) => {
  const userId = getUserId(req).userId;
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId
      }
    });
    if (!task) {
      // if no task for id and userId
      logger.error("Task not found for deletion with ID: ", req.params.id)
      const err = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }

    const isDeleted = await Task.destroy({
      // return number of rows deleted
      where: {
        id: req.params.id,
        userId
      }
    });

    if (!isDeleted) {
      logger.error("Unable to delete task with ID: ", req.params.id)
      const err = new Error("Unable to delete the task");
      err.statusCode = 500;
      throw err;
    }

    logger.info("Task deleted with ID: ", req.params.id)
    res.status(200).json({
      message: "Task successfully deleted"
    });
  } catch (error) {
    next(error);
  }
};
