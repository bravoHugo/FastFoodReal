const renderIndex = (req, res) => {
  const usuarioEstaLogueado = req.isAuthenticated();
  console.log(usuarioEstaLogueado);
  res.render("index", { usuarioEstaLogueado });
};

module.exports = renderIndex;
