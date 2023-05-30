const express = require("express");
const app = express();
const session = require("express-session");
// app.use(express.urlencoded({ extended: false }));
module.exports = session({
  secret: "secret", // Cambia esto por tu propia clave secreta
  resave: false,
  saveUninitialized: true,
});
app.use((req, res, next) => {
  app.locals.message = req.flash("message");
  next();
});
