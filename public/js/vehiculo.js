document.addEventListener("DOMContentLoaded", () => {
    loadVehicleRecords();

    document.getElementById('newBtn').addEventListener('click', () => {
        document.getElementById('vehicleForm').reset();
        document.querySelector(".modal-content h2").textContent = "Nuevo Vehículo";
        document.getElementById('vehicleForm').onsubmit = registerVehicle;
        document.getElementById('modalForm').style.display = "block";
    });

    document.querySelector('.close').addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('modalForm')) {
            closeModal();
        }
    });
});

// Función para mostrar el mensaje
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

function loadVehicleRecords() {
    fetch('http://localhost:3001/api/vehicles')
        .then(response => response.json())
        .then(data => renderVehicleTable(data))
        .catch(error => console.error("Error al cargar los registros de vehículos:", error));
}

function renderVehicleTable(vehicles) {
    const tableBody = document.getElementById('vehicleTableBody');
    tableBody.innerHTML = '';

    vehicles.forEach(vehicle => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${vehicle.numeroUnidad}</td>
            <td>${vehicle.tipoVehiculo}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.placas}</td>
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
            openModifyModal(vehicle);
        });

        row.querySelector('.delete-button').addEventListener('click', () => {
            showConfirmModal("¿Está seguro de que desea eliminar este vehículo?", () => deleteVehicle(vehicle.id_vehiculo));
        });

        tableBody.appendChild(row);
    });
}

function openModifyModal(vehicle) {
    document.getElementById('modalForm').style.display = "block";
    document.getElementById("numeroUnidad").value = vehicle.numeroUnidad;
    document.getElementById("tipoVehiculo").value = vehicle.tipoVehiculo;
    document.getElementById("placas").value = vehicle.placas;
    document.getElementById("year").value = vehicle.year;

    document.querySelector(".modal-content h2").textContent = "Modificar Vehículo";
    document.getElementById('vehicleForm').onsubmit = function(event) {
        event.preventDefault();
        updateVehicle(vehicle.id_vehiculo);
    };
}

function deleteVehicle(id_vehiculo) {

    // Si el usuario confirma, proceder a eliminar
    fetch(`http://localhost:3001/api/vehicles/${id_vehiculo}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (response.ok) {
            // Si el servidor responde con éxito, notificar al usuario
            showNotification ("Vehículo eliminado exitosamente");
            loadVehicleRecords(); // Recargar los registros
        } else {
            // Si el servidor responde con error, notificar
            showNotification("Error al eliminar el vehículo");
        }
    })
    .catch(error => {
        // Si ocurre un error de red o en el fetch, manejarlo aquí
        console.error("Error al eliminar el vehículo:", error);
        showNotification("Error al eliminar el vehículo");
    });
}


function updateVehicle(id_vehiculo) {
    const formData = {
        numeroUnidad: document.getElementById("numeroUnidad").value,
        tipoVehiculo: document.getElementById("tipoVehiculo").value,
        placas: document.getElementById("placas").value,
        year: document.getElementById("year").value,
    };

    fetch(`http://localhost:3001/api/vehicles/${id_vehiculo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            showNotification('Vehículo actualizado exitosamente');
            closeModal();
            loadVehicleRecords();
        } else {
            showNotification('Error al actualizar el vehículo');
        }
    })
    .catch(error => {
        console.error("Error al actualizar el vehículo:", error);
        showNotification("Error al actualizar el vehículo");
    });
}

function registerVehicle(event) {
    event.preventDefault();

    const vehicleData = {
        numeroUnidad: document.getElementById('numeroUnidad').value,
        tipoVehiculo: document.getElementById('tipoVehiculo').value,
        placas: document.getElementById('placas').value,
        year: document.getElementById('year').value,
    };

    fetch('http://localhost:3001/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData) // Cambiado a `vehicleData`
    })
    .then(response => {
        if (response.ok) {
            showNotification("Vehiculo guardado exitosamente");
            closeModal();
            loadVehicleRecords();
        } else {
            showNotification("Error al guardar el vehículo");
        }
    })
    .catch(error => {
        console.error("Error en el cliente:", error);
        showNotification("Error al registrar el vehículo");
    });
}
