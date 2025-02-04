# flask_inventario-movil

# .env
Dentro de este archivo va el puerto que va a levantar el servidor. Si por algún motivo elpuerto está ocupado, se deberá optar por cambiar a otro que esté disponible.
# Configuración de la base de datos

Se debe modificar el archivo pool.json para configurar la conexión a la base de datos.
Los campos serán los siguientes:
[
    {
        "host": "XX",
        "base": "slm",
        "puerto": "5432",
        "nombre": "slm"
    },
    {
        "host": "XX",
        "base": "ALBO",
        "puerto": "5433",
        "nombre": "ALBORADA "
    },
]

# Levantar el proyecto desde un ejecutable login-page-app.exe

Ejecutar el servidor: Ejecuta el archivo generado (por ejemplo, login-page-app.exe en Windows) en la computadora que actuará como servidor. Asegúrate de que el puerto especificado en tu .env (3000) esté abierto y accesible en la red local.

Acceder desde el celular: Conecta tu celular a la misma red Wi-Fi que la computadora. Abre un navegador en el celular y accede a la dirección IP de la computadora con el puerto especificado. Por ejemplo:

http://192.168.88.13:3000

# En caso que el ejecutable no exista
pkg . --targets node18-win --output login-page-app.exe

# Levantar el proyecto usando docker
1. docker build image -t flask_inventario_movil .

2. docker run -d -p 3000:3000 --name flask_inventatio_movil flask_inventario_movil