document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const accion = event.submitter?.value;
        if (accion !== "guardar") return;

        // Validaciones
        const nombres = formData.get("nombres").trim();
        const apellidos = formData.get("apellidos").trim();
        const numerodocumento = formData.get("numerodocumento").trim();
        const telefono = formData.get("telefono").trim();
        const email = formData.get("email").trim();
        const fechanacimiento = formData.get("fechanacimiento");

        // Validar campos obligatorios
        if (!nombres || !apellidos || !numerodocumento) {
            mostrarMensaje("Por favor, complete los campos obligatorios.", "error");
            return;
        }

        // Validación de teléfono
        if (telefono && !/^\d{7,15}$/.test(telefono)) {
            mostrarMensaje("El número de teléfono debe contener solo dígitos (7 a 15).", "error");
            return;
        }

        // Validación de correo electrónico
        if (email && !/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            mostrarMensaje("El correo electrónico no tiene un formato válido.", "error");
            return;
        }

        // Validación de fecha de nacimiento y cálculo de edad
        if (fechanacimiento) {
            const edad = calcularEdad(fechanacimiento);
            if (edad < 0) {
                mostrarMensaje("La fecha de nacimiento no puede ser futura.", "error");
                return;
            }
            formData.set("edad", edad);
        }

        // Validación del número de documento (mínimo 6 dígitos)
        if (numerodocumento && !/^\d{6,15}$/.test(numerodocumento)) {
            mostrarMensaje("El número de documento debe contener entre 6 y 15 dígitos.", "error");
            return;
        }

        // AJAX
        fetch("", {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": form.querySelector("[name=csrfmiddlewaretoken]").value
            },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.mensaje === "ok") {
                mostrarMensaje("Paciente guardado exitosamente.", "success");
                setTimeout(() => {
                    window.location.href = "/enfermeria/pacientes/"; // Redirige a la lista de pacientes
                }, 1500);
            } else if (data.mensaje === "duplicado") {
                mostrarMensaje("⚠️ Ya existe un paciente con ese número de documento.", "error");
            } else {
                mostrarMensaje("❌ Error al registrar el paciente.", "error");
            }
        })
        .catch(err => {
            console.error("Error:", err);
            mostrarMensaje("❌ Error inesperado. Intente de nuevo.", "error");
        });
    });

    // Función para calcular edad basada en la fecha de nacimiento
    function calcularEdad(fecha) {
        const nacimiento = new Date(fecha);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
        return edad;
    }

    // Función para mostrar mensajes de éxito o error
    function mostrarMensaje(texto, tipo) {
        let container = document.querySelector(".registro-container");
        let msg = document.createElement("div");

        msg.className = `mensaje-ajax ${tipo}`;
        msg.innerText = texto;

        // Limpia mensajes previos si hay
        document.querySelectorAll(".mensaje-ajax").forEach(el => el.remove());

        container.prepend(msg);

        setTimeout(() => {
            msg.remove();
        }, 3000);
    }
});
