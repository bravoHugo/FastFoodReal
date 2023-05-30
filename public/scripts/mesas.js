// mesa 1
const button1 = document.getElementById('mesa_1');
let mesaVar1 = true
async function presiono1() {
  try {
    plato = await axios.get(`/waiterPlatillo`);
    const platos=plato.data;
    console.log(platos);
    if (button1.style.backgroundColor === 'green') {
      Swal.fire({
        title: 'Registrar Venta',
        showCancelButton: false,
        showConfirmButton: false,
        html: `
          <form id="agregarUsuarioForm" method="post" action="/user/WaiterVentas1">
            <input type="hidden" name="estadoBoton" value="0">
            <div id="platos-container" class="form-group" >
              <!-- Los campos de los platos se generarán aquí -->
            </div>
            <br/>
            <button type="submit" class="submit" style="background-color: #4CAF50; border: none; color: white; padding: 10px 24px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px; cursor: pointer;" id="registrarBoton">Registrar</button>
            <a href="#" class="cancel" style="background-color: #d33; border: none; color: white; padding: 10px 24px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px; cursor: pointer; margin-left: 10px;" id="cancelarBoton">Cancelar</a>
          </form>
        `
      });

      // Generar campos para cada platillo
      const platosContainer = document.getElementById('platos-container');
      platos.forEach((platillo, index) => {
        const inputName = `platillo${index + 1}`;
        const inputPrecioName = `precio${index + 1}`;
        const inputCantidadName = `cantidad${index + 1}`;
        const checkboxId = `platillo-checkbox${index + 1}`;

        const div = document.createElement('div');
        div.classList.add('form-group');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.name = 'platillo';
        checkbox.value = platillo.codplatillo; //obtienes el valor del código del platillo

        const label = document.createElement('label');
        label.htmlFor = checkboxId;
        label.textContent = platillo.nombre;
        label.name = 'platillos';
        label.value = platillo.nombre;

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.id = inputCantidadName;
        inputCantidad.name = 'cantidades'; //obtienes el valor de las cantidades del platillo que ha seleccionado
        inputCantidad.placeholder = 'Cantidad';
        inputCantidad.required = false;
        inputCantidad.disabled = true; // Deshabilitar los campos de cantidad inicialmente

        const labelPrecio = document.createElement('label');
        labelPrecio.htmlFor = inputPrecioName;
        labelPrecio.textContent = 'Precio';

        const inputPrecio = document.createElement('input');
        inputPrecio.type = 'text';
        inputPrecio.id = inputPrecioName;
        inputPrecio.name = 'precios';
        inputPrecio.value = platillo.precio; //obtienes los precios de los platillos seleccionados
        inputPrecio.disabled = true; // Deshabilitar los campos de cantidad inicialmente

        const botonMas = document.createElement('button')

        div.appendChild(checkbox);
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
        div.appendChild(inputCantidad);
        div.appendChild(document.createElement('br'));
        div.appendChild(labelPrecio);
        div.appendChild(inputPrecio);

        platosContainer.appendChild(div);

        // Habilitar/deshabilitar el campo de cantidad según la selección del checkbox
        checkbox.addEventListener('change', (event) => {
          inputCantidad.disabled = !event.target.checked;
          inputPrecio.disabled = !event.target.checked;
        });
      });

      document.getElementById('agregarUsuarioForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
          Swal.fire('Modificado!', '', 'success');
          setTimeout(function () {
            location.reload();
          }, 1000);
          const response = await axios.post('/user/WaiterVentas1', {
            estadoBoton: '0',
            platillo: Array.from(formData.getAll('platillo')),
            cantidades: Array.from(formData.getAll('cantidades')),
            precios: Array.from(formData.getAll('precios'))
          });
          console.log(response);
        } catch (error) {
          Swal.fire('Error', 'Ha ocurrido un error al enviar el formulario', 'error');
        }
      });

      document.getElementById('cancelarBoton').addEventListener('click', () => {
        button1.style.backgroundColor = 'green';
        mesaVar1 = true;
        Swal.close();
      });

      button1.style.backgroundColor = 'red';
      mesaVar1 = false;
    }
  } catch (error) {
    Swal.fire('Error', 'Ha ocurrido un error al enviar el formulario', 'error');
  }
}

///mesa 2 ----------------------------
const button2 = document.getElementById('mesa_2');
let mesaVar2 = true
async function presiono2() {
  try {
    plato1 = await axios.get(`/waiterPlatillo`);
    const platos=plato1.data;
    console.log(platos);
    if (button2.style.backgroundColor === 'green') {
      Swal.fire({
        title: 'Registrar Venta',
        showCancelButton: false,
        showConfirmButton: false,
        html: `
          <form id="agregarUsuarioForm" method="post" action="/user/WaiterVentas1">
            <input type="hidden" name="estadoBoton" value="2">
            <div id="platos-container" class="form-group" >
              <!-- Los campos de los platos se generarán aquí -->
            </div>
            <br/>
            <button type="submit" class="submit" style="background-color: #4CAF50; border: none; color: white; padding: 10px 24px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px; cursor: pointer;" id="registrarBoton">Registrar</button>
            <a href="#" class="cancel" style="background-color: #d33; border: none; color: white; padding: 10px 24px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px; cursor: pointer; margin-left: 10px;" id="cancelarBoton">Cancelar</a>
          </form>
        `
      });

      // Generar campos para cada platillo
      const platosContainer = document.getElementById('platos-container');
      platos.forEach((platillo, index) => {
        const inputName = `platillo${index + 1}`;
        const inputPrecioName = `precio${index + 1}`;
        const inputCantidadName = `cantidad${index + 1}`;
        const checkboxId = `platillo-checkbox${index + 1}`;

        const div = document.createElement('div');
        div.classList.add('form-group');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.name = 'platillo';
        checkbox.value = platillo.codplatillo; //obtienes el valor del código del platillo

        const label = document.createElement('label');
        label.htmlFor = checkboxId;
        label.textContent = platillo.nombre;
        label.name = 'platillos';
        label.value = platillo.nombre;

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.id = inputCantidadName;
        inputCantidad.name = 'cantidades'; //obtienes el valor de las cantidades del platillo que ha seleccionado
        inputCantidad.placeholder = 'Cantidad';
        inputCantidad.required = false;
        inputCantidad.disabled = true; // Deshabilitar los campos de cantidad inicialmente

        const labelPrecio = document.createElement('label');
        labelPrecio.htmlFor = inputPrecioName;
        labelPrecio.textContent = 'Precio';

        const inputPrecio = document.createElement('input');
        inputPrecio.type = 'text';
        inputPrecio.id = inputPrecioName;
        inputPrecio.name = 'precios';
        inputPrecio.value = platillo.precio; //obtienes los precios de los platillos seleccionados
        inputPrecio.disabled = true; // Deshabilitar los campos de cantidad inicialmente

        const botonMas = document.createElement('button')

        div.appendChild(checkbox);
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
        div.appendChild(inputCantidad);
        div.appendChild(document.createElement('br'));
        div.appendChild(labelPrecio);
        div.appendChild(inputPrecio);

        platosContainer.appendChild(div);

        // Habilitar/deshabilitar el campo de cantidad según la selección del checkbox
        checkbox.addEventListener('change', (event) => {
          inputCantidad.disabled = !event.target.checked;
          inputPrecio.disabled = !event.target.checked;
        });
      });

      document.getElementById('agregarUsuarioForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
          Swal.fire('Modificado!', '', 'success');
          setTimeout(function () {
            location.reload();
          }, 1000);
          await axios.post('/user/WaiterVentas1', {
            estadoBoton: '2',
            platillo: Array.from(formData.getAll('platillo')),
            cantidades: Array.from(formData.getAll('cantidades')),
            precios: Array.from(formData.getAll('precios'))
          });
        } catch (error) {
          Swal.fire('Error', 'Ha ocurrido un error al enviar el formulario', 'error');
        }
      });

      document.getElementById('cancelarBoton').addEventListener('click', () => {
        button2.style.backgroundColor = 'green';
        Swal.close();
      });
      button2.style.backgroundColor = 'red';
    }
  } catch (error) {
    Swal.fire('Error', 'Ha ocurrido un error al enviar el formulario', 'error');
  }
}


///mesa 3 ----------------------------
const button3 = document.getElementById('mesa_3');
async function presiono3() {
  try {
    plato1 = await axios.get(`/waiterPlatillo`);
    const platos=plato1.data;
    console.log(platos);
    if (button3.style.backgroundColor === 'green') {
      Swal.fire({
        title: 'Registrar Venta',
        showCancelButton: false,
        showConfirmButton: false,
        html: `
          <form id="agregarUsuarioForm" method="post" action="/user/WaiterVentas1">
            <input type="hidden" name="estadoBoton" value="2">
            <div id="platos-container" class="form-group" >
              <!-- Los campos de los platos se generarán aquí -->
            </div>
            <br/>
            <button type="submit" class="submit" style="background-color: #4CAF50; border: none; color: white; padding: 10px 24px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px; cursor: pointer;" id="registrarBoton">Registrar</button>
            <a href="#" class="cancel" style="background-color: #d33; border: none; color: white; padding: 10px 24px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px; cursor: pointer; margin-left: 10px;" id="cancelarBoton">Cancelar</a>
          </form>
        `
      });

      // Generar campos para cada platillo
      const platosContainer = document.getElementById('platos-container');
      platos.forEach((platillo, index) => {
        const inputName = `platillo${index + 1}`;
        const inputPrecioName = `precio${index + 1}`;
        const inputCantidadName = `cantidad${index + 1}`;
        const checkboxId = `platillo-checkbox${index + 1}`;

        const div = document.createElement('div');
        div.classList.add('form-group');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.name = 'platillo';
        checkbox.value = platillo.codplatillo; //obtienes el valor del código del platillo

        const label = document.createElement('label');
        label.htmlFor = checkboxId;
        label.textContent = platillo.nombre;
        label.name = 'platillos';
        label.value = platillo.nombre;

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.id = inputCantidadName;
        inputCantidad.name = 'cantidades'; //obtienes el valor de las cantidades del platillo que ha seleccionado
        inputCantidad.placeholder = 'Cantidad';
        inputCantidad.required = false;
        inputCantidad.disabled = true; // Deshabilitar los campos de cantidad inicialmente

        const labelPrecio = document.createElement('label');
        labelPrecio.htmlFor = inputPrecioName;
        labelPrecio.textContent = 'Precio';

        const inputPrecio = document.createElement('input');
        inputPrecio.type = 'text';
        inputPrecio.id = inputPrecioName;
        inputPrecio.name = 'precios';
        inputPrecio.value = platillo.precio; //obtienes los precios de los platillos seleccionados
        inputPrecio.disabled = true; // Deshabilitar los campos de cantidad inicialmente

        const botonMas = document.createElement('button')

        div.appendChild(checkbox);
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
        div.appendChild(inputCantidad);
        div.appendChild(document.createElement('br'));
        div.appendChild(labelPrecio);
        div.appendChild(inputPrecio);

        platosContainer.appendChild(div);

        // Habilitar/deshabilitar el campo de cantidad según la selección del checkbox
        checkbox.addEventListener('change', (event) => {
          inputCantidad.disabled = !event.target.checked;
          inputPrecio.disabled = !event.target.checked;
        });
      });

      document.getElementById('agregarUsuarioForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
          Swal.fire('Modificado!', '', 'success');
          setTimeout(function () {
            location.reload();
          }, 1000);
          await axios.post('/user/WaiterVentas1', {
            estadoBoton: '4',
            platillo: Array.from(formData.getAll('platillo')),
            cantidades: Array.from(formData.getAll('cantidades')),
            precios: Array.from(formData.getAll('precios'))
          });
        } catch (error) {
          Swal.fire('Error', 'Ha ocurrido un error al enviar el formulario', 'error');
        }
      });

      document.getElementById('cancelarBoton').addEventListener('click', () => {
        button3.style.backgroundColor = 'green';
        Swal.close();
      });
      button3.style.backgroundColor = 'red';
    }
  } catch (error) {
    Swal.fire('Error', 'Ha ocurrido un error al enviar el formulario', 'error');
  }
}

///mesa 4 ----------------------------
const button4 = document.getElementById('mesa_4');
async function presiono4() {
  try {
    plato1 = await axios.get(`/waiterPlatillo`);
    const platos=plato1.data;
    console.log(platos);
    if (button4.style.backgroundColor === 'green') {
      Swal.fire({
        title: 'Registrar Venta',
        showCancelButton: false,
        showConfirmButton: false,
        html: `
          <form id="agregarUsuarioForm" method="post" action="/user/WaiterVentas1">
            <input type="hidden" name="estadoBoton" value="2">
            <div id="platos-container" class="form-group" >
              <!-- Los campos de los platos se generarán aquí -->
            </div>
            <br/>
            <button type="submit" class="submit" style="background-color: #4CAF50; border: none; color: white; padding: 10px 24px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px; cursor: pointer;" id="registrarBoton">Registrar</button>
            <a href="#" class="cancel" style="background-color: #d33; border: none; color: white; padding: 10px 24px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px; cursor: pointer; margin-left: 10px;" id="cancelarBoton">Cancelar</a>
          </form>
        `
      });

      // Generar campos para cada platillo
      const platosContainer = document.getElementById('platos-container');
      platos.forEach((platillo, index) => {
        const inputName = `platillo${index + 1}`;
        const inputPrecioName = `precio${index + 1}`;
        const inputCantidadName = `cantidad${index + 1}`;
        const checkboxId = `platillo-checkbox${index + 1}`;

        const div = document.createElement('div');
        div.classList.add('form-group');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.name = 'platillo';
        checkbox.value = platillo.codplatillo; //obtienes el valor del código del platillo

        const label = document.createElement('label');
        label.htmlFor = checkboxId;
        label.textContent = platillo.nombre;
        label.name = 'platillos';
        label.value = platillo.nombre;

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.id = inputCantidadName;
        inputCantidad.name = 'cantidades'; //obtienes el valor de las cantidades del platillo que ha seleccionado
        inputCantidad.placeholder = 'Cantidad';
        inputCantidad.required = false;
        inputCantidad.disabled = true; // Deshabilitar los campos de cantidad inicialmente

        const labelPrecio = document.createElement('label');
        labelPrecio.htmlFor = inputPrecioName;
        labelPrecio.textContent = 'Precio';

        const inputPrecio = document.createElement('input');
        inputPrecio.type = 'text';
        inputPrecio.id = inputPrecioName;
        inputPrecio.name = 'precios';
        inputPrecio.value = platillo.precio; //obtienes los precios de los platillos seleccionados
        inputPrecio.disabled = true; // Deshabilitar los campos de cantidad inicialmente

        const botonMas = document.createElement('button')

        div.appendChild(checkbox);
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
        div.appendChild(inputCantidad);
        div.appendChild(document.createElement('br'));
        div.appendChild(labelPrecio);
        div.appendChild(inputPrecio);

        platosContainer.appendChild(div);

        // Habilitar/deshabilitar el campo de cantidad según la selección del checkbox
        checkbox.addEventListener('change', (event) => {
          inputCantidad.disabled = !event.target.checked;
          inputPrecio.disabled = !event.target.checked;
        });
      });

      document.getElementById('agregarUsuarioForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
          Swal.fire('Modificado!', '', 'success');
          setTimeout(function () {
            location.reload();
          }, 1000);
          await axios.post('/user/WaiterVentas1', {
            estadoBoton: '6',
            platillo: Array.from(formData.getAll('platillo')),
            cantidades: Array.from(formData.getAll('cantidades')),
            precios: Array.from(formData.getAll('precios'))
          });
        } catch (error) {
          Swal.fire('Error', 'Ha ocurrido un error al enviar el formulario', 'error');
        }
      });

      document.getElementById('cancelarBoton').addEventListener('click', () => {
        button4.style.backgroundColor = 'green';
        Swal.close();
      });
      button4.style.backgroundColor = 'red';
    }
  } catch (error) {
    Swal.fire('Error', 'Ha ocurrido un error al enviar el formulario', 'error');
  }
}

