
/* =====================================================
   FRENCH PRESS GUIDE
   Archivo: js/main.js

   Funcionalidades:
   - Navegación responsive
   - Scroll suave
   - Barra de progreso
   - Navegación activa
   - Checklist interactivo
   - Contador de tareas
   - Botón de impresión
===================================================== */


"use strict";


/* =====================================================
   01. INICIALIZACIÓN
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("French Press Guide iniciado correctamente.");

    initializeNavigation();

    initializeReadingProgress();

    initializeActiveNavigation();

    initializeChecklist();

    initializePrintButton();

});


/* =====================================================
   02. NAVEGACIÓN RESPONSIVE
===================================================== */

function initializeNavigation() {

    const menuToggle = document.getElementById("menuToggle");

    const navMenu = document.getElementById("navMenu");

    if (!menuToggle || !navMenu) {

        console.warn("No se encontraron los elementos del menú.");

        return;

    }


    // Abrir y cerrar menú móvil

    menuToggle.addEventListener("click", function () {

        const isOpen = navMenu.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";

    });


    // Cerrar menú al seleccionar una sección

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.setAttribute("aria-label", "Abrir menú");

            menuToggle.textContent = "☰";

        });

    });


    // Cerrar menú al presionar Escape

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            navMenu.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.setAttribute("aria-label", "Abrir menú");

            menuToggle.textContent = "☰";

        }

    });


    // Restablecer menú al cambiar a escritorio

    window.addEventListener("resize", function () {

        if (window.innerWidth > 1050) {

            navMenu.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.setAttribute("aria-label", "Abrir menú");

            menuToggle.textContent = "☰";

        }

    });

}


/* =====================================================
   03. BARRA DE PROGRESO DE LECTURA
===================================================== */

function initializeReadingProgress() {

    const progressBar = document.getElementById("readingProgress");

    if (!progressBar) {

        console.warn("No se encontró la barra de progreso.");

        return;

    }


    function updateProgress() {

        const scrollTop = window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight;

        const windowHeight = window.innerHeight;

        const scrollableHeight =
            documentHeight - windowHeight;


        if (scrollableHeight <= 0) {

            progressBar.style.width = "100%";

            return;

        }


        const progress =
            (scrollTop / scrollableHeight) * 100;


        const normalizedProgress =
            Math.min(100, Math.max(0, progress));


        progressBar.style.width =
            normalizedProgress + "%";

    }


    // Actualizar al desplazarse

    window.addEventListener("scroll", updateProgress, {
        passive: true
    });


    // Actualizar al cambiar el tamaño de ventana

    window.addEventListener("resize", updateProgress);


    // Actualización inicial

    updateProgress();

}


/* =====================================================
   04. IDENTIFICACIÓN DE SECCIÓN ACTIVA
===================================================== */

function initializeActiveNavigation() {

    const navLinks = document.querySelectorAll(
        ".nav-menu a[href^='#']"
    );

    const sections = document.querySelectorAll(
        "main section[id]"
    );


    if (!navLinks.length || !sections.length) {

        return;

    }


    function updateActiveSection() {

        const referencePosition =
            window.scrollY + 150;

        let currentSection = "";


        sections.forEach(function (section) {

            const sectionTop = section.offsetTop;

            const sectionBottom =
                sectionTop + section.offsetHeight;


            if (
                referencePosition >= sectionTop &&
                referencePosition < sectionBottom
            ) {

                currentSection = section.id;

            }

        });


        // Actualizar enlaces del menú

        navLinks.forEach(function (link) {

            const targetId =
                link.getAttribute("href").substring(1);

            const isActive =
                targetId === currentSection;

            link.classList.toggle("active", isActive);

            if (isActive) {

                link.setAttribute("aria-current", "location");

            } else {

                link.removeAttribute("aria-current");

            }

        });

    }


    window.addEventListener("scroll", updateActiveSection, {
        passive: true
    });


    window.addEventListener("resize", updateActiveSection);


    updateActiveSection();

}


/* =====================================================
   05. CHECKLIST INTERACTIVO
===================================================== */

function initializeChecklist() {

    const checkboxes = document.querySelectorAll(
        ".brew-check"
    );

    const countDisplay =
        document.getElementById("checklistCount");

    const progressBar =
        document.getElementById("checklistProgress");

    const resetButton =
        document.getElementById("resetChecklist");


    if (
        !checkboxes.length ||
        !countDisplay ||
        !progressBar
    ) {

        console.warn("No se encontraron todos los elementos del checklist.");

        return;

    }


    const totalItems = checkboxes.length;


    // Actualizar el progreso

    function updateChecklist() {

        let completedItems = 0;


        checkboxes.forEach(function (checkbox) {

            if (checkbox.checked) {

                completedItems++;

            }

        });


        const percentage =
            (completedItems / totalItems) * 100;


        // Actualizar contador

        countDisplay.textContent =
            completedItems + " / " +
            totalItems + " completados";


        // Actualizar barra visual

        progressBar.style.width =
            percentage + "%";


        // Mensaje de finalización

        if (completedItems === totalItems) {

            countDisplay.textContent =
                "¡Preparación lista! ☕";

        }

    }


    // Escuchar cambios de cada casilla

    checkboxes.forEach(function (checkbox) {

        checkbox.addEventListener(
            "change",
            updateChecklist
        );

    });


    // Reiniciar checklist

    if (resetButton) {

        resetButton.addEventListener("click", function () {

            checkboxes.forEach(function (checkbox) {

                checkbox.checked = false;

            });


            updateChecklist();

        });

    }


    // Estado inicial

    updateChecklist();

}


/* =====================================================
   06. IMPRESIÓN Y EXPORTACIÓN PDF
===================================================== */

function initializePrintButton() {

    const printButton =
        document.getElementById("printGuide");


    if (!printButton) {

        console.warn("No se encontró el botón de impresión.");

        return;

    }


    printButton.addEventListener("click", function () {

        window.print();

    });

}


/* =====================================================
   07. UTILIDAD: DESPLAZAMIENTO SUAVE
===================================================== */

// Función disponible para futuras ampliaciones.

function scrollToSection(sectionId) {

    const section =
        document.getElementById(sectionId);


    if (!section) {

        console.warn(
            "No existe la sección: " + sectionId
        );

        return;

    }


    section.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


/* =====================================================
   08. UTILIDAD: COMPROBAR IMÁGENES
===================================================== */

// Informa sobre imágenes que no se han encontrado
// o que no pueden cargarse.

function checkImages() {

    const images =
        document.querySelectorAll("img");

    images.forEach(function (img) {

        if (img.complete && img.naturalWidth === 0) {

            console.warn(
                "Imagen no disponible: " + img.src
            );

            return;

        }


        img.addEventListener("error", function () {

            console.warn(
                "No se pudo cargar la imagen: " + img.src
            );

        });

    });

}


// Ejecutar comprobación de imágenes.

document.addEventListener("DOMContentLoaded", checkImages);


/* =====================================================
   FIN DE MAIN.JS
===================================================== */
