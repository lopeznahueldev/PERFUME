let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let fragment = document.createDocumentFragment();

async function fetchAPI() {
  try {
    const URL = "./data.json";
    const response = await fetch(URL);
    const prod = await response.json();
    
    setTimeout(() => {
      renderHTML(prod);
    }, 1100);

  } catch (error) {
    console.log(error);
  }
}

//TARJETAS EN EL DOM
function renderHTML(arr) {
  const shopContainer = document.querySelector("#perfume");
  shopContainer.innerHTML = "";
  setTimeout(() => {
    arr.forEach((product) => {
      const { id, nombre, precio, imagen, link } = product;
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
      <div>
      <div class="card__header" >
      <a href="${link}"> <img src="${imagen}" alt="${nombre}" /></a>
      </div>
      <a href="${link}"><h3 class="card__title">${nombre}</h3></a>
      <p class="card__price">$${precio}</p>
      <button id="comprar-${id}" class="boton_comprar">Comprar</button>
      </div>
        `;
      fragment.append(div);
    });
    shopContainer.append(fragment)
    btnComprar(arr);
  }, 1000);
}

//BOTON COMPRAR
function btnComprar(productos) {
  productos.forEach((producto) => {
    document
      .querySelector(`#comprar-${producto.id}`)
      .addEventListener("click", () => {
        agregarAlCarrito(producto);
        alertAddCart();
      });
  });
}

//AGREGAR PRODUCTOS AL CARRITO
function agregarAlCarrito(producto) {
  let existe = carrito.some((prod) => prod.id === producto.id);
  let prodFind = carrito.find((prod) => prod.id === producto.id);
  existe === false ? (producto.cantidad = 1) : prodFind.cantidad++;
  existe || carrito.push(producto);
  mostrarCarrito(carrito);
  contador();
  total();
}

//CARRITO
function mostrarCarrito(arr) {
  let cartContainer = document.querySelector("#carrito");
  cartContainer.innerHTML = "";
  for (const producto of arr) {
    const { id, nombre, precio, imagen, cantidad } = producto;
    let div = document.createElement("div");
    div.innerHTML = `
    <p>${producto.nombre}</p>
    <p>Precio: $${producto.precio}</p> 
    <p id="cantidad${producto.id}">Cantidad: ${producto.cantidad}</p>
    <button id="eliminar-${id}" class="boton_eliminar cart-remove">Eliminar</i></button>
    <hr/>
    `;
    cartContainer.appendChild(div);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  botonEliminar();
  contador();
  total();
}

function botonEliminar() {
  let btnEliminar = document.querySelectorAll(".cart-remove");
  btnEliminar.forEach((el) => {
    el.addEventListener("click", (ev) => {
      let button = ev.target.id;
      eliminarProducto(button);
    });
  });
}

//CONTADOR
function contador() {
  let contador = document.querySelector("#counter");
  let total = carrito.reduce((acc, el) => acc + el.cantidad, 0);
  contador.innerText = total;
}

//CALCULAR TOTAL
function total() {
  let total = document.querySelector(".precio_total");
  let resultado = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
  total.innerText = `$${resultado.toFixed(2)}`;
  localStorage.setItem("total", JSON.stringify(resultado));
}

function eliminarProducto(producto) {
  let item = carrito.find((el) => `eliminar-${el.id}` === producto);
  let index = carrito.indexOf(item);
  carrito.splice(index, 1);
  mostrarCarrito(carrito);
  contador();
  total();
  alertRemovedCart();
}

fetchAPI();
mostrarCarrito(carrito);

//ALERTAS
function alertAddCart() {
  Toastify({
    text: `Se agrego un PERFUME al Carrito`,
    duration: 1500,
    gravity: "bottom",
    position: "left",
    style: {
      background: "#4B4B4B",
    },
  }).showToast();
}

function alertRemovedCart() {
  Toastify({
    text: "Se elimino un PERFUME del Carrito",
    duration: 1500,
    gravity: "bottom",
    position: "left",
    style: {
      background: "#4B4B4B",
    },
  }).showToast();
}