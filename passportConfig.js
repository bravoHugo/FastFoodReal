const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

let userId = null;

function initialize(passport) {
  console.log("Initialized");

  const authenticateUser = (correo, contraseña, done) => {
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

  //analizar luego
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
        userId = results.rows[0].codusuario;
        console.log(userId);
        console.log(`ID is ${results.rows[0].codusuario}`);
        return done(null, results.rows[0]);
      }
    );
  });
}

module.exports = initialize;
