document.addEventListener("DOMContentLoaded", () => {
    // Obtener el rol del usuario, por ejemplo de un almacenamiento local o sesión
    const userRole = localStorage.getItem('userRole');  // Asumiendo que guardamos el rol al hacer login
    if (!userRole) {
        console.error("El rol del usuario no está definido. Verifique el inicio de sesión.");
        return;
    }
    // Definir el menú por defecto
    let menuHTML = '';

    switch(userRole) {
        case 'administrador':
            menuHTML = `
                <ul class="nav-list">
                    <li><a href="registros_revision.html"><img src="public/img/inicio_1.png" alt="Inicio" class="icono-nav"> Inicio</a></li>
                    <li><a href="revision.html"><img src="public/img/revision.png" alt="Revisión de Transporte" class="icono-nav"> Revisión de Transporte</a></li>
                    <li><a href="vehiculo.html"><img src="public/img/vehiculo.png" alt="Registro de Vehículo" class="icono-nav"> Registro de Vehículo</a></li>
                    <li><a href="usuarios.html"><img src="public/img/registro.png" alt="Registro de usuarios" class="icono-nav"> Registro y activación</a></li>
                    <li><a href="javascript:void(0)" id="logout"><img src="public/img/salir.png" alt="Salir" class="icono-nav"> Salir</a></li>
                </ul>
            `;
            break;
        case 'tecnico':
            menuHTML = `
                <ul class="nav-list">
                    <li><a href="registros_revision.html"><img src="public/img/inicio_1.png" alt="Inicio" class="icono-nav"> Inicio</a></li>
                    <li><a href="revision.html"><img src="public/img/revision.png" alt="Revisión de Transporte" class="icono-nav"> Revisión de Transporte</a></li>
                    <li><a href="vehiculo.html"><img src="public/img/vehiculo.png" alt="Registro de Vehículo" class="icono-nav"> Registro de Vehículo</a></li>
                   <li><a href="javascript:void(0)" id="logout"><img src="public/img/salir.png" alt="Salir" class="icono-nav"> Salir</a></li>
                </ul>
            `;
            break;
        case 'trabajador':
            menuHTML = `
                <ul class="nav-list">
                    <li><a href="registros_revision.html"><img src="public/img/inicio_1.png" alt="Inicio" class="icono-nav"> Inicio</a></li>
                    <li><a href="revision.html"><img src="public/img/revision.png" alt="Revisión de Transporte" class="icono-nav"> Revisión de Transporte</a></li>
                    <li><a href="javascript:void(0)" id="logout"><img src="public/img/salir.png" alt="Salir" class="icono-nav"> Salir</a></li>
                </ul>
            `;
            break;
        default:
            console.error("Rol de usuario no válido.");
            return;
    }

    document.getElementById('navbar').innerHTML = menuHTML;

    // Resaltar el enlace activo
    const currentPage = window.location.pathname.split('/').pop();  // Obtiene el nombre del archivo actual (por ejemplo, "registros_revision.html")
    const menuLinks = document.querySelectorAll('.nav-list a');  // Selecciona todos los enlaces del menú
    
    menuLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();  // Obtiene el nombre del archivo de cada enlace
        if (linkPage === currentPage) {
            link.classList.add('active-link');  // Agrega la clase 'active-link' al enlace activo
        }
    });

    // Agregar el evento para cerrar sesión
    document.getElementById('logout').addEventListener('click', logout);
});

// Función de cierre de sesión
function logout() {
    localStorage.removeItem('userRole'); // Elimina la sesión en localStorage
    sessionStorage.removeItem('userRole'); // Elimina la sesión en sessionStorage si es que también lo guardas allí
    window.location.href = 'index.html'; // Redirige al login
}
