const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt"); 
const { pool } = require("../../dbConfig.js");
const globals = require("../Passport/globals.js");
const { json } = require("express");
const Swal = require("sweetalert2");

const getResumen = async (req, res) => {
  let pedido_mesas = null;
  const checkerQueryResult = await pool.query(
    `SELECT pedido_mesas.codventa,pedido_mesas.codmesa, pedido_mesas.platillo, pedido_mesas.cantidad, pedido_mesas.estado,pedido_mesas.fecha_hora,
    pedido_mesas.estadonuevo, pedido_mesas.precio
      FROM pedido_mesas
      WHERE pedido_mesas.estado = '4'
      Group by pedido_mesas.codventa,pedido_mesas.codmesa, pedido_mesas.platillo, pedido_mesas.cantidad, pedido_mesas.estado,pedido_mesas.fecha_hora,pedido_mesas.estadonuevo,pedido_mesas.precio
      ORDER BY pedido_mesas.codventa
    `
  );
  req.session.pedidoMesas = checkerQueryResult.rows;
  pedido_mesas = req.session.pedidoMesas;

  const userQueryResult = await pool.query(
    `SELECT detalle_ventas.codventa, detalle_ventas.codplatillo, detalle_ventas.cantidad, detalle_ventas.estado, menues.nombre,menues.precio, ventas.tipoventa, detalle_ventas.estadonuevo
      FROM detalle_ventas
      JOIN menues ON detalle_ventas.codplatillo = menues.codplatillo
      JOIN ventas ON detalle_ventas.codventa = ventas.codventa
      WHERE detalle_ventas.estado = '4'
      Group by detalle_ventas.codventa, detalle_ventas.codplatillo, detalle_ventas.cantidad, detalle_ventas.estado, menues.nombre, menues.precio, ventas.tipoventa, detalle_ventas.estadonuevo
      ORDER BY detalle_ventas.codventa`,
  );
  req.session.pedidos = userQueryResult.rows;
  pedidos = req.session.pedidos;
  res.render("resumeVentas", { pedidos,pedido_mesas });
}

const getObtenercodventa = async (req, res) => {
  try {
    const codventaQueryResult = await pool.query(
      `SELECT codventa
      FROM ventas
      ORDER BY codventa DESC
      LIMIT 1;`,
    );
    console.log(codventaQueryResult.rows,"datos")
    res.json(codventaQueryResult.rows);
  }
  catch (error) {
    console.error(error); // Imprime el error en la consola para el análisis
    res.status(500).json({ error: "Error al generar la boleta" });
  }
}

const postcheckerGenerateLlevar = async (req, res) => {
  try {
    const nombreCajero = req.body.nombreCajero;
    const detalle_pedido = JSON.parse(req.body.detalle_pedido);
    const {DNI,nombres, apellidos, telefono, direccion, fechaHoraActual} = req.body;
    console.log(DNI, nombres, apellidos, telefono, direccion, fechaHoraActual)
    console.log("nombre del cajero:",nombreCajero)
    console.log(detalle_pedido, "detalle pedido para guardar")
    


    let total = 0;
    await pool.query("BEGIN");

    const usuarioInsertResult = await pool.query(
      `INSERT INTO usuarios (nombres,apellidos, celular, direccion,dni,codperfil,estado) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING codusuario`,
      [nombres, apellidos, telefono, direccion, DNI,'5', '1']
    );
    const codusuario = usuarioInsertResult.rows[0].codusuario;

    const ventaInsertResult = await pool.query(
      `INSERT INTO ventas (estado) VALUES ($1) RETURNING codventa`,
      ['4']
    );
    const codventa = ventaInsertResult.rows[0].codventa;

    for (let i = 0; i < detalle_pedido.length; i++) {
      const platillo = parseInt(detalle_pedido[i].codplatillo);
      const cantidad = parseInt(detalle_pedido[i].cantidad);
      const precio = parseFloat(detalle_pedido[i].precio);
      console.log("platillo:", platillo, cantidad, precio);
      total = total + (precio * cantidad);
      
      console.log(total);
      await pool.query(
        `INSERT INTO detalle_ventas (cantidad, codplatillo,codventa, estado,precio,estadonuevo) VALUES ($1,$2,$3,$4,$5,$6)`,
        [cantidad, platillo, codventa, '4', precio, '3']
      );
    }
    total +=2;
    await pool.query(
      `update ventas set tipoventa=$1, fechayhora=$2, codusuario=$3, preciototal=$4 where codventa= $5`,
      ['paraLlevar', fechaHoraActual,codusuario,total, codventa ]
    );
    console.log(total);
    await pool.query("COMMIT");
    console.log("enviado a la base de datos");
  } catch (err) {
    console.error(err.message);
    await pool.query("ROLLBACK");
    req.flash("error_msg", err.message);
    res.status(400).send({ message: err.message });
    
  }
};

const postcheckerLlevar = async (req, res) => {
  const estadoTabla = req.body.estado_tabla;
  let pedido_llevar = undefined;
  console.log(estadoTabla, "el estado de la tabla")
  if (estadoTabla===1) {
    const codplatillo = req.body.platillo;
    const cantidades = req.body.cantidades;
    const precios = req.body.precios;
    console.log(codplatillo, cantidades, precios, "pedido_llevar")
    pedido_llevar = [];
    for (let i = 0; i < codplatillo.length; i++) {
      const pedido = {
        codplatillo: codplatillo[i],
        cantidad: cantidades[i],
        precio: precios[i]
      };
      pedido_llevar.push(pedido);
    }
  }
  console.log(pedido_llevar, "pedido_llevar en un solo array");
  req.session.pedido_llevar = pedido_llevar;
  res.redirect("/VentasLlevar");
}


const Tologin = (req, res) => {
  const usuarioEstaLogueado = req.isAuthenticated();
  res.render("login", { usuarioEstaLogueado, messages: req.flash() });
};

const Tologout = (req, res) => {
  req.logout(() => {
    const usuarioEstaLogueado = req.isAuthenticated();
    req.flash("success_msg", "you have logget out");
    res.render("index", { usuarioEstaLogueado });
  });
};

const ToCart = function (req, res) {
  const usuarioEstaLogueado = req.isAuthenticated();
  res.render("carro", { usuarioEstaLogueado });
};
const thanks = function (req, res) {
  const usuarioEstaLogueado = req.isAuthenticated();
  res.render("gracias", { usuarioEstaLogueado });
}

const getWaiter = async (req, res) => {
  res.render("Waiter");
}

const Towaiter = async  (req, res) => {
  const mesa1QueryResult = await pool.query(
    `select estado
    FROM mesas
    WHERE codmesa = '1';`,
  );
  const mesa2QueryResult = await pool.query(
    `select estado
    FROM mesas
    WHERE codmesa = '2';`,
  );
  const mesa3QueryResult = await pool.query(
    `select estado
    FROM mesas
    WHERE codmesa = '3';`,
  );
  const mesa4QueryResult = await pool.query(
    `select estado
    FROM mesas
    WHERE codmesa = '4';`,
  );
  let buttonestado1 = mesa1QueryResult.rows[0].estado;
  let buttonestado2 = mesa2QueryResult.rows[0].estado;
  let buttonestado3 = mesa3QueryResult.rows[0].estado;
  let buttonestado4 = mesa4QueryResult.rows[0].estado;

  console.log(buttonestado1, buttonestado2, buttonestado3,buttonestado4)
  res.render("WaiterDashboard", { buttonestado1, buttonestado2 ,buttonestado3,buttonestado4})
};

const TowaiterPlatillo = async (req, res) => {
  try {
    const platillosQueryResult = await pool.query(
      `select codplatillo, precio, nombre from menues`,
    );
    console.log(platillosQueryResult);
    res.json(platillosQueryResult.rows);
  }
  catch (error) {}
}

const getCheker = async (req, res) => {
  res.render("Checker");
}

const checkerPresencial = async (req, res) => {
  const mesa1QueryResult = await pool.query(
    `select estado
    FROM mesas
    WHERE codmesa = 1;`,
  );
  const mesa2QueryResult = await pool.query(
    `select estado
    FROM mesas
    WHERE codmesa = 2;`,
  );
  const mesa3QueryResult = await pool.query(
    `select estado
    FROM mesas
    WHERE codmesa = 3;`,
  );
  const mesa4QueryResult = await pool.query(
    `select estado
    FROM mesas
    WHERE codmesa = 4;`,
  );
  let buttonestado1 = mesa1QueryResult.rows[0].estado;
  let buttonestado2 = mesa2QueryResult.rows[0].estado;
  let buttonestado3 = mesa3QueryResult.rows[0].estado;
  let buttonestado4 = mesa4QueryResult.rows[0].estado;
  console.log(buttonestado1, " Mesa 1 en el cajero")
  console.log(buttonestado2, " Mesa 2 en el cajero")
  console.log(buttonestado3, " Mesa 3 en el cajero")
  console.log(buttonestado4, " Mesa 4 en el cajero")

  res.render("CheckerVentasPresencial", { buttonestado1,buttonestado2,buttonestado3,buttonestado4 });
}
///////
const postWaiter1 = async (req, res) => {
  const estadoBoton = req.body.estadoBoton;
  const formValues = req.body.formValues;
  let codmesa;
  let tipoventa;
  if (estadoBoton === '0' || formValues === '1') {
    codmesa = 1;
    tipoventa = 'mesa_1';
  } else if (estadoBoton ==='2' || formValues === '3') {
    codmesa = 2;
    tipoventa = 'mesa_2';
  } else if (estadoBoton === '4' || formValues === '5') {
    codmesa = 3;
    tipoventa = 'mesa_3'
  }
  else if (estadoBoton === '6' || formValues === '7') {
    codmesa = 4;
    tipoventa = 'mesa_4'
  }
  console.log(formValues, "uwu", codmesa);
  console.log(estadoBoton);
  console.log(tipoventa);
  if (estadoBoton !== undefined && estadoBoton !== '') {
    try {
      const codplatillo = req.body.platillo;
      const cantidades = req.body.cantidades;
      const precios = req.body.precios;
      console.log(codplatillo, cantidades, precios);
      let total = 0;
      let codventa;
      pool.query("BEGIN");
      const ventaInsertResult = await pool.query(
        `INSERT INTO ventas (tipoventa, estado) VALUES ($1, $2) RETURNING codventa`,
        [tipoventa, '2']
      );
      console.log(ventaInsertResult.rows, "codigo de venta");
      codventa = ventaInsertResult.rows[0].codventa;
      for (let i = 0; i < codplatillo.length; i++) {
        const platillo = codplatillo[i];
        const cantidad = parseInt(cantidades[i]);
        const precio = parseFloat(precios[i]);
        console.log("platillo:",platillo, cantidad, precio);
        if (precio !== null) {
          const estado = '1';
          total = total + (precio * cantidad);
          console.log(total);
          await pool.query(
            `INSERT INTO pedido_mesas (codventa, codmesa,platillo, cantidad, precio,estado) VALUES ($1,$2,$3,$4,$5,$6)`,
            [codventa,codmesa, platillo, cantidad, precio, estado]
          );
        }
      }
      await pool.query(
        `UPDATE ventas SET preciototal = $1 WHERE codventa = $2`,
        [total, codventa]
      );
      await pool.query(
        `UPDATE mesas
        SET estado = $1
        WHERE codmesa = $2;`,
        [estadoBoton, codmesa]
      );
      await pool.query("COMMIT");
      console.log("enviado a la base de datos");
    } catch (err) {
      console.error(err.message);
      await pool.query("ROLLBACK");
      
      console.log("error al enviar a la BD");
    }
  }
  if (formValues !== undefined && formValues !== '') {
    await pool.query(
      `UPDATE mesas
      SET estado = $1
      WHERE codmesa = $2;`,
      [formValues, codmesa]
    );
  }
}

const checkermesas = async (req, res) => {
  let userId = globals.getUserId();
  let pedido_mesas = null;
  const checkerQueryResult = await pool.query(
    `SELECT codmesa, codventa, platillo, precio,cantidad, fecha_hora,estado,estadonuevo
    FROM pedido_mesas
    Where estado='1' OR estado = '2' or estado = '3'
    order by codventa asc
    `
  );

  const userQueryResult = await pool.query(`SELECT nombres, apellidos, correo, dni from usuarios
  where codusuario= $1;`,
  [userId]
  );
  let cajeroDatos = userQueryResult.rows[0];
  req.session.pedidoMesas = checkerQueryResult.rows;
  pedido_mesas = req.session.pedidoMesas;
  res.render("CheckerVentasMesas", {pedido_mesas,cajeroDatos});
}

const postcheckermesas = async (req, res) => {
  try {
    const codventa = req.body.codventa;
    const nombrePlatillo = req.body.platillo;
    const cantidades = req.body.cantidades;
    const precios = req.body.precios;
    let total = 0;
    console.log(codventa, "codigo de venta")
    await pool.query("BEGIN");
    const codmesaQueryResult = await pool.query(
      `select codmesa from pedido_mesas
    where codventa=$1;`,
      [codventa]
    );
    const codmesa = codmesaQueryResult.rows[0].codmesa;

    const detalleQueryResult = await pool.query(`
    select platillo from pedido_mesas where codventa= $1
    `, [codventa])
    const platilloInsertado = detalleQueryResult.rows.length;
    console.log(platilloInsertado, "cantidad de platillos en la BD")
    
    console.log(codmesa, "codigo de mesa")
    for (let i = 0; i < nombrePlatillo.length; i++) {
      const platillo = parseInt(nombrePlatillo[i]);
      const cantidad = parseInt(cantidades[i]);
      const precio = parseFloat(precios[i]);
      console.log("platillo:", platillo, cantidad, precio);
      let codigoSimilarEncontrado = false; // Mover la variable aquí
      for (let j = 0; j < platilloInsertado; j++) {
        const codigoPlatillo = detalleQueryResult.rows[j].platillo;
        console.log(codigoPlatillo,"codigo platillo en la bd")
        if (codigoPlatillo === platillo) {
          codigoSimilarEncontrado = true;
          break;
        }
      }
      console.log(codigoSimilarEncontrado ? "Hay un código similar en la BD" : "No hay códigos similares en la BD");
      total = total + (precio * cantidad);
      if (precio !== null & codigoSimilarEncontrado===false) {
        console.log(total);
        await pool.query(
          `INSERT INTO pedido_mesas (codventa, codmesa,platillo, cantidad, precio,estado,estadonuevo) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [codventa, codmesa, platillo, cantidad, precio,'1', '3']
        );
      } else if (codigoSimilarEncontrado==true) {
        const datoCantidadQueryResult = await pool.query(`
        select cantidad from pedido_mesas where codventa= $1 and platillo=$2;
        `,[codventa,platillo])

        let datoCantidad = parseFloat(datoCantidadQueryResult.rows[0].cantidad);
        console.log(datoCantidad, "cantidad en la BD")
        console.log(cantidad, "cantidad en la vista")
        datoCantidad = datoCantidad + cantidad;
        console.log(datoCantidad, "cantidaad enviado en la BD")
        await pool.query(
          `update pedido_mesas set cantidad=$1 where codventa= $2 and platillo= $3;`,
          [datoCantidad,codventa,platillo]
        );
      }
    }
    const totalQueryResult = await pool.query(
      `select preciototal from ventas
    where codventa=$1;`,
      [codventa]
    );
    let totalVenta = totalQueryResult.rows[0].preciototal;
    total = total + parseFloat(totalVenta);
    console.log(totalVenta,"base de datos")
    console.log(total, "total enviado")

    await pool.query(
      `UPDATE ventas SET preciototal = $1 WHERE codventa = $2`,
      [total, codventa]
    );
    await pool.query("COMMIT");
    console.log("enviado a la base de datos");
  } catch (err) {
    console.error(err.message);
    await pool.query("ROLLBACK");
    req.flash("error_msg", err.message);
    res.status(400).send({ message: err.message });
  }
}

const postcheckerweb = async (req, res) => {
  try {
    const codventa = req.body.codventa;
    const nombrePlatillo = req.body.platillo;
    const cantidades = req.body.cantidades;
    const precios = req.body.precios;
    let total = 0;
    console.log(codventa, "codigo de venta")
    await pool.query("BEGIN");
    const detalleQueryResult = await pool.query(`
    select codplatillo from detalle_ventas where codventa= $1
    `, [codventa])
    const platilloInsertado = detalleQueryResult.rows.length;
    console.log(platilloInsertado,"cantidad de platillos en la BD")

    for (let i = 0; i < nombrePlatillo.length; i++) {
      const platillo = parseInt(nombrePlatillo[i]);
      const cantidad = parseInt(cantidades[i]);
      const precio = parseFloat(precios[i]);
      console.log("platillo:", platillo, cantidad, precio);
      let codigoSimilarEncontrado = false; // Mover la variable aquí
      for (let j = 0; j < platilloInsertado; j++) {
        const codigoPlatillo = detalleQueryResult.rows[j].codplatillo;
        console.log(codigoPlatillo,"codigo platillo en la bd")
        if (codigoPlatillo === platillo) {
            codigoSimilarEncontrado = true;
            break;
        }
      }
      console.log(codigoSimilarEncontrado ? "Hay un código similar en la BD" : "No hay códigos similares en la BD");
      total = total + (precio * cantidad);
      if (precio !== null & codigoSimilarEncontrado ===false) {
        console.log(total);
        await pool.query(
          `INSERT INTO detalle_ventas (cantidad, codplatillo,codventa, estado,precio,estadonuevo) VALUES ($1,$2,$3,$4,$5,$6)`,
          [cantidad,platillo,codventa,'2',precio,'3']
        );
      } else if (codigoSimilarEncontrado ===true) {
        const datoCantidadQueryResult = await pool.query(`
        select cantidad from detalle_ventas where codventa= $1 and codplatillo=$2;
        `,[codventa,platillo])

        let datoCantidad = parseFloat(datoCantidadQueryResult.rows[0].cantidad);
        console.log(datoCantidad, "cantidad en la BD")
        console.log(cantidad, "cantidad en la vista")
        datoCantidad = datoCantidad + cantidad;
        console.log(datoCantidad, "cantidaad enviado en la BD")
        await pool.query(
          `update detalle_ventas set cantidad=$1 where codventa= $2 and codplatillo= $3;`,
          [datoCantidad,codventa,platillo]
        );
      }
    }
    const totalQueryResult = await pool.query(
      `select preciototal from ventas
    where codventa=$1;`,
      [codventa]
    );
    let totalVenta = totalQueryResult.rows[0].preciototal;
    let total1 = total + parseFloat(totalVenta);
    console.log(totalVenta,"base de datos")
    console.log(total1, "total enviado")

    await pool.query(
      `UPDATE ventas SET preciototal = $1 WHERE codventa = $2`,
      [total1, codventa]
    );
    await pool.query("COMMIT");
    console.log("enviado a la base de datos");
  } catch (err) {
    console.error(err.message);
    await pool.query("ROLLBACK");
    req.flash("error_msg", err.message);
    res.status(400).send({ message: err.message });
  }
}

const deleteCheckerMesas = async (req, res) => {
  const tipoventa = parseInt(req.body.tipoventa);
  if(tipoventa === 0){
    try{
      const platillo = req.body.platillo;
      const codventa = req.body.codventa;
      const precio = parseFloat(req.body.precio);
      const cantidad = parseFloat(req.body.cantidad);
      let precio1 = 1;
      console.log(platillo, "el platillo");
      console.log(codventa, "codigo de venta");
      await pool.query("BEGIN");
      await pool.query(`DELETE FROM pedido_mesas WHERE codventa = $1 AND platillo = $2`,
      [codventa,platillo]
      )
      precio1 = cantidad * precio;
      const totalQueryResult = await pool.query(
        `select preciototal from ventas
      where codventa=$1;`,
        [codventa]
      );
      let totalVenta = parseFloat(totalQueryResult.rows[0].preciototal);
      console.log(totalVenta,"base de datos")
      totalVenta = totalVenta - precio1;
      console.log(totalVenta,"enviado a la BD")

      await pool.query(
        `UPDATE ventas SET preciototal = $1 WHERE codventa = $2`,
        [totalVenta, codventa]
      );
      await pool.query("COMMIT");
      console.log("enviado a la base de datos");
    } catch (err) {
      console.error(err.message);
      await pool.query("ROLLBACK");
      req.flash("error_msg", err.message);
      res.status(400).send({ message: err.message });
    }
  } else if (tipoventa === 1) {
    try {
      let precio1 = 0;
      const platillo = req.body.platillo;
      const codventa = req.body.codventa;
      const precio = parseFloat(req.body.precio);
      const cantidad = parseFloat(req.body.cantidad);
      console.log(precio);
      console.log(platillo, "el platillo web");
      console.log(codventa, "codigo de venta");
      console.log(cantidad, precio,"datos separados desde la vista(cantidad y precio)");
      await pool.query("BEGIN");
      await pool.query(`DELETE FROM detalle_ventas WHERE codventa = $1 AND codplatillo = $2`,
      [codventa,platillo]
      )
      precio1 = cantidad * precio;
      const totalQueryResult = await pool.query(
        `select preciototal from ventas
      where codventa=$1;`,
        [codventa]
      );
      let totalVenta = parseFloat(totalQueryResult.rows[0].preciototal);
      console.log(totalVenta, "base de datos")
      console.log(precio1,"total en la vista")
      parseFloat(totalVenta = totalVenta - precio1);
      console.log(totalVenta,"enviado a la BD")

      await pool.query(
        `UPDATE ventas SET preciototal = $1 WHERE codventa = $2`,
        [totalVenta, codventa]
      );
      await pool.query("COMMIT");
      console.log("enviado a la base de datos");
    } catch (err) {
      console.error(err.message);
      await pool.query("ROLLBACK");
      req.flash("error_msg", err.message);
      res.status(400).send({ message: err.message });
    }
  }
}

let venta = null;
const Tochecker = async (req, res) => {
  let userId = globals.getUserId();
  console.log(userId, "");
  const ventaQueryResult = await pool.query(
    `SELECT detalle_ventas.codventa, detalle_ventas.codplatillo, detalle_ventas.cantidad, detalle_ventas.estado, detalle_ventas.estadonuevo, menues.nombre,menues.precio, ventas.tipoventa, ventas.preciototal
      FROM detalle_ventas
      JOIN menues ON detalle_ventas.codplatillo = menues.codplatillo
      JOIN ventas ON detalle_ventas.codventa = ventas.codventa
      WHERE detalle_ventas.estado = '3' or detalle_ventas.estado = '2'
      GROUP BY detalle_ventas.codventa, detalle_ventas.codplatillo, detalle_ventas.estado,detalle_ventas.estadonuevo, 
      menues.nombre, menues.precio, ventas.tipoventa, ventas.preciototal
	    ORDER BY detalle_ventas.codventa
  `);

  const userQueryResult = await pool.query(`SELECT nombres, apellidos, correo, dni from usuarios
  where codusuario= $1;`,
  [userId]
  );
  let cajeroDatos = userQueryResult.rows[0];
  req.session.venta = ventaQueryResult.rows;
  console.log(cajeroDatos);
  venta = req.session.venta;
  console.log(venta);
  res.render("CheckerDashboard", { venta: venta,cajeroDatos: cajeroDatos});
};

const TocheckerGenerate = async (req, res) => {
  try {
    const { id } = req.params;
    const boletaQueryResult = await pool.query(
      `SELECT detalle_ventas.codplatillo, detalle_ventas.cantidad, 
      detalle_ventas.precio, ventas.codventa, ventas.fechayhora, ventas.tipoventa, 
      ventas.tipocomprobante, ventas.preciototal, usuarios.codusuario, usuarios.nombres, usuarios.apellidos, 
      usuarios.dni,usuarios.direccion, usuarios.celular,menues.nombre
      FROM ventas
      JOIN detalle_ventas ON detalle_ventas.codventa = ventas.codventa
      JOIN usuarios ON ventas.codusuario = usuarios.codusuario
      JOIN menues ON menues.codplatillo = detalle_ventas.codplatillo
      WHERE ventas.codventa = $1;`,
      [id]
    );
    console.log(boletaQueryResult.rows,"datos")
    res.json(boletaQueryResult.rows);
  }
  catch (error) {
    console.error(error); // Imprime el error en la consola para el análisis
    res.status(500).json({ error: "Error al generar la boleta" });
  }
}

const TocheckerGenerate1 = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "codigo de ventas")
    const boletaQueryResult = await pool.query(
      `SELECT pedido_mesas.platillo, pedido_mesas.cantidad, 
      pedido_mesas.precio, ventas.codventa, ventas.fechayhora, ventas.tipoventa, 
      ventas.tipocomprobante, ventas.preciototal, menues.nombre
      FROM ventas
      JOIN pedido_mesas ON pedido_mesas.codventa = ventas.codventa
      JOIN menues ON menues.codplatillo = pedido_mesas.platillo
      WHERE ventas.codventa = $1
      AND pedido_mesas.estado <> '0'
      ;`,
      [id]
    );
    console.log(boletaQueryResult.rows,"datos1")
    res.json(boletaQueryResult.rows);
  }
  catch (error) {
    console.error(error); // Imprime el error en la consola para el análisis
    res.status(500).json({ error: "Error al generar la boleta" });
  }
}

let userupdate = null;
const postcheckerGenerate = async (req, res) => {
  try {
    const { id, dni, nombre, apellidos, telefono, direccion, codventa,fechaHoraActual } = req.body;
    
    if (id === '2') {
      userupdate = await pool.connect();
      await userupdate.query('BEGIN'); // Iniciar transacción
      console.log(id, dni, nombre, apellidos, telefono, direccion, codventa,fechaHoraActual)
      // Actualizar estado en tabla usuarios
      await userupdate.query(`
      UPDATE usuarios SET dni=$1, nombres=$2, apellidos=$3, celular=$4, direccion=$5 WHERE codusuario=$6;
    `, [dni, nombre, apellidos, telefono, direccion, id]
      );

      // Actualizar estado en tabla detalle_ventas
      await userupdate.query(`
      UPDATE detalle_ventas
      SET estado = '4'
      WHERE codventa= $1;
    `, [codventa]);

      // Actualizar estado en tabla ventas
      await userupdate.query(`
      UPDATE ventas
      SET estado = '4', fechayhora= $1
      WHERE codventa=$2;
      `, [fechaHoraActual, codventa]);
    }
    if (id === '1') {
      userupdate = await pool.connect();
      await userupdate.query('BEGIN'); // Iniciar transacción
      console.log(id, dni, nombre, apellidos, telefono, direccion, codventa)
      // Actualizar estado en tabla usuarios
      const usuarioInsertResult = await pool.query(
        `INSERT INTO usuarios (nombres,apellidos, celular, direccion,dni,codperfil,estado) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING codusuario`,
        [nombre, apellidos, telefono, direccion, dni,'5', '1']
      );

      // Actualizar estado en tabla detalle_ventas
      await userupdate.query(`
      UPDATE pedido_mesas
      SET estado = '4'
      WHERE codventa= $1;
    `, [codventa]);

      // Actualizar estado en tabla ventas
      await userupdate.query(`
      UPDATE ventas
      SET estado = '4',fechayhora= $1
      WHERE codventa=$2;
      `, [fechaHoraActual,codventa]);
    }
    await userupdate.query('COMMIT');
    console.log('Actualización exitosa');
    res.status(201).json(userupdate.rows); // Devuelve el nuevo proveedor como respuesta
  } catch (error) {
    await userupdate.query('ROLLBACK')
    console.log(error);
    return res.status(500).json({
      message: "Error al obtener los perfiles",
      error,
    });
  }
};

const getCheckerLlevar = async (req, res) => {
  let pedido_llevar;
  let cajeroDatos;
  console.log(req.session.pedido_llevar, "del session");
  let userId = globals.getUserId();
  
  const userQueryResult = await pool.query(`SELECT nombres, apellidos, correo, dni from usuarios
  where codusuario= $1;`,
    [userId]
  );
  cajeroDatos = userQueryResult.rows[0];
  console.log(cajeroDatos);
  pedido_llevar = req.session.pedido_llevar;
  
  console.log(pedido_llevar,"enviado a la vista")
  res.render("CheckerVentasLlevar", {pedido_llevar,cajeroDatos: cajeroDatos});
}

let pedidos = null;
const Cooker = async (req, res) => {
  let pedido_mesas = null;
  const checkerQueryResult = await pool.query(
    `SELECT pedido_mesas.codventa,pedido_mesas.codmesa, pedido_mesas.platillo, pedido_mesas.cantidad, pedido_mesas.estado,pedido_mesas.fecha_hora,
    pedido_mesas.estadonuevo
      FROM pedido_mesas
      WHERE pedido_mesas.estado = '1' or pedido_mesas.estado='3'
      Group by pedido_mesas.codventa,pedido_mesas.codmesa, pedido_mesas.platillo, pedido_mesas.cantidad, pedido_mesas.estado,pedido_mesas.fecha_hora,pedido_mesas.estadonuevo
      ORDER BY pedido_mesas.codventa
    `
  );
  req.session.pedidoMesas = checkerQueryResult.rows;
  pedido_mesas = req.session.pedidoMesas;

  const userQueryResult = await pool.query(
    `SELECT detalle_ventas.codventa, detalle_ventas.codplatillo, detalle_ventas.cantidad, detalle_ventas.estado, menues.nombre,menues.precio, ventas.tipoventa, detalle_ventas.estadonuevo
      FROM detalle_ventas
      JOIN menues ON detalle_ventas.codplatillo = menues.codplatillo
      JOIN ventas ON detalle_ventas.codventa = ventas.codventa
      WHERE detalle_ventas.estado = '2'
      Group by detalle_ventas.codventa, detalle_ventas.codplatillo, detalle_ventas.cantidad, detalle_ventas.estado, menues.nombre, menues.precio, ventas.tipoventa, detalle_ventas.estadonuevo
      ORDER BY detalle_ventas.codventa`,
  );
  req.session.pedidos = userQueryResult.rows;
  pedidos = req.session.pedidos;
  res.render("CookerDashboard", { pedidos,pedido_mesas });
};

const CookerUpdate = async (req, res) => {
  const { codventa } = req.params;
  console.log( codventa, "web");
  await pool.query(
    `UPDATE detalle_ventas
     SET estado = $1
     WHERE codventa = $2`,
    ["3", codventa]
  );
  await pool.query(
    `UPDATE ventas
     SET estado = $1
     WHERE codventa = $2`,
    ["3", codventa]
  );
  res.redirect("/user/Chef");
};

const CookerUpdateMesas = async (req, res) => {
  const { codventa } = req.params;
  console.log(codventa, "mesas")
  await pool.query(
    `UPDATE pedido_mesas
     SET estado = $1
     WHERE codventa = $2`,
    ["2", codventa]
  );
  await pool.query(
    `UPDATE ventas
     SET estado = $1
     WHERE codventa = $2`,
    ["2", codventa]
  );
}

const Tohome = (req, res) => {
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
    console.log(
      "esta es la respuesta que deberia dar la sesion : " + req.session.hola
    );
    const usuarioEstaLogueado = req.isAuthenticated();
    res.render("index", { user: req.user.correo, usuarioEstaLogueado });
  }
};

const Tocorreo = async (req, res) => {
  const { correo } = req.params;
  const userId = globals.getUserId();
  const userQueryResult = await pool.query(
    `SELECT nombres, apellidos, direccion, celular, dni
     FROM usuarios
     WHERE codusuario = $1`,
     [userId]
  );
  req.session.usuarios = userQueryResult.rows[0];
  usuario = req.session.usuarios;
  res.render("profile", { correo, user: req.user.correo,usuario });
};

const Post_correo = async (req, res) => {
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
};

const GetPassword = (req, res) => {
  const { correo } = req.params;
  res.render("newPassword", { correo });
};

const CreateNewPassword = async (req, res) => {
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
};

const getRecuperar = (req, res) => {
  res.render("recuperar");
};

const creteNewRecuperar = (req, res) => {
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
    html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña: <a href="http://localhost:3200/user/newPassword/${correo}">Restablecer contraseña</a></p>`,
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
};

const GetVenta = (req, res) => {
  console.log(req.isAuthenticated());
  res.render("login", { messages: req.flash() });
};

let productos1 = null;
let usuario = null;

const CreateNewVenta = async (req, res) => {
  const productosEnCarrito = req.body;
  console.log(productosEnCarrito,"carrito");
  req.session.productos = productosEnCarrito;
  productos1 = req.session.productos || [];
  const userId = globals.getUserId();
  const userQueryResult = await pool.query(
    `SELECT nombres, apellidos, direccion, celular, dni
     FROM usuarios
     WHERE codusuario = $1`,
     [userId]
  );
  req.session.usuarios = userQueryResult.rows[0];
  usuario = req.session.usuarios;
  console.log(usuario);
  res.redirect("/user/carroComprado")
};

const NewCar = function (req, res) {
  const usuarioEstaLogueado = req.isAuthenticated();
  const total = req.session.total;
  res.render("carroComprado", { usuarioEstaLogueado, total, productos1,usuario });
};

const BuyCar = async (req, res) => {
  try {
    const { tipoventa } = req.body;
    console.log(tipoventa);
    let productosEnCarrito1;
    productosEnCarrito1 = req.session.productos;
    console.log(productosEnCarrito1);
    const userId = globals.getUserId();
    let total = 0;
    await pool.query("BEGIN");
    const ventaInsertResult = await pool.query(
      `INSERT INTO ventas (codusuario,tipoventa, estado) VALUES ($1, $2, $3) RETURNING codventa`,
      [userId, tipoventa, "2"]
    );
    req.flash("message", productosEnCarrito1);
    const codventa = ventaInsertResult.rows[0].codventa;
    for (const producto of productosEnCarrito1) {
      const { id, cantidad, precio } = producto;
      console.log(id, cantidad, precio);
      total = total + (precio * cantidad);
      await pool.query(
        `INSERT INTO detalle_ventas (codventa,codplatillo, cantidad, precio,estado) 
       VALUES ($1,$2, $3, $4,$5)`,
        [codventa, id, cantidad, precio, "2"]
      );
    }
    await pool.query(
      `UPDATE ventas SET preciototal = $1 WHERE codventa = $2`,
      [total, codventa]
    );
    console.log(total);
    await pool.query("COMMIT");
    req.session.total = total;
    console.log("enviado a la base de datos");
    res.redirect("gracias");
  } catch (err) {
    console.error(err.message);
    await pool.query("ROLLBACK");
    req.flash("error_msg", err.message);
    res.status(400).send({ message: err.message });
  }
}

const GetUser = (req, res) => {
  res.render("login", { messages: req.flash() });
};

const CreateNewUser = async (req, res) => {
  let { nombres, apellidos, dni, celular, direccion, correo, contraseña, contraseña2 } = req.body;

  let errors = [];

  console.log({
    nombres,
    apellidos,
    dni,
    direccion,
    celular,
    correo,
    contraseña,
    contraseña2,
  });
  if (!nombres || !correo || !apellidos || !dni || !direccion || !celular || !contraseña || !contraseña2) {
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
      apellidos,
      dni,
      direccion,
      celular,
      correo,
      contraseña,
      contraseña2,
    });
  } else {
    try {
      let hashedPassword = await bcrypt.hash(contraseña, 10);
      console.log(hashedPassword);
      
      const correoQuery = await pool.query(
        `SELECT * FROM usuarios WHERE correo = $1`,
        [correo]
      );
      
      console.log(correoQuery.rows);
      
      if (correoQuery.rows.length > 0) {
        errors.push({ message: "Correo ya registrado" });
        res.render("login", { errors });
        return;
      }
      
      const dniQuery = await pool.query(
        `SELECT * FROM usuarios WHERE dni = $1`,
        [dni]
      );
      
      console.log(dniQuery.rows);
      
      if (dniQuery.rows.length > 0) {
        errors.push({ message: "DNI ya registrado" });
        res.render("login", { errors });
        return;
      }
      
      const insertQuery = await pool.query(
        `INSERT INTO usuarios (nombres, apellidos, dni, celular, direccion, correo, contraseña, codperfil, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, 5, '1') 
        RETURNING codusuario, contraseña`,
        [nombres, apellidos, dni, celular, direccion, correo, hashedPassword]
      );
      
      console.log(insertQuery.rows);
      
      req.flash("success_msg", "Ahora estás registrado. Por favor inicia sesión");
      res.redirect("/user/login");
    } catch (err) {
      console.log(err);
      res.render("login", { errors: [{ message: "Ocurrió un error al registrar el usuario" }] });
    }
  }
};


const checkAuthenticated = function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/index");
  }
  next();
};

const checkNotAuthenticated = function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    const usuarioEstaLogueado = req.isAuthenticated();

    res.render("index", { usuarioEstaLogueado });
  }
};
//export modules
module.exports = {
  getResumen,
  getObtenercodventa,
  postcheckerGenerateLlevar,
  postcheckerLlevar,
  getCheckerLlevar,
  TocheckerGenerate1,
  postcheckerweb,
  deleteCheckerMesas,
  CookerUpdateMesas,
  postcheckermesas,
  checkermesas,
  postWaiter1,
  postcheckerGenerate,
  TocheckerGenerate,
  CookerUpdate,
  thanks,
  BuyCar,
  NewCar,
  ToCart,
  Tologin,
  Tologout,
  Tochecker,
  Towaiter,
  TowaiterPlatillo,
  Cooker,
  Tohome,
  Tocorreo,
  Post_correo,
  GetPassword,
  CreateNewPassword,
  getRecuperar,
  creteNewRecuperar,
  GetVenta,
  CreateNewVenta,
  GetUser,
  CreateNewUser,
  getCheker,
  getWaiter,
  checkerPresencial,
  checkAuthenticated,
  checkNotAuthenticated,
};
