const asignaturas = [
  "Minería de Datos",
  "Fundamentos de Inteligencia Artificial",
  "Infraestructura TI",
  "Desarrollo Web y Móvil"
];

let contadorId = 1;
let actividades = [];

(function () {
  let filtroAsignaturaActual = "todas";
  let filtroEstadoActual = "todos";

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
    mostrarEvaluaciones();
    modalActividad.hide();
  });

  btnEliminar.addEventListener("click", function () {
    const id = Number(document.getElementById("actividadId").value);
    actividades = actividades.filter(function (a) {
      return a.id !== id;
    });
    dibujarTablero();
    cargarRamosSeccion3();
    mostrarEvaluaciones()
    modalActividad.hide();
  });

  llenarSelectsAsignatura();
  dibujarTablero();
})();

const btnSeleccionProximo = document.querySelector('.seleccionProximo');

let periodoProximo = 14;
const inputDias = document.getElementById('proximosDias');
inputDias.value = periodoProximo;

function calcularDiasRestantes(fechaProxima) {
  const hoy = new Date();
  const fechaProximaDate = new Date(fechaProxima);
  const diferenciaMs = fechaProximaDate - hoy;
  const diasRestantes = Math.ceil((diferenciaMs / (1000 * 60 * 60 * 24)) + 1);
  return diasRestantes;
}

function mostrarEvaluaciones() {
  if (actividades.length === 0) {
    const cuerpoTabla = document.getElementById('bodyProximo');
    cuerpoTabla.innerHTML = '';
    const filaVacia = document.createElement('tr');
    const tdVacio = document.createElement('td');
    tdVacio.colSpan = 4;
    tdVacio.textContent = 'No hay actividades registradas.';
    filaVacia.appendChild(tdVacio);
    cuerpoTabla.appendChild(filaVacia);
    return;
  }

  const evaluacionesPendientes = actividades.filter(item => item.estado !== 'completada');
  const periodoProximoEval = evaluacionesPendientes.filter(item => {
    const dias = calcularDiasRestantes(item.fecha);
    return dias >= 0 && dias <= periodoProximo;
  });
  const periodoProximoOrdenado = periodoProximoEval.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const cuerpoTabla = document.getElementById('bodyProximo');
  cuerpoTabla.innerHTML = '';
  periodoProximoOrdenado.forEach(item => {
    const fila = document.createElement('tr');
    const thEvaluacion = document.createElement('th');
    thEvaluacion.scope = 'row';
    thEvaluacion.textContent = item.nombre;
    const tdFecha = document.createElement('td');
    tdFecha.textContent = item.fecha;
    const tdRamo = document.createElement('td');
    tdRamo.textContent = item.asignatura;
    const tdModalidad = document.createElement('td');
    tdModalidad.textContent = item.estado;
    fila.appendChild(thEvaluacion);
    fila.appendChild(tdFecha);
    fila.appendChild(tdRamo);
    fila.appendChild(tdModalidad);
    cuerpoTabla.appendChild(fila);
  });
}

mostrarEvaluaciones();

inputDias.addEventListener('change', (e) => {
  periodoProximo = e.target.valueAsNumber || 0;
  mostrarEvaluaciones();
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
});


const datosRamosSeccion3 = [
  {
    nombre: "Minería de Datos",
    colorBarra: "bg-success"
  },
  {
    nombre: "Fundamentos de Inteligencia Artificial",
    colorBarra: "bg-danger"
  },
  {
    nombre: "Infraestructura TI",
    colorBarra: "bg-primary"
  },
  {
    nombre: "Desarrollo Web y Móvil",
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

function calcularNotaPromedioRamo(nombreRamo) {
  const evaluacionesRamo = datosEvaluaciones.filter(function (evaluacion) {
    return evaluacion.ramo === nombreRamo;
  });

  if (evaluacionesRamo.length === 0) {
    return "Aún no hay notas";
  }

  let sumaNotas = 0;

  evaluacionesRamo.forEach(function (evaluacion) {
    sumaNotas += Number(evaluacion.nota);
  });

  const promedio = sumaNotas / evaluacionesRamo.length;

  return promedio.toFixed(1).replace(".", ",");
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

  const tituloModal = document.getElementById("tituloModalRamo");
  const contenidoModal = document.getElementById("contenidoModalRamo");
  const modalElemento = document.getElementById("modalActividadesRamo");

  tituloModal.textContent = ramo.nombre;
  contenidoModal.innerHTML = "";

  if (actividadesRamo.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No hay actividades registradas.";
    mensaje.className = "text-muted mb-0";

    contenidoModal.appendChild(mensaje);

    bootstrap.Modal.getOrCreateInstance(modalElemento).show();
    return;
  }

  actividadesRamo.sort(function (a, b) {
    return new Date(a.fecha) - new Date(b.fecha);
  });

  const lista = document.createElement("div");
  lista.className = "list-group";

  actividadesRamo.forEach(function (actividad) {
    const item = document.createElement("div");
    item.className = "list-group-item";

    const nombre = document.createElement("h6");
    nombre.textContent = actividad.nombre;

    const estado = document.createElement("span");
    estado.textContent = obtenerTextoEstadoRamos(actividad.estado);
    estado.className = "badge me-2";

    if (actividad.estado === "completada") {
      estado.classList.add("text-bg-success");
    } else if (actividad.estado === "progreso") {
      estado.classList.add("text-bg-primary");
    } else {
      estado.classList.add("text-bg-warning");
    }

    const fecha = document.createElement("span");
    fecha.textContent = formatearFechaRamos(actividad.fecha);
    fecha.className = "small text-secondary";

    item.appendChild(nombre);
    item.appendChild(estado);
    item.appendChild(fecha);

    lista.appendChild(item);
  });

  contenidoModal.appendChild(lista);

  bootstrap.Modal.getOrCreateInstance(modalElemento).show();
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

    const titulo = tarjeta.querySelector(".card-title");
    if (titulo) {
      titulo.textContent = ramo.nombre;
    }

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

    const porcentaje = tarjeta.querySelector(".texto-progreso + p");
    if (porcentaje) {
      porcentaje.textContent = progreso + " %";
    }

    const nota = tarjeta.querySelector(".texto-nota + p");
    if (nota) {
      nota.textContent = calcularNotaPromedioRamo(ramo.nombre);
    }

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

    const boton = tarjeta.querySelector("button.btn");
    if (boton) {
      boton.onclick = () => {
        mostrarActividadesRamo(ramo);
      };
    }
  });
}

const datosEvaluaciones = []

cargarRamosSeccion3();

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
    fila.innerHTML = `
      <td>${item.evaluacion}</td>
      <td>${item.fecha}</td>
      <td><span></span> ${item.ramo}</td>
      <td><span class="${item.color} fw-bold">${item.modalidad}</span></td>
      <td>${item.nota}</td>
    `;
    cuerpoTabla.appendChild(fila);
  });
}

function normalizarRamo(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

btnTodo.addEventListener("click", () => {
  hacer_tabla(datosEvaluaciones);
});

btnIA.addEventListener("click", () => {
  const filtrados = datosEvaluaciones.filter(
    (item) => normalizarRamo(item.ramo) === normalizarRamo("Fundamentos de Inteligencia Artificial")
  );
  hacer_tabla(filtrados);
});

btnWeb.addEventListener("click", () => {
  const filtrados = datosEvaluaciones.filter(
    (item) => normalizarRamo(item.ramo) === normalizarRamo("Desarrollo Web y Móvil")
  );
  hacer_tabla(filtrados);
});

btnInfra.addEventListener("click", () => {
  const filtrados = datosEvaluaciones.filter(
    (item) => normalizarRamo(item.ramo) === normalizarRamo("Infraestructura TI")
  );
  hacer_tabla(filtrados);
});

btnMineria.addEventListener("click", () => {
  const filtrados = datosEvaluaciones.filter(
    (item) => normalizarRamo(item.ramo) === normalizarRamo("Minería de Datos")
  );
  hacer_tabla(filtrados);
});

hacer_tabla(datosEvaluaciones);

// ---- Asignar nota a actividades completadas (Sección 4) ----

const btnNuevo = document.getElementById("btnNuevo");
const modalEvaluacion = new bootstrap.Modal(document.getElementById("modalEvaluacion"));
const formEvaluacion = document.getElementById("formEvaluacion");
const campoActividadCompletada = document.getElementById("campoActividadCompletada");

function obtenerActividadesCompletadasSinNota() {
  if (typeof actividades === "undefined") {
    return [];
  }

  const idsYaUsados = datosEvaluaciones
    .filter((item) => item.idActividad !== undefined)
    .map((item) => item.idActividad);

  return actividades.filter((actividad) => {
    return actividad.estado === "completada" && !idsYaUsados.includes(actividad.id);
  });
}

function formatearFechaEvaluacion(fechaTexto) {
  const fecha = new Date(fechaTexto + "T00:00:00");
  return fecha.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function obtenerColorModalidad(modalidad) {
  if (modalidad === "Online") {
    return "text-success";
  }
  if (modalidad === "Asincronica") {
    return "text-secondary";
  }
  return "text-danger";
}

function abrirModalNuevaEvaluacion() {
  formEvaluacion.reset();
  campoActividadCompletada.innerHTML = "";

  const disponibles = obtenerActividadesCompletadasSinNota();

  if (disponibles.length === 0) {
    const opcionVacia = document.createElement("option");
    opcionVacia.value = "";
    opcionVacia.textContent = "No hay actividades completadas pendientes de nota";
    campoActividadCompletada.appendChild(opcionVacia);
    return;
  }

  disponibles.forEach((actividad) => {
    const opcion = document.createElement("option");
    opcion.value = actividad.id;
    opcion.textContent = actividad.nombre + " (" + actividad.asignatura + ")";
    campoActividadCompletada.appendChild(opcion);
  });
}

btnNuevo.addEventListener("click", abrirModalNuevaEvaluacion);

formEvaluacion.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (!formEvaluacion.checkValidity()) {
    formEvaluacion.reportValidity();
    return;
  }

  const idActividad = Number(campoActividadCompletada.value);
  const actividad = actividades.find((a) => a.id === idActividad);
  if (!actividad) {
    return;
  }

  const modalidad = document.getElementById("campoModalidad").value;
  const nota = document.getElementById("campoNota").value;

  datosEvaluaciones.push({
    evaluacion: actividad.nombre,
    fecha: formatearFechaEvaluacion(actividad.fecha),
    ramo: actividad.asignatura,
    modalidad: modalidad,
    color: obtenerColorModalidad(modalidad),
    nota: Number(nota).toFixed(1),
    idActividad: actividad.id
  });

  hacer_tabla(datosEvaluaciones);
  cargarRamosSeccion3();
  modalEvaluacion.hide();
});
