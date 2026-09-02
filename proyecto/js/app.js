// Lista temporal de evaluaciones
const evaluaciones = [
  {
    evaluacion: 'Trabajo 1',
    fecha: new Date(2026, 8, 12),
    ramo: 'Desarrollo web y móvil',
    modalidad: "Presencial"
  },
  {
    evaluacion: 'Trabajo 2',
    fecha: new Date(2026, 8, 3),
    ramo: 'Desarrollo web y móvil',
    modalidad: 'Online'
  }
];

// Lista temporal de tareas
const tareas = [
  {
    tarea: 'Tarea 1',
    fechaLimite: new Date(2026, 8, 3),
    prioridad: 'Urgente',
    tiempoEstimado: '1h 30m'
  },
  {
    tarea: 'Tarea 2',
    fechaLimite: new Date(2026, 8, 15),
    prioridad: 'Baja',
    tiempoEstimado: '1h'
  }
];

// Ordenar por fecha desde la más cercana a la más lejana
evaluacionesOrdenadas = evaluaciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
tareasOrdenadas = tareas.sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite));

// Funcionalidad de la tabla próximo
const btnSeleccionProximo = document.querySelector('.seleccionProximo');

let periodoProximo = 14;
const inputDias = document.getElementById('proximosDias');
inputDias.value = periodoProximo;

function calcularDiasRestantes(fechaProxima) {
  const hoy = new Date();

  const diferenciaMs = fechaProxima - hoy;
  const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  return diasRestantes;
}

let periodoProximoEval = evaluacionesOrdenadas.filter(item => {
  const dias = calcularDiasRestantes(item.fecha);
  return dias >= 0 && dias <= periodoProximo;
});

let periodoProximoTarea = tareasOrdenadas.filter(item => {
  const dias = calcularDiasRestantes(item.fechaLimite);
  return dias >= 0 && dias <= periodoProximo;
});

function mostrarEvaluaciones() {
  const headerTabla = document.getElementById('headProximo');
  headerTabla.innerHTML = '';

  const header = document.createElement('tr');

  const headEvaluacion = document.createElement('th');
  headEvaluacion.textContent = 'Evaluación';
  headEvaluacion.scope = 'col';

  const headFecha = document.createElement('th');
  headFecha.textContent = 'Fecha';
  headFecha.scope = 'col';

  const headRamo = document.createElement('th');
  headRamo.textContent = 'Ramo';
  headRamo.scope = 'col';

  const headModalidad = document.createElement('th');
  headModalidad.textContent = 'Modalidad';
  headModalidad.scope = 'col';

  header.appendChild(headEvaluacion);
  header.appendChild(headFecha);
  header.appendChild(headRamo);
  header.appendChild(headModalidad);

  headerTabla.appendChild(header);

  const cuerpoTabla = document.getElementById('bodyProximo');
  cuerpoTabla.innerHTML = '';

  periodoProximoEval.forEach(item => {
    const fechaString = item.fecha.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const fila = document.createElement('tr');

    const thEvaluacion = document.createElement('th');
    thEvaluacion.scope = 'row';
    thEvaluacion.textContent = item.evaluacion;

    const tdFecha = document.createElement('td');
    tdFecha.textContent = fechaString;

    const tdRamo = document.createElement('td');
    tdRamo.textContent = item.ramo;

    const tdModalidad = document.createElement('td');
    tdModalidad.textContent = item.modalidad;

    fila.appendChild(thEvaluacion);
    fila.appendChild(tdFecha);
    fila.appendChild(tdRamo);
    fila.appendChild(tdModalidad);

    cuerpoTabla.appendChild(fila);
  })
}

function mostrarTareas() {
  const headerTabla = document.getElementById('headProximo');
  headerTabla.innerHTML = '';

  const header = document.createElement('tr');

  const headTarea = document.createElement('th');
  headTarea.textContent = 'Tarea';
  headTarea.scope = 'col';

  const headFechaLimite = document.createElement('th');
  headFechaLimite.textContent = 'Fecha Límite';
  headFechaLimite.scope = 'col';

  const headPrioridad = document.createElement('th');
  headPrioridad.textContent = 'Prioridad';
  headPrioridad.scope = 'col';

  const headTiempo = document.createElement('th');
  headTiempo.textContent = 'Tiempo Estimado';
  headTiempo.scope = 'col';

  header.appendChild(headTarea);
  header.appendChild(headFechaLimite);
  header.appendChild(headPrioridad);
  header.appendChild(headTiempo);

  headerTabla.appendChild(header);

  const cuerpoTabla = document.getElementById('bodyProximo');
  cuerpoTabla.innerHTML = '';

  periodoProximoTarea.forEach(item => {
    const fechaString = item.fechaLimite.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const fila = document.createElement('tr');

    const tdTarea = document.createElement('th');
    tdTarea.scope = 'row';
    tdTarea.textContent = item.tarea;

    const tdFechaLimite = document.createElement('td');
    tdFechaLimite.textContent = fechaString;

    const tdPrioridad = document.createElement('td');
    tdPrioridad.textContent = item.prioridad;

    const tdTiempo = document.createElement('td');
    tdTiempo.textContent = item.tiempoEstimado;

    fila.appendChild(tdTarea);
    fila.appendChild(tdFechaLimite);
    fila.appendChild(tdPrioridad);
    fila.appendChild(tdTiempo);

    cuerpoTabla.appendChild(fila);
  })
}

mostrarEvaluaciones();

const btnEvaluaciones = document.querySelector('.btnEvaluaciones');
btnEvaluaciones.addEventListener('click', () => {
  btnSeleccionProximo.textContent = 'Evaluaciones';
  mostrarEvaluaciones();
});

const btnTareas = document.querySelector('.btnTareas');
btnTareas.addEventListener('click', () => {
  btnSeleccionProximo.textContent = 'Tareas';
  mostrarTareas();
});

inputDias.addEventListener('change', (e) => {
  periodoProximo = e.target.valueAsNumber || 0;
  
  periodoProximoEval = evaluacionesOrdenadas.filter(item => {
    const dias = calcularDiasRestantes(item.fecha);
    return dias >= 0 && dias <= periodoProximo;
  });
  periodoProximoTarea = tareasOrdenadas.filter(item => {
    const dias = calcularDiasRestantes(item.fechaLimite);
    return dias >= 0 && dias <= periodoProximo;
  });

  if (btnSeleccionProximo.textContent == 'Evaluaciones') {
    mostrarEvaluaciones();
  } else {
    mostrarTareas();
  }
});


// Funcionalidad de la lista de eventos
const eventos = document.getElementById('listaEventos');

function ajustarAltura(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

function crearNuevoEvento() {
  const nuevoLi = document.createElement('li');
  const nuevoEvento = document.createElement('textarea');
  const botonEliminar = document.createElement('button');

  nuevoEvento.rows = '1';
  nuevoEvento.className = 'nuevoEvento';
  nuevoEvento.placeholder = 'Ingrese un evento...';

  nuevoEvento.addEventListener('input', (e) => {
    ajustarAltura(e.target);
  });

  botonEliminar.textContent = 'X';
  botonEliminar.className = 'btn btn-outline-secondary btn-sm btnEliminar';

  botonEliminar.addEventListener('click', () => {
    const cantEventos = eventos.querySelectorAll('li').length;
    if (cantEventos > 1) {
      nuevoLi.remove();
    } else {
      nuevoEvento.value = '';
      nuevoEvento.style.height = 'auto';
    }
  });

  nuevoLi.className = 'list-group-item itemEvento';
  nuevoLi.appendChild(nuevoEvento);
  nuevoLi.appendChild(botonEliminar);
  eventos.appendChild(nuevoLi);

  nuevoEvento.focus();
}

const primerEvento = eventos.querySelector('li');
if (primerEvento) {
  const primerInput = primerEvento.querySelector('.nuevoEvento');
  const botonEliminar = primerEvento.querySelector('.btnEliminar');

  botonEliminar.addEventListener('click', () => {
    const cantEventos = eventos.querySelectorAll('li').length;
    if (cantEventos > 1) {
      primerEvento.remove();
    } else {
      primerInput.value = '';
      primerInput.style.height = 'auto';
    }
  });
}

const botonAgregar = document.querySelector('.agregarEvento');
botonAgregar.addEventListener('click', (e) => {
  crearNuevoEvento();
})

console.log('JavaScript funcionandooo');