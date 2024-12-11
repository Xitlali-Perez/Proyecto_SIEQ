document.addEventListener("DOMContentLoaded", () => {
    loadUserRecords();

    document.getElementById('newBtn').addEventListener('click', () => {
        document.getElementById('usersForm').reset();
        document.querySelector(".modal-content h2").textContent = "Nuevo Usuario";
        document.getElementById('usersForm').onsubmit = registerUser;
        document.getElementById('modalForm').style.display = "block";
    });

    document.querySelector('.close').addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('modalForm')) {
            closeModal();
        }
    });
});


const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : 'http://tu-dominio.com';

// Función para mostrar el mensaje de notificación
function showNotification(message) {
    const modal = document.getElementById('notificationModal');
    const messageElement = document.getElementById('notifMessage');
    const closeButton = document.getElementById('notifClose');

    messageElement.textContent = message;
    modal.style.display = 'flex';

    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

}

// Función para mostrar el modal de confirmación
function showConfirmModal(message, onConfirmCallback) {
    const modal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmButton = document.getElementById('confirmDeleteBtn');
    const cancelButton = document.getElementById('cancelDeleteBtn');

    confirmMessage.textContent = message;
    modal.style.display = 'flex';

    confirmButton.onclick = () => {
        onConfirmCallback();
        modal.style.display = 'none';
    };

    cancelButton.onclick = () => {
        modal.style.display = 'none';
    };
}

function closeModal() {
    document.getElementById('modalForm').style.display = "none";
}

function loadUserRecords() {
    fetch(`${BASE_URL}/api/users`)
        .then(response => response.json())
        .then(data => renderUserTable(data))
        .catch(error => console.error("Error al cargar los registros de usuarios:", error));
}

function renderUserTable(users) {
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.noempleado}</td>
            <td>${user.nombre}</td>
            <td>${user.apepaterno}</td> <!-- Columna para el apellido paterno -->
            <td>${user.apematerno}</td>
            <td>${user.usuario}</td>
            <td>${user.password}</td>
            <td>${user.rol}</td>
            <td>
                <button class="modify-button">
                    <img src="public/img/modificar.png" class="icono-mas">Modificar
                </button>
                <button class="delete-button">
                    <img src="public/img/eliminar.png" class="icono-mas">Eliminar
                </button>
            </td>

        `;

        row.querySelector('.modify-button').addEventListener('click', () => {
            openModifyModal(user);
        });

        row.querySelector('.delete-button').addEventListener('click', () => {
            showConfirmModal("¿Está seguro de que desea eliminar este usuario?", () => deleteUser(user.idUsuario));
        });

        tableBody.appendChild(row);
    });
}

function openModifyModal(user) {
    document.getElementById('modalForm').style.display = "block";
    document.getElementById("noempleado").value = user.noempleado;
    document.getElementById("nombre").value = user.nombre;
    document.getElementById("apepaterno").value = user.apepaterno;
    document.getElementById("apematerno").value = user.apematerno;
    document.getElementById("usuario").value = user.usuario;
    document.getElementById("password").value = user.password;
    // Establecer el valor seleccionado del campo "rol"
    const rolSelect = document.getElementById("rol");
    rolSelect.value = user.rol;

    document.querySelector(".modal-content h2").textContent = "Modificar Usuario";
    document.getElementById('usersForm').onsubmit = function(event) {
        event.preventDefault();
        // este se debe de quitar, pero aun esta en el codigo original
	    updateUser(user.idUsuario);
    };
}

function deleteUser(idUsuario) {
    fetch(`${BASE_URL}/api/users/${idUsuario}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (response.ok) {
            showNotification("Usuario eliminado exitosamente");
            loadUserRecords();
        } else {
            showNotification("Error al eliminar el usuario");
        }
    })
    .catch(error => {
        console.error("Error al eliminar el usuario:", error);
        showNotification("Error al eliminar el usuario");
    });
}


function updateUser(idUsuario) {
    const formData = {
        noempleado: document.getElementById("noempleado").value,
        nombre: document.getElementById("nombre").value,
        apepaterno: document.getElementById("apepaterno").value,
        apematerno: document.getElementById("apematerno").value,
        usuario: document.getElementById("usuario").value,
        password: document.getElementById("password").value,
        rol: document.getElementById("rol").value,
    };

    fetch(`${BASE_URL}/api/users/${idUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            showNotification('Usuario actualizado exitosamente');
            closeModal();
            loadUserRecords();
        } else {
            showNotification('Error al actualizar el usuario');
        }
    })
    .catch(error => {
        console.error("Error al actualizar el usuario:", error);
        showNotification("Error al actualizar el usuario");
    });
}



function registerUser(event) {
    event.preventDefault();

    const userData = {
        noempleado: document.getElementById('noempleado').value,
        nombre: document.getElementById('nombre').value,
        apepaterno: document.getElementById('apepaterno').value,
        apematerno: document.getElementById('apematerno').value,
        usuario: document.getElementById('usuario').value,
        password: document.getElementById('password').value,
        rol: document.getElementById('rol').value,
    };

    fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            showNotification("Usuario guardado exitosamente");
            closeModal();
            loadUserRecords();
        } else {
            showNotification("Error al guardar el usuario");
        }
    })
    .catch(error => {
        console.error("Error al registrar el usuario:", error);
        showNotification("Error al registrar el usuario");
    });
}
 
