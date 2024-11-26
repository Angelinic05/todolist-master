import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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
let currentEditId = null;

const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString('es-MX', { weekday: 'long', month: 'short', day: 'numeric' });

addChecklistButton.addEventListener('click', function() {
    const itemText = checklistInput.value.trim();
    if (itemText) {
        const listItem = document.createElement('li');
        listItem.classList.add('checklist-item');

        // Crear un checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checklist-checkbox');

        // Crear un span para el círculo
        const circle = document.createElement('span');
        circle.classList.add('checklist-circle');

        // Crear un span para el texto del ítem
        const textSpan = document.createElement('span');
        textSpan.classList.add('checklist-text');
        textSpan.textContent = itemText;

        // Agregar el checkbox, el círculo y el texto al listItem
        listItem.appendChild(checkbox);
        listItem.appendChild(circle);
        listItem.appendChild(textSpan);
        checklistItemsList.appendChild(listItem);
        checklistInput.value = ''; // Limpiar el campo de entrada
    }
});

async function agregarTarea(tarea, id, realizado, eliminado, startDate, endDate, details, status, persona, checklistItems = [], fromFirebase = false) {
    if (eliminado) return;

    const REALIZADO = realizado ? 'fa-check-circle' : 'fa-circle';
    const LINE = realizado ? 'line-through' : '';

    // Convertir los ítems del checklist en una lista HTML
    const checklistHTML = checklistItems.map(item => `
        <li class="checklist-item">
            <input type="checkbox" class="checklist-checkbox" ${item.realizado ? 'checked' : ''}>
            <span class="checklist-circle"></span>
            <span class="checklist-text">${item.text}</span>
        </li>
    `).join('');

    const elemento = `
    <li id="elemento-${id}">
        <i class="fas fa-pencil-alt" data="editar" id="${id}"></i>
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

    // Agregar eventos a los checkboxes de la tarea
 // Agregar eventos a los checkboxes de la tarea
const checkboxes = document.querySelectorAll(`#elemento-${id} .checklist-checkbox`);
checkboxes.forEach((checkbox, index) => {
    const circle = checkbox.nextElementSibling; // Obtener el círculo correspondiente

    // Evento para el círculo
    circle.addEventListener('click', function() {
        checkbox.checked = !checkbox.checked; // Alternar el estado del checkbox
        checkbox.dispatchEvent(new Event('change')); // Disparar el evento de cambio
    });

    checkbox.addEventListener('change', async function() {
        // Actualizar el estado local
        checklistItems[index].realizado = checkbox.checked; 

        // Actualizar en Firebase
        if (tarea.firebaseId) {
            try {
                await updateDoc(doc(db, 'tareas', tarea.firebaseId), {
                    checklist: checklistItems // Asegúrate de que esto esté bien estructurado
                });
                console.log("Checklist actualizado en Firebase");
            } catch (error) {
                console.error("Error actualizando checklist en Firebase: ", error);
            }
        }

        // Cambiar el estilo del texto según el estado del checkbox
        if (checkbox.checked) {
            circle.classList.add('completed');
        } else {
            circle.classList.remove('completed');
        }
    });

    // Inicializar el estado del checkbox
    if (checklistItems[index].realizado) {
        checkbox.checked = true; // Marcar como checked si está realizado
        checkbox.dispatchEvent(new Event('change')); // Disparar el evento de cambio
    }
});
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

    // Al agregar un item al checklist
    const checklistItems = Array.from(checklistItemsList.children).map(item => ({
        text: item.textContent,
        realizado: item.querySelector('.checklist-checkbox').checked // Guardar el estado del checkbox
    }));

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

            if (LIST[persona]) {
                if (!LIST[persona].some(t => t.id === tarea.id)) {
                    const checklistItems = tarea.checklist.map(item => ({
                        text: item.text,
                        realizado: item.realizado
                    }));

                    LIST[persona].push({ ...tarea, checklist: checklistItems, firebaseId: doc.id });
                    agregarTarea(tarea.nombre, tarea.id, tarea.realizado, tarea.eliminado, tarea.startDate, tarea.endDate, tarea.details, tarea.status, tarea.persona, checklistItems, true);
                }
            } else {
                console.error(`Persona no válida: ${persona}`);
            }
        });

        Object.keys(LIST).forEach(persona => {
            LIST[persona].forEach(tarea => {
                onSnapshot(doc(db, 'tareas', tarea.firebaseId), (doc) => {
                    const data = doc.data();
                    const checklistItems = data.checklist.map(item => ({
                        text: item.text,
                        realizado: item.realizado
                    }));
        
                    // Actualiza la tarea en la UI
                    const elemento = document.getElementById(`elemento-${data.id}`);
                    if (elemento) {
                        const checklistContainer = elemento.querySelector('ul'); // Asegúrate de que esto apunte al contenedor correcto
                        checklistContainer.innerHTML = checklistItems.map(item => `
                            <li class="checklist-item">
                                <input type="checkbox" class="checklist-checkbox" ${item.realizado ? 'checked' : ''}>
                                <span class="checklist-circle"></span>
                                <span class="checklist-text">${item.text}</span>
                            </li>
                        `).join('');
        
                        // Reasignar eventos a los checkboxes
                        const checkboxes = checklistContainer.querySelectorAll('.checklist-checkbox');
                        checkboxes.forEach((checkbox, index) => {
                            const circle = checkbox.nextElementSibling;
        
                            // Evento para el círculo
                            circle.addEventListener('click', function() {
                                checkbox.checked = !checkbox.checked;
                                checkbox.dispatchEvent(new Event('change'));
                            });
        
                            checkbox.addEventListener('change', async function() {
                                checklistItems[index].realizado = checkbox.checked;
        
                                if (tarea.firebaseId) {
                                    try {
                                        await updateDoc(doc(db, 'tareas', tarea.firebaseId), {
                                            checklist: checklistItems
                                        });
                                    } catch (error) {
                                        console.error("Error actualizando checklist en Firebase: ", error);
                                    }
                                }
        
                                // Cambiar el estilo del círculo según el estado del checkbox
                                if (checkbox.checked) {
                                    circle.classList.add('completed');
                                } else {
                                    circle.classList.remove('completed');
                                }
                            });
        
                            // Inicializar el estado del checkbox
                            if (checklistItems[index].realizado) {
                                checkbox.checked = true; // Marcar como checked si está realizado
                                checkbox.dispatchEvent(new Event('change')); // Disparar el evento de cambio
                            }
                        });
                    } else {
                        console.error(`Elemento con ID elemento-${data.id} no encontrado.`);
                    }
                });
            });
        });
    

    } catch (error) {
        console.error("Error al cargar tareas: ", error);
    }
}
async function actualizarTarea() {
    console.log("Función actualizarTarea llamada"); 
    const tareaId = currentEditId; 
    let tarea;
    for (const persona in LIST) {
        tarea = LIST[persona].find(t => t.id === parseInt(tareaId));
        if (tarea) break; 
    }

    if (tarea) {
        const nuevaTarea = document.getElementById('input-tarea').value; // Cambiado
        const nuevaStartDate = document.getElementById('start-date-modal').value; // Cambiado
        const nuevaEndDate = document.getElementById('end-date-modal').value; // Cambiado
        const nuevosDetalles = document.getElementById('details-modal').value; // Cambiado
        const nuevoStatus = document.getElementById('status-modal').value; // Cambiado
        const nuevaPersona = document.getElementById('persona-modal').value; // Cambiado

        // Obtener los ítems del checklist del modal
        const checklistItems = Array.from(document.getElementById('checklist-items-modal').children).map(item => ({
            text: item.querySelector('.checklist-text').textContent,
            realizado: item .querySelector('.checklist-checkbox').checked
        }));

        // Actualizar la tarea
        tarea.nombre = nuevaTarea;
        tarea.startDate = nuevaStartDate;
        tarea.endDate = nuevaEndDate;
        tarea.details = nuevosDetalles;
        tarea.status = nuevoStatus;
        tarea.persona = nuevaPersona;
        tarea.checklist = checklistItems;

        try {
            await updateDoc(doc(db, 'tareas', tarea.firebaseId), {
                nombre: nuevaTarea,
                startDate: nuevaStartDate,
                endDate: nuevaEndDate,
                details: nuevosDetalles,
                status: nuevoStatus,
                persona: nuevaPersona,
                checklist: checklistItems
            });
            console.log("Tarea actualizada en Firebase");
        } catch (error) {
            console.error("Error actualizando tarea en Firebase: ", error);
        }

        renderizarTareas();
        cerrarModal(); // Cierra el modal después de guardar los cambios
    }
}

document.getElementById('add-checklist-item-modal').addEventListener('click', function() {
    const itemText = document.getElementById('checklist-item-modal').value.trim();
    if (itemText) {
        const listItem = document.createElement('li');
        listItem.classList.add('checklist-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checklist-checkbox');

        const circle = document.createElement('span');
        circle.classList.add('checklist-circle');

        const textSpan = document.createElement('span');
        textSpan.classList.add('checklist-text');
        textSpan.textContent = itemText;

        // Aquí está la corrección
        listItem.appendChild(checkbox);
        listItem.appendChild(circle);
        listItem.appendChild(textSpan); // Cambié ListItem a listItem
        document.getElementById('checklist-items-modal').appendChild(listItem);
        document.getElementById('checklist-item-modal').value = ''; // Limpiar el campo de entrada
    }
});
function abrirModalEditar(tareaId) {
    let tarea;
    for (const persona in LIST) {
        tarea = LIST[persona].find(t => t.id === parseInt(tareaId));
        if (tarea) break; 
    }
    
    if (tarea) {
        // Asignar los valores existentes a los campos del modal
        document.getElementById('input-tarea').value = tarea.nombre || '';
        document.getElementById('start-date-modal').value = tarea.startDate || '';
        document.getElementById('end-date-modal').value = tarea.endDate || '';
        document.getElementById('details-modal').value = tarea.details || '';
        document.getElementById('status-modal').value = tarea.status || '';
        document.getElementById('persona-modal').value = tarea.persona || '';
        currentEditId = tareaId; 

        // Limpiar checklist anterior en el modal
        const checklistItemsListModal = document.getElementById('checklist-items-modal');
        checklistItemsListModal.innerHTML = '';

        // Agregar ítems del checklist al modal
        tarea.checklist.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('checklist-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('checklist-checkbox');
            checkbox.checked = item.realizado; // Marcar como checked si está realizado

            const circle = document.createElement('span');
            circle.classList.add('checklist-circle');

            const textSpan = document.createElement('span');
            textSpan.classList.add('checklist-text');
            textSpan.textContent = item.text;

            // Agregar evento para alternar el estado del checkbox
            circle.addEventListener('click', function() {
                checkbox.checked = !checkbox.checked; // Alternar el estado del checkbox
                checkbox.dispatchEvent(new Event('change')); // Disparar el evento de cambio
            });

            // Actualizar el estado en el objeto cuando cambie el checkbox
            checkbox.addEventListener('change', function() {
                item.realizado = checkbox.checked; // Actualizar el estado en el objeto
                if (checkbox.checked) {
                    circle.classList.add('completed'); // Cambiar el estilo si está marcado
                } else {
                    circle.classList.remove('completed'); // Cambiar el estilo si está desmarcado
                }
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(circle);
            listItem.appendChild(textSpan);
            checklistItemsListModal.appendChild(listItem);
        });

        // Mostrar el modal
        document.getElementById('modal-editar').style.display = 'block'; 
    }
}



function renderizarTareas() {
    // Limpia la lista actual


    // Itera sobre la lista de tareas y vuelve a crear los elementos
    Object.keys(LIST).forEach(persona => {
        LIST[persona].forEach(tarea => {
            const elemento = document.createElement('li');
            elemento.innerHTML = `
                <i class="fas fa-pencil-alt" data="editar" id="${tarea.id}"></i>
                <p class="fecha">Desde: ${tarea.startDate} Hasta: ${tarea.endDate}</p>
                <p class="text">${tarea.nombre}</p>
                <p class="detalles">${tarea.details}</p>
                <p class="estado">${tarea.status}</p>
                <p class="persona">Asignada a: ${tarea.persona}</p>
                <ul>${tarea.checklist.map(item => `<li>${item.text} - ${item.realizado ? 'Hecho' : 'Pendiente'}</li>`).join('')}</ul>
                <i class="fas fa-trash de" data-eliminado data-persona="${tarea.persona}" id="${tarea.id}"></i>
            `;
            listaTareas.appendChild(elemento);
        });
    });
}

document.addEventListener('click', function(event) {
    if (event.target.dataset.eliminado !== undefined) {
        const persona = event.target.dataset.persona;  
        eliminarTarea(event.target.id, persona); 
    } else if (event.target.dataset.realizado !== undefined) {
        tareaRealizada(event.target);
    } else if (event.target.dataset.editar !== undefined || event.target.classList.contains('fa-pencil-alt')) {
        const tareaId = event.target.id; // Aquí obtienes el ID del lápiz
        abrirModalEditar(tareaId); 
    }
});

document.addEventListener('DOMContentLoaded', () => {
    configurarEventosVistas();
    cargarTareas();
    document.getElementById('guardar-cambios-modal').addEventListener('click', actualizarTarea);
});