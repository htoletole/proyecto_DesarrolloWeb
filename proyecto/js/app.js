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
      primerInput.style.height = 'auto';
    }
  });
}

const botonAgregar = document.querySelector('.agregarEvento');
botonAgregar.addEventListener('click', (e) => {
  crearNuevoEvento();
})

console.log('JavaScript funcionandooo');