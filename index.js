// const fecha = document.querySelector('#fecha')
// const listaJeyson = document.querySelector('#lista-jeyson')
// const listaCristian = document.querySelector('#lista-cristian')
// const listaAngeli = document.querySelector('#lista-angeli')
// const input = document.querySelector('#input')
// const startDate = document.querySelector('#start-date')
// const endDate = document.querySelector('#end-date')
// const details = document.querySelector('#details')
// const status = document.querySelector('#status')
// const persona = document.querySelector('#persona')
// const botonEnter = document.querySelector('#boton-enter')

// let LIST = {
//     Jeyson: [],
//     Cristian: [],
//     Angeli: []
// }
// let id = 0

// // Función para actualizar la fecha
// const FECHA = new Date()
// fecha.innerHTML = FECHA.toLocaleDateString('es-MX', { weekday: 'long', month: 'short', day: 'numeric' })

// // Función para agregar tarea
// function agregarTarea(tarea, id, realizado, eliminado, startDate, endDate, details, status, persona) {
//     if (eliminado) { return }

//     const REALIZADO = realizado ? 'fa-check-circle' : 'fa-circle'
//     const LINE = realizado ? 'line-through' : ''

//     const elemento = `
//         <li id="elemento">
//             <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
//             <p class="text ${LINE}">${tarea}</p>
//             <p class="fecha">Desde: ${startDate} Hasta: ${endDate}</p>
//             <p class="detalles">${details}</p>
//             <p class="estado">${status}</p>
//             <i class="fas fa-trash de" data="eliminado" id="${id}"></i> 
//         </li>
//     `

//     if (persona === 'Jeyson') {
//         listaJeyson.insertAdjacentHTML("beforeend", elemento)
//     } else if (persona === 'Cristian') {
//         listaCristian.insertAdjacentHTML("beforeend", elemento)
//     } else if (persona === 'Angeli') {
//         listaAngeli.insertAdjacentHTML("beforeend", elemento)
//     }
// }

// // Función para manejar tarea realizada
// function tareaRealizada(element) {
//     element.classList.toggle('fa-check-circle')
//     element.classList.toggle('fa-circle')
//     element.parentNode.querySelector('.text').classList.toggle('line-through')
//     LIST[element.id].realizado = LIST[element.id].realizado ? false : true
// }

// // Función para eliminar tarea
// function tareaEliminada(element) {
//     element.parentNode.parentNode.removeChild(element.parentNode)
//     LIST[element.id].eliminado = true
// }

// // Evento para agregar tarea
// botonEnter.addEventListener('click', () => {
//     const tarea = input.value
//     const start = startDate.value
//     const end = endDate.value
//     const detail = details.value
//     const taskStatus = status.value
//     const selectedPersona = persona.value

//     if (tarea) {
//         agregarTarea(tarea, id, false, false, start, end, detail, taskStatus, selectedPersona)
//         LIST[selectedPersona].push({
//             nombre: tarea,
//             id: id,
//             realizado: false,
//             eliminado: false,
//             startDate: start,
//             endDate: end,
//             details: detail,
//             status: taskStatus
//         })
//         localStorage.setItem('TODO', JSON.stringify(LIST))
//         id++
//         input.value = ''
//         startDate.value = ''
//         endDate.value = ''
//         details.value = ''
//         status.value = 'Pendiente'
//     }
// })

// // Cambiar de vista al seleccionar el menú
// document.querySelector('#inicio').addEventListener('click', () => {
//     location.reload();
//     document.getElementById('formulario').style.display = 'block'
//     document.getElementById('tareas-jeyson').style.display = 'none'
//     document.getElementById('tareas-cristian').style.display = 'none'
//     document.getElementById('tareas-angeli').style.display = 'none'
// })

// document.querySelector('#jeyson').addEventListener('click', () => {
//     document.getElementById('formulario').style.display = 'none'
//     document.getElementById('tareas-jeyson').style.display = 'block'
//     document.getElementById('tareas-cristian').style.display = 'none'
//     document.getElementById('tareas-angeli').style.display = 'none'
// })

// document.querySelector('#cristian').addEventListener('click', () => {
//     document.getElementById('formulario').style.display = 'none'
//     document.getElementById('tareas-jeyson').style.display = 'none'
//     document.getElementById('tareas-cristian').style.display = 'block'
//     document.getElementById('tareas-angeli').style.display = 'none'
// })

// document.querySelector('#angeli').addEventListener('click', () => {
//     document.getElementById('formulario').style.display = 'none'
//     document.getElementById('tareas-jeyson').style.display = 'none'
//     document.getElementById('tareas-cristian').style.display = 'none'
//     document.getElementById('tareas-angeli').style.display = 'block'
// })

// // Cargar tareas desde localStorage
// let data = localStorage.getItem('TODO')
// if (data) {
//     LIST = JSON.parse(data)
//     id = LIST.Jeyson.length + LIST.Cristian.length + LIST.Angeli.length

//     LIST.Jeyson.forEach(tarea => agregarTarea(tarea.nombre, tarea.id, tarea.realizado, tarea.eliminado, tarea.startDate, tarea.endDate, tarea.details, tarea.status, 'Jeyson'))
//     LIST.Cristian.forEach(tarea => agregarTarea(tarea.nombre, tarea.id, tarea.realizado, tarea.eliminado, tarea.startDate, tarea.endDate, tarea.details, tarea.status, 'Cristian'))
//     LIST.Angeli.forEach(tarea => agregarTarea(tarea.nombre, tarea.id, tarea.realizado, tarea.eliminado, tarea.startDate, tarea.endDate, tarea.details, tarea.status, 'Angeli'))
// }

// // Añadir eventos para marcar tareas como realizadas o eliminadas
// document.addEventListener('click', function(event) {
//     if (event.target.dataset.eliminado) {
//         tareaEliminada(event.target)
//     } else if (event.target.dataset.realizado) {
//         tareaRealizada(event.target)
//     }
// })

// Importar Firebase desde CDN (esto solo es necesario si usas módulos JS)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDgtdNs1w5bXkJT5w4ROTXb6BXt8ERKbWY",
    authDomain: "toolist-d7614.firebaseapp.com",
    projectId: "toolist-d7614",
    storageBucket: "toolist-d7614.firebasestorage.app",
    messagingSenderId: "749796563417",
    appId: "1:749796563417:web:dbceb1018d4aedd7a521c8",
    measurementId: "G-QKELJWTV3H"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos DOM
const fecha = document.querySelector('#fecha');
const listaJeyson = document.querySelector('#lista-jeyson');
const listaCristian = document.querySelector('#lista-cristian');
const listaAngeli = document.querySelector('#lista-angeli');
const input = document.querySelector('#input');
const startDate = document.querySelector('#start-date');
const endDate = document.querySelector('#end-date');
const details = document.querySelector('#details');
const status = document.querySelector('#status');
const persona = document.querySelector('#persona');
const botonEnter = document.querySelector('#boton-enter');

let LIST = {
    Jeyson: [],
    Cristian: [],
    Angeli: []
};
let id = 0;

// Función para actualizar la fecha
const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString('es-MX', { weekday: 'long', month: 'short', day: 'numeric' });

// Función para agregar tarea
async function agregarTarea(tarea, id, realizado, eliminado, startDate, endDate, details, status, persona, fromFirebase = false) {
    if (eliminado) return;

    const REALIZADO = realizado ? 'fa-check-circle' : 'fa-circle';
    const LINE = realizado ? 'line-through' : '';

    const elemento = `
        <li id="elemento-${id}">
            <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
            <p class="text ${LINE}">${tarea}</p>
            <p class="fecha">Desde: ${startDate} Hasta: ${endDate}</p>
            <p class="detalles">${details}</p>
            <p class="estado">${status}</p>
            <i class="fas fa-trash de" data-eliminado id="${id}"></i> 
        </li>
    `;

    if (persona === 'Jeyson') {
        listaJeyson.insertAdjacentHTML("beforeend", elemento);
    } else if (persona === 'Cristian') {
        listaCristian.insertAdjacentHTML("beforeend", elemento);
    } else if (persona === 'Angeli') {
        listaAngeli.insertAdjacentHTML("beforeend", elemento);
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
                persona: persona
            });
            console.log("Tarea agregada a Firebase con ID:", docRef.id);
            LIST[persona].find(t => t.id === id).firebaseId = docRef.id;
        } catch (error) {
            console.error("Error agregando tarea: ", error);
        }
    }
}



// Función para manejar tarea realizada
async function tareaRealizada(element) {
    element.classList.toggle('fa-check-circle');
    element.classList.toggle('fa-circle');
    element.parentNode.querySelector('.text').classList.toggle('line-through');
    LIST[element.id].realizado = LIST[element.id].realizado ? false : true;

    // Actualizar en Firebase
    const tarea = LIST[element.id];
    try {
        await updateDoc(doc(db, 'tareas', tarea.firebaseId), {
            realizado: tarea.realizado
        });
        console.log("Tarea actualizada en Firebase");
    } catch (error) {
        console.error("Error actualizando tarea: ", error);
    }
}

// Función para eliminar tarea
async function tareaEliminada(element) {
    const tareaId = element.id; // Identificador de la tarea
    const persona = Object.keys(LIST).find(key => LIST[key].some(t => t.id == tareaId));
    if (!persona) return;

    // Elimina del DOM
    const tareaElemento = document.querySelector(`#elemento-${tareaId}`);
    if (tareaElemento) {
        tareaElemento.parentNode.removeChild(tareaElemento);
    }

    // Elimina de Firebase
    const firebaseId = LIST[persona].find(t => t.id == tareaId).firebaseId;
    try {
        if (firebaseId) {
            await deleteDoc(doc(db, 'tareas', firebaseId));
            console.log("Tarea eliminada de Firebase");
        }
    } catch (error) {
        console.error("Error eliminando tarea: ", error);
    }

    // Elimina de la lista local
    LIST[persona] = LIST[persona].filter(t => t.id != tareaId);
}


// Evento para agregar tarea
botonEnter.addEventListener('click', () => {
    const tarea = input.value;
    const start = startDate.value;
    const end = endDate.value;
    const detail = details.value;
    const taskStatus = status.value;
    const selectedPersona = persona.value;

    if (tarea) {
        agregarTarea(tarea, id, false, false, start, end, detail, taskStatus, selectedPersona);
        LIST[selectedPersona].push({
            nombre: tarea,
            id: id,
            realizado: false,
            eliminado: false,
            startDate: start,
            endDate: end,
            details: detail,
            status: taskStatus,
            firebaseId: null
        });
        localStorage.setItem('TODO', JSON.stringify(LIST));
        id++;
        input.value = '';
        startDate.value = '';
        endDate.value = '';
        details.value = '';
        status.value = 'Pendiente';
    }
});

// Función genérica para mostrar la vista seleccionada
function mostrarVista(vistaId) {
    const vistas = ['formulario', 'tareas-jeyson', 'tareas-cristian', 'tareas-angeli'];
    vistas.forEach(vista => {
        document.getElementById(vista).style.display = (vista === vistaId) ? 'block' : 'none';
    });
}

// Configuración de eventos de las vistas
function configurarEventosVistas() {
    document.querySelector('#inicio').addEventListener('click', () => {
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
}

// Cargar tareas desde Firebase
async function cargarTareas() {
    try {
        const querySnapshot = await getDocs(collection(db, 'tareas'));
        querySnapshot.forEach(doc => {
            const tarea = doc.data();
            const persona = tarea.persona;

            // Evitar duplicados verificando si el ID ya existe en la lista
            if (!LIST[persona].some(t => t.id === tarea.id)) {
                LIST[persona].push({ ...tarea, firebaseId: doc.id });
                agregarTarea(tarea.nombre, tarea.id, tarea.realizado, tarea.eliminado, tarea.startDate, tarea.endDate, tarea.details, tarea.status, tarea.persona);
            }
        });
    } catch (error) {
        console.error("Error al cargar tareas: ", error);
    }
}


// Añadir eventos para marcar tareas como realizadas o eliminadas
document.addEventListener('click', function(event) {
    if (event.target.dataset.eliminado !== undefined) {
        tareaEliminada(event.target);
    } else if (event.target.dataset.realizado !== undefined) {
        tareaRealizada(event.target);
    }
});

// Inicialización
configurarEventosVistas();
cargarTareas();




















