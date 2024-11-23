import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDgtdNs1w5bXkJT5w4ROTXb6BXt8ERKbWY",
    authDomain: "toolist-d7614.firebaseapp.com",
    projectId: "toolist-d7614",
    storageBucket: "toolist-d7614.firebasestorage.app",
    messagingSenderId: "749796563417",
    appId: "1:749796563417:web:dbceb1018d4aedd7a521c8",
    measurementId: "G-QKELJWTV3H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const fecha = document.querySelector('#fecha');
const listaJeyson = document.querySelector('#lista-jeyson');
const listaCristian = document.querySelector('#lista-cristian');
const listaAngeli = document.querySelector('#lista-angeli');
const listaSilvia = document.querySelector('#lista-silvia');
const input = document.querySelector('#input');
const startDate = document.querySelector('#start-date');
const endDate = document.querySelector('#end-date');
const details = document.querySelector('#details');
const status = document.querySelector('#status');
const persona = document.querySelector('#persona');
const botonEnter = document.querySelector('#boton-enter');
const addChecklistButton = document.getElementById('add-checklist-item');
const checklistInput = document.getElementById('checklist-item');
const checklistItemsList = document.getElementById('checklist-items');

let LIST = {
    Jeyson: [],
    Cristian: [],
    Angeli: [],
    Silvia: []
};
let id = 0;

const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString('es-MX', { weekday: 'long', month: 'short', day: 'numeric' });

addChecklistButton.addEventListener('click', function() {
    const itemText = checklistInput.value.trim();
    if (itemText) {
        const listItem = document.createElement('li');
        listItem.textContent = itemText;
        checklistItemsList.appendChild(listItem);
        checklistInput.value = ''; // Clear the input field
    }
});

async function agregarTarea(tarea, id, realizado, eliminado, startDate, endDate, details, status, persona, checklistItems = [], fromFirebase = false) {
    if (eliminado) return;

    const REALIZADO = realizado ? 'fa-check-circle' : 'fa-circle';
    const LINE = realizado ? 'line-through' : '';

    // Convertir los ítems del checklist en una lista HTML
    const checklistHTML = checklistItems.map(item => `<li>${item}</li>`).join('');

    const elemento = `
    <li id="elemento-${id}">
        <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
        <p class="fecha">Desde: ${startDate} Hasta: ${endDate}</p>
        <p class="text ${LINE}">${tarea}</p>
        <p class="detalles">${details}</p>
        <p class="estado">${status}</p>
        <ul>${checklistHTML}</ul> 
        <i class="fas fa-trash de" data-eliminado data-persona="${persona}" id="${id}"></i> 
    </li>
    `;

    // Agregar el elemento a la lista correspondiente
    if (persona === 'Jeyson') {
        listaJeyson.insertAdjacentHTML("beforeend", elemento);
    } else if (persona === 'Cristian') {
        listaCristian.insertAdjacentHTML("beforeend", elemento);
    } else if (persona === 'Angeli') {
        listaAngeli.insertAdjacentHTML("beforeend", elemento);
    } else if (persona === 'Silvia') {
        listaSilvia.insertAdjacentHTML("beforeend", elemento);
    }

    // Guardar en Firebase solo si no viene de Firebase
    if (!fromFirebase) {
        try {
            const docRef = await addDoc(collection(db, 'tareas'), {
                nombre: tarea,
                id: id,
                realizado: realizado,
                eliminado: eliminado,
                startDate: startDate,
                endDate: endDate,
                details: details,
                status: status,
                persona: persona,
                checklist: checklistItems
            });
            console.log("Tarea agregada a Firebase con ID:", docRef.id);
            LIST[persona].find(t => t.id === id).firebaseId = docRef.id; // Actualiza firebaseId
        } catch (error) {
            console.error("Error agregando tarea: ", error);
        }
    }
}

async function tareaRealizada(element) {
    element.classList.toggle('fa-check-circle');
    element.classList.toggle('fa-circle');
    element.parentNode.querySelector('.text').classList.toggle('line-through');
    LIST[element.id].realizado = !LIST[element.id].realizado;

    const tarea = LIST[element.id];
    try {
        await updateDoc(doc(db, ' tareas', tarea.firebaseId), {
            realizado: tarea.realizado
        });
        console.log("Tarea actualizada en Firebase");
    } catch (error) {
        console.error("Error actualizando tarea: ", error);
    }
}

async function eliminarTarea(id, persona) {
    console.log(LIST);  
    console.log(`Eliminando tarea para la persona: ${persona}, ID: ${id}`);  

    try {
        const tarea = LIST[persona].find(t => t.id === parseInt(id)); 
        console.log(`Tarea encontrada: `, tarea);  

        if (tarea) {
            const firebaseId = tarea.firebaseId; 
            await deleteDoc(doc(db, 'tareas', firebaseId));
            console.log(`Tarea con ID ${id} eliminada de Firebase`);

            LIST[persona] = LIST[persona].filter(t => t.id !== parseInt(id)); 
            document.getElementById(`elemento-${id}`).remove();
        } else {
            console.log(`Tarea con ID ${id} no encontrada en la lista de ${persona}`);
        }
    } catch (error) {
        console.error("Error al eliminar la tarea: ", error);
    }
}

botonEnter.addEventListener('click', () => {
    const tarea = input.value;
    const start = startDate.value;
    const end = endDate.value;
    const detail = details.value;
    const taskStatus = status.value;
    const selectedPersona = persona.value;

    const checklistItems = Array.from(checklistItemsList.children).map(item => item.textContent);

    if (tarea && start && end && new Date(start) <= new Date(end)) {
        agregarTarea(tarea, id, false, false, start, end, detail, taskStatus, selectedPersona, checklistItems, false);
        LIST[selectedPersona].push({
            nombre: tarea,
            id: id,
            realizado: false,
            eliminado: false,
            startDate: start,
            endDate: end,
            details: detail,
            status: taskStatus,
            checklist: checklistItems,
            firebaseId: null
        });
        localStorage.setItem('TODO', JSON.stringify(LIST));
        id++;
        input.value = '';
        startDate.value = '';
        endDate.value = '';
        details.value = '';
        status.value = 'Pendiente';
        checklistItemsList.innerHTML = '';
    } else {
        alert("Por favor, completa todos los campos correctamente.");
    }
});

function mostrarVista(vistaId) {
    const vistas = ['formulario', 'tareas-jeyson', 'tareas-cristian', 'tareas-angeli', 'tareas-silvia'];
    vistas.forEach(vista => {
        document.getElementById(vista).style.display = (vista === vistaId) ? 'block' : 'none';
    });
}

function configurarEventosVistas() {
    document.querySelector('#inicio').addEventListener('click', () => {
        location.reload();
        mostrarVista('formulario');
    });

    document.querySelector('#jeyson').addEventListener('click', () => {
        mostrarVista('tareas-jeyson');
    });

    document.querySelector('#cristian').addEventListener('click', () => {
        mostrarVista('tareas-cristian');
    });

    document.querySelector('#angeli').addEventListener('click', () => {
        mostrarVista('tareas-angeli');
    });
    document.querySelector('#silvia').addEventListener('click', () => {
        mostrarVista('tareas-silvia');
    });
}

async function cargarTareas() {
    try {
        const querySnapshot = await getDocs(collection(db, 'tareas'));
        querySnapshot.forEach(doc => {
            const tarea = doc.data();
            const persona = tarea.persona;

            console.log("Persona obtenida de Firebase:", persona);

            if (LIST[persona]) {
                if (!LIST[persona].some(t => t.id === tarea.id)) {
                    LIST[persona].push({ ...tarea, firebaseId: doc.id });
                    agregarTarea(tarea.nombre, tarea.id, tarea.realizado, tarea.eliminado, tarea.startDate, tarea.endDate, tarea.details, tarea.status, tarea.persona,tarea.checklist, true);
                }
            } else {
                console.error(`Persona no válida: ${persona}`);
            }
        });
    } catch (error) {
        console.error("Error al cargar tareas: ", error);
    }
}

document.addEventListener('click', function(event) {
    if (event.target.dataset.eliminado !== undefined) {
        const persona = event.target.dataset.persona;  
        eliminarTarea(event.target.id, persona); 
    } else if (event.target.dataset.realizado !== undefined) {
        tareaRealizada(event.target);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    configurarEventosVistas();
    cargarTareas();
});