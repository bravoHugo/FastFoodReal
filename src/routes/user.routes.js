const express = require("express");
const router = express.Router();
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const {
  getResumen,
  getObtenercodventa,
  postcheckerGenerateLlevar,
  postcheckerLlevar,
  getCheckerLlevar,
  TocheckerGenerate1,
  postcheckerweb,
  deleteCheckerMesas,
  postcheckermesas,
  CookerUpdateMesas,
  checkermesas,
  TowaiterPlatillo,
  postWaiter1,
  getWaiter,
  getCheker,
  postcheckerGenerate,
  TocheckerGenerate,
  CookerUpdate,
  thanks,
  BuyCar,
  NewCar,
  Tologin,
  Tologout,
  ToCart,
  Tochecker,
  Towaiter,
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
  checkerPresencial,
  CreateNewUser,
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/Users/Users.controllers.js");
// Configura la sesión de Express
// Inicializa Passport y establece la sesión de usuario
// app.use(passport.session());
app.use(flash());

//rutas con axios
router.get("/ultimoCodventa", getObtenercodventa);
router.get("/generate/:id", TocheckerGenerate);
router.get("/generate1/:id", TocheckerGenerate1);
router.post("/generate", postcheckerGenerate);
router.post("/user/ActualizarPedido/:codventa", CookerUpdate);
router.post("/user/ActualizarPedidoMesas/:codventa",CookerUpdateMesas)
router.get("/waiterPlatillo", TowaiterPlatillo);
router.get("/checkermesas", checkermesas);
router.post("/actualizarPedido", postcheckermesas);
router.post("/actualizarPedidoWeb", postcheckerweb);
router.post("/borrarPedido", deleteCheckerMesas)
//Ventas por mesa: 
router.post("/user/WaiterVentas1", postWaiter1);
router.get("/user/CheckerVentasPresencial", checkerPresencial);
router.post("/pedidoLlevar", postcheckerLlevar);
router.post("/ventaLlevar", postcheckerGenerateLlevar);

// // Configura Passport

//falta el checkAuthenticated///
router.get("/resumenVentas", getResumen);
router.get("/VentasLlevar", getCheckerLlevar)
router.get("/user/Checker", getCheker);
router.get("/user/login", checkAuthenticated, Tologin);
router.get("/user/logout", Tologout);
router.get("/user/gracias", thanks);
router.get("/user/carroComprado", NewCar);//
router.post("/user/carroComprado", BuyCar)
router.get("/user/carrito", ToCart);//
router.get("/user/CheckerVentas", Tochecker);
router.get("/user/Waiter", getWaiter)
router.get("/user/WaiterVentas", Towaiter);
router.get("/user/Chef", Cooker);
router.get("/user/index", checkNotAuthenticated, Tohome);
router.get("/user/profile/:correo", Tocorreo);
router.post("/user/profile/:correo", Post_correo);
router.get("/user/newPassword/:correo", GetPassword);
router.post("/user/newPassword", CreateNewPassword);
router.get("/user/recuperar", getRecuperar);
router.post("/user/recuperar", creteNewRecuperar);
router.get("/user/venta", checkAuthenticated, GetVenta);
router.post("/user/venta", CreateNewVenta);
router.get("/user/register", checkAuthenticated, GetUser);
router.post("/user/register", CreateNewUser);
router.post(
  "/user/login",
  passport.authenticate("local", {
    successRedirect: "/user/index",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);
app.use("/", router);
module.exports = app;
