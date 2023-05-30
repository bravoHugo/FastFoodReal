let productos = [];
// fetch("/assets/scripts/productos.json")
//   .then((response) => response.json())
//   .then((data) => {
//     productos = data;
//     cargarProductos(productos);
//   });
var datamenu;
async function iniciar() {
  try {
    const response = await axios.get("/allmenues");
    datamenu = await response.data;
    cargarProductos(datamenu);
  } catch (error) {
    console.log("Ocurrió un error al obtener los productos:", error);
  }
}
iniciar();
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

botonesCategorias.forEach((boton) =>
  boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
  })
);

function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";

  productosElegidos.forEach((producto) => {
    if (producto.estado === "2") {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
            <img class="producto-imagen" src="/assets/uploads/${producto.img}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.nombre}</h3>
                <p class="producto-precio">S/.${producto.precio}</p>
                <button class="producto-agregar" id="${producto.codplatillo}">Agregar</button>
            </div>
        `;

      contenedorProductos.append(div);
    }
  });

  actualizarBotonesAgregar();
}

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    if (e.currentTarget.id == "todos") {
      tituloPrincipal.innerText = "Todos los productos";
      console.log(datamenu);
      cargarProductos(datamenu);
    }
    if (e.currentTarget.id == "platillos") {
      tituloPrincipal.innerText = "Platillos";
      const productosPlatillos = datamenu.filter((elemento) => {
        return elemento.categoria === "Platillos";
      });
      console.log(productosPlatillos);
      cargarProductos(productosPlatillos);
    }
    if (e.currentTarget.id == "bebidas") {
      tituloPrincipal.innerText = "Bebidas";
      const productosPlatillos = datamenu.filter((elemento) => {
        return elemento.categoria === "Bebidas";
      });
      console.log(productosPlatillos);
      cargarProductos(productosPlatillos);
    }
    if (e.currentTarget.id == "guarniciones") {
      tituloPrincipal.innerText = "Guarniciones";
      const productosPlatillos = datamenu.filter((elemento) => {
        return elemento.categoria === "Guarniciones";
      });
      console.log(productosPlatillos);
      cargarProductos(productosPlatillos);
    }
  });
});

function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}

function agregarAlCarrito(e) {
  Toastify({
    text: "Producto agregado",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
      y: "1.5rem", // vertical axis - can be a number or a string indicating unity. eg: '2em'
    },
    onClick: function () {}, // Callback after click
  }).showToast();
  const idBoton = parseInt(e.currentTarget.id);
  console.log(typeof e.currentTarget.id);
  const productoAgregado = datamenu.find(
    (producto) => producto.codplatillo === idBoton
  );
  console.log(productoAgregado);
  if (productosEnCarrito.some((producto) => producto.codplatillo === idBoton)) {
    const index = productosEnCarrito.findIndex(
      (producto) => producto.codplatillo === idBoton
    );
    console.log(productosEnCarrito);
    console.log(index);
    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
    console.log(productosEnCarrito);
  }

  actualizarNumerito();

  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numerito.innerText = nuevoNumerito;
}
