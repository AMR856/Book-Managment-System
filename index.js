require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const errorHandler = require('./src/utils/errorHandler');
const authorRouter = require('./src/author/author.routes');

app.use(bodyParser.json());
app.use('/authors', authorRouter);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);