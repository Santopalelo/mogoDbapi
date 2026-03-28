require('dotenv').config();

const express = require('express');
const cors = require('cors');
const logRequest = require('./middlewares/logger.js');
const validateTodo = require('./middlewares/validator.js');
const errorhandler = require('./middlewares/errorHandler.js');
const connectDB = require('./database/db.js');
const Todo = require('./models/todo.model.js');
const app = express();
app.use(express.json()); // Parse JSON bodies

app.use(cors('*'));

connectDB();

app.use(logRequest);

app.get("/todos", async (req, res) => {
    try {
        const { completed } = req.query;

        let filter = {};

        if (completed !== undefined) {
            filter.completed = completed === "true";
        }

        const todos = await Todo.find(filter);
        res.json(todos);
    } catch (error) {
        next(error);
    }
});

app.get('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// POST New – Create
app.post('/todos', validateTodo, async (req, res, next) => {
  const { task, completed } = req.body;
  const newTodo = new Todo({
    task,
    completed,
  });

  await newTodo.save();
  try {
    res.status(201).json(newTodo); // Echo back
  } catch (error) {
    next(error);
  }
});

// PATCH Update – Partial
app.patch('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// DELETE Remove
app.delete('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: `Todo ${req.params.id} deleted` });
  } catch (error) {
    next(error);
  }
});

app.use(errorhandler);

const PORT = process.env.PORT||4000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
