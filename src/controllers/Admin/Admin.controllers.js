const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { pool } = require("../../dbConfig.js");

const Todashboard = async (req, res) => {
  const results = await pool.query(
    `SELECT codusuario,nombres, correo, perfiles.nombre as cargo,perfiles.codperfil, usuarios.estado  FROM usuarios JOIN perfiles ON usuarios.codperfil = perfiles.codperfil WHERE usuarios.estado='1' ORDER BY codusuario asc`
  );
  req.flash("usuarios", results.rows);
  res.render("AdminDashboard", { usuarios: results.rows });
};

const Post_dashboard = async function (req, res) {
  const body = req.body;

  // Actualizar codperfil
  const updates = Object.keys(body)
    .filter((key) => key.startsWith("cargo_"))
    .map((key) => ({
      codperfil: body[key],
      codusuario: key.replace("cargo_", ""),
    }));
  const query = "UPDATE usuarios SET codperfil=$1 WHERE codusuario=$2";
  for (const update of updates) {
    try {
      await pool.query(query, [update.codperfil, update.codusuario]);
      console.log(
        `${update.codusuario} actualizado con el cargo ${update.codperfil}`
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Actualizar estado
  const updates2 = Object.keys(body)
    .filter((key) => key.startsWith("estado_"))
    .map((key) => ({
      estado: body[key],
      codusuario: key.replace("estado_", ""),
    }));
  const query1 = "UPDATE usuarios SET estado=$1 WHERE codusuario=$2";
  for (const update of updates2) {
    try {
      await pool.query(query1, [update.estado, update.codusuario]);
      console.log(
        `${update.codusuario} actualizado el estado a ${update.estado}`
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Redirigir a la página de edición
  res.redirect("/user/adminPanel/Dashboard");
};

// REGISTRAR ADMIN
const Post_admin = async (req, res) => {
  let { correo, contraseña, cargo } = req.body;

  let errors = [];

  console.log({
    correo,
    contraseña,
    cargo,
  });
  if (!correo || !contraseña) {
    errors.push({ message: "Por favor ingrese todos los campos" });
  }

  if (contraseña.length < 6) {
    errors.push({ message: "La contraseña debe tener al menos 6 caracteres" });
  }
  if (errors.length > 0) {
    res.render("AdminPanel", {
      errors,
      correo,
    });
  } else {
    let hashedPassword = await bcrypt.hash(contraseña, 10);
    console.log(hashedPassword);
    pool.query(
      `SELECT * FROM usuarios
          WHERE correo = $1`,
      [correo],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);
        if (results.rows.length > 0) {
          errors.push({ message: "Correo ya registrado" });
          res.render("AdminRegister", { errors });
        } else {
          pool.query(
            `INSERT INTO usuarios (correo, contraseña,codperfil,estado) VALUES ($1,$2,$3,$4) 
              RETURNING codusuario, contraseña,codperfil,estado`,
            [correo, hashedPassword, cargo, "1"],
            (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log(results.rows);
              req.flash(
                "success_msg",
                "Ahora estas registrado. Por favor inicia sesión"
              );
              res.redirect("/user/login");
            }
          );
        }
      }
    );
  }
};
module.exports = {
  Todashboard,
  Post_dashboard,
  Post_admin,
};
