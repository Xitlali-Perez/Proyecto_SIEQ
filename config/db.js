require('dotenv').config(); // Carga las variables de entorno desde .env
const mysql = require('mysql');

// Validación de variables de entorno
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'NODE_ENV'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error(`Faltan las siguientes variables de entorno: ${missingEnvVars.join(', ')}`);
    process.exit(1); // Termina la ejecución si faltan variables necesarias
}

// Configuración del pool de conexiones a MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // Espera conexiones disponibles si el pool está lleno
    connectionLimit: 10,      // Máximo de conexiones simultáneas
    queueLimit: 0             // Sin límite para la cola de solicitudes
});

// Función para probar la conexión al iniciar
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1); // Termina la ejecución si la conexión falla
    } else {
        console.log('Conexión al pool de MySQL exitosa');
        connection.release(); // Libera la conexión para que otros puedan usarla
    }
});

// Exportar el pool de conexiones
module.exports = pool;
