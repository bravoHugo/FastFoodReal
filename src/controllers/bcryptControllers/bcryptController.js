//controlador para comparar la contraseña con la contraseña de la base de datos
const ConfirmationCompare = (err, isMatch) => {
  if (err) {
    console.log(err);
  }
  if (isMatch) {
    return done(null, user);
  } else {
    return done(null, false, { message: "Contraseña incorrecta" });
  }
};
module.exports = ConfirmationCompare;
