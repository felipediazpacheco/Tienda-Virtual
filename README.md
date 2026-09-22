# Tienda-Virtual
Repositorio para tienda virtual SportyStyle
App web que simula el proceso de compra en una tienda deportiva
Desarrollada con HTML, CSS y JavaScript, integrando autenticación con Auth0

#Autenticacion
Se usó SDK de Auth0 para SPA via CDN. Al iniciar la app, corre el cliente con el Dominio y el Client ID del Dashboard de Auth0
En caso de no estar autenticado el usuario se muestra un mensaje y el botón para iniciar sesión, el cual redirige al login generico de auth0 con `loginWithRedirect()`
Luego de autenticar Auth0 redirige de vuelta y el SDK procesa el callback automáticamente, mostrando un mensaje de bienvenida con el nombre del usuario. El manejo de tokens y sesión queda delegado por completo al SDK.

#
