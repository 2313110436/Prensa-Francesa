
/* =====================================================
   FRENCH PRESS GUIDE
   Archivo: js/timer.js

   FRENCH PRESS BREWING TIMER

   Funcionalidades:
   - Cuenta regresiva de 4 minutos
   - Inicio y pausa
   - Continuar temporizador
   - Reinicio
   - Barra de progreso
   - Identificación de etapas
   - Aviso al finalizar
   - Control de temporizadores duplicados
===================================================== */

"use strict";


/* =====================================================
   01. CONFIGURACIÓN
===================================================== */

const timerConfig = {

    duration: 240,

    updateInterval: 200,

    stages: [

        {
            time: 0,
            title: "Preparación lista",
            description: "Agrega el café y comienza el vertido."
        },

        {
            time: 30,
            title: "Bloom - Preinfusión",
            description: "Permite liberar los gases del café."
        },

        {
            time: 45,
            title: "Agitación suave",
            description: "Mezcla suavemente el café."
        },

        {
            time: 240,
            title: "Extracción completada",
            description: "Baja el émbolo y sirve inmediatamente."
        }

    ]

};


/* =====================================================
   02. INICIALIZACIÓN
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    initializeFrenchPressTimer();

});


/* =====================================================
   03. TEMPORIZADOR PRINCIPAL
===================================================== */

function initializeFrenchPressTimer() {


    // Elementos HTML

    const display =
        document.getElementById("timerDisplay");

    const phase =
        document.getElementById("timerPhase");

    const progressBar =
        document.getElementById("timerProgress");

    const startButton =
        document.getElementById("startTimer");

    const pauseButton =
        document.getElementById("pauseTimer");

    const resetButton =
        document.getElementById("resetTimer");


    // Comprobar elementos

    if (
        !display ||
        !phase ||
        !progressBar ||
        !startButton ||
        !pauseButton ||
        !resetButton
    ) {

        console.warn(
            "No se encontraron todos los elementos del temporizador."
        );

        return;

    }


    /* ---------------------------------------------
       VARIABLES DE CONTROL
    --------------------------------------------- */

    let remainingTime = timerConfig.duration;

    let timerInterval = null;

    let endTimestamp = null;

    let audioContext = null;

    let completed = false;


    /* =================================================
       04. FORMATO DEL TIEMPO
    ================================================= */

    function formatTime(seconds) {

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;


        const formattedMinutes =
            String(minutes).padStart(2, "0");

        const formattedSeconds =
            String(remainingSeconds).padStart(2, "0");


        return formattedMinutes + ":" + formattedSeconds;

    }


    /* =================================================
       05. ACTUALIZAR PANTALLA
    ================================================= */

    function updateDisplay() {

        display.textContent =
            formatTime(remainingTime);


        // Actualizar barra de progreso

        const elapsedTime =
            timerConfig.duration - remainingTime;


        const percentage =
            (elapsedTime / timerConfig.duration) * 100;


        progressBar.style.width =
            Math.min(100, Math.max(0, percentage)) + "%";


        // Actualizar etapa

        updatePhase();


        // Actualizar título del documento

        if (timerInterval !== null) {

            document.title =
                formatTime(remainingTime) +
                " | French Press Guide";

        }

    }


    /* =================================================
       06. IDENTIFICAR ETAPA DE PREPARACIÓN
    ================================================= */

    function updatePhase() {

        const elapsed =
            timerConfig.duration - remainingTime;


        let currentStage =
            timerConfig.stages[0];


        timerConfig.stages.forEach(function (stage) {

            if (elapsed >= stage.time) {

                currentStage = stage;

            }

        });


        phase.textContent =
            currentStage.title;


        phase.setAttribute(
            "aria-label",
            currentStage.description
        );

    }


    /* =================================================
       07. SONIDO DE FINALIZACIÓN
    ================================================= */

    function playCompletionSound() {

        try {

            const AudioContextClass =
                window.AudioContext ||
                window.webkitAudioContext;


            if (!AudioContextClass) {

                return;

            }


            audioContext =
                audioContext || new AudioContextClass();


            if (audioContext.state === "suspended") {

                audioContext.resume();

            }


            const frequencies = [660, 880, 660];


            frequencies.forEach(function (frequency, index) {

                const oscillator =
                    audioContext.createOscillator();

                const gain =
                    audioContext.createGain();


                const startTime =
                    audioContext.currentTime + index * 0.22;


                oscillator.type = "sine";

                oscillator.frequency.value = frequency;


                gain.gain.setValueAtTime(
                    0.0001,
                    startTime
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.15,
                    startTime + 0.03
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    startTime + 0.18
                );


                oscillator.connect(gain);

                gain.connect(audioContext.destination);


                oscillator.start(startTime);

                oscillator.stop(startTime + 0.2);

            });

        } catch (error) {

            console.warn(
                "No se pudo reproducir el sonido.",
                error
            );

        }

    }


    /* =================================================
       08. FINALIZAR TEMPORIZADOR
    ================================================= */

    function finishTimer() {

        clearInterval(timerInterval);

        timerInterval = null;

        remainingTime = 0;

        completed = true;


        updateDisplay();


        phase.textContent =
            "¡Café listo! ☕";


        startButton.textContent =
            "Iniciar nuevamente";


        document.title =
            "Coffee Ready! | French Press Guide";


        playCompletionSound();


        console.log(
            "Preparación de café completada."
        );

    }


    /* =================================================
       09. ACTUALIZACIÓN DEL TEMPORIZADOR
    ================================================= */

    function tick() {

        if (endTimestamp === null) {

            return;

        }


        const millisecondsRemaining =
            endTimestamp - Date.now();


        remainingTime = Math.max(
            0,
            Math.ceil(millisecondsRemaining / 1000)
        );


        updateDisplay();


        if (millisecondsRemaining <= 0) {

            finishTimer();

        }

    }


    /* =================================================
       10. INICIAR TEMPORIZADOR
    ================================================= */

    function startTimer() {

        // Evitar intervalos duplicados

        if (timerInterval !== null) {

            return;

        }


        // Si terminó, iniciar desde cero

        if (completed || remainingTime <= 0) {

            remainingTime =
                timerConfig.duration;

            completed = false;

        }


        // Establecer tiempo de finalización

        endTimestamp =
            Date.now() + remainingTime * 1000;


        phase.textContent =
            remainingTime === timerConfig.duration
                ? "Preparación en curso"
                : "Continuando extracción";


        startButton.textContent =
            "En preparación...";


        timerInterval = setInterval(
            tick,
            timerConfig.updateInterval
        );


        tick();


        console.log(
            "Temporizador iniciado."
        );

    }


    /* =================================================
       11. PAUSAR TEMPORIZADOR
    ================================================= */

    function pauseTimer() {

        if (timerInterval === null) {

            return;

        }


        // Actualizar antes de detener

        tick();


        clearInterval(timerInterval);

        timerInterval = null;

        endTimestamp = null;


        startButton.textContent =
            "Continuar";


        if (!completed) {

            phase.textContent =
                "Preparación en pausa";

        }


        document.title =
            "Temporizador en pausa | French Press Guide";


        console.log(
            "Temporizador pausado."
        );

    }


    /* =================================================
       12. REINICIAR TEMPORIZADOR
    ================================================= */

    function resetTimer() {

        clearInterval(timerInterval);

        timerInterval = null;

        endTimestamp = null;


        remainingTime =
            timerConfig.duration;


        completed = false;


        startButton.textContent =
            "Iniciar";


        document.title =
            "French Press Guide | El Arte del Café";


        updateDisplay();


        phase.textContent =
            "Preparación lista";


        console.log(
            "Temporizador reiniciado."
        );

    }


    /* =================================================
       13. CONECTAR BOTONES
    ================================================= */

    startButton.addEventListener(
        "click",
        startTimer
    );


    pauseButton.addEventListener(
        "click",
        pauseTimer
    );


    resetButton.addEventListener(
        "click",
        resetTimer
    );


    /* =================================================
       14. ESTADO INICIAL
    ================================================= */

    updateDisplay();


    phase.textContent =
        "Preparación lista";


    startButton.textContent =
        "Iniciar";


    pauseButton.textContent =
        "Pausar";


    resetButton.textContent =
        "Reiniciar";


    console.log(
        "French Press Timer iniciado correctamente."
    );


}


/* =====================================================
   FIN DE TIMER.JS
===================================================== */
