const express = require('express');

const app = express();
require('express-async-errors');
const cors = require('cors');

app.use(cors());
const port = 5000;
app.use(express.static('images'));

const authorization = require('./middleware/authorization');
const user = require('./routes/User');
const todos = require('./routes/Todos');

require('dotenv').config();
const connectDB = require('./connect/connect');

const notFoundMiddleware = require('./middleware/notFound');
const ErrorHandler = require('./middleware/errorHandler');

app.use(express.json({ limit: '30mb', extended: true }));

app.use('/api/v1/todos', authorization, todos);
app.use('/api/v1/auth', user);

app.use(notFoundMiddleware);
app.use(ErrorHandler);

const run = async () => {
  try {
    await connectDB('mongodb+srv://nini1234:niniko1234@cluster0.dnowldg.mongodb.net/?retryWrites=true&w=majority');
    app.listen(port, console.log(`server is listening to the port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

run();
