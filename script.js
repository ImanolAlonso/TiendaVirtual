let contenedor = document.getElementById("contenedorProductos");
let iniciarSesion = document.getElementById("iniciarSesion");
let carrito = document.getElementById("carrito");
let botonCompra = document.getElementById("botonCompra");

let tallas = document.querySelectorAll(".tallaRopa");
let categorias = document.querySelectorAll(".categoria");
let precio = document.getElementById("precio");
let oferta = document.getElementById("oferta");

let divFiltros = document.querySelector(".filtros");

let busqueda = document.getElementById("busqueda");
let botonBusqueda = document.getElementById("botonBusqueda");
let botonHablar = document.getElementById("botonHablar");

let botonCookies = document.querySelectorAll(".botonCookies");
let divCookies = document.getElementById("cookies");

let dropMenu = document.querySelectorAll(".dropMenu");
let cerrarSesion = document.getElementById("cerrarSesion");

let titulo = document.getElementsByTagName("title")
if ( window.location.href.split("/")[window.location.href.split("/").length - 1] =="productos.html") {
  console.log(titulo)
  titulo[0].innerHTML = sessionStorage.getItem("seccion").toUpperCase();
}

let itemsNav = document.querySelectorAll(".itemNav");
itemsNav.forEach(item => {
  item.addEventListener("mouseover",function(){
    item.classList += "shadow bg-danger bg-danger-gradient gbg-opacity-10 text-white";
  })
  item.addEventListener("mouseleave",function(){
    item.classList.remove("shadow")
    item.classList.remove("bg-danger")
    item.classList.remove("bg-danger-gradient")
    item.classList.remove("bg-opcaity-10")
    item.classList.remove("text-white")
  })
})

const SpeechRecognition = webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'es-ES';


iniciarSesion.addEventListener("click", openNewWindow);
cerrarSesion.addEventListener("click", cerrarSesionCliente);
carrito.addEventListener("click", mostrarProductosEnCarrito);
botonCompra.addEventListener("click",abrirCarrito);


function hablar() {
  try {
    recognition.start();
    console.log("Empieza a hablar...");
    recognition.onstart = function () {
      console.log("Escuchando...");
      // Puedes realizar configuraciones adicionales aquí si es necesario
    };
    recognition.onspeechend = function () {
      console.log("Se ha parado la escucha");
      // Puedes realizar acciones adicionales aquí si es necesario
    };
    recognition.onresult = function (e) {
      var transcript = e.results[0][0].transcript;
      console.log(`Has dicho: ${transcript}`);
    };
  } catch (error) {
    console.error("Error al iniciar el reconocimiento:", error);
  }
}

if (localStorage.getItem("sesion") == "true") {
  dropMenu[0].classList.remove("visually-hidden");
}

function cerrarSesionCliente() {
  localStorage.setItem("sesion", false);
  localStorage.setItem("nombreSesion", "iniciar sesion");
  location.reload();
}

if (localStorage.getItem("cookies") == "true") {
  divCookies.style.display = "none";
}
botonCookies.forEach((boton) => {
  boton.addEventListener("click", () => {
    localStorage.setItem("cookies", true);
    divCookies.style.display = "none";
  });
});
if (
  window.location.href.split("/")[window.location.href.split("/").length - 1] ==
  "productos.html"
) {
  botonHablar.addEventListener("click", hablar);
  botonBusqueda.addEventListener("click", filtroBusqueda);
  divFiltros.addEventListener("click", filtrosSeleccionados);
}
async function cargarConId(id) {
  try {
    const json = await cargarJSON();
    mostrarConId(json, id);
  } catch (e) {
    console.log(e);
  }
}
function mostrarProductosEnCarrito() {
  let canvasBody = document.getElementById("canvasBody")
  if (localStorage.getItem("sesion") == "true") {
    if (localStorage.getItem("Productos")) {
      productos = JSON.parse(localStorage.getItem("Productos"));
    }
    //Reset del carrito donde estan todos los prodcutos
    canvasBody.innerHTML = "";
    productos.forEach((producto) => {
      //Acceder al JSON con el producto(id)
      cargarConId(producto.id);
    });
  }
}
function mostrarConId(json, idPr) {
  let canvasBody = document.getElementById("canvasBody")
  var div = document.createElement("div");
  var imagen = document.createElement("img");
  var nombre = document.createElement("p");

  div.classList ="row container w-75 d-flex align-items-center justify-content-center";
  imagen.src = json[idPr - 1].imagenes[0];
  imagen.classList = "col w-50";
  nombre.innerHTML = json[idPr - 1].nombre;
  nombre.classList = "col";
  div.appendChild(imagen);
  div.appendChild(nombre);
  canvasBody.appendChild(div);
}

let filtros = {
  talla: {},
  tipo: {},
  oferta: false,
  precio: {},
  palabra: "",
};



async function filtrosSeleccionados(event) {
  let json = await cargarJSON();
  if (event.target.parentElement.parentElement.classList.contains("talla")) {
    // Actualiza el estado del filtro de talla
    filtros.talla[event.target.value] = event.target.checked;
  }
  if (
    event.target.parentElement.parentElement.classList.contains("categoria")
  ) {
    // Actualiza el estado del filtro de tipo
    filtros.tipo[event.target.value] = event.target.checked;
  }
  if (event.target.parentElement.classList.contains("precio")) {
    // Actualiza el estado del filtro de precio
    filtros.precio = event.target.value;
  }
  if (event.target.parentElement.classList.contains("oferta")) {
    // Actualiza el estado del filtro de oferta
    filtros.oferta = event.target.checked;
  }
  //Llamar a funcion externa que ejecute el filtro
  mostrarConFiltro(filtros, json);
}
function mostrarConFiltro(filtros, json) {
  //Elementos filtrados es el json con los elementos que coincidan con el filtro
  let elementosFiltrados = json.filter((item) => {
    //Filtros es un objeto donde se van añadiendo elementos seleccionados y van cambiando de valores entre true y false

    for (let key in filtros) {
      if (key === "precio") {
        // Filtrar por precio y oferta
        if (item[key] > Number(filtros[key])) {
          return false;
        }
      } else if (key === "oferta") {
        // Filtrar por oferta solo si el filtro de oferta está como true
        if (filtros[key] && item[key] === false) {
          return false;
        }
      } else if (key === "palabra") {
        if (!item.nombre.toLocaleLowerCase().includes(filtros.palabra)) {
          return false;
        }
      } else {
        // Filtrar por talla, tipo
        for (let filtro in filtros[key]) {
          if (filtros[key][filtro] && !item[key].includes(filtro)) {
            return false;
          }
        }
      }
    }
    return true;
  });
  mostrar(elementosFiltrados);
}

function abrirCarrito() {
  if (localStorage.getItem("sesion") == "false") {
    openNewWindow();
  } else {
    window.open("carritoCompra.html", "_self");
  }
}
function paginaNueva(e) {
  sessionStorage.setItem("seccion",e.name)
  window.open("productos.html", "_self");
}
async function filtroBusqueda() {
  let json = await cargarJSON();
  let palabraBusqueda = busqueda.value.toLocaleLowerCase();
  filtros.palabra = palabraBusqueda;
  let productosFiltradosBusqueda = json.filter((producto) => {
    if (!producto.nombre.toLocaleLowerCase().includes(palabraBusqueda)) {
      return false;
    }
    return true;
  });
  mostrar(productosFiltradosBusqueda);
}

async function cargar() {
  try {
    const json = await cargarJSON();
    mostrar(json);
  } catch (e) {
    console.log(e);
  }
}

async function cargarJSON() {
  let doc = "articulos.json";
  const respuesta = await fetch(doc);
  const json = await respuesta.json();
  return json;
}
function mostrar(json) {
  //Reseteo del div para cuando le llamen en los filtros no añada a lo que ya esta si no que empiece de 0
  contenedor.innerHTML = "";
  json.forEach((elemento) => {
    if (
      elemento.genero.includes(
        sessionStorage.getItem("seccion")
      )
    ) {
      let divCard = document.createElement("div");
      let divCardBody = document.createElement("div");
      let img = document.createElement("img");
      let h5 = document.createElement("h5");
      let precio = document.createElement("p");
      let enlace = document.createElement("a");
      let enlaceImagen = document.createElement("a");

      divCard.classList = "card col-lg-3 border divCard";
      divCard.addEventListener("mouseover",function(){
        divCard.classList.add("shadow-lg");
        img.classList.add("hoverImg");
      })
      divCard.addEventListener("mouseleave",function(){
        divCard.classList.remove("shadow-lg");
        img.classList.remove("hoverImg");
      })
      
      divCardBody.className = "card-body align-items-center";
      img.className = "card-img-top img-h position-relative";
      h5.className = "card-title";
      enlace.classList = "btn btn-outline-danger";
      enlace.id = elemento.id;
      enlaceImagen.href = "detalleProducto.html?id=" + elemento.id;
      img.src = elemento.imagenes[0];
      h5.innerHTML = elemento.nombre;
      precio.innerHTML = elemento.precio + " &#8364";
      precio.classList = "m-2 p-2 fw-bold"
      enlace.innerHTML = "Agregar al carrito";

      enlaceImagen.appendChild(img);
      divCardBody.appendChild(h5);
      for (let i = 0; i < elemento.talla.length; i++) {
        let talla = document.createElement("button");
        talla.classList = "btn btn-light m-1 tallaProducto";
        talla.innerHTML = elemento.talla[i];
        talla.addEventListener("click", tallaSeleccionada);
        divCardBody.appendChild(talla);
      }
      divCardBody.appendChild(precio);
      divCardBody.appendChild(enlace);
      divCard.appendChild(enlaceImagen);
      divCard.appendChild(divCardBody);
      contenedor.appendChild(divCard);
      enlace.addEventListener("click", comprobarSesion);
    }
  });
}
function tallaSeleccionada(e) {
  if(e.target.classList.contains("btn-dark")){
    e.target.classList.remove("btn-dark");
    e.target.classList.add("btn-light");
  } else {
    e.target.classList.remove("btn-light");
    e.target.classList.add("btn-dark");
  }
  e.target.parentElement.querySelectorAll(".tallaProducto").forEach((talla) => {
    if (talla.classList.contains("btn-dark") && talla.textContent != e.target.textContent) {
      talla.classList.remove("btn-dark");
      talla.classList.add("btn-light");
    }
    
  });
  if (
    e.target.parentElement.lastElementChild.textContent != "Agregar al carrito"
  ) {
    e.target.parentElement.lastElementChild.remove();
  }
}
function comprobarSesion(e) {
  var tallaElegida = "Unica";
  e.target.parentElement.querySelectorAll("button").forEach((talla) => {
    if (talla.classList.contains("btn-dark")) {
      tallaElegida = talla.textContent;
    }
  });
  if (localStorage.getItem("sesion") == "true") {
    if (
      tallaElegida == "Unica" &&
      e.target.parentElement.querySelectorAll("button").length > 0
    ) {
      p = document.createElement("p");
      p.classList = "text-danger m-1";
      p.innerHTML = "Debes seleccionar una talla";
      if (e.target.parentElement.lastElementChild == e.target) {
        e.target.parentElement.appendChild(p);
      }
    } else {
      agregarAlCarrito(
        e.target.id,
        e.target.previousElementSibling.textContent.split(" ")[0],
        tallaElegida
      );
      Notification.requestPermission()
        .then((resultado) => {
          mostrarNotificacion(resultado);
        });
        function mostrarNotificacion(resultado) {
          if (resultado == "granted") {
            new Notification("Producto añadido correctamente", {
            });
          }
        }
      mostrarProductosEnCarrito();
    }
  } else {
    openNewWindow();
  }
}

function agregarAlCarrito(id, precio, talla) {
  const almacenamientoJSON = {
    id,
    precio,
    talla,
  };
  productos = JSON.parse(localStorage.getItem("Productos")) || [];
  //agregar el nuevo producto al objeto de productos
  productos.push(almacenamientoJSON);
  //Volcado de datos al localStorage
  localStorage.setItem("Productos", JSON.stringify(productos));
}

function openNewWindow() {
  var ancho = 600;
  var alto = 800;
  var y = window.top.outerHeight / 2 + window.top.screenY - alto / 2;
  var x = window.top.outerWidth / 2 + window.top.screenX - ancho / 2;
  if (localStorage.getItem("sesion") == "false") {
    window.open(
      "inicioSesion.html",
      "ventanaNueva",
      "width=" + ancho + ",height=" + alto + ",top=" + y + ",left=" + x
    );
  }
}
//Solo se ejecute al cargar la pagina no cada vez que accede a una funcion
function crearDatosLocalStorage() {
  if (!localStorage.getItem("nombreSesion")) {
    localStorage.setItem("nombreSesion", "Iniciar Sesion");
  }
  if (!localStorage.getItem("sesion")) {
    localStorage.setItem("sesion", false);
  }
  iniciarSesion.innerHTML = localStorage.getItem("nombreSesion");
}

        let osmUrl; // url
        let map; // mapa
        let markerGroup; // marcadores
        window.addEventListener('load', setMap())

        function setMap() {
            // Creamos el mapa
            osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib });
            // Esto de setView sirve para situar la cámara, las coordenadas desde las que 
            map = L.map('map').setView([40.3877449,-3.6298866], 13).addLayer(osm);
            markerGroup = L.layerGroup().addTo(map);
            showMap();
        }

        // Comprueba si has hecho el mapa entero
        function setFullMap() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showFullMap);
            }
            else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        // Añade el marcador de la tienda
        function showMap() {
            L.marker([40.3877449,-3.6298866]).addTo(map)
                .bindPopup('Mountain Bourd Jand')
                .openPopup()
                .addTo(map);
        }

        // Añade el marcador de tu localización
        function showFullMap(position) {
            L.marker([position.coords.latitude, position.coords.longitude]).addTo(map)
                .bindPopup('Ubicacion actual')
                .openPopup()
                .addTo(map);
        }
crearDatosLocalStorage();
cargar();
