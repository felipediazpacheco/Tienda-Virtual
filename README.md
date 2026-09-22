## Tienda-Virtual
Repositorio para tienda virtual SportyStyle
App web que simula el proceso de compra en una tienda deportiva
Desarrollada con HTML, CSS y JavaScript, integrando autenticación con Auth0

## Autenticacion
Se usó SDK de Auth0 para SPA vía CDN. Al iniciar la app, corre el cliente con el Dominio y el Client ID del Dashboard de Auth0
En caso de no estar autenticado el usuario se muestra un mensaje y el botón para iniciar sesión, el cual redirige al login genérico de auth0 con `loginWithRedirect()`
Luego de autenticar Auth0 redirige de vuelta y el SDK procesa el callback automáticamente, mostrando un mensaje de bienvenida con el nombre del usuario. El manejo de tokens y sesión queda delegado por completo al SDK.

## Seleccion de Productos
La tienda muestra 3 categorías con 3 productos cada una, las cuales tienen nombre, descripción, precio y una imagen(en texto). Los cuales se renderizan dinámicamente con JavaScript.
Al hacer click para agregar al carrito el producto se agrega y en caso de haber un producto antes, se aumenta la cantidad. Ademas se guarda en ´sessionStorage´.
El carrito además se actualiza de manera automatica mostrando cantidad, precio y cantidad total

## Proteccion de sesión
El carrito guarda en ´sessionStorage´ con la palabra clave ´carrito´ y solo funciona mediante la función de navegador.
Al completar la compra se elimina con ´sessionStorage.removeItem´ y al cerrar sesion se ejecuta ´sessionStorage.clear()´ antes del logout de Auth0, lo cual hace que los datos no queden almacenados

## Tecnologias
HTML5, JavaScript, Auth0 SPA SDK, CSS3 y Session Storage
