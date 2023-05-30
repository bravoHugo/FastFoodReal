const { pool } = require("../../dbConfig");
const bcrypt = require("bcrypt");
const { json, response } = require("express");
const Swal = require("sweetalert2");
//CONTROLADORES CRUD
const deleteuser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(" UPDATE usuarios SET  estado='0' WHERE codusuario=$1;", [
      id,
    ]);
    res.redirect("/user/admin/permission");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al eliminar el usuario",
      error,
    });
  }
};
const getuserbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      "SELECT usuarios.codusuario, usuarios.nombres, usuarios.apellidos, usuarios.correo, usuarios.dni, usuarios.celular, usuarios.direccion, perfiles.nombre AS Perfil FROM usuarios INNER JOIN perfiles ON usuarios.codperfil = perfiles.codperfil where usuarios.estado='1' AND usuarios.codusuario=$1;",
      [id]
    );
    //envia en formato json
    res.json(resultado.rows);
  } catch (error) {}
};
const postUserbyid = async (req, res) => {
  try {
    const { id, dni, nombre, apellidos, telefono, direccion, perfil } =
      req.body;
    const userupdate = await pool.query(
      "UPDATE usuarios SET dni=$1, nombres=$2, apellidos=$3, celular=$4, direccion=$5, codperfil=$6 WHERE codusuario=$7;",
      [dni, nombre, apellidos, telefono, direccion, perfil, id]
    );
    res.status(201).json(userupdate.rows[0]); // Devuelve el nuevo proveedor como respuesta
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al obtener los perfiles",
      error,
    });
  }
};
const getPerfiles = async (req, res) => {
  try {
    const resultado = await pool.query("SELECT *FROM perfiles");
    res.json(resultado.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al obtener los perfiles",
      error,
    });
  }
};
//1.CONTROLADORES PARA USUARIOS
//1.1.REGISTRAR USUARIO
const getUserRegister = async (req, res) => {
  //MANDAREMOS LOS PERFILES PARA USAR EL COMOBOX
  const perfiles = await pool.query("SELECT *FROM PERFILES");
  let valor = req.flash("emailExists")[0];
  let valor2 = req.flash("exist")[0];
  let valor3 = req.flash("sucess")[0];
  let valor4 = req.flash("error")[0];
  res.render("AdminRegister", {
    perfiles: perfiles.rows,
    exist: valor2,
    sucess: valor3,
    error: valor4,
    emailExists: valor,
  });
};
const postUserRegister = async (req, res) => {
  const {
    contraseña1,
    nombres,
    apellidos,
    correo,
    dni,
    numcelular,
    direccion,
    codperfil,
  } = req.body;
  let hashedPassword = await bcrypt.hash(contraseña1, 10);
  const result1 = await pool.query("SELECT *FROM usuarios where correo = $1", [
    correo,
  ]);
  if (result1.rows.length > 0) {
    // El correo electrónico ya existe en la base de datos
    req.flash("emailExists", true);
    return res.redirect("/user/admin/register");
  }
  if (contraseña1.length < 6) {
    req.flash("exist", true);
    return res.redirect("/user/admin/register");
  }
  try {
    await pool.query(
      "INSERT INTO usuarios(contraseña, nombres, apellidos, correo, dni, celular, direccion, codperfil, estado)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        hashedPassword,
        nombres,
        apellidos,
        correo,
        dni,
        numcelular,
        direccion,
        codperfil,
        "1",
      ]
    );
    req.flash("sucess", true);
    res.redirect("/user/admin/register");
    console.log("INGRESADO CON EXITO");
  } catch (error) {
    console.log(error);
    req.flash("error", true);
    res.redirect("/user/admin/register");
  }
};
// 1.2.ASIGNAR PERMISOS
const getAssingnPermisos = async (req, res) => {
  try {
    result = await pool.query(
      "SELECT usuarios.codusuario, usuarios.nombres, usuarios.apellidos, usuarios.correo, usuarios.dni, usuarios.celular, usuarios.direccion, perfiles.nombre AS Perfil FROM usuarios INNER JOIN perfiles ON usuarios.codperfil = perfiles.codperfil where usuarios.estado='1';"
    );
    res.render("Assignprofiles", { usuarios: result.rows });
  } catch (error) {
    console.log(error)
    res.render("Assignprofiles");
  }
};

//CONTROLADORES PARA  MARCAS
const getMarcas = async (req, res) => {
  try {
    const marcas = await pool.query("SELECT * FROM marcas_productos");
    res.render("MarcasRegister", { marcas: marcas.rows });
  } catch (err) {
    console.error(err.message);
  }
};
const getMarcasbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const marcas = await pool.query(
      "SELECT * FROM marcas_productos WHERE codmarca=$1",
      [id]
    );
    res.json(marcas.rows);
  } catch (err) {
    console.error(err.message);
  }
};
const postMarcas = async (req, res) => {
  try {
    const { nombre } = req.body;
    const newMarca = await pool.query(
      "INSERT INTO marcas_productos (nombre,estado) VALUES($1,$2) RETURNING *",
      [nombre, "1"]
    );
    console.log("post satisfactorio");
    res.redirect("/marcas");
  } catch (err) {
    console.error(err.message);
  }
};
///////*/*/*/*/*/*////////////*///////
//CONTROLADORES PARA  PRODUCTOS
const getProducto = async (req, res) => {
  try {
    const productos = await pool.query(
      `SELECT productos.idproducto, productos.codigo_producto, productos.nombre, categorias_productos.nombre as "Categoria", marcas_productos.nombre as "Marcas", unidad.nombre as "Unidad", productos.descripcion, productos.estado
        FROM productos
        INNER JOIN marcas_productos ON productos.codmarca = marcas_productos.codmarca
        INNER JOIN unidad ON unidad.id_unidad = productos.id_unidad
        INNER JOIN categorias_productos ON categorias_productos.codcategoria = productos.codcategoria
        WHERE productos.estado = '1'`
    );
    res.render("registerProducts", { products: productos.rows });
  } catch (err) {
    console.error(err.message);
  }
};
const getProductobyID = async (req, res) => {
  try {
    const { id } = req.params;
    const productos = await pool.query(
      "SELECT * FROM productos WHERE idproducto=$1",
      [id]
    );
    res.json(productos.rows);
  } catch (err) {
    console.error(err.message);
  }
};
const postProductos = async (req, res) => {
  try {
    const { codigo, nombre, desc, unidad, categorias, marca } = req.body;
    const newProducto = await pool.query(
      "INSERT INTO public.productos(codigo_producto, nombre, descripcion, codcategoria, codmarca,id_unidad,estado)VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *",
      [codigo, nombre, desc, categorias, marca, unidad, "1"]
    );
    res.redirect("/productos");
  } catch (err) {
    console.error(err.message);
  }
};
const deleteProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const productos = await pool.query(
      "UPDATE productos SET estado='0' WHERE idproducto=$1",
      [id]
    );
    res.redirect("/productos");
  } catch (error) {
    console.error(error.message);
  }
};
const Updateproducts = async (req, res) => {
  const { id, codigo, nombre, desc, unidad, categorias, marca } = req.body;
  try {
    const productos = await pool.query(
      "UPDATE productos SET codigo_producto=COALESCE($1,codigo_producto), nombre=COALESCE($2,nombre), descripcion=COALESCE($3,descripcion), codcategoria=COALESCE($4,codcategoria), codmarca=COALESCE($5,codmarca), id_unidad=COALESCE($6,id_unidad), estado=COALESCE('1',estado) WHERE idproducto=$7 RETURNING *",
      [codigo, nombre, desc, categorias, marca, unidad, id]
    );
    res.json(productos.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
};

//CONTROLADOR PARA UNIDAD
const getUnidad = async (req, res) => {
  const response = await pool.query("SELECT *from unidad");
  res.json(response.rows);
};
const getCategories4Products = async (req, res) => {
  try {
    const response = await pool.query("SELECT  *FROM categorias_productos");
    res.json(response.rows);
  } catch (error) {
    res.render(error);
  }
};

const getMarcas4Products = async (req, res) => {
  try {
    const response = await pool.query("SELECT  *FROM marcas_productos");
    res.json(response.rows);
  } catch (error) {
    res.render(error);
  }
};
//////////////////////////************///////////////// */
//CONTROLADORES PARA  CATEGORIAS
const getCategorias = async (req, res) => {
  try {
    const categorias = await pool.query(
      "SELECT *FROM categorias_productos WHERE estado='1'"
    );
    res.render("RegisterCategories", { categorias: categorias.rows });
  } catch (err) {
    console.error(err.message);
  }
};
const getCategoriasbyID = async (req, res) => {
  try {
    const { id } = req.params;
    const categorias = await pool.query(
      "SELECT *FROM categorias_productos WHERE codcategoria=$1",
      [id]
    );
    res.json(categorias.rows);
  } catch (err) {
    console.error(err.message);
  }
};
const postCategorias = async (req, res) => {
  try {
    const { nombre } = req.body;
    const newCategoria = await pool.query(
      "INSERT INTO categorias_productos(nombre,estado)VALUES($1,$2) RETURNING *",
      [nombre, "1"]
    );
    res.json(newCategoria.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};
const UpdateCategorias = async (req, res) => {
  try {
    const { id, nombre } = req.body;
    const updateCategoria = await pool.query(
      "UPDATE categorias_productos SET nombre=$1 WHERE codcategoria=$2",
      [nombre, id]
    );
    res.json(updateCategoria.rows[0]);
  } catch (error) {}
};
const deleteCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategoria = await pool.query(
      "UPDATE categorias_productos SET estado='0' WHERE codcategoria=$1",
      [id]
    );
    res.redirect("/categorias");
  } catch (error) {
    console.log(error.message);
  }
};
//////////////////////////************///////////////// */
//CONTROLADORES PARA  COMPRAS
const getCompras = async (req, res) => {
  try {
    const compras = await pool.query("SELECT * FROM compras");
    res.render("RegistroCompras");
  } catch (err) {
    console.error(err.message);
  }
};
const getComprasbyID = async (req, res) => {
  try {
    const { id } = req.params;
    const compras = await pool.query(
      "SELECT * FROM compras WHERE codcompra=$1",
      [id]
    );
    res.json(compras.rows);
  } catch (err) {
    console.error(err.message);
  }
};
const postCompras = async (req, res) => {
  try {
    const {
      "fecha-actual": fechacompra,
      totalcompra,
      estado,
      proveedor,
    } = req.body;
    const newCompra = await pool.query(
      "INSERT INTO public.compras(fecha_compra, totalcompra, estado_compra, codproveedor) VALUES ($1, $2, $3, $4) RETURNING *;",
      [fechacompra, totalcompra, estado, proveedor]
    );
    res.json(newCompra.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar la compra" });
  }
};

const prove4compras = async (req, res) => {
  try {
    const response = await pool.query("SELECT *FROM PROVEEDORES");
    res.json(response.rows);
  } catch (err) {
    res.send(err);
  }
};
const product4compras = async (req, res) => {
  try {
    const response =
      await pool.query(`SELECT productos.idproducto, productos.codigo_producto, productos.nombre, categorias_productos.nombre as "Categoria", marcas_productos.nombre as "Marcas", unidad.nombre as "Unidad", productos.descripcion, productos.estado
    FROM productos
    INNER JOIN marcas_productos ON productos.codmarca = marcas_productos.codmarca
    INNER JOIN unidad ON unidad.id_unidad = productos.id_unidad
    INNER JOIN categorias_productos ON categorias_productos.codcategoria = productos.codcategoria
    WHERE productos.estado = '1'`);
    res.json(response.rows);
  } catch (error) {
    res.send(error);
  }
};
//CONTROLADOR PARA DETALLE COMPRAS :
const getdetallecompras = async (req, res) => {
  try {
    const response = pool.query(`
    SELECT  iddetalle,detalle_compras.idcompra , compras.fecha_compra ,compras.totalcompra, proveedores.nomcompania ,proveedores.representante,
    productos.nombre ,cantidad , precio , total
    FROM detalle_compras
    INNER JOIN compras ON compras.idcompra = detalle_compras.idcompra
    INNER JOIN proveedores ON proveedores.codproveedor = compras.codproveedor
    INNER JOIN productos ON productos.idproducto = detalle_compras.idproducto;
  `);

    res.render("DetalleCompras", { detalle: response.rows });
  } catch (error) {
    res.send(error);
  }
};
const postdetalleCompras = async (req, res) => {
  try {
    const {
      idcompra: idInserdado,
      idproducto: idproducto,
      cantidad: cantidad,
      precio: costo,
      total: total,
    } = req.body;
    const newCompra = await pool.query(
      "INSERT INTO public.detalle_compras(idcompra, idproducto, cantidad, precio, total) VALUES ( $1, $2, $3, $4, $5) RETURNING *;",
      [idInserdado, idproducto, cantidad, costo, total]
    );
    res.json(newCompra.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar la compra" });
  }
};
//////////////////////////************///////////////// */
//CONTROLADORES PARA PROVEEDORES
const getProveedores = async (req, res) => {
  try {
    const proveedores = await pool.query(
      "SELECT * FROM proveedores WHERE estado='1'"
    );
    res.render("RegisterProveedores", {
      proveedores: proveedores.rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};
const getProveedoresbyID = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedores = await pool.query(
      "SELECT * FROM proveedores WHERE codproveedor=$1",
      [id]
    );
    res.json(proveedores.rows);
  } catch (err) {
    console.error(err.message);
  }
};
const editProveedor = async (req, res) => {
  try {
    const {
      id,
      compania,
      direccion,
      telefono,
      representante,
      correo,
      numcuenta,
      nombre,
      ruc,
    } = req.body;
    const result = await pool.query(
      "UPDATE proveedores SET nomcompania = $1, direccion = $2,telefono = $3,representante = $4,correo = $5,nrocntabanc = $6,nombre = $7,ruc = $8,estado = $9 WHERE codproveedor = $10;",
      [
        compania,
        direccion,
        telefono,
        representante,
        correo,
        numcuenta,
        nombre,
        ruc,
        "1",
        id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
  }
};
const deleproveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE proveedores SET estado=0 WHERE codproveedor=$1",
      [id]
    );
    res.redirect("/proveedores");
  } catch (error) {
    console.log(error);
  }
};
const postProveedores = async (req, res) => {
  try {
    const {
      compania,
      direccion,
      telefono,
      representante,
      correo,
      numcuenta,
      nombre,
      ruc,
    } = req.body;
    const newProveedor = await pool.query(
      "INSERT INTO proveedores(nomcompania, direccion, telefono, representante, correo, nrocntabanc, nombre, ruc, estado)VALUES ( $1, $2, $3, $4,$5, $6, $7, $8, $9) RETURNING *",
      [
        compania,
        direccion,
        telefono,
        representante,
        correo,
        numcuenta,
        nombre,
        ruc,
        "1",
      ]
    );
    res.status(201).json(newProveedor.rows[0]); // Devuelve el nuevo proveedor como respuesta
  } catch (err) {
    console.error(err);
  }
};
//IMAGENES DE LOS USUARIOS :
const getallmenu = async (req, res) => {
  const result = await pool.query("SELECT *FROM menues");
  res.json(result.rows);
};
const getmenu = async (req, res) => {
  const result = await pool.query(
    "SELECT *FROM menues WHERE estado='1'or estado='2'"
  );
  res.render("RegisterMenues", { datamenu: result.rows });
};
const postmenu = async (req, res) => {
  const { nombre, precio, stock, categoria } = req.body;
  const image = req.file;
  const result = await pool.query(
    "INSERT INTO menues(nombre, precio, stock, img,estado,categoria)VALUES ($1, $2, $3, $4, $5,$6)",
    [nombre, precio, stock, image.filename, "1", categoria]
  );
  res.json(result.rows[0]);
};
const getmenubyid = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT *FROM menues WHERE codplatillo=$1", [
    id,
  ]);
  res.json(result.rows);
};
const patchmenubyid = async (req, res) => {
  const { id, nombre, precio, stock, categoria } = req.body;
  const image = req.file;
  const imageData = image && image.filename ? image.filename : null;
  const result = await pool.query(
    "UPDATE menues SET nombre = $1,precio = $2,stock = $3,categoria=$4,img = COALESCE($5, img) WHERE codplatillo = $6",
    [nombre, precio, stock, categoria, imageData, id]
  );
  res.json(result.rows[0]);
};
const deletMenu = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "UPDATE menues SET estado=0 WHERE codplatillo=$1",
    [id]
  );
  res.redirect("/menues");
};
const publicarMenu = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "UPDATE menues SET estado=2 WHERE codplatillo=$1",
    [id]
  );
  res.redirect("/menues");
};
const quitarpubliMenu = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "UPDATE menues SET estado=1 WHERE codplatillo=$1",
    [id]
  );
  res.redirect("/menues");
};
module.exports = {
  getMarcas,
  getmenu,
  postmenu,
  getMarcasbyId,
  postMarcas,
  getProducto,
  getProductobyID,
  postProductos,
  getCategorias,
  getCategoriasbyID,
  postCategorias,
  getCompras,
  getComprasbyID,
  postCompras,
  getProveedores,
  getProveedoresbyID,
  postProveedores,
  getUserRegister,
  postUserRegister,
  getAssingnPermisos,
  deleteuser,
  getuserbyid,
  getPerfiles,
  postUserbyid,
  editProveedor,
  deleproveedor,
  UpdateCategorias,
  deleteCategories,
  getmenubyid,
  patchmenubyid,
  getallmenu,
  deletMenu,
  publicarMenu,
  quitarpubliMenu,
  getCategories4Products,
  getMarcas4Products,
  getUnidad,
  deleteProducts,
  Updateproducts,
  prove4compras,
  product4compras,
  postdetalleCompras,
  getdetallecompras,
};
