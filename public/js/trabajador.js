document.getElementById('searchBtn').addEventListener('click', function() {
    const year = document.getElementById('selectYear').value;
    const month = document.getElementById('selectMonth').value;
    const unit = document.getElementById('selectUnit').value;

    fetchRecords(year, month, unit);
});

// Cargar todos los registros al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    fetchRecords();
});

function fetchRecords(year = "", month = "", unit = "") {
    fetch(`http://localhost:3001/api/records?year=${year}&month=${month}&unit=${unit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderTable(data); // Llama a la función `renderTable` correctamente
        })
        .catch(error => console.error("Error fetching records:", error));
}

function renderTable(records) {
    const tableBody = document.getElementById('resultsTable');
    tableBody.innerHTML = ''; // Vaciar tabla antes de agregar nuevos registros

    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No se encontraron registros.</td></tr>';
        return;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    records.forEach(record => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${record.folio}</td>
            <td>${record.unidad}</td>
            <td>${formatDate(record.fecha)}</td> <!-- Formateo de la fecha -->
            <td>${record.elaborante}</td>
            <td><button class="${record.estado === 'Completo' ? 'estado-completo' : 'estado-pendiente'}">${record.estado}</button></td>
            <td><button>Revisar</button></td>
        `;

        row.querySelector('button').addEventListener('click', () => {
            if (record.estado === 'Pendiente') {
                alert('Completa el segundo formulario');
            }
        });

        tableBody.appendChild(row);
    });
}
