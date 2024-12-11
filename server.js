const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001; // Usa el puerto del entorno si está disponible, de lo contrario usa 3001

//Configura middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    // Consulta SQL para verificar el usuario y la contraseña
    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ?';
    db.query(query, [usuario, password], (error, results) => {
        if (error) {
            console.error('Error durante el login:', error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        if (results.length > 0) {
            // Obtener el rol del usuario
            const userRole = results[0].rol;  // Asumiendo que la columna "rol" está en la base de datos
            let redirectUrl = '';
            // Redirigir según el rol del usuario
            switch(userRole) {
                case 'administrador':
                    redirectUrl = 'http://localhost/Proyecto_SIEQ/registros_revision.html';  // Redirigir a la página del administrador
                    break;
                case 'tecnico':
                    redirectUrl = 'http://localhost/Proyecto_SIEQ/registros_revision.html';  // Redirigir a la página del técnico
                    break;
                case 'trabajador':
                    redirectUrl = 'http://localhost/Proyecto_SIEQ/trabajador.html';  // Redirigir a la página del trabajador
                    break;
                default:
                    return res.status(403).json({ message: 'Rol de usuario no válido' });
            }
            // Responder con mensaje y URL de redirección
            res.json({
                message: 'Inicio de sesión exitoso',
                redirectUrl: redirectUrl,
                role: userRole  // Devolver el rol junto con la URL
            });
            
        } else {
            // Si las credenciales no son válidas
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    });
});

// Ruta para obtener registros de vehículos
// Ruta para obtener registros de vehículos
app.get('/api/vehicles', (req, res) => {
    const query = `
        SELECT 
            id_vehiculo, 
            no_unidad AS numeroUnidad,
            tipo AS tipoVehiculo,
            placas,
            year
        FROM 
            vehiculo
        ORDER BY 
            no_unidad ASC
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching vehicle records:', error);
            return res.status(500).send('Error fetching vehicle records');
        }
        res.json(results);
    });
});


// Ruta para obtener registros de usuarios
app.get('/api/users', (req, res) => {
    const query = `
        SELECT 
            id_usuario AS idUsuario, no_empleado AS noempleado, nombre, ape_paterno AS apepaterno, ape_materno AS apematerno, usuario, password, rol 
        FROM 
            Usuarios;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching user records:', error);
            return res.status(500).send('Error fetching user records');
        }
        res.json(results);
    });
});

// Ruta para obtener los años disponibles
app.get('/api/years', (req, res) => {
    const query = `SELECT DISTINCT YEAR(fecha) AS year FROM formulario ORDER BY year DESC`;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching years:', error);
            return res.status(500).send('Error fetching years');
        }
        res.json(results.map(row => row.year));
    });
});

// Ruta para obtener los tipos de unidad
app.get('/api/units', (req, res) => {
    const query = `SELECT DISTINCT tipo FROM vehiculo ORDER BY tipo`;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching units:', error);
            return res.status(500).send('Error fetching units');
        }
        res.json(results.map(row => row.tipo));
    });
});

// Ruta para obtener registros de formularios con filtros opcionales
app.get('/api/records', async (req, res) => {
    const { year, month, unit } = req.query;

    let query = `
        SELECT 
            f.folio,
            f.fecha,
            v.tipo AS unidad,
            fir_elaboro_vehiculo AS elaborante,
            f.estado,
            f.tipo_registro
        FROM 
            formulario f
        JOIN 
            vehiculo v ON f.id_vehiculo_fk = v.id_vehiculo
        WHERE 
            1=1
    `;
    const queryParams = [];

    if (year) {
        query += ' AND YEAR(f.fecha) = ?';
        queryParams.push(year);
    }

    if (month) {
        query += ' AND MONTH(f.fecha) = ?';
        queryParams.push(month);
    }

    if (unit) {
        query += ' AND v.tipo = ?';
        queryParams.push(unit);
    }

    db.query(query, queryParams, (error, results) => {
        if (error) {
            console.error('Error fetching records:', error);
            return res.status(500).send('Error fetching records');
        }
        res.json(results);
    });
});

// Ruta para insertar un nuevo vehículo
app.post('/api/vehicles', (req, res) => {
    const { numeroUnidad, tipoVehiculo, placas, year } = req.body;

    const sql = 'INSERT INTO vehiculo (no_unidad, tipo, placas, year) VALUES (?, ?, ?, ?)';
    const values = [numeroUnidad, tipoVehiculo, placas, year];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar el vehículo:', err);
            return res.status(500).send('Error al registrar el vehículo');
        }
        res.status(201).send('Vehículo registrado exitosamente');
    });
});

// Ruta para insertar un nuevo usuario
app.post('/api/users', (req, res) => {
    const { noempleado, nombre, apepaterno, apematerno, usuario, password, rol } = req.body;
    const query = 'INSERT INTO usuarios (no_empleado, nombre, ape_paterno, ape_materno, usuario, password, rol) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [noempleado, nombre, apepaterno, apematerno, usuario, password, rol], (error) => {
        if (error) {
            console.error('Error al registrar usuario:', error);
            return res.status(500).json({ message: 'Error al registrar usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
});

// Ruta para actualizar un vehiculo
app.put('/api/vehicles/:id_vehiculo', (req, res) => {
    const id_vehiculo = req.params.id_vehiculo;
    const { numeroUnidad, tipoVehiculo, placas, year } = req.body;

    const sql = `
        UPDATE vehiculo 
        SET no_unidad = ?, tipo = ?, placas = ?, year = ? 
        WHERE id_vehiculo = ?
    `;
    const values = [numeroUnidad, tipoVehiculo, placas, year, id_vehiculo];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar el vehículo:', err);
            return res.status(500).send('Error al actualizar el vehículo');
        }
        res.send('Vehículo actualizado exitosamente');
    });
});

// Ruta para actualizar un usuario
app.put('/api/users/:idUsuario', (req, res) => {
    const { idUsuario } = req.params;
    const { noempleado, nombre, apepaterno, apematerno, usuario, password, rol } = req.body;

    const query = `
        UPDATE usuarios
        SET 
            no_empleado = ?, nombre = ?, ape_paterno = ?, ape_materno = ?, usuario = ?, password = ?, rol = ?
        WHERE 
            id_usuario = ?
    `;

    const values = [noempleado, nombre, apepaterno, apematerno, usuario, password, rol, idUsuario];

    db.query(query, values, (error) => {
        if (error) {
            console.error('Error al actualizar usuario:', error);
            return res.status(500).json({ message: 'Error al actualizar usuario' });
        }
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    });
});

// Ruta para eliminar un vehículo
app.delete('/api/vehicles/:id_vehiculo', (req, res) => {
    const id_vehiculo = req.params.id_vehiculo;
    const sql = 'DELETE FROM vehiculo WHERE id_vehiculo = ?';

    db.query(sql, [id_vehiculo], (err, result) => {
        if (err) {
            console.error('Error al eliminar el vehículo:', err);
            return res.status(500).send('Error al eliminar el vehículo');
        }
        res.send('Vehículo eliminado exitosamente');
    });
});

// Ruta para eliminar un usuario
app.delete('/api/users/:idUsuario', (req, res) => {
    const idUsuario = req.params.idUsuario;
    const sql = 'DELETE FROM usuarios WHERE id_usuario = ?';

    db.query(sql, [idUsuario], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            return res.status(500).send('Error al eliminar el usuario');
        }
        res.send('Usuario eliminado exitosamente');
    });
});

// FUNCIONES DEL FORMULARIO UNO (SALIDA) ----------------------------------------------------------------------------
// Ruta para obtener todos los vehículos
app.get('/api/vehicles', (req, res) => {
    const query = 'SELECT * FROM Vehiculo';
    executeQuery(query, [], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los vehículos' });
        }
        res.json(results);
    });
});

// Ruta para obtener detalles de un vehículo según el número de unidad
app.get('/api/vehicle/:unidad', (req, res) => {
    const numeroUnidad = req.params.unidad;
    const query = `
        SELECT 
            no_unidad AS numeroUnidad,
            tipo AS tipoVehiculo,
            placas
        FROM 
            vehiculo
        WHERE 
            no_unidad = ?;
    `;
    db.query(query, [numeroUnidad], (error, results) => {
        if (error) {
            console.error('Error al obtener los detalles del vehículo:', error);
            return res.status(500).send('Error al obtener los detalles del vehículo');
        }
        if (results.length > 0) {
            res.json(results[0]); // Devolver el primer registro encontrado
        } else {
            res.status(404).send('Vehículo no encontrado');
        }
    });
});

//Guardar los datos del formulario 1 en la base de datos
app.post('/api/submitForm', (req, res) => {
    const formularioData = req.body.formulario;
    const nivelesData = req.body.niveles;
    const exterioresData = req.body.exteriores;
    const interioresData = req.body.interiores;
    const emergenciaData = req.body.emergencia;
    const evidenciaData = req.body.evidencia;
    const extraData = req.body.extra;

    // Obtener datos del vehículo
    const vehiculoQuery = 'SELECT id_vehiculo FROM Vehiculo WHERE no_unidad = ? AND placas = ? AND tipo = ?';
    console.log("Datos del vehículo:", formularioData.unidad, formularioData.placas, formularioData.tipovehiculo);
    db.query(vehiculoQuery, [formularioData.unidad, formularioData.placas, formularioData.tipovehiculo], (err, vehiculoResult) => {
        if (err) {
            console.error('Error al consultar el vehículo', err);
            return res.status(500).json({ message: 'Error al consultar el vehículo' });
        }
        if (vehiculoResult.length === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        const idVehiculo = vehiculoResult[0].id_vehiculo;

        // Insertar niveles
        const nivelesQuery = `INSERT INTO Niveles (aceite_motor, anticongelante, estado_frenos, liquido_frenos, liq_limpiaparabrisas)
                              VALUES (?, ?, ?, ?, ?)`;
        const nivelesValues = [
            nivelesData.aceite_motor,
            nivelesData.anticongelante,
            nivelesData.estadofrenos,
            nivelesData.liquidofrenos,
            nivelesData.liqlimpiaparabrisas
        ];
        db.query(nivelesQuery, nivelesValues, (err, nivelesResult) => {
            if (err) {
                console.error('Error al insertar niveles', err);
                return res.status(500).json({ message: 'Error al insertar niveles' });
            }
            const idNiveles = nivelesResult.insertId;

            // Insertar exteriores
            const exterioresQuery = `INSERT INTO Exteriores (luces, luces_cuarto, antena, espejos_retractiles, espejos_laterales, cristales,
                                                       rotulos, tapones_rines, tapon_combustible, claxon, limpiaparabrisas, manijas, fascias,
                                                       limpieza_unidad, llantas, alarma_reversa) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const exterioresValues = Object.values(exterioresData);
            db.query(exterioresQuery, exterioresValues, (err, exterioresResult) => {
                if (err) {
                    console.error('Error al insertar exteriores', err);
                    return res.status(500).json({ message: 'Error al insertar exteriores' });
                }
                const idExteriores = exterioresResult.insertId;

                // Insertar interiores
                const interioresQuery = `INSERT INTO Interiores (tablero, calefaccion, estereo, bocinas, viseras, retrovisor, cenicero, botones,
                                                           manijas, tapetes, vestiduras, cielo, asientos, cinturones, libre_olores, matrial_ageno, libre_basura)
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const interioresValues = Object.values(interioresData);
                db.query(interioresQuery, interioresValues, (err, interioresResult) => {
                    if (err) {
                        console.error('Error al insertar interiores', err);
                        return res.status(500).json({ message: 'Error al insertar interiores' });
                    }
                    const idInteriores = interioresResult.insertId;

                    // Insertar emergencia
                    const emergenciaQuery = `INSERT INTO Emergencia (gato, llave, triangulo, llanta_refaccion, extintor, torreta, calzas, cables,
                                                           matachispas, botiquin) 
                                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    const emergenciaValues = Object.values(emergenciaData);
                    db.query(emergenciaQuery, emergenciaValues, (err, emergenciaResult) => {
                        if (err) {
                            console.error('Error al insertar emergencia', err);
                            return res.status(500).json({ message: 'Error al insertar emergencia' });
                        }
                        const idEmergencia = emergenciaResult.insertId;

                        // Insertar extra
                        const extraQuery = `INSERT INTO revicion_extra (nivel_combustible, vida_llantas_delanteras, presion_delanteras, vida_llantas_traseras, 
                                                                presion_traseras, observaciones) 
                                            VALUES (?, ?, ?, ?, ?, ?)`;
                        const extraValues = [
                            extraData.cantidadCombustible,
                            extraData.vidadelantereas,
                            extraData.presiondelantereas,
                            extraData.vidatraseras,
                            extraData.presiontraseras,
                            extraData.observaciones
                        ];
                        db.query(extraQuery, extraValues, (err, extraResult) => {
                            if (err) {
                                console.error('Error al insertar extra', err);
                                return res.status(500).json({ message: 'Error al insertar extra' });
                            }
                            const idExtra = extraResult.insertId;

                            // Insertar formulario
                            const formularioQuery = `INSERT INTO formulario (folio, fecha, hora_registro, kilometraje, destino, licen_conducir, 
                                                        t_circulacion, poliza, vvq, id_vehiculo_fk, id_niveles_fk, id_interiores_fk, id_exteriores_fk, 
                                                        id_emergencia_fk, id_extra_fk, conductor, fir_recibe_vehiculo, fir_elaboro_vehiculo, estado, tipo_registro) 
                                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                            const formularioValues = [
                                formularioData.fecha,
                                formularioData.hora,
                                formularioData.kilometraje,
                                formularioData.destino,
                                formularioData.licenconducir,
                                formularioData.tcirculacion,
                                formularioData.poliza,
                                formularioData.vvq,
                                idVehiculo,
                                idNiveles,
                                idInteriores,
                                idExteriores,
                                idEmergencia,
                                idExtra,
                                formularioData.conductor,
                                formularioData.firmarecibe,
                                formularioData.firmaelaboro,
                                'pendiente', // Estado inicial
                                'salida'    // Tipo de registro
                            ];
                            db.query(formularioQuery, formularioValues, (err, formularioResult) => {
                                if (err) {
                                    console.error('Error al insertar formulario', err);
                                    return res.status(500).json({ message: 'Error al insertar formulario' });
                                }

                                // Insertar evidencia si existe
                                if (evidenciaData && evidenciaData.ruta_imagen) {
                                    const evidenciaQuery = `INSERT INTO Evidencias (ruta_imagen, id_formulario_fk) VALUES (?, ?)`;
                                    const evidenciaValues = [evidenciaData.ruta_imagen, formularioResult.insertId];
                                    db.query(evidenciaQuery, evidenciaValues, (err) => {
                                        if (err) {
                                            console.error('Error al insertar evidencia', err);
                                            return res.status(500).json({ message: 'Error al insertar evidencia' });
                                        }
                                        res.json({ message: 'Formulario registrado correctamente con evidencia' });
                                    });
                                } else {
                                    res.json({ message: 'Formulario registrado correctamente' });
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});


//FUNCIONALIDADES DEL FORMULARIO 2 (ENTRADA) ----------------------------------------------------------------------------
//Optencion de los campos principales del formualrio 1 (folio, numero de unidad, tipo de vehiculo y placas)
app.get('/api/records/:folio', (req, res) => {
    const folio = req.params.folio;
    console.log("Folio recibido:", folio);

    if (!folio) {
        return res.status(400).json({ message: "Folio inválido" });
    }

    const query = `
        SELECT 
            f.folio AS folio,
            v.no_unidad AS unidad,
            v.placas AS placas,
            v.tipo AS tipovehiculo
        FROM Formulario f
        JOIN Vehiculo v ON f.id_vehiculo_fk = v.id_vehiculo
        WHERE f.folio = ?
    `;

    db.query(query, [folio], (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error en la consulta", error });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: "Registro no encontrado" });
        }
    });
});

app.post('/api/submitSecondForm', (req, res) => {
    const formularioData = req.body.formulario;
    const nivelesData = req.body.niveles;
    const exterioresData = req.body.exteriores;
    const interioresData = req.body.interiores;
    const emergenciaData = req.body.emergencia;
    const evidenciaData = req.body.evidencia;
    const extraData = req.body.extra;

    // Primero, obtienes el folio del primer formulario
    const folioFormulario = formularioData.folio; // Esto debe coincidir con el folio del primer formulario

    // Consulta para verificar si el primer formulario tiene estado "pendiente"
    const checkFormularioQuery = 'SELECT estado FROM Formulario WHERE folio = ?';
    db.query(checkFormularioQuery, [folioFormulario], (err, result) => {
        if (err) {
            console.error('Error al consultar el estado del formulario', err);
            return res.status(500).json({ message: 'Error al consultar el estado del formulario' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Formulario no encontrado' });
        }

        // Si el estado es "pendiente", lo cambiamos a "completo"
        if (result[0].estado === 'pendiente') {
            const updateFormularioQuery = 'UPDATE formulario SET estado = ? WHERE folio = ?';
            db.query(updateFormularioQuery, ['completo', folioFormulario], (err, updateResult) => {
                if (err) {
                    console.error('Error al actualizar el estado del formulario', err);
                    return res.status(500).json({ message: 'Error al actualizar el estado del formulario' });
                }
                // Ahora podemos continuar con la inserción del segundo formulario
                insertSecondFormData(formularioData, nivelesData, exterioresData, interioresData, emergenciaData, extraData, evidenciaData, folioFormulario, res);
            });
        }else {
            // Si no es "pendiente", simplemente insertamos el segundo formulario
            insertSecondFormData(formularioData, nivelesData, exterioresData, interioresData, emergenciaData, extraData, evidenciaData, folioFormulario, res);
        }
    });
});

// Función para insertar los datos del segundo formulario
function insertSecondFormData(formularioData, nivelesData, exterioresData, interioresData, emergenciaData, extraData, evidenciaData, folioFormulario, res) {
    // Verificar si ya existen dos registros con el mismo folio
    const checkFolioQuery = 'SELECT COUNT(*) AS count FROM formulario WHERE folio = ?';
    db.query(checkFolioQuery, [formularioData.folio], (err, checkResult) => {
        if (err) {
            console.error('Error al verificar folio', err);
            return res.status(500).json({ message: 'Error al verificar folio' });
        }

        if (checkResult[0].count >= 2) {
            return res.status(400).json({ message: 'Ya existen dos registros con este folio' });
        }
        
        const vehiculoQuery = 'SELECT id_vehiculo FROM Vehiculo WHERE no_unidad = ?';
        console.log("Datos del vehículo:", formularioData.unidad);
        db.query(vehiculoQuery, [formularioData.unidad], (err, vehiculoResult) => {
            if (err) {
                console.error('Error al consultar el vehículo', err);
                return res.status(500).json({ message: 'Error al consultar el vehículo' });
            }
            if (vehiculoResult.length === 0) {
                return res.status(404).json({ message: 'Vehículo no encontrado' });
            }

            const idVehiculo = vehiculoResult[0].id_vehiculo;
            // Insertar niveles
            const nivelesQuery = `INSERT INTO Niveles (aceite_motor, anticongelante, estado_frenos, liquido_frenos, liq_limpiaparabrisas)
                                VALUES (?, ?, ?, ?, ?)`;
            const nivelesValues = [
                nivelesData.aceite_motor,
                nivelesData.anticongelante,
                nivelesData.estadofrenos,
                nivelesData.liquidofrenos,
                nivelesData.liqlimpiaparabrisas
            ];
            db.query(nivelesQuery, nivelesValues, (err, nivelesResult) => {
                if (err) {
                    console.error('Error al insertar niveles', err);
                    return res.status(500).json({ message: 'Error al insertar niveles' });
                }
                const idNiveles = nivelesResult.insertId;

                // Insertar exteriores
                const exterioresQuery = `INSERT INTO Exteriores (luces, luces_cuarto, antena, espejos_retractiles, espejos_laterales, cristales,
                                                        rotulos, tapones_rines, tapon_combustible, claxon, limpiaparabrisas, manijas, fascias,
                                                        limpieza_unidad, llantas, alarma_reversa) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const exterioresValues = Object.values(exterioresData);
                db.query(exterioresQuery, exterioresValues, (err, exterioresResult) => {
                    if (err) {
                        console.error('Error al insertar exteriores', err);
                        return res.status(500).json({ message: 'Error al insertar exteriores' });
                    }
                    const idExteriores = exterioresResult.insertId;

                    // Insertar interiores
                    const interioresQuery = `INSERT INTO Interiores (tablero, calefaccion, estereo, bocinas, viseras, retrovisor, cenicero, botones,
                                                            manijas, tapetes, vestiduras, cielo, asientos, cinturones, libre_olores, matrial_ageno, libre_basura)
                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    const interioresValues = Object.values(interioresData);
                    db.query(interioresQuery, interioresValues, (err, interioresResult) => {
                        if (err) {
                            console.error('Error al insertar interiores', err);
                            return res.status(500).json({ message: 'Error al insertar interiores' });
                        }
                        const idInteriores = interioresResult.insertId;

                        // Insertar emergencia
                        const emergenciaQuery = `INSERT INTO Emergencia (gato, llave, triangulo, llanta_refaccion, extintor, torreta, calzas, cables,
                                                            matachispas, botiquin) 
                                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                        const emergenciaValues = Object.values(emergenciaData);
                        db.query(emergenciaQuery, emergenciaValues, (err, emergenciaResult) => {
                            if (err) {
                                console.error('Error al insertar emergencia', err);
                                return res.status(500).json({ message: 'Error al insertar emergencia' });
                            }
                            const idEmergencia = emergenciaResult.insertId;

                            // Insertar extra
                            const extraQuery = `INSERT INTO revicion_extra (nivel_combustible, vida_llantas_delanteras, presion_delanteras, vida_llantas_traseras, 
                                                                        presion_traseras, observaciones) 
                                                VALUES (?, ?, ?, ?, ?, ?)`;
                            const extraValues = [
                                extraData.cantidadCombustible,
                                extraData.vidadelantereas,
                                extraData.presiondelantereas,
                                extraData.vidatraseras,
                                extraData.presiontraseras,
                                extraData.observaciones
                            ];
                            db.query(extraQuery, extraValues, (err, extraResult) => {
                                if (err) {
                                    console.error('Error al insertar extra', err);
                                    return res.status(500).json({ message: 'Error al insertar extra' });
                                }
                                const idExtra = extraResult.insertId;

                                // Insertar segundo formulario con el estado 'completo'
                                const formularioQuery = `INSERT INTO Formulario (folio, fecha, hora_registro, kilometraje, destino, licen_conducir, 
                                                            t_circulacion, poliza, vvq, id_vehiculo_fk, id_niveles_fk, id_interiores_fk, id_exteriores_fk, 
                                                            id_emergencia_fk, id_extra_fk, conductor, fir_recibe_vehiculo, fir_elaboro_vehiculo, estado, tipo_registro) 
                                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                                const formularioValues = [
                                    formularioData.folio,
                                    formularioData.fecha,
                                    formularioData.hora,
                                    formularioData.kilometraje,
                                    formularioData.destino,
                                    formularioData.licenconducir,
                                    formularioData.tcirculacion,
                                    formularioData.poliza,
                                    formularioData.vvq,
                                    idVehiculo,
                                    idNiveles,
                                    idInteriores,
                                    idExteriores,
                                    idEmergencia,
                                    idExtra,
                                    formularioData.conductor,
                                    formularioData.firmarecibe,
                                    formularioData.firmaelaboro,
                                    'completo', // Estado actualizado
                                    'entrada'   // Tipo de registro
                                ];
                                db.query(formularioQuery, formularioValues, (err, formularioResult) => {
                                    if (err) {
                                        console.error('Error al insertar formulario', err);
                                        return res.status(500).json({ message: 'Error al insertar formulario' });
                                    }

                                    // Insertar evidencia si existe
                                    if (evidenciaData && evidenciaData.ruta_imagen) {
                                        const evidenciaQuery = `INSERT INTO Evidencias (ruta_imagen, id_formulario_fk) VALUES (?, ?)`;
                                        const evidenciaValues = [evidenciaData.ruta_imagen, formularioResult.insertId];
                                        db.query(evidenciaQuery, evidenciaValues, (err) => {
                                            if (err) {
                                                console.error('Error al insertar evidencia', err);
                                                return res.status(500).json({ message: 'Error al insertar evidencia' });
                                            }
                                            res.json({ message: 'Formulario registrado correctamente con evidencia' });
                                        });
                                    } else {
                                        res.json({ message: 'Formulario registrado correctamente' });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

app.get('/obtenerDetallesFormulario', (req, res) => {
    const folio = req.query.folio;
    if (!folio) {
        return res.status(400).json({ success: false, message: 'Folio no proporcionado' });
    }
    console.log('Solicitud recibida para folio:', folio); // Verificar que el folio esté llegando correctamente

    const query = `
        SELECT 
            f.folio,
            f.fecha,
            f.hora_registro AS hora,
            f.kilometraje,
            f.destino,
            f.licen_conducir AS licenconducir,
            f.t_circulacion AS tcirculacion,
            f.poliza,
            f.vvq,
            f.conductor,
            f.fir_recibe_vehiculo AS firmarecibe,
            f.fir_elaboro_vehiculo AS firmaelaboro,
            f.tipo_registro,
            v.no_unidad AS unidad,
            v.tipo,
            v.placas,
            n.aceite_motor,
            n.anticongelante,
            n.estado_frenos AS estadofrenos,
            n.liquido_frenos AS liquidofrenos,
            n.liq_limpiaparabrisas AS liqlimpiaparabrisas,
            e.luces,
            e.luces_cuarto AS cuartoluces,
            e.antena,
            e.espejos_retractiles AS espejosretr,
            e.espejos_laterales AS espejoslat,
            e.cristales,
            e.rotulos,
            e.tapones_rines AS taponesrines,
            e.tapon_combustible AS taponcombustible,
            e.claxon,
            e.limpiaparabrisas,
            e.manijas,
            e.fascias,
            e.limpieza_unidad AS limpiezaunidad,
            e.llantas,
            e.alarma_reversa AS alarmareversa,
            i.tablero,
            i.calefaccion,
            i.estereo,
            i.bocinas,
            i.viseras,
            i.retrovisor,
            i.cenicero AS ceniceros,
            i.botones,
            i.manijas,
            i.tapetes,
            i.vestiduras,
            i.cielo,
            i.asientos,
            i.cinturones,
            i.libre_olores AS libreolores,
            i.matrial_ageno AS materialajeno,
            i.libre_basura AS librebasura,
            em.gato,
            em.llave,
            em.triangulo,
            em.llanta_refaccion AS llantarefaccion,
            em.extintor,
            em.torreta,
            em.calzas,
            em.cables,
            em.matachispas,
            em.botiquin,
            re.nivel_combustible AS cantidadCombustible,
            re.vida_llantas_delanteras AS vidadelantereas,
            re.presion_delanteras AS presiondelantereas,
            re.vida_llantas_traseras AS vidatraseras,
            re.presion_traseras AS presiontraseras,
            re.observaciones,
            ev.ruta_imagen
        FROM 
            Formulario f
        LEFT JOIN Vehiculo v ON f.id_vehiculo_fk = v.id_vehiculo
        LEFT JOIN Niveles n ON f.id_niveles_fk = n.id_niveles
        LEFT JOIN Exteriores e ON f.id_exteriores_fk = e.id_exteriores
        LEFT JOIN Interiores i ON f.id_interiores_fk = i.id_interiores
        LEFT JOIN Emergencia em ON f.id_emergencia_fk = em.id_emergencia
        LEFT JOIN Evidencias ev ON ev.id_formulario_fk = f.id_formulario
        LEFT JOIN Revicion_Extra re ON f.id_extra_fk = re.id_extra
        WHERE f.folio = ?;
    `;
    db.query(query, [folio], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ success: false, message: 'Error en la consulta' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron los detalles del formulario' });
        }

        res.json({ success: true, registros: results });
    });
    
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

