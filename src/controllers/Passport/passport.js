const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { pool } = require("../../dbConfig.js");
const globals = require('./globals.js');

function initialize(passport) {
  console.log("Initialized");

  const authenticateUser = (correo, contraseña, done) => {
    console.log(correo, contraseña);
    pool.query(
      `SELECT * FROM usuarios WHERE correo = $1`,
      [correo],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(contraseña, user.contraseña, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Contraseña incorrecta" });
            }
          });
        } else {
          return done(null, false, {
            message: "No existe usuario registrado con ese correo",
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "correo", passwordField: "contraseña" },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.codusuario));

  passport.deserializeUser((codusuario, done) => {
    pool.query(
      `SELECT * FROM usuarios WHERE codusuario = $1`,
      [codusuario],
      (err, results) => {
        if (err) {
          return done(err);
        }
        globals.setUserId(results.rows[0].codusuario);
        console.log(`ID is ${results.rows[0].codusuario}`);
        return done(null, results.rows[0]);
      }
    );
  });
}
module.exports = initialize;
