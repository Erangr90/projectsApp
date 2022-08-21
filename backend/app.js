const express = require("express");
const bodyParser = require("body-parser");
const colors = require("colors");
const connectDB = require("./config/db");
const path = require('path')
// Routes Import
const projectsRoutes = require("./routes/projects")
const usersRoutes = require("./routes/users")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Images Folder
app.use("/images", express.static(path.join('backend/images')))

connectDB();
// Set headers responses
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// Routes Middleware
app.use("/api/projects",projectsRoutes)
app.use("/api/users",usersRoutes)



module.exports = app;
