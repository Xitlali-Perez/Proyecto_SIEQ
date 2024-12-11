document.addEventListener("DOMContentLoaded", () => {
    // Restablecer los formularios
    document.getElementById('revisionForm')?.reset();
    document.getElementById("fecha").value = new Date().toISOString().split('T')[0];
    document.getElementById("hora").value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Configuración del dropdown de vehículos
    const vehiculosSelect = document.getElementById('unidad');
    const placasInput = document.getElementById('placas');
    const tipoInput = document.getElementById('tipovehiculo');

    fetch('http://localhost:3001/api/vehicles')
        .then(response => response.json())
        .then(vehiculos => {
            vehiculosSelect.innerHTML = '<option value="" disabled selected>Selecciona una unidad</option>';
            vehiculos.forEach(vehiculo => {
                const option = document.createElement('option');
                option.value = vehiculo.numeroUnidad;
                option.textContent = vehiculo.numeroUnidad;
                option.dataset.tipo = vehiculo.tipoVehiculo;
                option.dataset.placas = vehiculo.placas;
                vehiculosSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al obtener las unidades:', error));

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

    // Limpiar el formulario al hacer clic en el botón de limpiar
    document.getElementById("limpiarBtn").addEventListener("click", function() {
        // Recargar la página para obtener los datos actualizados
        window.location.reload();
    });
});
// Función para iniciar sesión
async function loginUser() {
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    if (!usuario || !password) {
        alert('Por favor ingrese ambos campos: usuario y contraseña.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.message || 'Ha ocurrido un error.');
            return;
        }

        const data = await response.json();
        if (data.redirectUrl) {
            localStorage.setItem('userRole', data.role);
            window.location.href = data.redirectUrl;
        }
    } catch (error) {
        console.error('Ha ocurrido un error:', error);
        alert('Error de conexión. Por favor, intente más tarde.');
    }
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
// Limpiar el formulario al cambiar de página o recargar la página
window.addEventListener('beforeunload', () => {
    document.getElementById('revisionForm')?.reset(); // Restablecer el formulario
});

// Función para enviar el formulario
async function submitForm(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma convencional

    // Obtener los datos del formulario
    const formularioData = {
        formulario: {
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            unidad: document.getElementById('unidad').value,
            placas: document.getElementById('placas').value,
            tipovehiculo: document.getElementById('tipovehiculo').value,
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
        const response = await fetch('http://localhost:3001/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formularioData) // Convertir los datos a JSON
        });

        const data = await response.json();
        alert(data.message); // Mostrar el mensaje devuelto por el servidor
        // Limpiar el formulario
        document.getElementById('revisionForm')?.reset(); // Restablecer el formulario
        document.getElementById("fecha").value = new Date().toISOString().split('T')[0];
        document.getElementById("hora").value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Volver a la primera sección del formulario
        window.location.reload();
    } catch (error) {
        console.error('Error al enviar los datos', error);
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}