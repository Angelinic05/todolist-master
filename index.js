const fecha = document.querySelector('#fecha')
const listaJeyson = document.querySelector('#lista-jeyson')
const listaCristian = document.querySelector('#lista-cristian')
const listaAngeli = document.querySelector('#lista-angeli')
const input = document.querySelector('#input')
const startDate = document.querySelector('#start-date')
const endDate = document.querySelector('#end-date')
const details = document.querySelector('#details')
const status = document.querySelector('#status')
const persona = document.querySelector('#persona')
const botonEnter = document.querySelector('#boton-enter')

let LIST = {
    Jeyson: [],
    Cristian: [],
    Angeli: []
}
let id = 0

// Función para actualizar la fecha
const FECHA = new Date()
fecha.innerHTML = FECHA.toLocaleDateString('es-MX', { weekday: 'long', month: 'short', day: 'numeric' })

// Función para agregar tarea
function agregarTarea(tarea, id, realizado, eliminado, startDate, endDate, details, status, persona) {
    if (eliminado) { return }

    const REALIZADO = realizado ? 'fa-check-circle' : 'fa-circle'
    const LINE = realizado ? 'line-through' : ''

    const elemento = `
        <li id="elemento">
            <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
            <p class="text ${LINE}">${tarea}</p>
            <p class="fecha">Desde: ${startDate} Hasta: ${endDate}</p>
            <p class="detalles">${details}</p>
            <p class="estado">${status}</p>
            <i class="fas fa-trash de" data="eliminado" id="${id}"></i> 
        </li>
    `

    if (persona === 'Jeyson') {
        listaJeyson.insertAdjacentHTML("beforeend", elemento)
    } else if (persona === 'Cristian') {
        listaCristian.insertAdjacentHTML("beforeend", elemento)
    } else if (persona === 'Angeli') {
        listaAngeli.insertAdjacentHTML("beforeend", elemento)
    }
}

// Función para manejar tarea realizada
function tareaRealizada(element) {
    element.classList.toggle('fa-check-circle')
    element.classList.toggle('fa-circle')
    element.parentNode.querySelector('.text').classList.toggle('line-through')
    LIST[element.id].realizado = LIST[element.id].realizado ? false : true
}

// Función para eliminar tarea
function tareaEliminada(element) {
    element.parentNode.parentNode.removeChild(element.parentNode)
    LIST[element.id].eliminado = true
}

// Evento para agregar tarea
botonEnter.addEventListener('click', () => {
    const tarea = input.value
    const start = startDate.value
    const end = endDate.value
    const detail = details.value
    const taskStatus = status.value
    const selectedPersona = persona.value

    if (tarea) {
        agregarTarea(tarea, id, false, false, start, end, detail, taskStatus, selectedPersona)
        LIST[selectedPersona].push({
            nombre: tarea,
            id: id,
            realizado: false,
            eliminado: false,
            startDate: start,
            endDate: end,
            details: detail,
            status: taskStatus
        })
        localStorage.setItem('TODO', JSON.stringify(LIST))
        id++
        input.value = ''
        startDate.value = ''
        endDate.value = ''
        details.value = ''
        status.value = 'Pendiente'
    }
})

// Cambiar de vista al seleccionar el menú
document.querySelector('#inicio').addEventListener('click', () => {
    document.getElementById('formulario').style.display = 'block'
    document.getElementById('tareas-jeyson').style.display = 'none'
    document.getElementById('tareas-cristian').style.display = 'none'
    document.getElementById('tareas-angeli').style.display = 'none'
})

document.querySelector('#jeyson').addEventListener('click', () => {
    document.getElementById('formulario').style.display = 'none'
    document.getElementById('tareas-jeyson').style.display = 'block'
    document.getElementById('tareas-cristian').style.display = 'none'
    document.getElementById('tareas-angeli').style.display = 'none'
})

document.querySelector('#cristian').addEventListener('click', () => {
    document.getElementById('formulario').style.display = 'none'
    document.getElementById('tareas-jeyson').style.display = 'none'
    document.getElementById('tareas-cristian').style.display = 'block'
    document.getElementById('tareas-angeli').style.display = 'none'
})

document.querySelector('#angeli').addEventListener('click', () => {
    document.getElementById('formulario').style.display = 'none'
    document.getElementById('tareas-jeyson').style.display = 'none'
    document.getElementById('tareas-cristian').style.display = 'none'
    document.getElementById('tareas-angeli').style.display = 'block'
})

// Cargar tareas desde localStorage
let data = localStorage.getItem('TODO')
if (data) {
    LIST = JSON.parse(data)
    id = LIST.Jeyson.length + LIST.Cristian.length + LIST.Angeli.length

    LIST.Jeyson.forEach(tarea => agregarTarea(tarea.nombre, tarea.id, tarea.realizado, tarea.eliminado, tarea.startDate, tarea.endDate, tarea.details, tarea.status, 'Jeyson'))
    LIST.Cristian.forEach(tarea => agregarTarea(tarea.nombre, tarea.id, tarea.realizado, tarea.eliminado, tarea.startDate, tarea.endDate, tarea.details, tarea.status, 'Cristian'))
    LIST.Angeli.forEach(tarea => agregarTarea(tarea.nombre, tarea.id, tarea.realizado, tarea.eliminado, tarea.startDate, tarea.endDate, tarea.details, tarea.status, 'Angeli'))
}

// Añadir eventos para marcar tareas como realizadas o eliminadas
document.addEventListener('click', function(event) {
    if (event.target.dataset.eliminado) {
        tareaEliminada(event.target)
    } else if (event.target.dataset.realizado) {
        tareaRealizada(event.target)
    }
})
