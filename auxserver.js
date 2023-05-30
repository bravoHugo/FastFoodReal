/* const express = require("express");
const app = express();
// const { pool } = require("./dbConfig");
// const bcrypt = require("bcrypt");
// const session = require("express-session");
// const flash = require("express-flash");
// const passport = require("passport");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 4000;

require("dotenv").config();
app.use("/assets", express.static("public"));
const initializePassport = require("./passportConfig");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);
app.use(flash()); */
/* Todos los metodos Get que no tienen métodos POST relacionados a su URL*/
/* app.get("/", (req, res) => {
  const usuarioEstaLogueado = req.isAuthenticated();
  res.render("index", { usuarioEstaLogueado });
});

app.get("/user/login", checkAuthenticated, (req, res) => {
  const usuarioEstaLogueado = req.isAuthenticated();
  res.render("login", { usuarioEstaLogueado });
});

app.get("/user/logout", (req, res) => {
  req.logout(() => {
    const usuarioEstaLogueado = req.isAuthenticated();
    req.flash("success_msg", "you have logget out");
    res.render("index", { usuarioEstaLogueado });
  });
});

app.get("/user/carrito", function (req, res) {
  const usuarioEstaLogueado = req.isAuthenticated();
  res.render("carro", { usuarioEstaLogueado });
});

app.get("/user/Checker", checkNotAuthenticated, (req, res) => {
  res.render("CheckerDashboard");
});
app.get("/user/Waiter", checkNotAuthenticated, (req, res) => {
  res.render("WaiterDashboard");
});
app.get("/user/Chef", checkNotAuthenticated, (req, res) => {
  res.render("CookerDashboard");
});

app.get("/user/index", checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  if (req.user.codperfil == "1") {
    res.redirect("/user/adminPanel/Dashboard");
  } else if (req.user.codperfil == "2") {
    res.redirect("/user/Checker");
  } else if (req.user.codperfil == "3") {
    res.redirect("/user/Chef");
  } else if (req.user.codperfil == "4") {
    res.redirect("/user/Waiter");
  } else {
    const usuarioEstaLogueado = req.isAuthenticated();
    res.render("index", { user: req.user.correo, usuarioEstaLogueado });
  }
}); */

/* /user/profile/:correo */
/* app.get("/user/profile/:correo", (req, res) => {
  const { correo } = req.params;
  res.render("profile", { correo, user: req.user.correo });
});

app.post("/user/profile/:correo", async (req, res) => {
  const { correo, nombres, apellidos, celular, direccion } = req.body;
  const errors = [];
  console.log({ correo, nombres, apellidos, celular, direccion });

  if (!nombres || !correo || !apellidos || !celular || !direccion) {
    errors.push({ message: "Por favor ingrese todos los campos" });
  }

  if (errors.length > 0) {
    res.render("profile", { errors, nombres, apellidos, celular, direccion });
  } else {
    try {
      const results = await pool.query(
        `UPDATE usuarios 
        SET nombres = $1, apellidos = $2, celular = $3, direccion = $4 
        WHERE correo = $5 
        RETURNING codusuario, contraseña`,
        [nombres, apellidos, celular, direccion, correo]
      );

      console.log(results.rows);
      req.flash("success_msg", "Información actualizada con éxito");
      res.redirect("/user/index");
    } catch (err) {
      console.error(err.message);
    }
  }
}); */

/*/user/adminPanel/Dashboard */
/* app.get(
  "/user/adminPanel/Dashboard",
  checkNotAuthenticated,
  function (req, res) {
    pool.query(
      `SELECT codusuario,nombres, correo, perfiles.nombre as cargo,perfiles.codperfil, usuarios.estado  FROM usuarios JOIN perfiles ON usuarios.codperfil = perfiles.codperfil WHERE usuarios.estado='1' ORDER BY codusuario asc`,
      (err, results) => {
        res.render("AdminDashboard", { usuarios: results.rows });
      }
    );
  }
);

app.post("/user/adminPanel/Dashboard", async function (req, res) {
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
}); */

/* //REGISTRO DE ADMINISTRADOR : */

/* app.get("/user/adminPanel/register", checkNotAuthenticated, (req, res) => {
  res.render("AdminRegister");
});

app.post("/user/adminPanel/register", async (req, res) => {
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
}); */
/*/user/newPassword/:correo */

/* app.get("/user/newPassword/:correo", (req, res) => {
  const { correo } = req.params;
  res.render("newPassword", { correo });
});

app.post("/user/newPassword", async (req, res) => {
  let { correo, contraseña, contraseña2 } = req.body;
  let errors = [];
  console.log({ correo, contraseña, contraseña2 });

  if (contraseña.length < 6) {
    errors.push({ message: "La contraseña debe tener al menos 6 caracteres" });
  }

  if (contraseña !== contraseña2) {
    errors.push({ message: "Las contraseñas no coinciden" });
  }

  if (errors.length > 0) {
    res.render("newPassword", {
      errors,
      correo,
      contraseña,
      contraseña2,
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
          pool.query(
            `UPDATE usuarios SET contraseña = $1
            WHERE correo = $2 RETURNING codusuario, contraseña`,
            [hashedPassword, correo],
            (err, results) => {
              if (err) {
                console.log(err);
              }
              console.log(results.rows);
              req.flash("success_msg", "Contraseña actualizada con éxito");
              res.redirect("/user/login");
            }
          );
        }
      }
    );
  }
});
 */
/* /user/recuperar */

/* app.get("/user/recuperar", (req, res) => {
  res.render("recuperar");
}); */

/* app.post("/user/recuperar", (req, res) => {
  const { correo } = req.body;
  let errors = [];

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "KentakitoHamburger@gmail.com",
      pass: "zqrhdadoooseaixs",
    },
  });

  const mailOptions = {
    from: "KentakitoHamburger@gmail.com",
    to: correo,
    subject: "Restablecimiento de contraseña",
    html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña: <a href="http://localhost:4000/user/newPassword/${correo}">Restablecer contraseña</a></p>`,
  };

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
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.send("Ha ocurrido un error al enviar el mensaje automático.");
          } else {
            console.log("Mensaje automático enviado: " + info.response);
            res.render("emailSend");
          }
        });
      } else {
        errors.push({ message: "Correo no registrado" });
        res.render("recuperar", { errors });
      }
    }
  );
}); */

/* /user/venta */

/* app.get("/user/venta", checkAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("login");
});

app.post("/user/venta", async (req, res) => {
  if (!req.body.productosEnCarrito) {
    req.flash("error_msg", "No se han proporcionado productos en el carrito");
    res
      .status(400)
      .send({ message: "No se han proporcionado productos en el carrito" });
    return;
  }

  let productosEnCarrito;
  try {
    productosEnCarrito = JSON.parse(req.body.productosEnCarrito);
  } catch (err) {
    console.error(err.message);
    req.flash("error_msg", "El carrito de productos no es válido");
    res.status(400).send({ message: "El carrito de productos no es válido" });
    return;
  }

  try {
    for (const producto of productosEnCarrito) {
      // Get the product info from the cart
      console.log(producto);
      const { id, cantidad, precio } = producto;
      // Insert the product info into the DB
      console.log(id, cantidad, precio);
      await pool.query(
        `INSERT INTO detalle_ventas (codventa,codplatillo, cantidad, precio,estado) 
         VALUES ($1,$2, $3, $4,$5)`,
        ["1", id, cantidad, precio, "1"]
      );
      console.log("inserted row");
    }
    console.log("finished inserting rows");
    // Empty the cart
    req.session.carrito = [];

    req.flash("success_msg", "Venta realizada con éxito");
    res.redirect("/user/carrito");
  } catch (err) {
    console.error(err.message);
    req.flash("error_msg", "Ha ocurrido un error al realizar la venta");
    res
      .status(500)
      .send({ message: "Ha ocurrido un error al realizar la venta" });
  }
}); */

/* /user/register */

/*app.get("/user/register", checkAuthenticated, (req, res) => {
  res.render("login");
});

app.post("/user/register", async (req, res) => {
  let { nombres, correo, contraseña, contraseña2 } = req.body;

  let errors = [];

  console.log({
    nombres,
    correo,
    contraseña,
    contraseña2,
  });
  if (!nombres || !correo || !contraseña || !contraseña2) {
    errors.push({ message: "Por favor ingrese todos los campos" });
  }

  if (contraseña.length < 6) {
    errors.push({ message: "La contraseña debe tener al menos 6 caracteres" });
  }

  if (contraseña !== contraseña2) {
    errors.push({ message: "Las contraseñas no coinciden" });
  }

  if (errors.length > 0) {
    res.render("login", {
      errors,
      nombres,
      correo,
      contraseña,
      contraseña2,
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
          res.render("login", { errors });
        } else {
          pool.query(
            `INSERT INTO usuarios (nombres, correo, contraseña,codperfil,estado) VALUES ($1,$2,$3,5,'1') 
            RETURNING codusuario, contraseña`,
            [nombres, correo, hashedPassword],
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
}); */

/* app.post(
  "/user/login",
  passport.authenticate("local", {
    successRedirect: "/user/index",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/index");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    const usuarioEstaLogueado = req.isAuthenticated();

    res.render("index", { usuarioEstaLogueado });
  }
}
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); */
