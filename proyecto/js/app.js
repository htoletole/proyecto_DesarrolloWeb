const asignaturas = [
  "Minería de Datos",
  "Fundamentos de Inteligencia Artificial",
  "Infraestructura TI",
  "Desarrollo Web y Móvil"
];
 
let contadorId = 1;
let actividades = [
  { id: contadorId++, nombre: "Preprocesamiento de datos", descripcion: "Dejar lista la limpieza de datos para el próximo control.", asignatura: asignaturas[0], fecha: "2026-09-08", estado: "progreso" },
  { id: contadorId++, nombre: "Laberinto con búsqueda", descripcion: "Implementar algoritmos de búsqueda para el proyecto.", asignatura: asignaturas[1], fecha: "2026-08-30", estado: "completada" },
  { id: contadorId++, nombre: "Configuración de servidor", descripcion: "Dejar listo el laboratorio de infraestructura.", asignatura: asignaturas[2], fecha: "2026-09-06", estado: "pendiente" }
];
 
(function () {
  let filtroAsignaturaActual = "todas";
  let filtroEstadoActual = "todos";
  let idArrastrando = null;
 
  const selectFiltroAsignatura = document.getElementById("filtroAsignatura");
  const selectFiltroEstado = document.getElementById("filtroEstado");
  const selectCampoAsignatura = document.getElementById("campoAsignatura");
  const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");
  const btnNueva = document.getElementById("btnNueva");
  const btnEliminar = document.getElementById("btnEliminar");
  const formActividad = document.getElementById("formActividad");
  const modalTitulo = document.getElementById("modalTitulo");
  const barraAvance = document.getElementById("barraAvance");
  const modalActividad = new bootstrap.Modal(document.getElementById("modalActividad"));
 
  const columnas = {
    pendiente: document.getElementById("colPendiente"),
    progreso: document.getElementById("colProgreso"),
    completada: document.getElementById("colCompletada")
  };
  const contadores = {
    pendiente: document.getElementById("countPendiente"),
    progreso: document.getElementById("countProgreso"),
    completada: document.getElementById("countCompletada")
  };
 
  function llenarSelectsAsignatura() {
    for (let i = 0; i < asignaturas.length; i++) {
      const opcion1 = document.createElement("option");
      opcion1.value = asignaturas[i];
      opcion1.textContent = asignaturas[i];
      selectFiltroAsignatura.appendChild(opcion1);
 
      const opcion2 = document.createElement("option");
      opcion2.value = asignaturas[i];
      opcion2.textContent = asignaturas[i];
      selectCampoAsignatura.appendChild(opcion2);
    }
  }
 
  function diasParaFecha(fechaTexto) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha = new Date(fechaTexto + "T00:00:00");
    return Math.round((fecha - hoy) / (1000 * 60 * 60 * 24));
  }
 
  function textoFecha(actividad) {
    if (actividad.estado === "completada") {
      return "Entregada";
    }
    const dias = diasParaFecha(actividad.fecha);
    if (dias < 0) {
      return "Vencida hace " + Math.abs(dias) + " día(s)";
    } else if (dias === 0) {
      return "Vence hoy";
    } else {
      return "Vence en " + dias + " día(s)";
    }
  }
 
  function estaPorVencer(actividad) {
    return actividad.estado !== "completada" && diasParaFecha(actividad.fecha) <= 3;
  }
 
  function obtenerActividadesFiltradas() {
    const resultado = [];
    for (let i = 0; i < actividades.length; i++) {
      const a = actividades[i];
      const pasaAsignatura = filtroAsignaturaActual === "todas" || a.asignatura === filtroAsignaturaActual;
      const pasaEstado = filtroEstadoActual === "todos" || a.estado === filtroEstadoActual;
      if (pasaAsignatura && pasaEstado) {
        resultado.push(a);
      }
    }
    return resultado;
  }
 
  function crearTarjeta(actividad) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "card-activity p-3" + (estaPorVencer(actividad) ? " due-soon" : "");
    tarjeta.draggable = true;
    tarjeta.dataset.id = actividad.id;
 
    const descripcionHtml = actividad.descripcion ? "<p class='small text-muted mb-2'>" + actividad.descripcion + "</p>" : "";
 
    tarjeta.innerHTML =
      "<div class='d-flex justify-content-between align-items-start gap-2 mb-2'>" +
      "  <h3 class='h6 mb-0'>" + actividad.nombre + "</h3>" +
      "  <span class='subject-badge badge'>" + actividad.asignatura + "</span>" +
      "</div>" +
      descripcionHtml +
      "<div class='d-flex justify-content-between align-items-center'>" +
      "  <span class='due-badge text-muted'>" + textoFecha(actividad) + "</span>" +
      "  <button type='button' class='btn btn-sm btn-outline-secondary btn-editar'>Editar</button>" +
      "</div>";
 
    tarjeta.addEventListener("dragstart", function () {
      idArrastrando = actividad.id;
      tarjeta.classList.add("dragging");
    });
    tarjeta.addEventListener("dragend", function () {
      tarjeta.classList.remove("dragging");
      idArrastrando = null;
    });
    tarjeta.querySelector(".btn-editar").addEventListener("click", function () {
      abrirModalEditar(actividad.id);
    });
 
    return tarjeta;
  }
 
  function dibujarTablero() {
    const visibles = obtenerActividadesFiltradas();
    const estados = ["pendiente", "progreso", "completada"];
    let completadas = 0;
    let porVencer = 0;
 
    for (let i = 0; i < estados.length; i++) {
      const estado = estados[i];
      const columna = columnas[estado];
      columna.innerHTML = "";
 
      const actividadesDelEstado = [];
      for (let j = 0; j < visibles.length; j++) {
        if (visibles[j].estado === estado) {
          actividadesDelEstado.push(visibles[j]);
        }
      }
 
      if (actividadesDelEstado.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "empty-note p-3 text-center mb-0";
        vacio.textContent = "Sin actividades en esta columna.";
        columna.appendChild(vacio);
      } else {
        for (let k = 0; k < actividadesDelEstado.length; k++) {
          columna.appendChild(crearTarjeta(actividadesDelEstado[k]));
        }
      }
 
      contadores[estado].textContent = actividadesDelEstado.length;
    }
 
    for (let v = 0; v < visibles.length; v++) {
      if (visibles[v].estado === "completada") completadas++;
      if (estaPorVencer(visibles[v])) porVencer++;
    }
 
    const avance = visibles.length > 0 ? Math.round((completadas / visibles.length) * 100) : 0;
    document.getElementById("statTotal").textContent = visibles.length;
    document.getElementById("statVencen").textContent = porVencer;
    document.getElementById("statAvance").textContent = avance + "%";
    barraAvance.style.width = avance + "%";
    barraAvance.setAttribute("aria-valuenow", avance);
  }
 
  function buscarActividadPorId(id) {
    for (let i = 0; i < actividades.length; i++) {
      if (actividades[i].id === id) {
        return actividades[i];
      }
    }
    return null;
  }
 
  function abrirModalNueva() {
    formActividad.reset();
    document.getElementById("actividadId").value = "";
    modalTitulo.textContent = "Nueva actividad";
    btnEliminar.classList.add("d-none");
    document.getElementById("campoEstado").value = "pendiente";
  }
 
  function abrirModalEditar(id) {
    const actividad = buscarActividadPorId(id);
    if (!actividad) {
      return;
    }
    document.getElementById("actividadId").value = actividad.id;
    document.getElementById("campoNombre").value = actividad.nombre;
    document.getElementById("campoDescripcion").value = actividad.descripcion;
    document.getElementById("campoAsignatura").value = actividad.asignatura;
    document.getElementById("campoFecha").value = actividad.fecha;
    document.getElementById("campoEstado").value = actividad.estado;
    modalTitulo.textContent = "Editar actividad";
    btnEliminar.classList.remove("d-none");
    modalActividad.show();
  }
 
  selectFiltroAsignatura.addEventListener("change", function () {
    filtroAsignaturaActual = selectFiltroAsignatura.value;
    dibujarTablero();
  });
 
  selectFiltroEstado.addEventListener("change", function () {
    filtroEstadoActual = selectFiltroEstado.value;
    dibujarTablero();
  });
 
  btnLimpiarFiltros.addEventListener("click", function () {
    filtroAsignaturaActual = "todas";
    filtroEstadoActual = "todos";
    selectFiltroAsignatura.value = "todas";
    selectFiltroEstado.value = "todos";
    dibujarTablero();
  });
 
  btnNueva.addEventListener("click", abrirModalNueva);
 
  formActividad.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!formActividad.checkValidity()) {
      formActividad.reportValidity();
      return;
    }
 
    const id = document.getElementById("actividadId").value;
    const nombre = document.getElementById("campoNombre").value;
    const descripcion = document.getElementById("campoDescripcion").value;
    const asignatura = document.getElementById("campoAsignatura").value;
    const fecha = document.getElementById("campoFecha").value;
    const estado = document.getElementById("campoEstado").value;
 
    if (id) {
      const actividad = buscarActividadPorId(Number(id));
      actividad.nombre = nombre;
      actividad.descripcion = descripcion;
      actividad.asignatura = asignatura;
      actividad.fecha = fecha;
      actividad.estado = estado;
    } else {
      actividades.push({ id: contadorId++, nombre: nombre, descripcion: descripcion, asignatura: asignatura, fecha: fecha, estado: estado });
    }
 
    dibujarTablero();
    cargarRamosSeccion3();
    modalActividad.hide();
  });
 
  btnEliminar.addEventListener("click", function () {
    const id = Number(document.getElementById("actividadId").value);
    actividades = actividades.filter(function (a) {
      return a.id !== id;
    });
    dibujarTablero();
    cargarRamosSeccion3();
    modalActividad.hide();
  });
 
  const estadosColumna = ["pendiente", "progreso", "completada"];
  for (let i = 0; i < estadosColumna.length; i++) {
    const estado = estadosColumna[i];
    const columna = columnas[estado];
 
    columna.addEventListener("dragover", function (evento) {
      evento.preventDefault();
      columna.classList.add("drag-over");
    });
    columna.addEventListener("dragleave", function () {
      columna.classList.remove("drag-over");
    });
    columna.addEventListener("drop", function (evento) {
      evento.preventDefault();
      columna.classList.remove("drag-over");
      if (idArrastrando === null) {
        return;
      }
      const actividad = buscarActividadPorId(idArrastrando);
      if (actividad) {
        actividad.estado = estado;
        dibujarTablero();
        cargarRamosSeccion3();
      }
      idArrastrando = null;
    });
  }
 
  llenarSelectsAsignatura();
  dibujarTablero();
})();
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
 
evaluacionesOrdenadas = evaluaciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
tareasOrdenadas = tareas.sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite));
 
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
const datosRamosSeccion3 = [
  {
    nombre: "Minería de Datos",
    nota: "Aún no hay notas",
    colorBarra: "bg-success"
  },
  {
    nombre: "Fundamentos de Inteligencia Artificial",
    nota: "Aún no hay notas",
    colorBarra: "bg-danger"
  },
  {
    nombre: "Infraestructura TI",
    nota: "Aún no hay notas",
    colorBarra: "bg-primary"
  },
  {
    nombre: "Desarrollo Web y Móvil",
    nota: "Aún no hay notas",
    colorBarra: "bg-info"
  }
];
 
function obtenerActividadesRamo(nombreRamo) {
  return actividades.filter(function (actividad) {
    return actividad.asignatura === nombreRamo;
  });
}
 
function obtenerTextoPendientesRamos(cantidad) {
  if (cantidad === 0) {
    return "Sin pendientes";
  }
 
  if (cantidad === 1) {
    return "1 pendiente";
  }
 
  return cantidad + " pendientes";
}
 
function calcularProgresoRamo(actividadesRamo) {
  if (actividadesRamo.length === 0) {
    return 0;
  }
 
  const completadas = actividadesRamo.filter(function (actividad) {
    return actividad.estado === "completada";
  }).length;
 
  return Math.round((completadas / actividadesRamo.length) * 100);
}
 
function obtenerProximaActividadRamo(actividadesRamo) {
  const pendientes = actividadesRamo.filter(function (actividad) {
    return actividad.estado !== "completada";
  });
 
  pendientes.sort(function (a, b) {
    return new Date(a.fecha) - new Date(b.fecha);
  });
 
  if (pendientes.length === 0) {
    return null;
  }
 
  return pendientes[0];
}
 
function formatearFechaRamos(fechaTexto) {
  if (!fechaTexto) {
    return "-";
  }
 
  const partes = fechaTexto.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}
 
function obtenerColorPendientesRamos(cantidad) {
  if (cantidad === 0) {
    return "text-bg-success";
  }
 
  if (cantidad <= 2) {
    return "text-bg-warning";
  }
 
  return "text-bg-danger";
}
 
function obtenerTextoEstadoRamos(estado) {
  if (estado === "pendiente") {
    return "Pendiente";
  }
 
  if (estado === "progreso") {
    return "En progreso";
  }
 
  return "Completada";
}
 
function mostrarActividadesRamo(ramo) {
  const actividadesRamo = obtenerActividadesRamo(ramo.nombre);
 
  if (actividadesRamo.length === 0) {
    alert(ramo.nombre + "\n\nNo hay actividades registradas.");
    return;
  }
 
  actividadesRamo.sort(function (a, b) {
    return new Date(a.fecha) - new Date(b.fecha);
  });
 
  let mensaje = ramo.nombre + "\n\nActividades:\n";
 
  actividadesRamo.forEach(function (actividad) {
    mensaje +=
      "- " + actividad.nombre +
      " | " + obtenerTextoEstadoRamos(actividad.estado) +
      " | " + formatearFechaRamos(actividad.fecha) +
      "\n";
  });
 
  alert(mensaje);
}
 
function cargarRamosSeccion3() {
  if (typeof actividades === "undefined") {
    return;
  }
 
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
 
    const actividadesRamo = obtenerActividadesRamo(ramo.nombre);
 
    const pendientes = actividadesRamo.filter(function (actividad) {
      return actividad.estado !== "completada";
    }).length;
 
    const progreso = calcularProgresoRamo(actividadesRamo);
    const proximaActividad = obtenerProximaActividadRamo(actividadesRamo);
 
    // Nombre del ramo
    const titulo = tarjeta.querySelector(".card-title");
 
    if (titulo) {
      titulo.textContent = ramo.nombre;
    }
 
    // Barra de progreso
    const barra = tarjeta.querySelector(".progress-bar");
 
    if (barra) {
      barra.style.width = progreso + "%";
      barra.setAttribute("aria-valuenow", progreso);
 
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
      porcentaje.textContent = progreso + " %";
    }
 
    // Nota de presentación
    const nota = tarjeta.querySelector(".texto-nota + p");
 
    if (nota) {
      nota.textContent = ramo.nota;
    }
 
    // Próxima actividad y fecha
    const datos = tarjeta.querySelectorAll(".nombre-dato");
 
    if (datos.length >= 2) {
      if (proximaActividad) {
        datos[0].nextElementSibling.textContent = proximaActividad.nombre;
        datos[1].nextElementSibling.textContent =
          formatearFechaRamos(proximaActividad.fecha);
      } else if (actividadesRamo.length === 0) {
        datos[0].nextElementSibling.textContent = "Sin actividades registradas";
        datos[1].nextElementSibling.textContent = "-";
      } else {
        datos[0].nextElementSibling.textContent = "Sin actividades pendientes";
        datos[1].nextElementSibling.textContent = "-";
      }
    }
 
    // Cantidad de pendientes
    const badge = tarjeta.querySelector(".badge");
 
    if (badge) {
      badge.textContent = obtenerTextoPendientesRamos(pendientes);
 
      badge.classList.remove(
        "text-bg-warning",
        "text-bg-danger",
        "text-bg-success",
        "text-bg-secondary"
      );
 
      badge.classList.add(obtenerColorPendientesRamos(pendientes));
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
 
cargarRamosSeccion3();
 
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
