// Cargar todos los registros al cargar la página
document.addEventListener("DOMContentLoaded",  function() {
    // Cargar datos dinámicos para los selectores
    loadYears();
    loadUnits();
    document.getElementById('secondForm')?.reset();
    document.getElementById("fecha").value = new Date().toISOString().split('T')[0];
    document.getElementById("hora").value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById('searchBtn').addEventListener('click', function() {
        const year = document.getElementById('selectYear').value;
        const month = document.getElementById('selectMonth').value;
        const unit = document.getElementById('selectUnit').value;
    
        fetchRecords(year, month, unit);
    });

    fetchRecords();
    // Configuración del dropdown de vehículos
    const vehiculosSelect = document.getElementById('unidad');
    const placasInput = document.getElementById('placas');
    const tipoInput = document.getElementById('tipovehiculo');

    vehiculosSelect.addEventListener('change', (event) => {
        const selectedOption = event.target.selectedOptions[0];
        tipoInput.value = selectedOption.dataset.tipo || '';
        placasInput.value = selectedOption.dataset.placas || '';
    });

    // Configuración de la barra deslizadora de combustible
    const barra = document.getElementById("nivelCombustible");
    const numero = document.getElementById("cantidadCombustible");
    barra.addEventListener("input", () => {
        numero.value = barra.value;
    });

});

// Función para cargar años en el selector
function loadYears() {
    fetch('http://localhost:3001/api/years')
        .then(response => response.json())
        .then(years => {
            const yearSelect = document.getElementById('selectYear');
            yearSelect.innerHTML = '<option value="">Seleccionar Año</option>'; // Evita duplicados
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading years:', error);
            alert("No se pudieron cargar los años. Intenta más tarde."); // Feedback al usuario
        });
}

// Función para cargar unidades en el selector
function loadUnits() {
    fetch('http://localhost:3001/api/units')
        .then(response => response.json())
        .then(units => {
            const unitSelect = document.getElementById('selectUnit');
            units.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit;
                option.textContent = unit;
                unitSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading units:', error));
}

function fetchRecords(year = "", month = "", unit = "") {
    fetch(`http://localhost:3001/api/records?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}&unit=${encodeURIComponent(unit)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderTable(data);
        })
        .catch(error => {
            console.error("Error fetching records:", error);
            alert("No se pudieron obtener los registros. Intenta más tarde."); // Feedback al usuario
        });
}

// Renderizar la tabla con los datos
function renderTable(records) {
    const tableBody = document.getElementById('resultsTable');
    tableBody.innerHTML = ''; // Vaciar la tabla antes de agregar nuevos registros

    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8">No se encontraron registros.</td></tr>';
        return;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
// Agrupar registros por folio
    const groupedRecords = records.reduce((acc, record) => {
        if (!acc[record.folio]) {
            acc[record.folio] = [];
        }
        acc[record.folio].push(record);
        return acc;
    }, {});

    // Iterar sobre los grupos de registros
    Object.keys(groupedRecords).forEach(folio => {
        const recordsForFolio = groupedRecords[folio];

        // Verificar si existe al menos un registro pendiente y uno completo
        const hasPending = recordsForFolio.some(record => record.estado === 'Pendiente');
        const hasComplete = recordsForFolio.some(record => record.estado === 'Completo');

        // Si ambos estados existen, solo mostrar el "Completo"
        const recordToShow = hasComplete ? recordsForFolio.find(record => record.estado === 'Completo') : recordsForFolio[0];

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${recordToShow.folio}</td>
            <td>${recordToShow.unidad}</td>
            <td>${formatDate(recordToShow.fecha)}</td>
            <td>${recordToShow.elaborante}</td>
            <td>${recordToShow.tipo_registro}</td>
            <td>
                <button class="${recordToShow.estado === 'Completo' ? 'estado-completo' : 'estado-pendiente'}" 
                        ${recordToShow.estado === 'Completo' ? 'disabled' : ''}>
                    ${recordToShow.estado}
                </button>
            </td>
            <td>
                <button class="view-button" onclick="viewDetails('${recordToShow.folio}')">
                    <img src="public/img/revisar.png" class="icono-mas">Revisar
                </button>
            </td>

        `;

        const estadoButton = row.querySelector('button');

        if (recordToShow.estado === 'Pendiente') {
            estadoButton.addEventListener('click', () => {
                openModal(recordToShow.folio);
            });
        }

        tableBody.appendChild(row);
    });
}

// Función para manejar pestañas
function openTab(event, tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const selectedTab = document.getElementById(tabName);
    selectedTab.classList.add('active');
}

function nextTab(tabName) {
    openTab(null, tabName);
}

function previousTab(tabName) {
    openTab(null, tabName);
}
// Función para mostrar imágenes cargadas
function mostrarImagenes(event) {
    const input = event.target;
    const files = input.files;
    const preview = document.getElementById('preview');
    preview.innerHTML = '';

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '100px';
            img.style.height = '100px';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// Función para abrir el modal
function openModal(folio) {
    const modal = document.getElementById("secondFormModal");
    if (!modal) {
        console.error("Modal no encontrado");
        return;
    }

    // Definir los elementos del formulario
    const formElements = {
        folio: document.getElementById("folio"),
        unidad: document.getElementById("unidad"),
        placas: document.getElementById("placas"),
        tipovehiculo: document.getElementById("tipovehiculo"),
    };

    if (folio && (typeof folio === "string" || typeof folio === "number")) {
        fetch(`http://localhost:3001/api/records/${folio}`)
            .then(response => response.json())
            .then(record => {
                if (record) {
                    // Rellenar los campos del formulario con los datos del registro
                    formElements.folio.value = record.folio || "";
                    formElements.unidad.value = record.unidad || "";
                    formElements.placas.value = record.placas || "";
                    formElements.tipovehiculo.value = record.tipovehiculo || "";
                } else {
                    console.error("Registro no encontrado");
                }
            })
            .catch(error => {
                console.error("Error al obtener los datos del registro:", error);
            });
    } else {
        console.error("Folio inválido:", folio);
    }

    modal.style.display = "block";
}

// Función para enviar el formulario 2
async function submitSecondForm(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma convencional
    // Obtener los datos del segundo formulario
    const formularioData2 = {
        formulario: {
            folio: document.getElementById('folio').value || null,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            unidad: document.getElementById('unidad').value,
            kilometraje: document.getElementById('kilometraje').value,
            destino: document.getElementById('destino').value,
            licenconducir: document.querySelector('input[name="licenconducir"]:checked').value,
            tcirculacion: document.querySelector('input[name="tcirculacion"]:checked').value,
            poliza: document.querySelector('input[name="poliza"]:checked').value,
            vvq: document.querySelector('input[name="vvq"]:checked').value,
            conductor: document.getElementById('conductor').value,
            firmarecibe: document.getElementById('firmarecibe').value,
            firmaelaboro: document.getElementById('firmaelaboro').value
        },
        niveles: {
            aceite_motor: document.querySelector('input[name="aceite_motor"]:checked').value,
            anticongelante: document.querySelector('input[name="anticongelante"]:checked').value,
            estadofrenos: document.querySelector('input[name="estadofrenos"]:checked').value,
            liquidofrenos: document.querySelector('input[name="liquidofrenos"]:checked').value,
            liqlimpiaparabrisas: document.querySelector('input[name="liqlimpiaparabrisas"]:checked').value
        },
        exteriores: {
            luces: document.querySelector('input[name="luces"]:checked').value,
            cuartoluces: document.querySelector('input[name="cuartoluces"]:checked').value,
            antena: document.querySelector('input[name="antena"]:checked').value,
            espejosretr: document.querySelector('input[name="espejosretr"]:checked').value,
            espejoslat: document.querySelector('input[name="espejoslat"]:checked').value,
            cristales: document.querySelector('input[name="cristales"]:checked').value,
            rotulos: document.querySelector('input[name="rotulos"]:checked').value,
            taponesrines: document.querySelector('input[name="taponesrines"]:checked').value,
            taponcombustible: document.querySelector('input[name="taponcombustible"]:checked').value,
            claxon: document.querySelector('input[name="claxon"]:checked').value,
            limpiaparabrisas: document.querySelector('input[name="limpiaparabrisas"]:checked').value,
            manijas: document.querySelector('input[name="manijas"]:checked').value,
            fascias: document.querySelector('input[name="fascias"]:checked').value,
            limpiezaunidad: document.querySelector('input[name="limpiezaunidad"]:checked').value,
            llantas: document.querySelector('input[name="llantas"]:checked').value,
            alarmareversa: document.querySelector('input[name="alarmareversa"]:checked').value
        },
        interiores: {
            tablero: document.querySelector('input[name="tablero"]:checked ').value,
            calefaccion: document.querySelector(' input[name="calefaccion"]:checked ').value,
            estereo: document.querySelector(' input[name="estereo"]:checked ').value,
            bocinas: document.querySelector('input[name="bocinas"]:checked ').value,
            viseras: document.querySelector('input[name="viseras"]:checked ').value,
            retrovisor: document.querySelector('input[name="retrovisor"]:checked ').value,
            ceniceros: document.querySelector('input[name="ceniceros"]:checked ').value,
            botones: document.querySelector('input[name="botones"]:checked ').value,
            manijas: document.querySelector('input[name="manijas"]:checked ').value,
            tapetes: document.querySelector('input[name="tapetes"]:checked ').value,
            vestiduras: document.querySelector('input[name="vestiduras"]:checked ').value,
            cielo: document.querySelector('input[name="cielo"]:checked ').value,
            asientos: document.querySelector('input[name="asientos"]:checked ').value,
            cinturones: document.querySelector('input[name="cinturones"]:checked ').value,
            libreolores: document.querySelector('input[name="libreolores"]:checked ').value,
            materialajeno: document.querySelector('input[name="materialajeno"]:checked ').value,
            librebasura: document.querySelector('input[name="librebasura"]:checked ').value
        },
        emergencia: {
            gato: document.querySelector('input[name="gato"]:checked ').value,
            querySelector: document.querySelector('input[name="llave"]:checked ').value,
            triangulo: document.querySelector('input[name="triangulo"]:checked ').value,
            llantarefaccion: document.querySelector('input[name="llantarefaccion"]:checked').value,
            extintor: document.querySelector('input[name="extintor"]:checked').value,
            torreta: document.querySelector('input[name="torreta"]:checked').value,
            calzas: document.querySelector('input[name="calzas"]:checked').value,
            cables: document.querySelector('input[name="cables"]:checked').value,
            matachispas: document.querySelector('input[name="matachispas"]:checked').value,
            botiquin: document.querySelector('input[name="botiquin"]:checked').value
        },
        extra: {
            cantidadCombustible: document.getElementById('cantidadCombustible').value,
            vidadelantereas: document.getElementById('vidadelantereas').value,
            presiondelantereas: document.getElementById('presiondelantereas').value,
            vidatraseras: document.getElementById('vidatraseras').value,
            presiontraseras: document.getElementById('presiontraseras').value,
            observaciones: document.getElementById('observaciones').value
        },
        evidencia: {
            ruta_imagen: document.getElementById('ruta_imagen').value // Si hay una imagen
        }
    };
    
    try {
        const response = await fetch('http://localhost:3001/api/submitSecondForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formularioData2) // Convertir los datos a JSON
        });

        const data = await response.json();
        alert(data.message); // Mostrar el mensaje devuelto por el servidor
        // Limpiar el formulario
        document.getElementById('secondForm')?.reset(); // Restablecer el formulario
        document.getElementById("fecha").value = new Date().toISOString().split('T')[0];
        document.getElementById("hora").value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // Cerrar el modal
        const modal = document.getElementById('secondFormModal'); // Cambia 'miModal' al ID de tu modal
        if (modal) {
            modal.classList.remove('show'); // Para Bootstrap
            modal.style.display = 'none'; // Para ocultarlo manualmente
            document.body.classList.remove('modal-open'); // Remueve clases agregadas por Bootstrap
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove(); // Elimina el fondo del modal
            }
        }

        // Actualizar la página
        location.reload(); 

    } catch (error) {
        console.error('Error al enviar los datos', error);
    }
}

// Función para formatear la fecha a un formato más legible
function formatDate(dateString) {
    const date = new Date(dateString); // Convertir el string a un objeto Date
    const day = String(date.getDate()).padStart(2, '0'); // Día con 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con 2 dígitos
    const year = date.getFullYear(); // Año con 4 dígitos

    return `${day}/${month}/${year}`; // Formato: DD/MM/YYYY
}

// Función para ver detalles y mostrar el modal
async function viewDetails(folio) {
    console.log('ID del formulario:', folio); // Verifica el valor del ID
    const modal = document.getElementById('registroModal'); // El modal
    const registrosContenedor = document.getElementById('registrosContenedor'); // Contenedor de los registros
    const closeModal = document.getElementById('closeModal'); // Botón de cerrar

    if (!folio) {
        console.error('ID del formulario no válido');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/obtenerDetallesFormulario?folio=${folio}`);


        if (!response.ok) {
            throw new Error('Error al obtener los detalles del formulario');
        }
        // Verifica si la respuesta es JSON
        const data = await response.json();
        console.log(data); // Añadir para ver la respuesta completa


        if (data.success) {
            console.log('Datos del formulario:', data.registro);
            // Limpiar el contenedor de registros antes de mostrar los nuevos datos
            registrosContenedor.innerHTML = '';

            data.registros.forEach(registro => {
                const card = document.createElement('div');
                card.classList.add('registro-card');
                card.innerHTML = `
                    <div class="registro-titulo ${registro.tipo_registro === 'Entrada' ? 'entrada' : 'salida'}">
                        <h2>${registro.tipo_registro}</h2>
                    </div>
                    <div class="registro-detalles">
                        <p><strong>Folio:</strong> ${registro.folio}</p>
                        <p><strong>Fecha:</strong> ${formatDate(registro.fecha)}</p>
                        <p><strong>Hora:</strong> ${registro.hora}</p>
                    </div>
                    <h4>DOCUMENTACIÓN DEL VEHÍCULO</h4>
                    <div class="registro-detalles">
                        <p><strong>Número de unidad:</strong> ${registro.unidad}</p>
                        <p><strong>Tipo de Vehiculo:</strong> ${registro.tipo}</p>
                        <p><strong>Placas:</strong> ${registro.placas}</p>
                        <p><strong>Kilometraje:</strong> ${registro.kilometraje}</p>
                        <p><strong>Destino:</strong> ${registro.destino}</p>
                        <p><strong>Licencia de Conducir:</strong> ${registro.licenconducir}</p>
                        <p><strong>Tarjeta de Circulación:</strong> ${registro.tcirculacion}</p>
                        <p><strong>Póliza:</strong> ${registro.poliza}</p>
                        <p><strong>VVQ:</strong> ${registro.vvq}</p>
                    </div>

                    <h4>REVISIÓN DE NIVELES</h4>
                    <div class="registro-detalles">
                        <p><strong>Aceite Motor:</strong> ${registro.aceite_motor}</p>
                        <p><strong>Anticongelante:</strong> ${registro.anticongelante}</p>
                        <p><strong>Estado Frenos:</strong> ${registro.estadofrenos}</p>
                        <p><strong>Líquido de Frenos:</strong> ${registro.liquidofrenos}</p>
                        <p><strong>Líquido Limpiaparabrisas:</strong> ${registro.liqlimpiaparabrisas}</p>
                    </div>
                    <h4>REVISIÓN DE EXTERIORES</h4>
                    <div class="registro-detalles">
                        <p><strong>Luces:</strong> ${registro.luces}</p>
                        <p><strong>Cuarto Luces:</strong> ${registro.cuartoluces}</p>
                        <p><strong>Antena:</strong> ${registro.antena}</p>
                        <p><strong>Espejos Retrovisores:</strong> ${registro.espejosretr}</p>
                        <p><strong>Espejos Laterales:</strong> ${registro.espejoslat}</p>
                        <p><strong>Cristales:</strong> ${registro.cristales}</p>
                        <p><strong>Rótulos:</strong> ${registro.rotulos}</p>
                        <p><strong>Tapones Rines:</strong> ${registro.taponesrines}</p>
                        <p><strong>Tapón Combustible:</strong> ${registro.taponcombustible}</p>
                        <p><strong>Claxon:</strong> ${registro.claxon}</p>
                        <p><strong>Limpiaparabrisas:</strong> ${registro.limpiaparabrisas}</p>
                        <p><strong>Manijas:</strong> ${registro.manijas}</p>
                        <p><strong>Fascias:</strong> ${registro.fascias}</p>
                        <p><strong>Limpieza Unidad:</strong> ${registro.limpiezaunidad}</p>
                        <p><strong>Llantas:</strong> ${registro.llantas}</p>
                        <p><strong>Alarma Reversa:</strong> ${registro.alarmareversa}</p>
                    </div>

                    <h4>REVISIÓN DE INTERIORES</h4>
                    <div class="registro-detalles">
                        <p><strong>Tablero:</strong> ${registro.tablero}</p>
                        <p><strong>Calefacción:</strong> ${registro.calefaccion}</p>
                        <p><strong>Estéreo:</strong> ${registro.estereo}</p>
                        <p><strong>Bocinas:</strong> ${registro.bocinas}</p>
                        <p><strong>Viseras:</strong> ${registro.viseras}</p>
                        <p><strong>Retrovisor:</strong> ${registro.retrovisor}</p>
                        <p><strong>Ceniceros:</strong> ${registro.ceniceros}</p>
                        <p><strong>Botones:</strong> ${registro.botones}</p>
                        <p><strong>Manijas:</strong> ${registro.manijas}</p>
                        <p><strong>Tapetes:</strong> ${registro.tapetes}</p>
                        <p><strong>Vestiduras:</strong> ${registro.vestiduras}</p>
                        <p><strong>Cielo:</strong> ${registro.cielo}</p>
                        <p><strong>Asientos:</strong> ${registro.asientos}</p>
                        <p><strong>Cinturones:</strong> ${registro.cinturones}</p>
                        <p><strong>Libre de Olores:</strong> ${registro.libreolores}</p>
                        <p><strong>Material Ajeno:</strong> ${registro.materialajeno}</p>
                        <p><strong>Libre de Basura:</strong> ${registro.librebasura}</p>
                    </div>

                    <h4>REVISIÓN DE EMERGENCIA</h4>
                    <div class="registro-detalles">
                        <p><strong>Gato:</strong> ${registro.gato}</p>
                        <p><strong>Llave:</strong> ${registro.llave}</p>
                        <p><strong>Triángulo:</strong> ${registro.triangulo}</p>
                        <p><strong>Llanta Refacción:</strong> ${registro.llantarefaccion}</p>
                        <p><strong>Extintor:</strong> ${registro.extintor}</p>
                        <p><strong>Torreta:</strong> ${registro.torreta}</p>
                        <p><strong>Calzas:</strong> ${registro.calzas}</p>
                        <p><strong>Cables:</strong> ${registro.cables}</p>
                        <p><strong>Matachispas:</strong> ${registro.matachispas}</p>
                        <p><strong>Botiquín:</strong> ${registro.botiquin}</p>
                    </div>
                    <h4>NIVEL DE COMBUSTIBLE</h4>
                    <p><strong>Cantidad Combustible:</strong> ${registro.cantidadCombustible}</p>

                    <h4>OCUPANTE DEL VEHICULO</h4>
                    <p><strong>Nombre del Conductor:</strong> ${registro.conductor}</p>
                    
                    <h4>VIDA ÚTIL Y PRESIÓN DE LLANTAS</h4>
                    <h5>LLANTAS DELANTERAS</h5>
                    <div class="registro-detalles">
                        <p><strong>Vida de Llantas:</strong> ${registro.vidadelantereas}</p>
                        <p><strong>Presión Llantas: </strong> ${registro.presiondelantereas}</p>
                    </div>
                    <h5>LLANTAS TRASERAS</h5>
                    <div class="registro-detalles">
                        <p><strong>Vida de Llantas:</strong> ${registro.vidatraseras}</p>
                        <p><strong>Presión Llantas:</strong> ${registro.presiontraseras}</p>
                    </div>

                    <h4>DAÑO O GOLPE EN EL VEHICULO</h4>
                    <p><strong>Observaciones:</strong> ${registro.observaciones}</p>

                    <h4>ELABORÓ: CONTROL VEHICULAR</h4>
                    <p><strong>Firma Elaboró:</strong> ${registro.firmaelaboro}</p>
                    <h4>RECIBE VEHÍCULO: RESPONSABLE</h4>
                    <p><strong>Firma Recibe:</strong> ${registro.firmarecibe}</p>
                    <h4>EVIDENCIA</h4>
                    <img src="${registro.ruta_imagen}" alt="Imagen del registro">
                `;
                registrosContenedor.appendChild(card);
            });
            modal.style.display = 'block'; // Mostrar el modal
        } else {
            console.error('No se encontraron los detalles del formulario');
        }
    } catch (error) {
        console.error('Error al obtener los detalles:', error);
    }
    // Cerrar el modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Lógica para cerrar el modal al hacer clic en el botón cerrar
document.querySelector(".close").addEventListener("click", closeModal);
function closeModal() {
    const modal = document.getElementById("secondFormModal");
    if (modal) modal.style.display = "none";
}

// Mostrar la primera pestaña por defecto
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.tab-button').click(); // Simula un click en el primer botón
});


