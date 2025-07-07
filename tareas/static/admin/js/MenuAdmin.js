document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll('.menu li');
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.menu-toggle');
    const logo = document.getElementById('logo-toggle');

    function obtenerSaludo() {
        const hora = new Date().getHours();
        if (hora >= 6 && hora < 12) {
            return "¡Buenos días";
        } else if (hora >= 12 && hora < 18) {
            return "¡Buenas tardes";
        } else {
            return "¡Buenas noches";
        }
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    if (logo) {
        logo.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('collapsed');
            }
        });
    }

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const opcion = item.textContent.trim();

            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }

            if (opcion === "Cerrar sesión") {
                const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");
                if (confirmar) {
                    window.location.href = "/cerrar/";
                }
                return;
            }

            if (opcion === "Inicio") {
                window.location.href = "/admin/inicio/";
            } else if (opcion === "Gestión de Personal") {
                window.location.href = "/admin/listar_personal/";
            } else if (opcion === "Gestión de Especialidades") {
                window.location.href = "/admin/especialidades/";
            } else if (opcion === "Servicios Médicos") {
                window.location.href = "/admin/servicios/";
            } else if (opcion === "Gestión de Habitaciones") {
                window.location.href = "/admin/habitaciones/";
            } else if (opcion === "Gestión de Altas") {
                window.location.href = "/admin/tipos_alta/";
            } else if ( opcion === "Métodos de Pago") {
                window.location.href = "/admin/metodos_pago/";
            } else if (opcion === "Control de Pacientes") {
                window.location.href = "/admin/listar_pacientes/";
            } else if (opcion === "Consultas y Emergencias") {
                window.location.href = "/admin/consultas/";
            } else if (opcion === "Gestión Financiera") {
                window.location.href = "/admin/facturas/";
            } else if (opcion === "Reportes y Estadísticas") {
                window.location.href = "/admin/reportes/";
            } else if (opcion === "Control de Accesos") {
                window.location.href = "/admin/accesos/";
            } else if (opcion === "Configuraciones Generales") {
                window.location.href = "/admin/configuraciones/";
            } else {
                mainContent.innerHTML = `<h1>${opcion}</h1><p>Contenido en desarrollo...</p>`;
            }
        });
    });
});
