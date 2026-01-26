import { questions } from "./data/questions.js";
import { events } from "./data/events.js";

import { state } from "./game/state.js";
import { checkAnswer, nextQuestion, canRebuildCity } from "./game/logic.js";
import { startTimer, stopTimer, clearTimer } from "./game/timer.js";

import {
    renderQuestion,
    renderAnswers,
    renderMaterials,
    renderEndScreen
} from "./ui/render.js";

import { disableAnswers, iniciarBotones } from "./ui/buttons.js";

/* ===============================
   VARIABLES GLOBALES
=============================== */
let intervaloTexto = null;

/* ===============================
   DETECTAR PANTALLA
=============================== */
function esIndex() {
    return document.getElementById("pantalla-inicial") !== null;
}

function esJuego() {
    return document.getElementById("pantalla-juego") !== null;
}

/* ===============================
   JUEGO (pantalla 3)
=============================== */
function iniciarJuego() {
    if (!esJuego()) return;

    const preguntaEl = document.getElementById("pregunta");
    const respuestasEl = document.getElementById("respuestas");
    const materialesEl = document.getElementById("materiales");

    if (!preguntaEl || !respuestasEl || !materialesEl) {
        console.error("Faltan elementos del DOM del juego");
        return;
    }

    state.currentQuestion = 0;
    state.materials = {
        madera: 0,
        piedra: 0,
        comida: 0,
        oro: 0
    };
    state.finished = false;

    cargarPregunta();
}

function cargarPregunta() {
    const q = questions[state.currentQuestion];
    renderQuestion(q.text);
    renderAnswers(q.answers, manejarRespuesta);
    startTimer(manejarTimeout);
}

function manejarRespuesta(index) {
    stopTimer();
    const q = questions[state.currentQuestion];

    checkAnswer(q, index);
    renderMaterials(state.materials);
    disableAnswers();

    avanzar();
}

function manejarTimeout() {
    disableAnswers();
    avanzar();
}

function avanzar() {
    setTimeout(() => {
        nextQuestion(questions.length);
        state.finished ? finalizarJuego() : cargarPregunta();
    }, 600);
}

function finalizarJuego() {
    clearTimer();

    if (canRebuildCity()) {
        renderEndScreen(events.win.title, events.win.message, "win");
    } else {
        renderEndScreen(events.lose.title, events.lose.message, "lose");
    }
}

/* ===============================
   INDEX (pantalla inicial)
=============================== */
function iniciarIndex() {
    if (!esIndex()) return;

    iniciarBotones();

    registrarEventosIndex();
}

function registrarEventosIndex() {
    const btnContinuar = document.getElementById("btnContinuar");
    const btnCerrar = document.getElementById("btnCerrarInstrucciones");

    if (btnContinuar) {
        btnContinuar.addEventListener("click", () => {
            window.location.href = "./html/pantalla2/pantalla2.html";
        });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            document
                .getElementById("pergamino-instrucciones")
                ?.classList.add("oculto");
        });
    }

    document.addEventListener("mostrarPergamino", mostrarPergamino);
    document.addEventListener("mostrarInstrucciones", mostrarInstrucciones);
}

function mostrarPergamino() {
    const pantalla = document.getElementById("pantalla-inicial");
    const pergamino = document.getElementById("pergamino");
    const texto = document.getElementById("texto-pergamino");

    if (!pantalla || !pergamino || !texto) return;

    pantalla.classList.add("pantalla-desvanecer");

    setTimeout(() => {
        pantalla.classList.add("oculto");
        pergamino.classList.add("mostrar");

        setTimeout(() => {
            escribirTexto(
`En la antigua Acrópolis, una disputa entre Atenea y Poseidón terminó en desastre.

Poseidón inundó la ciudad para demostrar su poder.

Zeus impuso una condición: solo quien demuestre verdadera sabiduría podrá reconstruir la ciudad.`,
                texto
            );
        }, 1800);
    }, 800);
}

function mostrarInstrucciones() {
    document
        .getElementById("pergamino-instrucciones")
        ?.classList.remove("oculto");
}

function escribirTexto(mensaje, elemento) {
    if (intervaloTexto) clearInterval(intervaloTexto);

    elemento.textContent = "";
    let i = 0;

    intervaloTexto = setInterval(() => {
        elemento.textContent += mensaje[i++] || "";
        if (i >= mensaje.length) clearInterval(intervaloTexto);
    }, 40);
}

/* ===============================
   INIT ÚNICO
=============================== */
document.addEventListener("DOMContentLoaded", () => {
    iniciarIndex();
    iniciarJuego();
});
