import { Op } from "sequelize";
import { Task } from "../models/index.js";
import { getUserId } from "../services/getUserId.js";
// All controllers for task CRUD


// creating the task
export const createTask = async (req, res, next) => {
  const userId = getUserId(req).userId;
  try {
    const { title, description, priority, dueDate, status } = req.body; // extract all info form body

    if (!title || !priority || !dueDate) { // throw error if required fields are missing
      const err = new Error("Title, priority, and dueDate are required.");
      err.StatusCode = 400;
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

    if (!tasks.length) { // if no task found
      const err = new Error("No task found");
      err.StatusCode = 404;
      throw err;
    }

    console.log("Fetched Tasks: ", tasks);
    console.log("filters: ", where);

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
    if (!task) { // if no task then contruct the err and throw
      const err = new Error("Task not found");
      err.StatusCode = 404;
      throw err;
    }

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
    console.log("TaskID: ", req.params.id, "UserID: ", userId);
    const task = await Task.findOne({
      where: { id: req.params.id, userId }
    });
    if (!task) {
      const err = new Error("Task not found")
      err.StatusCode = 404
      throw err
    }

    // contruct new task object for updation
    const newTask = {
      title: title ?? task.title,
      description: description ?? task.description,
      priority: priority ?? task.priority,
      dueDate: dueDate ?? task.dueDate,
      status: status ?? task.status
    };

    const isUpdated = await Task.update(newTask, { // returns [affectedCount]
      where: { id: req.params.id, userId }
    });

    console.log("IsUpdated: ", isUpdated);

    if (!isUpdated[0]) {
      const err = new Error("Unable to update the task")
      err.statusCode = 500
      throw err // throw error for error handling middleware
    }

    res.status(200).json({
      message: "Task successfully updated",
      task: newTask
    });
  } catch (error) {
    next(error) 
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
    if (!task) { // if no task for id and userId
      const err = new Error("Task not found")
      err.statusCode = 404
      throw err
    }

    const isDeleted = await Task.destroy({ // return number of rows deleted
      where: {
        id: req.params.id,
        userId
      }
    });

    if (!isDeleted) {
      const err = new Error("Unable to delete the task")
      err.statusCode = 500
      throw err
    }
    res.status(200).json({
      message: "Task successfully deleted"
    });
  } catch (error) {
    next(error)
  }
};
