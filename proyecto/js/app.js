// Funcionalidad de la lista de eventos
const eventos = document.getElementById('listaEventos');

function agregarEvento(textarea) {
  textarea.addEventListener('change', (e) => {
    const texto = e.target.value.trim();

    const allEventos = eventos.querySelectorAll('.nuevoEvento');
    const esUltimoEvento = allEventos[allEventos.length - 1] === e.target;

    if (texto != '' && esUltimoEvento) {
      crearNuevoEvento();
    }
  });
}

function crearNuevoEvento() {
  const nuevoLi = document.createElement('li');
  const nuevoEvento = document.createElement('textarea');
  const botonEliminar = document.createElement('button');

  nuevoEvento.rows = '1';
  nuevoEvento.className = 'nuevoEvento';
  nuevoEvento.oninput = "this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'";
  nuevoEvento.placeholder = 'Ingrese un evento...';
  agregarEvento(nuevoEvento);

  botonEliminar.textContent = 'X';
  botonEliminar.className = 'btn btn-outline-secondary btn-sm btnEliminar';

  botonEliminar.addEventListener('click', () => {
    const cantEventos = eventos.querySelectorAll('li').length;

    if (cantEventos > 1) {
      nuevoLi.remove();
    } else {
      nuevoEvento.value = '';
      nuevoEvento.rows = '1';
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
    }
  });

  agregarEvento(primerEvento);
}

console.log('JavaScript funcionandooo');