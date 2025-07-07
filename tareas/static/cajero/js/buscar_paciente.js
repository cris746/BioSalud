document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector('input[name="q"]');
  const form = document.querySelector(".search-form");
  const tbody = document.querySelector(".tabla-pacientes tbody");
  const filtroSelect = document.getElementById("filtro-pendientes");

  function renderPacientes(pacientes) {
    tbody.innerHTML = "";

    if (pacientes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No se encontraron resultados.</td></tr>`;
      return;
    }

    pacientes.forEach(p => {
      const row = `
        <tr>
          <td>${p.nombres}</td>
          <td>${p.apellidos}</td>
          <td>${p.ci}</td>
          <td>${p.fechanacimiento}</td>
          <td>${p.telefono}</td>
          <td><a href="${p.url}" class="btn-ver"><i class="fas fa-eye"></i> Ver</a></td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", row);
    });
  }

  function guardarEnHistorial(paciente) {
    let historial = JSON.parse(localStorage.getItem("historialPacientes")) || [];

    historial = historial.filter(p => p.id !== paciente.id);
    historial.unshift(paciente);

    if (historial.length > 5) {
      historial = historial.slice(0, 5);
    }

    localStorage.setItem("historialPacientes", JSON.stringify(historial));
  }

  function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem("historialPacientes")) || [];
    if (historial.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No hay búsquedas recientes.</td></tr>`;
      return;
    }

    const ids = historial.map(p => p.id);
    fetch(`/cajero/buscar_pacientes_json/?ids=${ids.join(',')}`)
      .then(res => res.json())
      .then(data => {
        const validIds = data.pacientes.map(p => p.id);
        const validPacientes = historial.filter(p => validIds.includes(p.id));
        localStorage.setItem("historialPacientes", JSON.stringify(validPacientes));
        renderPacientes(validPacientes);
      })
      .catch(() => {
        renderPacientes(historial);
      });
  }

  function buscarPaciente(query) {
    const params = new URLSearchParams();
    params.append("q", query);
    const filtro = filtroSelect.value;
    if (filtro) params.append("filtro", filtro);

    history.replaceState(null, "", `?${params.toString()}`);

    fetch(`/cajero/buscar_pacientes_json/?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.pacientes.length > 0) {
          guardarEnHistorial(data.pacientes[0]);
        }
        renderPacientes(data.pacientes);
      });
  }

  function manejarBusqueda() {
    const query = input.value.trim();
    if (query === "" && filtroSelect.value === "") {
      mostrarHistorial();
    } else {
      buscarPaciente(query);
    }
  }

  input.addEventListener("input", manejarBusqueda);
  filtroSelect.addEventListener("change", manejarBusqueda);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    manejarBusqueda();
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("q")) input.value = urlParams.get("q");
  if (urlParams.has("filtro")) filtroSelect.value = urlParams.get("filtro");

  manejarBusqueda();
});
