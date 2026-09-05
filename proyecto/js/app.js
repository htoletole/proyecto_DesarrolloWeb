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

// Sección 3: Ramos
// Datos temporales.
// Se reemplazarán por los datos de actividades de la Sección 1.
const datosRamosSeccion3 = [
  {
    nombre: "Minería de datos",
    progreso: 70,
    nota: "Aún no hay notas",
    actividad: "Control 1",
    fecha: "10/09/2026",
    pendientes: 3,
    colorBarra: "bg-success",
    colorPendientes: "text-bg-warning"
  },
  {
    nombre: "Fundamentos de inteligencia artificial",
    progreso: 50,
    nota: "6,0",
    actividad: "Trabajo grupal",
    fecha: "12/09/2026",
    pendientes: 2,
    colorBarra: "bg-danger",
    colorPendientes: "text-bg-danger"
  },
  {
    nombre: "Infraestructura TI",
    progreso: 80,
    nota: "Aún no hay notas",
    actividad: "Presentación",
    fecha: "15/09/2026",
    pendientes: 1,
    colorBarra: "bg-primary",
    colorPendientes: "text-bg-success"
  },
  {
    nombre: "Desarrollo web y móvil",
    progreso: 90,
    nota: "Aún no hay notas",
    actividad: "Informe",
    fecha: "18/09/2026",
    pendientes: 0,
    colorBarra: "bg-info",
    colorPendientes: "text-bg-secondary"
  }
];

function obtenerTextoPendientesRamos(cantidad) {
  if (cantidad === 0) {
    return "Sin pendientes";
  }

  if (cantidad === 1) {
    return "1 pendiente";
  }

  return cantidad + " pendientes";
}


function mostrarActividadesRamo(ramo) {
  alert(
    ramo.nombre +
    "\nPróxima actividad: " + ramo.actividad +
    "\nFecha: " + ramo.fecha +
    "\nPendientes: " + obtenerTextoPendientesRamos(ramo.pendientes)
  );
}


function cargarRamosSeccion3() {
  const seccionRamos = document.querySelector(".seccion-ramos");

  if (!seccionRamos) {
    return;
  }

  const tarjetas = seccionRamos.querySelectorAll(".tarjeta-ramo");

  tarjetas.forEach((tarjeta, indice) => {
    const ramo = datosRamosSeccion3[indice];

    if (!ramo) {
      return;
    }

    // Nombre del ramo
    const titulo = tarjeta.querySelector(".card-title");

    if (titulo) {
      titulo.textContent = ramo.nombre;
    }


    // Barra de progreso
    const barra = tarjeta.querySelector(".progress-bar");

    if (barra) {
      barra.style.width = ramo.progreso + "%";

      barra.classList.remove(
        "bg-success",
        "bg-danger",
        "bg-primary",
        "bg-info"
      );

      barra.classList.add(ramo.colorBarra);
    }


    // Porcentaje de progreso
    const porcentaje = tarjeta.querySelector(".texto-progreso + p");

    if (porcentaje) {
      porcentaje.textContent = ramo.progreso + " %";
    }


    // Nota de presentación
    const nota = tarjeta.querySelector(".texto-nota + p");

    if (nota) {
      nota.textContent = ramo.nota;
    }


    // Próxima actividad y fecha
    const datos = tarjeta.querySelectorAll(".nombre-dato");

    if (datos.length >= 2) {
      datos[0].nextElementSibling.textContent = ramo.actividad;
      datos[1].nextElementSibling.textContent = ramo.fecha;
    }


    // Cantidad de pendientes
    const badge = tarjeta.querySelector(".badge");

    if (badge) {
      badge.textContent = obtenerTextoPendientesRamos(ramo.pendientes);

      badge.classList.remove(
        "text-bg-warning",
        "text-bg-danger",
        "text-bg-success",
        "text-bg-secondary"
      );

      badge.classList.add(ramo.colorPendientes);
    }


    // Botón Ver actividades
    const boton = tarjeta.querySelector("button.btn");

    if (boton) {
      boton.onclick = () => {
        mostrarActividadesRamo(ramo);
      };
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", cargarRamosSeccion3);
} else {
  cargarRamosSeccion3();
}

//Seccion 4, datos simulados, seleccion de elementos 
const datosEvaluaciones = 
[
  { 
    evaluacion: "Control 1", 
    fecha: "Fecha1", 
    ramo: "Mineria de datos", 
    modalidad: "Online", 
    color: "text-success", 
    nota: "6.7" 
  },
  { 
    evaluacion: " Proyecto 1A", 
    fecha: "Fecha", 
    ramo: "Fundamentos de inteligencia artificial", 
    modalidad: "Asincronica", 
    color: "text-secondary", 
    nota: "6.9" 
  },
  { 
    evaluacion: "Control 3 ", 
    fecha: "Fecha", 
    ramo: " Infraestructura TI", 
    modalidad: "Presencial", 
    color: "text-danger", 
    nota: "4.2" 
  },
  { 
    evaluacion: "Trabajo 1", 
    fecha: "Fecha", 
    ramo: "Desarrollo web y movil ",
    modalidad: "Online",  
    color: "text-success", 
    nota: "7.0" 
  }
];


const cuerpoTabla = document.getElementById("cuerpoTabla");
const btnTodo = document.getElementById("btnTodo");
const btnIA = document.getElementById("btnIA");
const btnWeb = document.getElementById("btnWeb");
const btnInfra = document.getElementById("btnInfra");
const btnMineria = document.getElementById("btnMineria");

function hacer_tabla(array_datos) {
  cuerpoTabla.innerHTML = "";
  array_datos.forEach((item) => {
  const fila = document.createElement("tr");
  fila.innerHTML = 
  `
  <td>${item.evaluacion}</td>
  <td>${item.fecha}</td>
  <td><span></span> ${item.ramo}</td>
  <td><span class="${item.color} fw-bold">${item.modalidad}</span></td>
  <td>${item.nota}</td>
  `;
    cuerpoTabla.appendChild(fila);
  });
}

// eventos

btnTodo.addEventListener("click", () => {
  hacer_tabla(datosEvaluaciones);
});

btnIA.addEventListener("click", () => {
  const filtrados = datosEvaluaciones.filter((item) => item.ramo === "Fundamentos de inteligencia artificial");
  hacer_tabla(filtrados);
});

btnWeb.addEventListener("click", () => {
  const filtrados = datosEvaluaciones.filter((item) => item.ramo === "Desarrollo web y movil ");
  hacer_tabla(filtrados);
});

btnInfra.addEventListener("click", () => {
  const filtrados = datosEvaluaciones.filter((item) => item.ramo === " Infraestructura TI");
  hacer_tabla(filtrados);
});

btnMineria.addEventListener("click", () => {
  const filtrados = datosEvaluaciones.filter((item) => item.ramo === "Mineria de datos");
  hacer_tabla(filtrados);
});

hacer_tabla(datosEvaluaciones);
