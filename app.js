// Configuracion auth0
let auth0Client;

const AUTH0_DOMAIN = 'dev-83188n4078805pqv.us.auth0.com';
const AUTH0_CLIENT_ID = 'Pz0yMHkGxv7FC1haWRlTLonCzZIFA0wD';
// Productos
const productos = {
  camisetas: [
    { id: 1, nombre: 'Camiseta Running', precio: 15990, img: 'https://placehold.co/200x140/4a90d9/white?text=Camiseta+Running', desc: 'Camiseta transpirable para running' },
    { id: 2, nombre: 'Camiseta Training', precio: 13990, img: 'https://placehold.co/200x140/4a90d9/white?text=Camiseta+Training', desc: 'Ajuste ergonómico para entrenamiento' },
    { id: 3, nombre: 'Camiseta Gym', precio: 11990, img: 'https://placehold.co/200x140/4a90d9/white?text=Camiseta+Gym', desc: 'Algodón suave, uso diario en gimnasio' }
  ],
  pantalones: [
    { id: 4, nombre: 'Pantalón Sport', precio: 22990, img: 'https://placehold.co/200x140/2d9d5f/white?text=Jogger+Sport', desc: 'Jogger deportivo con bolsillos' },
    { id: 5, nombre: 'Short Running', precio: 14990, img: 'https://placehold.co/200x140/2d9d5f/white?text=Short+Running', desc: 'Short liviano para correr' },
    { id: 6, nombre: 'Calza Deportiva', precio: 18990, img: 'https://placehold.co/200x140/2d9d5f/white?text=Calza+Deportiva', desc: 'Calza compresiva para entrenamiento' }
  ],
  accesorios: [
    { id: 7, nombre: 'Botella Deportiva', precio: 6990, img: 'https://placehold.co/200x140/d9824a/white?text=Botella', desc: 'Botella de 750ml a prueba de fugas' },
    { id: 8, nombre: 'Banda Elástica', precio: 5990, img: 'https://placehold.co/200x140/d9824a/white?text=Banda+Elastica', desc: 'Banda de resistencia para entrenamiento' },
    { id: 9, nombre: 'Mochila Deportiva', precio: 24990, img: 'https://placehold.co/200x140/d9824a/white?text=Mochila', desc: 'Mochila resistente con compartimentos' }
  ]
};
// Iniciar auth0
async function initAuth0() {
  auth0Client = await auth0.createAuth0Client({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });

  if (location.search.includes('code=')) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/');
  }

  await updateUI();
}

async function updateUI() {
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0Client.getUser();
    document.getElementById('welcome-msg').textContent = `Bienvenido, ${user.name}`;
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('app-content').style.display = 'block';
    document.getElementById('login-required-msg').style.display = 'none';
    renderProductos();
    renderCarrito();
  } else {
    document.getElementById('login-btn').style.display = 'inline-block';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('app-content').style.display = 'none';
    document.getElementById('login-required-msg').style.display = 'block';
  }
}

document.getElementById('login-btn').addEventListener('click', async () => {
  await auth0Client.loginWithRedirect();
});

document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.clear();
  auth0Client.logout({
    logoutParams: { returnTo: window.location.origin }
  });
});
// Renderizar Productos
function renderProductos() {
  Object.keys(productos).forEach(categoria => {
    const contenedor = document.getElementById(categoria);
    contenedor.innerHTML = '';
    productos[categoria].forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>${p.desc}</p>
        <p class="price">$${p.precio.toLocaleString('es-CL')}</p>
        <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
      `;
      contenedor.appendChild(card);
    });
  });
}
// Sesion Storage para carrito
function getCarrito() {
  return JSON.parse(sessionStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
  sessionStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
  const todos = [...productos.camisetas, ...productos.pantalones, ...productos.accesorios];
  const producto = todos.find(p => p.id === id);

  let carrito = getCarrito();
  const existente = carrito.find(item => item.id === id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito(carrito);
  renderCarrito();
}

function renderCarrito() {
  const carrito = getCarrito();
  const contenedor = document.getElementById('cart-items');
  contenedor.innerHTML = '';

  let total = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${item.nombre} x${item.cantidad}</span>
      <span>$${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
    `;
    contenedor.appendChild(div);
  });

  document.getElementById('cart-total').textContent = total.toLocaleString('es-CL');
}
// Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
  const carrito = getCarrito();
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }
  document.getElementById('checkout-form').style.display = 'block';
  document.getElementById('checkout-form').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('payment-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value;
  const telefono = document.getElementById('telefono').value;
// Validacion de correo (formato)
  const correoValido = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(correo);
  if (!correoValido) {
    alert('Por favor ingresa un correo electrónico válido (ej: nombre@gmail.com)');
    return;
  }
// Validacion de telefono: solo numeros, entre 8 y 12 digitos
  const telefonoValido = /^[0-9]{8,12}$/.test(telefono);
  if (!telefonoValido) {
    alert('Por favor ingresa un teléfono válido (solo números, 8 a 12 dígitos)');
    return;
  }

  mostrarConfirmacion();
});

function mostrarConfirmacion() {
  const carrito = getCarrito();
  const nombre = document.getElementById('nombre').value;
  let total = 0;

  let detalle = carrito.map(item => {
    total += item.precio * item.cantidad;
    return `<p>${item.nombre} x${item.cantidad} — $${(item.precio * item.cantidad).toLocaleString('es-CL')}</p>`;
  }).join('');

  document.getElementById('order-summary').innerHTML = `
    <p>Gracias, ${nombre}!</p>
    ${detalle}
    <p><strong>Total: $${total.toLocaleString('es-CL')}</strong></p>
  `;

  document.getElementById('catalog').style.display = 'none';
  document.getElementById('cart').style.display = 'none';
  document.getElementById('checkout-form').style.display = 'none';
  document.getElementById('confirmation').style.display = 'block';

  sessionStorage.removeItem('carrito');
}

window.addEventListener('load', initAuth0);