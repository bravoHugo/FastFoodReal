//Mesa 1---------------------------
const button1 = document.getElementById('mesa_1');
async function presiono1() {
  try {
    if (button1.style.backgroundColor === 'red') {          
      try {
        button1.style.backgroundColor = 'green';
        Swal.fire('Modificado!', '', 'success');
        setTimeout(function () {
          location.reload();
        }, 1000);
        await axios.post('/user/WaiterVentas1', { formValues: '1' });
      } catch (error) {
        Swal.fire('Error', 'ERRO1', 'error');
      }
    } else {
      
    }
  } catch (error) {
    Swal.fire('Error', 'ERROR 2', 'error');
  }
}

//Mesa 2 ---------------------------------------------------------
const button2 = document.getElementById('mesa_2');
async function presiono2() {
  try {
    if (button2.style.backgroundColor === 'red') {          
      try {
        button2.style.backgroundColor = 'green';
        Swal.fire('Modificado!', '', 'success');
        setTimeout(function () {
          location.reload();
        }, 1000);
        await axios.post('/user/WaiterVentas1', { formValues: '3' });
      } catch (error) {
        Swal.fire('Error', 'ERRO1', 'error');
      }
    } else {
      
    }
  } catch (error) {
    Swal.fire('Error', 'ERROR 2', 'error');
  }
}

//Mesa 3 ---------------------------------------------------------
const button3 = document.getElementById('mesa_3');
async function presiono3() {
  try {
    if (button3.style.backgroundColor === 'red') {          
      try {
        button3.style.backgroundColor = 'green';
        Swal.fire('Modificado!', '', 'success');
        setTimeout(function () {
          location.reload();
        }, 1000);
        await axios.post('/user/WaiterVentas1', { formValues: '5' });
      } catch (error) {
        Swal.fire('Error', 'ERRO1', 'error');
      }
    } else {
      
    }
  } catch (error) {
    Swal.fire('Error', 'ERROR 2', 'error');
  }
}

//Mesa 4 ---------------------------------------------------------
const button4 = document.getElementById('mesa_4');
async function presiono4() {
  try {
    if (button4.style.backgroundColor === 'red') {          
      try {
        button4.style.backgroundColor = 'green';
        Swal.fire('Modificado!', '', 'success');
        setTimeout(function () {
          location.reload();
        }, 1000);
        await axios.post('/user/WaiterVentas1', { formValues: '7' });
      } catch (error) {
        Swal.fire('Error', 'ERRO1', 'error');
      }
    } else {
      
    }
  } catch (error) {
    Swal.fire('Error', 'ERROR 2', 'error');
  }
}