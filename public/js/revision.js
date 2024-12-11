
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("fecha").value = new Date().toLocaleDateString();
    document.getElementById("hora").value = new Date().toLocaleTimeString();

    // Obtener las unidades registradas
    fetch('/unidades')
        .then(response => response.json())
        .then(data => {
            const unidadSelect = document.getElementById('unidad');
            data.forEach(vehiculo => {
                const option = document.createElement('option');
                option.value = vehiculo.id_vehiculo;
                option.textContent = vehiculo.no_unidad;
                unidadSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al obtener las unidades:', error);
        });

    // Llenar los campos de placas y tipo de vehículo cuando se selecciona una unidad
    document.getElementById('unidad').addEventListener('change', function() {
        const unidadId = this.value;
        if (unidadId) {
            // Consultar los detalles de la unidad seleccionada
            fetch(`/unidad/${unidadId}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('placas').value = data.placas;
                    document.getElementById('tipovehiculo').value = data.tipo;
                })
                .catch(error => {
                    console.error('Error al obtener la información de la unidad:', error);
                });
        }
    });
});
