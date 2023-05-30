function generarPDF(event) {
  event.preventDefault();
  // Captura los valores de los campos del formulario
  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const celular = document.getElementById("celular").value;
  const dni = document.getElementById("dni").value;
  const tipoventa = document.querySelector('input[name="tipoventa"]:checked').value;
  const direccion = document.getElementById("direccion").value;
  const total = document.getElementById("total").textContent;
  const doc = new jsPDF({
      format: "a6",
  });
  doc.setFont("times");
  doc.setFontSize(10);
  // Agrega los datos al documento PDF
  doc.text(`PREVENTA`, 40, 5);
  doc.text(`---------------------------------`, 30, 7);
  doc.text(``, 5, 10);
  doc.text(`Empresa: KENTAKITOS HAMBURGER`, 5, 15);
  doc.text(`Dirección Empresa: jr. Leoncio prado 1189`, 5, 20);
  doc.text(`Numeros de celular: 986363913 / 961324321`, 5, 25);
  doc.text(`----------------------------------`, 5, 30);
  /* const codventaInput  = document.getElementById("codventa").value;
  const codventa = parseInt(codventaInput.value); */
 /*  doc.text(`Venta Nr: ${codventa}`, 5, 32); */
  doc.text(`Nombre: ${nombre}`, 5, 35);
  doc.text(`Apellidos: ${apellidos}`, 5, 40);
  doc.text(`Celular: ${celular}`, 5, 45);
  doc.text(`DNI: ${dni}`, 5, 50);
  doc.text(`Tipo de venta: ${tipoventa}`, 5, 55);
  doc.text(`Dirección: ${direccion}`, 5, 60);
  doc.text(`----------------------------------`, 5, 65);
  doc.text(`Producto`, 5,70 );
  doc.text(`Precio`, 40,70 );
  doc.text(`Cantidad`, 55,70 );
  let y=75;
  let x=5;
  const productosJSON = document.getElementById("productos").value;
  const productos = JSON.parse(productosJSON);
  productos.forEach((producto) => {
    const titulo = producto.titulo;
    const precio = producto.precio;
    const cantidad = producto.cantidad;
    doc.text(`${titulo}`, x, y);
    doc.text(`${precio} soles`, x+ 35, y);
    doc.text(`${cantidad}`, x+55, y);
    y += 5;
  });
  doc.text(`-----------------------------------`, 5, y);
  doc.text(`TOTAL DE LA VENTA: ${total}`, 5, y+5);
  doc.text(`Gracias por su preferencia`, 30, y+15);
  doc.text(`© 2023 Kentakitos Hamburguer`, 25, y+20);
  // Descarga el documento PDF
  doc.save("compra.pdf");
  // Enviar el formulario al servidor
  event.target.submit();
}