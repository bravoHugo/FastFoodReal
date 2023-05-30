const { Router } = require("express");
const router = Router();
// const flash = require("express-flash");
// const passport = require("passport");
// const initializePassport = require("../controllers/Passport/passport.js");
// Configura la sesión de Express
// Inicializa Passport y establece la sesión de usuario
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

// Configura Passport
// initializePassport(passport);
// Rutas
router.get("/", (req, res) => {
  valorlegueado = req.isAuthenticated();
  res.render("index", { usuarioEstaLogueado: valorlegueado });
});
// Monta el enrutador en la aplicación

module.exports = router;
