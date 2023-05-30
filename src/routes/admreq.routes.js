const express = require("express");
const router = express.Router();
const AdmReq = require("../controllers/Adminrequierementes.js/AdmReq.js");
//CRUD
router.get("/delete/:id", AdmReq.deleteuser);
router.get("/edit/:id", AdmReq.getuserbyid);
router.post("/edit", AdmReq.postUserbyid);
router.get("/perfiles", AdmReq.getPerfiles);

//RUTAS PARA USUARIOS
//1.1
router.get("/user/admin/register", AdmReq.getUserRegister);
router.post("/user/admin/register", AdmReq.postUserRegister);
//1.2
router.get("/user/admin/permission", AdmReq.getAssingnPermisos);
//RUTAS PARA LAS MARCAS
router.get("/marcas", AdmReq.getMarcas);
router.get("/marcas/:id", AdmReq.getMarcasbyId);
router.post("/marcas", AdmReq.postMarcas);
//RUTAS PARA PRODUCTOS
router.get("/productos", AdmReq.getProducto);
router.get("/productos/:id", AdmReq.getProductobyID);
router.post("/productos", AdmReq.postProductos);
router.patch("/productos", AdmReq.Updateproducts);
router.get("/cat4products", AdmReq.getCategories4Products);
router.get("/marcas4products", AdmReq.getMarcas4Products);
router.get("/deleteproducts/:id", AdmReq.deleteProducts);
//RUTAS PARA UNIDAD
router.get("/unidad", AdmReq.getUnidad);
//RUTAS PARA CATEGORIAS
router.get("/categorias", AdmReq.getCategorias);
router.get("/categorias/:id", AdmReq.getCategoriasbyID);
router.post("/categorias", AdmReq.postCategorias);
router.post("/categoria", AdmReq.UpdateCategorias);
router.get("/delcategoria/:id", AdmReq.deleteCategories);
//RUTAS PARA PROVEEDORES
router.get("/proveedores", AdmReq.getProveedores);
router.get("/proveedores/:id", AdmReq.getProveedoresbyID);
router.post("/proveedores", AdmReq.postProveedores);
router.post("/proveedor", AdmReq.editProveedor);
router.get("/delprove/:id", AdmReq.deleproveedor);
//RUTAS PARA COMPRAS
router.get("/compras", AdmReq.getCompras);
router.get("/compras/:id", AdmReq.getComprasbyID);
router.post("/compras", AdmReq.postCompras);
router.get("/compras4prove", AdmReq.prove4compras);
router.get("/compras4products", AdmReq.product4compras);
//RUTAS PARA DETALLECOMPRAS
router.get("/detallecompras", AdmReq.getdetallecompras);
router.post("/detallecompras", AdmReq.postdetalleCompras);
//RUTAS PARA MENUES(PRUEBAS)
router.get("/menues", AdmReq.getmenu);
router.get("/allmenues", AdmReq.getallmenu);
router.post("/menues", AdmReq.postmenu);
router.get("/menues/:id", AdmReq.getmenubyid);
router.patch("/menu", AdmReq.patchmenubyid);
router.get("/deletemenu/:id", AdmReq.deletMenu);
router.get("/publicarmenu/:id", AdmReq.publicarMenu);
router.get("/quitarpublimenu/:id", AdmReq.quitarpubliMenu);

module.exports = router;
