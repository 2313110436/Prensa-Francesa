
/* =====================================================
   FRENCH PRESS GUIDE
   Archivo: js/calculator.js

   COFFEE RATIO CALCULATOR

   Funcionalidades:
   - Calcular proporción café / agua
   - Conversión de gramos a mililitros
   - Actualización automática
   - Validación de datos
   - Mensajes de preparación
===================================================== */

"use strict";


/* =====================================================
   01. INICIALIZACIÓN
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    initializeCoffeeCalculator();

});


/* =====================================================
   02. CONFIGURACIÓN
===================================================== */

const calculatorConfig = {

    minCoffee: 1,

    maxCoffee: 500,

    defaultCoffee: 30,

    defaultRatio: 15,

    availableRatios: [12, 13, 14, 15, 16, 17]

};


/* =====================================================
   03. INICIALIZAR CALCULADORA
===================================================== */

function initializeCoffeeCalculator() {

    const coffeeInput =
        document.getElementById("coffeeAmount");

    const ratioSelect =
        document.getElementById("coffeeRatio");

    const calculateButton =
        document.getElementById("calculateCoffee");

    const waterResult =
        document.getElementById("waterResult");

    const coffeeResult =
        document.getElementById("coffeeResult");

    const ratioResult =
        document.getElementById("ratioResult");

    const calculatorMessage =
        document.getElementById("calculatorMessage");


    // Comprobar que existan todos los elementos

    if (
        !coffeeInput ||
        !ratioSelect ||
        !calculateButton ||
        !waterResult ||
        !coffeeResult ||
        !ratioResult ||
        !calculatorMessage
    ) {

        console.warn(
            "No se encontraron todos los elementos de la calculadora."
        );

        return;

    }


    /* ---------------------------------------------
       FUNCIÓN DE VALIDACIÓN
    --------------------------------------------- */

    function validateCoffeeAmount(value) {

        const amount = Number(value);

        if (!Number.isFinite(amount)) {

            return {

                valid: false,

                message: "Introduce una cantidad válida de café."

            };

        }


        if (amount < calculatorConfig.minCoffee) {

            return {

                valid: false,

                message: "La cantidad mínima es 1 gramo."

            };

        }


        if (amount > calculatorConfig.maxCoffee) {

            return {

                valid: false,

                message: "La cantidad máxima es 500 gramos."

            };

        }


        return {

            valid: true,

            value: amount

        };

    }


    /* ---------------------------------------------
       FUNCIÓN DE OBTENCIÓN DE MENSAJES
    --------------------------------------------- */

    function getRatioMessage(ratio) {

        const messages = {

            12: "Preparación intensa y concentrada.",

            13: "Una taza de cuerpo pronunciado.",

            14: "Una preparación de intensidad media-alta.",

            15: "Una proporción equilibrada para comenzar.",

            16: "Una taza más ligera y delicada.",

            17: "Una preparación suave y menos concentrada."

        };


        return messages[ratio] ||
            "Ajusta la proporción según tus preferencias.";

    }


    /* ---------------------------------------------
       FUNCIÓN PRINCIPAL DE CÁLCULO
    --------------------------------------------- */

    function calculateRatio() {

        // Obtener valores

        const validation =
            validateCoffeeAmount(coffeeInput.value);


        const ratio =
            Number(ratioSelect.value);


        // Validar café

        if (!validation.valid) {

            calculatorMessage.textContent =
                validation.message;

            coffeeInput.setAttribute("aria-invalid", "true");

            return;

        }


        // Validar proporción

        if (
            !calculatorConfig.availableRatios.includes(ratio)
        ) {

            calculatorMessage.textContent =
                "Selecciona una proporción disponible.";

            return;

        }


        coffeeInput.removeAttribute("aria-invalid");


        // Calcular cantidad de agua

        const coffeeGrams = validation.value;

        const waterMilliliters =
            coffeeGrams * ratio;


        // Redondear el resultado

        const waterRounded =
            Math.round(waterMilliliters);


        // Actualizar resultados

        waterResult.textContent =
            waterRounded.toLocaleString("es-ES");


        coffeeResult.textContent =
            coffeeGrams + " g";


        ratioResult.textContent =
            "1:" + ratio;


        // Actualizar mensaje

        calculatorMessage.textContent =
            getRatioMessage(ratio);


        // Guardar resultado calculado

        const calculation = {

            coffee: coffeeGrams,

            water: waterRounded,

            ratio: ratio

        };


        console.log(
            "Resultado de preparación:",
            calculation
        );


        return calculation;

    }


    /* ---------------------------------------------
       EVENTO: BOTÓN CALCULAR
    --------------------------------------------- */

    calculateButton.addEventListener(
        "click",
        calculateRatio
    );


    /* ---------------------------------------------
       EVENTO: CAMBIAR CANTIDAD DE CAFÉ
    --------------------------------------------- */

    coffeeInput.addEventListener(
        "input",
        calculateRatio
    );


    /* ---------------------------------------------
       EVENTO: CAMBIAR PROPORCIÓN
    --------------------------------------------- */

    ratioSelect.addEventListener(
        "change",
        calculateRatio
    );


    /* ---------------------------------------------
       EVENTO: TECLA ENTER
    --------------------------------------------- */

    coffeeInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            calculateRatio();

        }

    });


    /* ---------------------------------------------
       CONFIGURAR VALORES INICIALES
    --------------------------------------------- */

    coffeeInput.value =
        calculatorConfig.defaultCoffee;


    ratioSelect.value =
        String(calculatorConfig.defaultRatio);


    // Calcular al cargar la página

    calculateRatio();


}


/* =====================================================
   04. FUNCIÓN AUXILIAR
   CÁLCULO EXTERNO DE PROPORCIONES
===================================================== */

function calculateCoffeeWater(coffeeGrams, ratio) {

    const coffee = Number(coffeeGrams);

    const proportion = Number(ratio);


    if (
        !Number.isFinite(coffee) ||
        !Number.isFinite(proportion) ||
        coffee <= 0 ||
        proportion <= 0
    ) {

        return null;

    }


    return {

        coffee: coffee,

        water: Math.round(coffee * proportion),

        ratio: proportion

    };

}


/* =====================================================
   05. FIN DEL MÓDULO
===================================================== */

console.log("Coffee Calculator module loaded.");

