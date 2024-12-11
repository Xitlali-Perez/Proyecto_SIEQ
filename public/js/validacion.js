document.addEventListener('DOMContentLoaded', function() {
    const userRole = sessionStorage.getItem('userRole'); // Usando sessionStorage para mantener la sesión durante la pestaña
    if (!userRole) {
        window.location.href = 'index.html'; // Redirige a la página de inicio de sesión si no hay sesión
    }
    
    // Establecer un temporizador para cerrar la sesión si no hay actividad
    let inactivityTimer;
    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(logout, 600000); // Cerrar sesión después de 10 minutos de inactividad
    };

    // Detectar actividad para reiniciar el temporizador
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);

    // Llamar a resetInactivityTimer al cargar la página para evitar el cierre de sesión inmediato
    resetInactivityTimer();

    //Asignar el evento de cierre de sesión de dotón de salir 
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton){
        logoutButton.addEventListener('click', function () {
            sessionStorage.clear(); // Destruir la sesión
            window.location.href = 'index.html'; // Redirigir al login
        });
    }
});

// Función de cierre de sesión
function logout() {
    sessionStorage.removeItem('userRole'); // Elimina la sesión
    window.location.href = 'index.html'; // Redirige al login
}