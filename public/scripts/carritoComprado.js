
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
  Swal.fire({
    title: "¿Estás seguro?",
    icon: "question",
    html: `Perderás tú compra <i class="bi bi-emoji-frown"></i>`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/user/index";
    }
  });
}