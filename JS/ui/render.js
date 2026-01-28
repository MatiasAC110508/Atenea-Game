export function renderQuestion(text) {
    document.getElementById("pregunta").textContent = text;
}

export function renderAnswers(answers, onSelect) {
    const container = document.getElementById("respuestas");
    container.innerHTML = "";

    answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.className = "respuesta";
        btn.textContent = answer;
        btn.onclick = () => onSelect(index);
        container.appendChild(btn);
    });
}

export function renderMaterials(materials) {
    document.getElementById("madera").textContent = materials.madera;
    document.getElementById("piedra").textContent = materials.piedra;
    document.getElementById("comida").textContent = materials.comida;
    document.getElementById("oro").textContent = materials.oro;
}


export function renderEndScreen(title, message, type) {
    sessionStorage.setItem("endType", type); // "win" o "lose"
    sessionStorage.setItem("endTitle", title);
    sessionStorage.setItem("endMessage", message);

    // Detectar si estamos en pantalla3
    
    const path = window.location.pathname;
    if (path.includes("/html/pantalla3/")) {
        window.location.href = "../../pantalla_final.html";
    } 
}
